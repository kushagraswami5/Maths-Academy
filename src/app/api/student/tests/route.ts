import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserFromToken } from "@/lib/auth"

export async function GET(req: Request) {
  const d = getUserFromToken(req); if (!d) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const user = await prisma.user.findUnique({ where:{ id:d.userId } })
  const enrollments = await prisma.enrollment.findMany({ where:{ userId:d.userId } })
  const courseIds = enrollments.map(e => e.courseId)
  const tests = await prisma.test.findMany({ where:{ courseId:{ in:courseIds }, isPublished:true }, include:{ course:true, questions:true }, orderBy:{ scheduledAt:"desc" } })
  const submissions = await prisma.testSubmission.findMany({ where:{ userId:d.userId }, include:{ test:true } })
  return NextResponse.json({ tests, submissions, user })
}
