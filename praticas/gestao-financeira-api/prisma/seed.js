import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

const defaultCategories = [
  { name: "income",    displayName: "Renda",       icon: "work",                background: "#DE9AC3", isIncome: true,  isDefault: true },
  { name: "food",      displayName: "Alimentação", icon: "fastfood",            background: "#DEA17B", isIncome: false, isDefault: true },
  { name: "house",     displayName: "Casa",        icon: "home",                background: "#E6E088", isIncome: false, isDefault: true },
  { name: "education", displayName: "Educação",    icon: "book",                background: "#AB8FBE", isIncome: false, isDefault: true },
  { name: "travel",    displayName: "Viagens",     icon: "airplanemode-active", background: "#82C9DE", isIncome: false, isDefault: true },
]

async function main() {
  for (const c of defaultCategories) {
    const existing = await prisma.category.findFirst({ where: { name: c.name, userId: null } })
    if (!existing) await prisma.category.create({ data: c })
  }

  const email    = process.env.DEFAULT_USER_EMAIL    ?? "admin@gestao.com"
  const password = process.env.DEFAULT_USER_PASSWORD ?? "admin123"
  const name     = process.env.DEFAULT_USER_NAME     ?? "Usuário Padrão"

  const existing = await prisma.user.findUnique({ where: { email } })
  if (!existing) {
    const hashed = await bcrypt.hash(password, 10)
    await prisma.user.create({ data: { email, name, password: hashed } })
    console.log(`Usuário padrão criado: ${email} / ${password}`)
  }

  console.log("Seed concluído.")
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
