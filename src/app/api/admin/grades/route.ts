import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserFromToken } from "@/lib/auth"

export async function GET(req: Request) {
  const d = getUserFromToken(req); if (!d) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const u = await prisma.user.findUnique({ where: { id: d.userId } })
  if (u?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const submissions = await prisma.homeworkSubmission.findMany({
    include: { homework: { include: { course: true } }, user: true },
    orderBy: { submittedAt: "desc" }
  })
  return NextResponse.json({ submissions })
}
