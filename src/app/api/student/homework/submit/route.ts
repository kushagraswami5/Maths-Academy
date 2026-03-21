import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserFromToken } from "@/lib/auth"

export async function POST(req: Request) {
  const d = getUserFromToken(req); if (!d) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { homeworkId, fileUrl } = await req.json()
  const sub = await prisma.homeworkSubmission.upsert({
    where:{ userId_homeworkId:{ userId:d.userId, homeworkId } },
    update:{ fileUrl, submittedAt:new Date() },
    create:{ userId:d.userId, homeworkId, fileUrl }
  })
  return NextResponse.json({ submission: sub })
}
