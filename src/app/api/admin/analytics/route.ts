import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserFromToken } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    const d = getUserFromToken(req); if (!d) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const u = await prisma.user.findUnique({ where: { id: d.userId } })
    if (u?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    // Recent test results
    const testResults = await prisma.testSubmission.findMany({
      include: { user: true, test: true }, orderBy: { submittedAt: "desc" }, take: 20
    })

    // Class performance — batch query instead of N+1
    const allSubs = await prisma.testSubmission.findMany({ include: { test: true, user: true } })
    const classPerformance = ["8","9","10"].map(cls => {
      const subs = allSubs.filter(s => s.user.class === cls)
      if (subs.length === 0) return null
      const avg = Math.round(subs.reduce((a,s) => a + (s.score/s.test.totalMarks)*100, 0) / subs.length)
      return { class: cls, avg }
    }).filter(Boolean)

    // Top students — batch query
    const allStudents = await prisma.user.findMany({ where: { role: "student" }, select: { id: true, name: true, class: true } })
    const topStudents = allStudents.map(s => {
      const subs = allSubs.filter(sub => sub.userId === s.id)
      if (subs.length === 0) return null
      const avg = Math.round(subs.reduce((a,sub) => a + (sub.score/sub.test.totalMarks)*100, 0) / subs.length)
      return { ...s, avgScore: avg }
    }).filter(Boolean).sort((a:any,b:any) => b.avgScore - a.avgScore).slice(0,5)

    // Monthly payments
    const payments = await prisma.payment.findMany({ where: { status: "paid" } })
    const monthlyMap: Record<string,number> = {}
    payments.forEach(p => { if(p.month) monthlyMap[p.month] = (monthlyMap[p.month]||0) + p.amount })
    const monthlyPayments = Object.entries(monthlyMap).map(([month,total]) => ({ month, total })).slice(-6)

    // Attendance summary — batch query
    const allAttendance = await prisma.attendance.findMany()
    const attendanceSummary = allStudents.slice(0,10).map(s => {
      const recs = allAttendance.filter(a => a.userId === s.id)
      const total = recs.length
      const present = recs.filter(a => a.status === "present").length
      return { ...s, percent: total > 0 ? Math.round((present/total)*100) : 0 }
    }).filter(s => s.percent > 0).sort((a,b) => b.percent - a.percent)

    return NextResponse.json({ testResults, classPerformance, topStudents, monthlyPayments, attendanceSummary })
  } catch (error) {
    console.error("Analytics error:", error)
    return NextResponse.json({ testResults:[], classPerformance:[], topStudents:[], monthlyPayments:[], attendanceSummary:[] }, { status: 200 })
  }
}
