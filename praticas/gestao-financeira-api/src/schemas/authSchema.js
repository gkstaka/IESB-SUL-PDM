import { z } from "zod"

export const registerSchema = z.object({
  name:     z.string().min(2),
  email:    z.string().email(),
  password: z.string().min(6),
})

export const loginSchema = z.object({
  email:    z.string().email(),
  // min(1) porque não faz sentido rejeitar senha com < 6 no login
  password: z.string().min(1),
})
