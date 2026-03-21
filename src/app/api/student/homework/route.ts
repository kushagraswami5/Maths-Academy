import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserFromToken } from "@/lib/auth"

export async function GET(req: Request) {
  const d = getUserFromToken(req); if (!d) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const enrollments = await prisma.enrollment.findMany({ where:{ userId:d.userId } })
  const courseIds = enrollments.map(e => e.courseId)
  const homeworks = await prisma.homework.findMany({ where:{ courseId:{ in:courseIds } }, include:{ course:true }, orderBy:{ dueDate:"asc" } })
  const submissions = await prisma.homeworkSubmission.findMany({ where:{ userId:d.userId }, include:{ homework:{ include:{ course:true } } } })
  return NextResponse.json({ homeworks, submissions })
}
