import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserFromToken } from "@/lib/auth"

export async function GET(req: Request) {
  const d = getUserFromToken(req); if (!d) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const enrollments = await prisma.enrollment.findMany({ where: { userId: d.userId } })
  const courseIds = enrollments.map(e => e.courseId)
  const liveClasses = await prisma.liveClass.findMany({ where: { courseId: { in: courseIds } }, include: { course: true }, orderBy: { scheduledAt: "desc" } })
  return NextResponse.json({ liveClasses })
}
