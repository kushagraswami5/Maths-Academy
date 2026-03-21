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
  const { searchParams } = new URL(req.url)
  const courseId = searchParams.get("courseId")
  if (!courseId) return NextResponse.json({ error: "courseId required" }, { status: 400 })
  const lectures = await prisma.lecture.findMany({ where: { courseId }, orderBy: { order: "asc" } })
  return NextResponse.json({ lectures })
}
export async function POST(req: Request) {
  if (!await isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { title, videoUrl, courseId, duration, order } = await req.json()
  const lecture = await prisma.lecture.create({ data: { title, videoUrl, courseId, duration: duration||0, order: order||0 } })
  return NextResponse.json({ lecture })
}
