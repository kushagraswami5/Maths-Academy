import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const token = authHeader.split(" ")[1]
    let decoded: { userId: string }
    try { decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string } }
    catch { return NextResponse.json({ error: "Invalid token" }, { status: 401 }) }

    const user = await prisma.user.findUnique({ where:{ id:decoded.userId }, select:{ id:true, name:true, email:true, class:true, role:true } })
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const enrollments = await prisma.enrollment.findMany({ where:{ userId:decoded.userId } })
    const courseIds = enrollments.map(e => e.courseId)
    const courses = await prisma.course.findMany({ where:{ id:{ in:courseIds } } })

    const today = new Date(); const todayEnd = new Date(); todayEnd.setHours(23,59,59,999)
    const upcomingLive = await prisma.liveClass.findMany({ where:{ courseId:{ in:courseIds }, scheduledAt:{ gte:today } }, include:{ course:true }, orderBy:{ scheduledAt:"asc" }, take:5 })
    const pendingHomework = await prisma.homework.findMany({
      where:{ courseId:{ in:courseIds }, submissions:{ none:{ userId:decoded.userId } } },
      include:{ course:true }, orderBy:{ dueDate:"asc" }, take:5
    })
    const notifications = await prisma.notification.findMany({ where:{ userId:decoded.userId, isRead:false }, orderBy:{ createdAt:"desc" }, take:10 })
    const submissions = await prisma.testSubmission.findMany({ where:{ userId:decoded.userId }, include:{ test:true } })
    const testsTaken = submissions.length
    const avgScore = submissions.length > 0 ? Math.round(submissions.reduce((a,s) => a+(s.score/s.test.totalMarks)*100,0)/submissions.length) : 0
    const attTotal = await prisma.attendance.count({ where:{ userId:decoded.userId } })
    const attPresent = await prisma.attendance.count({ where:{ userId:decoded.userId, status:"present" } })
    const attendancePercent = attTotal > 0 ? Math.round((attPresent/attTotal)*100) : 0

    return NextResponse.json({ user, courses, upcomingLive, pendingHomework, notifications, testsTaken, avgScore, attendancePercent })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Failed to load dashboard" }, { status: 500 })
  }
}
