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
  const tests = await prisma.test.findMany({ include: { course: true, _count: { select: { questions:true, submissions:true } } }, orderBy: { createdAt: "desc" } })
  return NextResponse.json({ tests })
}
export async function POST(req: Request) {
  if (!await isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { title, courseId, totalMarks, duration, scheduledAt, questions } = await req.json()
  const test = await prisma.test.create({
    data: { title, courseId, totalMarks, duration, scheduledAt: new Date(scheduledAt),
      questions: { create: questions.map((q: any) => ({ text:q.text, optionA:q.optionA, optionB:q.optionB, optionC:q.optionC, optionD:q.optionD, correctOption:q.correctOption, marks:q.marks })) }
    }
  })
  return NextResponse.json({ test })
}
