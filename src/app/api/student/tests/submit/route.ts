import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserFromToken } from "@/lib/auth"

export async function POST(req: Request) {
  const d = getUserFromToken(req); if (!d) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { testId, answers } = await req.json()
  const existing = await prisma.testSubmission.findUnique({ where:{ userId_testId:{ userId:d.userId, testId } } })
  if (existing) return NextResponse.json({ error:"Already submitted" }, { status:400 })
  const test = await prisma.test.findUnique({ where:{ id:testId }, include:{ questions:true } })
  if (!test) return NextResponse.json({ error:"Test not found" }, { status:404 })
  let score = 0
  for (const q of test.questions) {
    if (answers[q.id] === q.correctOption) score += q.marks
  }
  const sub = await prisma.testSubmission.create({ data:{ userId:d.userId, testId, answers, score } })
  return NextResponse.json({ score, totalMarks: test.totalMarks, submissionId: sub.id })
}
