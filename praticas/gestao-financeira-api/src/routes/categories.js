import { Router } from "express"
import { prisma } from "../lib/prisma.js"
import { createCategorySchema, updateCategorySchema } from "../schemas/categorySchema.js"

const router = Router()

// retorna as categorias padrão (userId null) + as criadas pelo usuário logado
router.get("/", async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      where: { OR: [{ userId: null }, { userId: req.user.id }] },
      orderBy: { displayName: "asc" },
    })
    res.json(categories)
  } catch (e) { next(e) }
})

router.post("/", async (req, res, next) => {
  try {
    const data = createCategorySchema.parse(req.body)
    const category = await prisma.category.create({ data: { ...data, userId: req.user.id } })
    res.status(201).json(category)
  } catch (e) { next(e) }
})

router.put("/:id", async (req, res, next) => {
  try {
    const data = updateCategorySchema.parse(req.body)
    const id = req.params.id
    const existing = await prisma.category.findUnique({ where: { id } })
    if (!existing) return res.status(404).json({ error: "Categoria não encontrada" })
    // não deixa editar categorias padrão nem de outro usuário
    if (existing.isDefault || existing.userId !== req.user.id) {
      return res.status(403).json({ error: "Sem permissão para editar esta categoria" })
    }
    const category = await prisma.category.update({ where: { id }, data })
    res.json(category)
  } catch (e) { next(e) }
})

router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id
    const existing = await prisma.category.findUnique({ where: { id } })
    if (!existing) return res.status(404).json({ error: "Categoria não encontrada" })
    if (existing.isDefault) return res.status(400).json({ error: "Categorias padrão não podem ser excluídas" })
    if (existing.userId !== req.user.id) return res.status(403).json({ error: "Sem permissão para excluir esta categoria" })
    await prisma.category.delete({ where: { id } })
    res.status(204).send()
  } catch (e) { next(e) }
})

export default router
