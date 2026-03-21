import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserFromToken } from "@/lib/auth"

export async function PATCH(req: Request) {
  const d = getUserFromToken(req); if (!d) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  await prisma.notification.updateMany({ where: { userId: d.userId, isRead: false }, data: { isRead: true } })
  return NextResponse.json({ success: true })
}
