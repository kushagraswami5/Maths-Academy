import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserFromToken } from "@/lib/auth"

export async function GET(req: Request, { params }: { params: Promise<{ liveClassId: string }> }) {
  try {
    const { liveClassId } = await params
    const d = getUserFromToken(req); if (!d) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const u = await prisma.user.findUnique({ where: { id: d.userId } })
    if (u?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    const liveClass = await prisma.liveClass.findUnique({ where: { id: liveClassId }, include: { course: true } })
    if (!liveClass) return NextResponse.json({ error: "Not found" }, { status: 404 })
    const enrollments = await prisma.enrollment.findMany({ where: { courseId: liveClass.courseId } })
    const enrolledUserIds = enrollments.map(e => e.userId)
    const students = await prisma.user.findMany({ where: { id: { in: enrolledUserIds }, role: "student", isActive: true } })
    const attendance = await prisma.attendance.findMany({ where: { liveClassId } })
    return NextResponse.json({ students, attendance, liveClass })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Server error", students: [], attendance: [] }, { status: 500 })
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ liveClassId: string }> }) {
  try {
    const { liveClassId } = await params
    const d = getUserFromToken(req); if (!d) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const u = await prisma.user.findUnique({ where: { id: d.userId } })
    if (u?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    const { records } = await req.json()
    for (const r of records) {
      try {
        await prisma.attendance.upsert({
          where: { userId_liveClassId: { userId: r.userId, liveClassId } },
          update: { status: r.status },
          create: { userId: r.userId, liveClassId, status: r.status }
        })
      } catch {
        await prisma.attendance.create({ data: { userId: r.userId, liveClassId, status: r.status } })
      }
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
