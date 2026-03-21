import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserFromToken } from "@/lib/auth"

export async function GET(req: Request) {
  const d = getUserFromToken(req); if (!d) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const notifications = await prisma.notification.findMany({ where:{ userId:d.userId }, orderBy:{ createdAt:"desc" } })
  return NextResponse.json({ notifications })
}
