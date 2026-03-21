/**
 * Run this once to create your admin account:
 *   npx ts-node scripts/create-admin.ts
 * 
 * Or with tsx:
 *   npx tsx scripts/create-admin.ts
 */

import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@mathsacademy.in"
  const password = process.env.ADMIN_PASSWORD || "Admin@123"
  const name = process.env.ADMIN_NAME || "Admin"

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    await prisma.user.update({ where: { email }, data: { role: "admin" } })
    console.log(`✅ Updated existing user "${email}" to admin role.`)
    return
  }

  const hashed = await bcrypt.hash(password, 10)
  await prisma.user.create({
    data: {
      name,
      email,
      parentEmail: email,
      studentMobile: "0000000000",
      class: "admin",
      password: hashed,
      role: "admin",
    }
  })
  console.log(`✅ Admin created!`)
  console.log(`   Email: ${email}`)
  console.log(`   Password: ${password}`)
  console.log(`   Change the password after first login!`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
