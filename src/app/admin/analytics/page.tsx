"use client"
import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/shared/Sidebar"
import TopBar from "@/components/shared/TopBar"
import { useSidebar } from "@/lib/useSidebar"

export default function AnalyticsPage() {
  const router = useRouter()
  const { open, show, hide } = useSidebar()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const pageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = localStorage.getItem("token"); if (!t) { router.replace("/login"); return }
    fetch("/api/admin/analytics", { headers: { Authorization: `Bearer ${t}` } })
      .then(r => r.json()).then(d => setData(d)).finally(() => setLoading(false))
  }, [])

  useGSAP(() => {
    if (!data || !pageRef.current) return
    const cards = pageRef.current.querySelectorAll(".card")
    const bars  = pageRef.current.querySelectorAll(".anim-bar")
    const progs = pageRef.current.querySelectorAll(".anim-progress")
    gsap.set(cards, { y: 18, opacity: 0 })
    gsap.to(cards, { y: 0, opacity: 1, duration: 0.45, stagger: 0.08, ease: "power2.out", clearProps: "transform,opacity" })
    gsap.set(bars, { scaleY: 0, transformOrigin: "bottom" })
    gsap.to(bars, { scaleY: 1, duration: 0.8, stagger: 0.08, ease: "power3.out", delay: 0.3, clearProps: "transform" })
    gsap.set(progs, { scaleX: 0, transformOrigin: "left" })
    gsap.to(progs, { scaleX: 1, duration: 0.9, stagger: 0.07, ease: "power2.out", delay: 0.4, clearProps: "transform" })
  }, { dependencies: [data], scope: pageRef })

  const classPerf: any[] = data?.classPerformance || []
  const topStudents: any[] = data?.topStudents || []
  const monthly: any[] = data?.monthlyPayments || []
  const attSummary: any[] = data?.attendanceSummary || []
  const testResults: any[] = data?.testResults || []
  const maxRev = Math.max(...monthly.map((p: any) => p.total), 1)

  return (
    <div className="app-shell">
      <Sidebar role="admin" open={open} onClose={hide} />
      <div className="main-content">
        <TopBar title="Analytics" subtitle="Performance overview" onMenuClick={show} />
        <div className="page-body" ref={pageRef}>
          {loading ? (
            <div style={{ display: "flex", gap: 10, alignItems: "center", color: "#7a8aa0", padding: "40px 0" }}><div className="spinner" /> Loading…</div>
          ) : (
            <>
              <div className="grid-2" style={{ marginBottom: 16 }}>
                {/* Class performance */}
                <div className="card">
                  <div className="card-header"><h2 style={{ fontSize: 14.5, fontWeight: 700 }}>Avg Score by Class</h2></div>
                  <div className="card-body">
                    {classPerf.length === 0 ? <p style={{ color: "#7a8aa0", fontSize: 13 }}>No test data yet.</p> : (
                      <div style={{ display: "flex", gap: 20, alignItems: "flex-end", height: 130 }}>
                        {classPerf.map((cp: any) => (
                          <div key={cp.class} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: "#4361ee" }}>{cp.avg}%</span>
                            <div style={{ width: "100%", background: "#f4f5f9", borderRadius: 6, height: 110, display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
                              <div className="anim-bar" data-h={cp.avg} style={{ width: "100%", height: `${cp.avg}%`, background: "linear-gradient(to top,#4361ee,#738aff)", borderRadius: 6 }} />
                            </div>
                            <span style={{ fontSize: 12, color: "#7a8aa0", fontWeight: 600 }}>Class {cp.class}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Revenue chart */}
                <div className="card">
                  <div className="card-header"><h2 style={{ fontSize: 14.5, fontWeight: 700 }}>Monthly Revenue</h2></div>
                  <div className="card-body">
                    {monthly.length === 0 ? <p style={{ color: "#7a8aa0", fontSize: 13 }}>No payment data yet.</p> : (
                      <div style={{ display: "flex", gap: 10, alignItems: "flex-end", height: 130, overflowX: "auto" }}>
                        {monthly.map((p: any) => (
                          <div key={p.month} style={{ minWidth: 46, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                            <span style={{ fontSize: 10.5, fontWeight: 700, color: "#e8a020" }}>₹{(p.total / 1000).toFixed(1)}k</span>
                            <div style={{ width: "100%", background: "#f4f5f9", borderRadius: 6, height: 100, display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
                              <div className="anim-bar" data-h={p.total} style={{ width: "100%", height: `${(p.total / maxRev) * 100}%`, background: "linear-gradient(to top,#e8a020,#f5c842)", borderRadius: 6 }} />
                            </div>
                            <span style={{ fontSize: 10, color: "#7a8aa0" }}>{p.month.slice(0, 3)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid-2" style={{ marginBottom: 16 }}>
                {/* Top students */}
                <div className="card">
                  <div className="card-header"><h2 style={{ fontSize: 14.5, fontWeight: 700 }}>🏆 Top Performers</h2></div>
                  <div>
                    {topStudents.length === 0 ? (
                      <div style={{ padding: "24px 20px", color: "#7a8aa0", fontSize: 13 }}>No data yet.</div>
                    ) : topStudents.map((s: any, i: number) => (
                      <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 20px", borderBottom: "1px solid #e4e7ef" }}>
                        <div style={{ width: 26, height: 26, borderRadius: "50%", background: i === 0 ? "#e8a020" : i === 1 ? "#94a3b8" : "#cd7c54", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 12 }}>{i + 1}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: 13.5 }}>{s.name}</div>
                          <div style={{ fontSize: 11, color: "#7a8aa0" }}>Class {s.class}</div>
                        </div>
                        <div style={{ fontWeight: 800, fontSize: 15, color: "#4361ee", fontFamily: "Outfit,sans-serif" }}>{s.avgScore}%</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Attendance */}
                <div className="card">
                  <div className="card-header"><h2 style={{ fontSize: 14.5, fontWeight: 700 }}>Attendance Summary</h2></div>
                  <div style={{ padding: "16px 20px" }}>
                    {attSummary.length === 0 ? <p style={{ color: "#7a8aa0", fontSize: 13 }}>No data yet.</p> : attSummary.map((s: any) => (
                      <div key={s.name} style={{ marginBottom: 14 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 5 }}>
                          <span style={{ fontWeight: 600 }}>{s.name}</span>
                          <span style={{ color: s.percent >= 75 ? "#059669" : "#e11d48", fontWeight: 700 }}>{s.percent}%</span>
                        </div>
                        <div style={{ height: 6, borderRadius: 6, background: "#f4f5f9", overflow: "hidden" }}>
                          <div className="anim-progress" data-w={s.percent} style={{ height: "100%", borderRadius: 6, background: s.percent >= 75 ? "#059669" : "#e11d48", width: s.percent + "%" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Test results */}
              <div className="card">
                <div className="card-header"><h2 style={{ fontSize: 14.5, fontWeight: 700 }}>Recent Test Results</h2></div>
                <div className="table-scroll"><table>
                  <thead><tr><th>Student</th><th>Test</th><th>Score</th><th>%</th><th>Date</th></tr></thead>
                  <tbody>
                    {testResults.map((r: any) => {
                      const pct = Math.round((r.score / r.test?.totalMarks) * 100)
                      return (
                        <tr key={r.id}>
                          <td style={{ fontWeight: 600 }}>{r.user?.name}</td>
                          <td style={{ color: "#3d4a63" }}>{r.test?.title}</td>
                          <td style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 13 }}>{r.score}/{r.test?.totalMarks}</td>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <div style={{ height: 5, width: 60, borderRadius: 5, background: "#f4f5f9", overflow: "hidden" }}>
                                <div style={{ height: "100%", borderRadius: 5, background: pct >= 60 ? "#059669" : "#e11d48", width: pct + "%" }} />
                              </div>
                              <span style={{ fontSize: 12.5, fontWeight: 600, color: pct >= 60 ? "#059669" : "#e11d48" }}>{pct}%</span>
                            </div>
                          </td>
                          <td style={{ color: "#7a8aa0", fontSize: 12 }}>{new Date(r.submittedAt).toLocaleDateString("en-IN")}</td>
                        </tr>
                      )
                    })}
                    {testResults.length === 0 && <tr><td colSpan={5} style={{ textAlign: "center", color: "#7a8aa0", padding: "32px 0" }}>No test submissions yet.</td></tr>}
                  </tbody>
                </table></div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
