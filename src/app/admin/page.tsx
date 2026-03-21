"use client"
import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Sidebar from "@/components/shared/Sidebar"
import TopBar from "@/components/shared/TopBar"
import { useSidebar } from "@/lib/useSidebar"

export default function AdminDashboard() {
  const router = useRouter()
  const { open, show, hide } = useSidebar()
  const [stats, setStats] = useState<any>(null)
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const gridRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const role = localStorage.getItem("role")
    if (!token || role !== "admin") { router.replace("/login"); return }
    fetch("/api/admin/analytics/stats", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setStats(d.stats); setStudents(d.recentStudents || []) })
      .finally(() => setLoading(false))
  }, [])

  useGSAP(() => {
    if (loading || !gridRef.current || !bottomRef.current) return
    const grid = Array.from(gridRef.current.children)
    const bottom = Array.from(bottomRef.current.children)
    gsap.set([...grid, ...bottom], { y: 22, opacity: 0 })
    const tl = gsap.timeline()
    tl.to(grid,   { y: 0, opacity: 1, duration: 0.45, stagger: 0.07, ease: "power2.out", clearProps: "transform,opacity" })
      .to(bottom, { y: 0, opacity: 1, duration: 0.4,  stagger: 0.1,  ease: "power2.out", clearProps: "transform,opacity" }, "-=0.2")
  }, { dependencies: [loading] })

  const kpis = stats ? [
    { label: "Total Students", value: stats.totalStudents, sub: `${stats.activeStudents} active`, color: "#4361ee", href: "/admin/students" },
    { label: "Revenue", value: "₹" + stats.totalRevenue.toLocaleString("en-IN"), sub: `${stats.pendingPayments} unpaid`, color: "#059669", href: "/admin/payments" },
    { label: "Courses", value: stats.totalCourses, sub: "All classes", color: "#7c3aed", href: "/admin/courses" },
    { label: "Avg Score", value: stats.avgScore + "%", sub: "Across tests", color: "#e8a020", href: "/admin/analytics" },
    { label: "Live Today", value: stats.todayLive, sub: "Scheduled", color: "#e11d48", href: "/admin/live" },
    { label: "Upcoming Tests", value: stats.upcomingTests, sub: "Published", color: "#0284c7", href: "/admin/tests" },
  ] : []

  return (
    <div className="app-shell">
      <Sidebar role="admin" open={open} onClose={hide} />
      <div className="main-content">
        <TopBar title="Dashboard" onMenuClick={show} />
        <div className="page-body">
          {loading ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#7a8aa0", padding: "40px 0" }}>
              <div className="spinner" /> Loading dashboard…
            </div>
          ) : (
            <>
              <div ref={gridRef} className="grid-kpi" style={{ marginBottom: 20 }}>
                {kpis.map(k => (
                  <Link key={k.label} href={k.href} className="kpi-card" style={{ textDecoration: "none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: k.color }} />
                      <span style={{ fontSize: 10.5, fontWeight: 700, color: "#7a8aa0", textTransform: "uppercase", letterSpacing: "0.07em" }}>{k.label}</span>
                    </div>
                    <div style={{ fontSize: 30, fontWeight: 800, color: "#0b0f1a", letterSpacing: "-0.025em", lineHeight: 1, fontFamily: "Outfit,sans-serif" }}>{k.value}</div>
                    <div style={{ fontSize: 11.5, color: "#7a8aa0", marginTop: 6 }}>{k.sub}</div>
                  </Link>
                ))}
              </div>

              <div ref={bottomRef} className="grid-main" style={{ marginBottom: 16 }}>
                <div className="card">
                  <div className="card-header">
                    <div>
                      <h2 style={{ fontSize: 14.5, fontWeight: 700 }}>Recent Registrations</h2>
                      <p style={{ fontSize: 11.5, color: "#7a8aa0", marginTop: 2 }}>Newly joined students</p>
                    </div>
                    <Link href="/admin/students" className="btn btn-outline btn-sm" style={{ textDecoration: "none" }}>View all</Link>
                  </div>
                  <div className="table-scroll"><table>
                    <thead><tr><th>Student</th><th>Class</th><th>Joined</th><th></th></tr></thead>
                    <tbody>
                      {students.length === 0 && (
                        <tr><td colSpan={4} style={{ textAlign: "center", color: "#7a8aa0", padding: "32px 0", fontSize: 13 }}>No students yet</td></tr>
                      )}
                      {students.map((s: any) => (
                        <tr key={s.id}>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#0b0f1a", display: "flex", alignItems: "center", justifyContent: "center", color: "#e8a020", fontWeight: 700, fontSize: 12, flexShrink: 0 }}>
                                {s.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div style={{ fontWeight: 600, fontSize: 13 }}>{s.name}</div>
                                <div style={{ fontSize: 11, color: "#7a8aa0" }}>{s.email}</div>
                              </div>
                            </div>
                          </td>
                          <td><span className="badge badge-ink">Class {s.class}</span></td>
                          <td style={{ color: "#7a8aa0", fontSize: 12 }}>{new Date(s.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</td>
                          <td><Link href="/admin/students" className="btn btn-ghost btn-sm" style={{ textDecoration: "none", fontSize: 11.5 }}>Enroll →</Link></td>
                        </tr>
                      ))}
                    </tbody>
                  </table></div>
                </div>

                <div className="card" style={{ alignSelf: "start" }}>
                  <div className="card-header"><h2 style={{ fontSize: 14.5, fontWeight: 700 }}>Quick Actions</h2></div>
                  <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 6 }}>
                    {[
                      ["/admin/students", "Add Student", "#4361ee"],
                      ["/admin/tests", "Create Test", "#7c3aed"],
                      ["/admin/homework", "Upload DPP", "#059669"],
                      ["/admin/live", "Schedule Live", "#e11d48"],
                      ["/admin/payments", "Record Fee", "#e8a020"],
                      ["/admin/notifications", "Notify Students", "#0284c7"],
                    ].map(([href, label, color]) => (
                      <Link key={label} href={href} style={{
                        textDecoration: "none", display: "flex", alignItems: "center", gap: 10,
                        padding: "10px 12px", borderRadius: 8, border: "1px solid #e4e7ef",
                        background: "#f9fafb", transition: "all 0.13s",
                      }}
                        onMouseEnter={e => { (e.currentTarget as any).style.borderColor = "#0b0f1a"; (e.currentTarget as any).style.background = "#fff"; }}
                        onMouseLeave={e => { (e.currentTarget as any).style.borderColor = "#e4e7ef"; (e.currentTarget as any).style.background = "#f9fafb"; }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: color as string, flexShrink: 0 }} />
                        <span style={{ fontSize: 13, fontWeight: 500, color: "#0b0f1a" }}>{label}</span>
                        <span style={{ marginLeft: "auto", fontSize: 11, color: "#b0bcc8" }}>→</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
