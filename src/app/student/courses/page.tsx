"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/shared/Sidebar"
import TopBar from "@/components/shared/TopBar"
import { useSidebar } from "@/lib/useSidebar"

export default function StudentCourses() {
  const router = useRouter()
  const { open, show, hide } = useSidebar()
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    const t = localStorage.getItem("token")
    if (!t) { router.replace("/login"); return }
    fetch("/api/student/courses", { headers: { Authorization: `Bearer ${t}` } })
      .then(r => r.json()).then(d => setData(d))
  }, [])

  const courses: any[] = data?.courses || []
  const allCourses: any[] = data?.allCourses || []
  const enrolledIds = new Set(courses.map((c: any) => c.id))

  return (
    <div className="app-shell">
      <Sidebar role="student" open={open} onClose={hide} />
      <div className="main-content">
        <TopBar title="My Courses" onMenuClick={show} />
        <div className="page-body">
          <h3 style={{ fontSize: 11, fontWeight: 700, color: "#7a8aa0", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>Enrolled Courses</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14, marginBottom: 28 }}>
            {courses.map((c: any) => (
              <div key={c.id} className="card" style={{ padding: 20, borderTop: "3px solid #4361ee" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <h3 style={{ fontWeight: 700, fontSize: 15 }}>{c.title}</h3>
                  <span className="badge badge-ink" style={{ fontSize: 10 }}>Class {c.class}</span>
                </div>
                <p style={{ fontSize: 13, color: "#7a8aa0", marginBottom: 14 }}>{c.description}</p>
                <div style={{ display: "flex", gap: 14, fontSize: 12, color: "#7a8aa0", marginBottom: 14 }}>
                  <span>📚 {c._count?.lectures || 0} Lectures</span>
                  <span>📝 {c._count?.tests || 0} Tests</span>
                </div>
                <div style={{ height: 5, borderRadius: 5, background: "#f4f5f9", overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 5, background: "#4361ee", width: "40%" }} />
                </div>
                <div style={{ fontSize: 11, color: "#7a8aa0", marginTop: 5 }}>40% complete</div>
              </div>
            ))}
            {courses.length === 0 && (
              <p style={{ color: "#7a8aa0", fontSize: 13 }}>Not enrolled in any courses yet.</p>
            )}
          </div>

          {allCourses.filter((c: any) => !enrolledIds.has(c.id)).length > 0 && (
            <>
              <h3 style={{ fontSize: 11, fontWeight: 700, color: "#7a8aa0", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>Available Courses</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14 }}>
                {allCourses.filter((c: any) => !enrolledIds.has(c.id)).map((c: any) => (
                  <div key={c.id} className="card" style={{ padding: 20, opacity: 0.85 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <h3 style={{ fontWeight: 700, fontSize: 15 }}>{c.title}</h3>
                      <span style={{ fontWeight: 700, color: "#4361ee" }}>₹{c.price}</span>
                    </div>
                    <span className="badge badge-indigo" style={{ marginBottom: 8, display: "inline-block" }}>Class {c.class}</span>
                    <p style={{ fontSize: 13, color: "#7a8aa0", marginBottom: 10 }}>{c.description}</p>
                    <p style={{ fontSize: 12.5, color: "#7a8aa0" }}>Contact your teacher to enroll.</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
