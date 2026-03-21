import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserFromToken } from "@/lib/auth"

async function getAdmin(req: Request) {
  const d = getUserFromToken(req); if (!d) return null
  const u = await prisma.user.findUnique({ where: { id: d.userId } })
  return u?.role === "admin" ? u : null
}

export async function GET(req: Request) {
  try {
    const admin = await getAdmin(req)
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // Return notifications sent TO students (for "recently sent" panel)
    const notifications = await prisma.notification.findMany({
      where: { user: { role: "student" } },
      orderBy: { createdAt: "desc" },
      take: 30
    })
    return NextResponse.json({ notifications })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ notifications: [] }, { status: 200 })
  }
}

export async function POST(req: Request) {
  try {
    const admin = await getAdmin(req)
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const { title, message, type, targetClass, userId } = await req.json()
    let userIds: string[] = []
    if (targetClass === "individual" && userId) {
      userIds = [userId]
    } else if (targetClass === "all") {
      const students = await prisma.user.findMany({ where: { role: "student" }, select: { id: true } })
      userIds = students.map(s => s.id)
    } else {
      const students = await prisma.user.findMany({ where: { role: "student", class: targetClass }, select: { id: true } })
      userIds = students.map(s => s.id)
    }
    if (userIds.length > 0) {
      await prisma.notification.createMany({ data: userIds.map(uid => ({ userId: uid, title, message, type })) })
    }
    return NextResponse.json({ sent: userIds.length })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to send" }, { status: 500 })
  }
}