import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserFromToken } from "@/lib/auth"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const d = getUserFromToken(req); if (!d) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const u = await prisma.user.findUnique({ where: { id: d.userId } })
  if (u?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const { grade, feedback } = await req.json()
  const sub = await prisma.homeworkSubmission.update({ where: { id }, data: { grade, feedback } })
  await prisma.notification.create({ data: { userId: sub.userId, title: "Homework Graded!", message: `Your submission has been graded: ${grade}/10.${feedback ? ` Feedback: ${feedback}` : ""}`, type: "homework" } })
  return NextResponse.json({ submission: sub })
}
