import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserFromToken } from "@/lib/auth"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const d = getUserFromToken(req); if (!d) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const u = await prisma.user.findUnique({ where: { id: d.userId } })
  if (u?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const test = await prisma.test.update({ where: { id }, data: { isPublished: true } })
  const enrollments = await prisma.enrollment.findMany({ where: { courseId: test.courseId } })
  if (enrollments.length > 0) {
    await prisma.notification.createMany({ data: enrollments.map(e => ({ userId: e.userId, title: "New Test Published!", message: `"${test.title}" is now available. Good luck!`, type: "test" })) })
  }
  return NextResponse.json({ test })
}
