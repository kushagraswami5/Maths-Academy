import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserFromToken } from "@/lib/auth"

export async function GET(req: Request) {
  const d = getUserFromToken(req); if (!d) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const u = await prisma.user.findUnique({ where: { id: d.userId } })
  if (u?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const [totalStudents, activeStudents, totalCourses, payments, pendingPayments, upcomingTests, todayLive, recentStudents, subs] = await Promise.all([
    prisma.user.count({ where:{ role:"student" } }),
    prisma.user.count({ where:{ role:"student", isActive:true } }),
    prisma.course.count(),
    prisma.payment.findMany({ where:{ status:"paid" } }),
    prisma.payment.count({ where:{ status:"pending" } }),
    prisma.test.count({ where:{ scheduledAt:{ gte:new Date() }, isPublished:true } }),
    prisma.liveClass.count({ where:{ scheduledAt:{ gte:new Date(new Date().setHours(0,0,0,0)), lte:new Date(new Date().setHours(23,59,59,999)) } } }),
    prisma.user.findMany({ where:{ role:"student" }, orderBy:{ createdAt:"desc" }, take:5 }),
    prisma.testSubmission.findMany({ include:{ test:true } })
  ])
  const totalRevenue = payments.reduce((a,p)=>a+p.amount, 0)
  const avgScore = subs.length > 0 ? Math.round(subs.reduce((a,s)=>a+(s.score/s.test.totalMarks)*100,0)/subs.length) : 0

  return NextResponse.json({ stats:{ totalStudents, activeStudents, totalCourses, totalRevenue, pendingPayments, upcomingTests, todayLive, avgScore }, recentStudents })
}
