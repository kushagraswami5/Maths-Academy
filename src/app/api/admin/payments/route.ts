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
  const payments = await prisma.payment.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" }
  })
  // Fetch course titles separately to avoid schema issues
  const courseIds = [...new Set(payments.map(p => p.courseId).filter(Boolean))]
  const courses = await prisma.course.findMany({ where: { id: { in: courseIds } }, select: { id: true, title: true } })
  const courseMap = Object.fromEntries(courses.map(c => [c.id, c.title]))
  const enriched = payments.map(p => ({ ...p, courseTitle: courseMap[p.courseId] || "—" }))
  return NextResponse.json({ payments: enriched })
}
export async function POST(req: Request) {
  if (!await isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { userId, courseId, amount, method, month, status } = await req.json()
  const payment = await prisma.payment.create({ data: { userId, courseId, amount, method, month, status } })
  if (status === "pending") {
    await prisma.notification.create({ data: { userId, title: "Fee Payment Due", message: `Your fee of ₹${amount} for ${month} is pending. Please pay at the earliest.`, type: "payment" } })
  }
  return NextResponse.json({ payment })
}
