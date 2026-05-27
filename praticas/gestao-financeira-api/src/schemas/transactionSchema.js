import { z } from "zod"

export const createTransactionSchema = z.object({
  description: z.string().min(1),
  value:       z.number().positive().transform((v) => Math.round(v * 100) / 100),
  // coerce pra aceitar string ISO ("2026-01-15") além de Date
  date:        z.coerce.date(),
  categoryId:  z.string().min(1),
})

export const updateTransactionSchema = createTransactionSchema.partial()
