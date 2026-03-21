import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserFromToken } from "@/lib/auth"

export async function POST(req: Request) {
  const d = getUserFromToken(req); if (!d) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const u = await prisma.user.findUnique({ where: { id: d.userId } })
  if (u?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const { userId, courseId } = await req.json()
  try {
    const enrollment = await prisma.enrollment.create({ data: { userId, courseId } })
    const course = await prisma.course.findUnique({ where: { id: courseId } })
    await prisma.notification.create({ data: { userId, title: "Enrolled in Course!", message: `You have been enrolled in "${course?.title}". Start learning now!`, type: "general" } })
    return NextResponse.json({ enrollment })
  } catch {
    return NextResponse.json({ error: "Already enrolled" }, { status: 400 })
  }
}

export async function DELETE(req: Request) {
  const d = getUserFromToken(req); if (!d) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const u = await prisma.user.findUnique({ where: { id: d.userId } })
  if (u?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const { userId, courseId } = await req.json()
  await prisma.enrollment.deleteMany({ where: { userId, courseId } })
  return NextResponse.json({ success: true })
}
