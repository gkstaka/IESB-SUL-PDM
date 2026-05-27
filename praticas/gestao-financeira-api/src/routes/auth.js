import { Router } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { prisma } from "../lib/prisma.js"
import { registerSchema, loginSchema } from "../schemas/authSchema.js"
import { authenticate } from "../middlewares/authenticate.js"

const router = Router()

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  )
}

router.post("/register", async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body)
    const existing = await prisma.user.findUnique({ where: { email: data.email } })
    if (existing) return res.status(409).json({ error: "E-mail já cadastrado" })

    const hashed = await bcrypt.hash(data.password, 10)
    const user = await prisma.user.create({
      data: { email: data.email, name: data.name, password: hashed },
    })

    res.status(201).json({ token: signToken(user), user: { id: user.id, email: user.email, name: user.name } })
  } catch (e) { next(e) }
})

router.post("/login", async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body)
    const user = await prisma.user.findUnique({ where: { email: data.email } })
    // compara hash — retorna 401 tanto pra usuário não encontrado quanto pra senha errada
    // pra não vazar se o e-mail existe ou não
    const valid = user && await bcrypt.compare(data.password, user.password)
    if (!valid) return res.status(401).json({ error: "Credenciais inválidas" })

    res.json({ token: signToken(user), user: { id: user.id, email: user.email, name: user.name } })
  } catch (e) { next(e) }
})

// renova o token sem precisar mandar a senha de novo
// útil quando o app é reaberto e o token antigo ainda é válido
router.post("/refresh", authenticate, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } })
    if (!user) return res.status(401).json({ error: "Usuário não encontrado" })

    res.json({ token: signToken(user), user: { id: user.id, email: user.email, name: user.name } })
  } catch (e) { next(e) }
})

router.get("/dev/token", async (req, res, next) => {
  try {
    const email = process.env.DEFAULT_USER_EMAIL ?? "admin@gestao.com"
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(404).json({ error: "Usuário padrão não encontrado. Execute: npm run prisma:seed" })

    res.json({
      token: signToken(user),
      usage: "Authorization: Bearer <token>",
      expires_in: "7d",
    })
  } catch (e) { next(e) }
})

export default router
