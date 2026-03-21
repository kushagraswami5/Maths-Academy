import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserFromToken } from "@/lib/auth"

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const d = getUserFromToken(req); if (!d) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const u = await prisma.user.findUnique({ where: { id: d.userId } })
  if (u?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  await prisma.lecture.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
