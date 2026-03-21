import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { name, email, parentEmail, studentMobile, studentClass, password } = await req.json()

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { name, email, parentEmail, studentMobile, class: studentClass, password: hashedPassword }
    })

    // Notify all admins about new registration
    try {
      const admins = await prisma.user.findMany({ where: { role: "admin" } })
      if (admins.length > 0) {
        await prisma.notification.createMany({
          data: admins.map(admin => ({
            userId: admin.id,
            title: "New Student Registration!",
            message: `${name} (Class ${studentClass}) just registered. Mobile: ${studentMobile} | Email: ${email}. Offer them a free demo!`,
            type: "general"
          }))
        })
      }
    } catch (e) {
      // Don't fail registration if notification fails
      console.error("Notification error:", e)
    }

    return NextResponse.json({ message: "User registered successfully", user })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
