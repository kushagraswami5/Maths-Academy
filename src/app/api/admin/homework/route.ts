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
  const homeworks = await prisma.homework.findMany({ include: { course:true, _count:{ select:{ submissions:true } } }, orderBy:{ createdAt:"desc" } })
  return NextResponse.json({ homeworks })
}
export async function POST(req: Request) {
  if (!await isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { title, description, pdfUrl, courseId, dueDate } = await req.json()
  const hw = await prisma.homework.create({ data: { title, description, pdfUrl, courseId, dueDate: new Date(dueDate) } })
  // Notify enrolled students
  const enrollments = await prisma.enrollment.findMany({ where: { courseId } })
  if (enrollments.length > 0) {
    await prisma.notification.createMany({ data: enrollments.map(e => ({ userId:e.userId, title:"New Homework Assigned", message:`"${title}" is due by ${new Date(dueDate).toLocaleDateString("en-IN")}`, type:"homework" })) })
  }
  return NextResponse.json({ homework: hw })
}
