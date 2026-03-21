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
  const courses = await prisma.course.findMany({ include: { _count: { select: { lectures:true, enrollments:true, tests:true } } }, orderBy: { createdAt: "desc" } })
  return NextResponse.json({ courses })
}
export async function POST(req: Request) {
  if (!await isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { title, description, class: cls, price } = await req.json()
  const course = await prisma.course.create({ data: { title, description, class: cls, price } })
  return NextResponse.json({ course })
}
