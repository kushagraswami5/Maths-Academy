import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserFromToken } from "@/lib/auth"

async function isAdmin(req: Request) {
  const d = getUserFromToken(req); if (!d) return null
  const u = await prisma.user.findUnique({ where: { id: d.userId } })
  return u?.role === "admin" ? u : null
}
export async function GET(req: Request) {
  if (!await isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const liveClasses = await prisma.liveClass.findMany({ include: { course: true }, orderBy: { scheduledAt: "desc" } })
  return NextResponse.json({ liveClasses })
}
export async function POST(req: Request) {
  if (!await isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { title, meetUrl, scheduledAt, courseId, duration } = await req.json()
  const lc = await prisma.liveClass.create({ data: { title, meetUrl, scheduledAt: new Date(scheduledAt), courseId, duration: Number(duration) } })
  return NextResponse.json({ liveClass: lc })
}
