"use client"
import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Sidebar from "@/components/shared/Sidebar"
import TopBar from "@/components/shared/TopBar"
import { useSidebar } from "@/lib/useSidebar"

export default function StudentDashboard() {
  const router = useRouter()
  const { open, show, hide } = useSidebar()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const pageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const role = localStorage.getItem("role")
    if (!token) { router.replace("/login"); return }
    if (role === "admin") { router.replace("/admin"); return }
    fetch("/api/dashboard", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { if (r.status === 401) { router.replace("/login"); return null } return r.json() })
      .then(d => { if (d) { setData(d); localStorage.setItem("name", d.user?.name || "") } })
      .finally(() => setLoading(false))
  }, [])

  useGSAP(() => {
    if (loading || !pageRef.current) return
    const hero = pageRef.current.querySelector(".hero-banner")
    const tiles = pageRef.current.querySelectorAll(".stat-tile")
    const cards = pageRef.current.querySelectorAll(".content-card")
    gsap.set([hero, ...Array.from(tiles), ...Array.from(cards)], { y: 18, opacity: 0 })
    const tl = gsap.timeline()
    tl.to(hero,  { y: 0, opacity: 1, duration: 0.45, ease: "power2.out", clearProps: "transform,opacity" })
      .to(tiles, { y: 0, opacity: 1, duration: 0.4, stagger: 0.07, ease: "power2.out", clearProps: "transform,opacity" }, "-=0.2")
      .to(cards, { y: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: "power2.out", clearProps: "transform,opacity" }, "-=0.2")
  }, { dependencies: [loading], scope: pageRef })

  const unread = data?.notifications?.filter((n: any) => !n.isRead).length || 0
  const todayLive = data?.upcomingLive?.filter((lc: any) => new Date(lc.scheduledAt).toDateString() === new Date().toDateString()) || []

  return (
    <div className="app-shell">
      <Sidebar role="student" open={open} onClose={hide} />
      <div className="main-content">
        <TopBar title="Dashboard" onMenuClick={show} />
        <div className="page-body" ref={pageRef}>
          {loading ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#7a8aa0", padding: "40px 0" }}><div className="spinner" /> Loading…</div>
          ) : (
            <>
              {/* Hero */}
              <div className="hero-banner" style={{ background: "#0b0f1a", borderRadius: 14, padding: "22px 28px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center", overflow: "hidden", position: "relative" }}>
                <div style={{ position: "absolute", top: -70, right: -70, width: 220, height: 220, border: "1px solid rgba(232,160,32,0.08)", borderRadius: "50%" }} />
                <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, border: "1px solid rgba(232,160,32,0.12)", borderRadius: "50%" }} />
                <div style={{ position: "relative" }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "white", marginBottom: 4, letterSpacing: "-0.02em" }}>
                    Hello, {data?.user?.name?.split(" ")[0] || "Student"} 👋
                  </div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.38)" }}>
                    Class {data?.user?.class} · {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
                  </div>
                </div>
                {unread > 0 && (
                  <Link href="/student/notifications" style={{ background: "#e8a020", color: "#0b0f1a", borderRadius: 8, padding: "8px 14px", fontWeight: 700, fontSize: 13, textDecoration: "none", position: "relative", flexShrink: 0 }}>
                    🔔 {unread} new
                  </Link>
                )}
              </div>

              {/* Stats */}
              <div className="grid-kpi grid-kpi-4" style={{ marginBottom: 16 }}>
                {[
                  { label: "Courses", value: data?.courses?.length || 0, color: "#4361ee", href: "/student/courses" },
                  { label: "Attendance", value: data?.attendancePercent ? data.attendancePercent + "%" : "N/A", color: "#059669", href: "/student/attendance" },
                  { label: "Tests Taken", value: data?.testsTaken || 0, color: "#7c3aed", href: "/student/tests" },
                  { label: "Avg Score", value: data?.testsTaken ? (data.avgScore || 0) + "%" : "N/A", color: "#e8a020", href: "/student/tests" },
                ].map(s => (
                  <Link key={s.label} href={s.href} className="stat-tile kpi-card" style={{ textDecoration: "none" }}>
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: "#7a8aa0", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>{s.label}</div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: s.color, fontFamily: "Outfit,sans-serif", letterSpacing: "-0.02em" }}>{s.value}</div>
                  </Link>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16 }}>
                <div className="content-card card">
                  <div className="card-header">
                    <h2 style={{ fontSize: 14.5, fontWeight: 700 }}>My Courses</h2>
                    <Link href="/student/courses" className="btn btn-outline btn-sm" style={{ textDecoration: "none" }}>View all</Link>
                  </div>
                  {(!data?.courses || data.courses.length === 0) ? (
                    <div style={{ textAlign: "center", padding: "32px 0", color: "#7a8aa0", fontSize: 13 }}>Not enrolled in any course yet.</div>
                  ) : data.courses.map((c: any) => (
                    <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 20px", borderBottom: "1px solid #e4e7ef" }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13.5 }}>{c.title}</div>
                        <div style={{ fontSize: 11.5, color: "#7a8aa0", marginTop: 2 }}>Class {c.class}</div>
                      </div>
                      <Link href="/student/lectures" className="btn btn-ghost btn-sm" style={{ textDecoration: "none", fontSize: 12 }}>Continue →</Link>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div className="content-card card">
                    <div className="card-header"><h2 style={{ fontSize: 13.5, fontWeight: 700 }}>Today's Live</h2></div>
                    <div style={{ padding: "14px 18px" }}>
                      {todayLive.length === 0 ? (
                        <p style={{ fontSize: 12.5, color: "#7a8aa0" }}>No class today</p>
                      ) : todayLive.map((lc: any) => (
                        <div key={lc.id}>
                          <div style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 3 }}>{lc.title}</div>
                          <div style={{ fontSize: 11.5, color: "#7a8aa0", marginBottom: 10, fontFamily: "JetBrains Mono,monospace" }}>
                            {new Date(lc.scheduledAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                          </div>
                          <a href={lc.meetUrl} target="_blank" className="btn btn-primary btn-sm" style={{ textDecoration: "none" }}>Join Now →</a>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="content-card card">
                    <div className="card-header"><h2 style={{ fontSize: 13.5, fontWeight: 700 }}>Pending HW</h2></div>
                    <div style={{ padding: "10px 18px 14px" }}>
                      {(!data?.pendingHomework || data.pendingHomework.length === 0) ? (
                        <p style={{ fontSize: 12.5, color: "#059669" }}>All done! 🎉</p>
                      ) : data.pendingHomework.slice(0, 3).map((h: any) => (
                        <div key={h.id} style={{ paddingBottom: 10, marginBottom: 10, borderBottom: "1px solid #e4e7ef" }}>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{h.title}</div>
                          <div style={{ fontSize: 11, color: "#e11d48", marginTop: 2 }}>Due: {new Date(h.dueDate).toLocaleDateString("en-IN")}</div>
                        </div>
                      ))}
                    </div>
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
