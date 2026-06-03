import { Router } from "express"
import { prisma } from "../lib/prisma.js"
import { createTransactionSchema, updateTransactionSchema } from "../schemas/transactionSchema.js"

const router = Router()

router.get("/", async (req, res, next) => {
  try {
    const where = { userId: req.user.id }

    // filtro de período via query params:
    // ?month=5&year=2026  → maio de 2026
    // ?year=2026          → ano inteiro
    // sem params          → tudo
    const month = parseInt(req.query.month)
    const year  = parseInt(req.query.year)

    if (!isNaN(year) && !isNaN(month) && month >= 1 && month <= 12) {
      where.date = {
        gte: new Date(year, month - 1, 1),
        lt:  new Date(year, month,     1),
      }
    } else if (!isNaN(year)) {
      where.date = {
        gte: new Date(year,     0, 1),
        lt:  new Date(year + 1, 0, 1),
      }
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: { category: true },
      orderBy: { date: "desc" },
    })
    res.json(transactions)
  } catch (e) { next(e) }
})

router.post("/", async (req, res, next) => {
  try {
    const data = createTransactionSchema.parse(req.body)
    const transaction = await prisma.transaction.create({
      data: { ...data, userId: req.user.id },
      include: { category: true },
    })
    res.status(201).json(transaction)
  } catch (e) { next(e) }
})

// userId no where garante que um usuário não edita transação do outro
router.put("/:id", async (req, res, next) => {
  try {
    const data = updateTransactionSchema.parse(req.body)
    const transaction = await prisma.transaction.update({
      where: { id: req.params.id, userId: req.user.id },
      data,
      include: { category: true },
    })
    res.json(transaction)
  } catch (e) { next(e) }
})

router.delete("/:id", async (req, res, next) => {
  try {
    await prisma.transaction.delete({ where: { id: req.params.id, userId: req.user.id } })
    res.status(204).send()
  } catch (e) { next(e) }
})

export default router
