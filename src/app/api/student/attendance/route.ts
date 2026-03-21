import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserFromToken } from "@/lib/auth"

export async function GET(req: Request) {
  const d = getUserFromToken(req); if (!d) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const records = await prisma.attendance.findMany({ where:{ userId:d.userId }, include:{ liveClass:{ include:{ course:true } } }, orderBy:{ joinedAt:"desc" } })
  return NextResponse.json({ records })
}
