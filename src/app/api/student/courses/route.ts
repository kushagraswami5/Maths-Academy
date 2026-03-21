import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserFromToken } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    const d = getUserFromToken(req); if (!d) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const user = await prisma.user.findUnique({ where:{ id:d.userId } })
    const enrollments = await prisma.enrollment.findMany({ where:{ userId:d.userId } })
    const courseIds = enrollments.map(e => e.courseId)
    const courses = await prisma.course.findMany({ where:{ id:{ in:courseIds } }, include:{ _count:{ select:{ lectures:true, tests:true } } } })
    const allCourses = await prisma.course.findMany({ where:{ class:user?.class||"" }, include:{ _count:{ select:{ lectures:true } } } })
    return NextResponse.json({ courses, allCourses })
  } catch (err) {
    console.error("API Error in /api/student/courses:", err);
    return NextResponse.json({ error: "Internal Server Error", details: String(err) }, { status: 500 })
  }
}
