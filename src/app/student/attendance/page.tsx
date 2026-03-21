"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/shared/Sidebar"
import TopBar from "@/components/shared/TopBar"
import { useSidebar } from "@/lib/useSidebar"


export default function StudentAttendance() {
  const router = useRouter()
  const { open, show, hide } = useSidebar()
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    const t = localStorage.getItem("token"); if (!t) { router.replace("/login"); return }
    fetch("/api/student/attendance", { headers: { Authorization: `Bearer ${t}` } })
      .then(r => r.json()).then(d => setData(d))
  }, [])

  const records: any[] = data?.records || []
  const total = records.length
  const present = records.filter((r: any) => r.status === "present").length
  const pct = total > 0 ? Math.round((present / total) * 100) : 0
  const color = pct >= 75 ? "#059669" : pct >= 50 ? "#e8a020" : "#e11d48"

  // Fix NaN: only show needed classes if total > 0
  const classesNeededFor75 = total > 0 && pct < 75
    ? Math.max(0, Math.ceil((0.75 * total - present) / 0.25))
    : null

  return (



    <div className="app-shell"><Sidebar role="student" open={open} onClose={hide} /><div className="main-content"><TopBar title="My Attendance" onMenuClick={show} /><div className="page-body">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 16, marginBottom: 28 }}>
        {[
          { label: "Total Classes", value: total, color: "#4361ee", bg: "#eef1ff" },
          { label: "Present", value: present, color: "#059669", bg: "#ecfdf5" },
          { label: "Absent", value: total - present, color: "#e11d48", bg: "#fff0f3" },
          { label: "Attendance %", value: total === 0 ? "N/A" : pct + "%", color, bg: "#f4f5f9" },
        ].map(s => (
          <div key={s.label} className="card card-p" style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "#7a8aa0", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card card-p" style={{ marginBottom: 24, display: "flex", alignItems: "center", gap: 32 }}>
        <svg width={120} height={120} viewBox="0 0 120 120">
          <circle cx={60} cy={60} r={50} fill="none" stroke="#e4e7ef" strokeWidth={10} />
          <circle cx={60} cy={60} r={50} fill="none" stroke={total === 0 ? "#e4e7ef" : color} strokeWidth={10}
            strokeDasharray={`${2 * Math.PI * 50}`}
            strokeDashoffset={`${2 * Math.PI * 50 * (1 - (total === 0 ? 0 : pct) / 100)}`}
            strokeLinecap="round" transform="rotate(-90 60 60)"
            style={{ transition: "stroke-dashoffset 1s ease" }} />
          <text x={60} y={60} textAnchor="middle" dominantBaseline="middle"
            style={{ fontSize: 20, fontWeight: 800, fill: total === 0 ? "#b0bcc8" : color, fontFamily: "Space Grotesk,sans-serif" }}>
            {total === 0 ? "—" : pct + "%"}
          </text>
        </svg>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>Overall Attendance</div>
          <div style={{ fontSize: 14, color: "#7a8aa0", marginTop: 4 }}>
            {total === 0
              ? "No classes recorded yet."
              : pct >= 75 ? "✅ Good standing! Keep it up."
                : pct >= 50 ? "⚠️ Attendance is low. Try to attend more classes."
                  : "🚨 Critical! Below 50% attendance."}
          </div>
          {classesNeededFor75 !== null && classesNeededFor75 > 0 && (
            <div style={{ fontSize: 13, color: "#e11d48", marginTop: 8 }}>
              Need {classesNeededFor75} more classes to reach 75%
            </div>
          )}
        </div>
      </div>

      <div className="card card-p">
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Attendance History</h2>
        <div className="table-scroll"><table>
          <thead><tr><th>Class</th><th>Course</th><th>Date</th><th>Status</th></tr></thead>
          <tbody>
            {records.map((r: any) => (
              <tr key={r.id}>
                <td style={{ fontWeight: 600 }}>{r.liveClass?.title}</td>
                <td style={{ color: "#7a8aa0" }}>{r.liveClass?.course?.title}</td>
                <td style={{ color: "#7a8aa0" }}>{new Date(r.joinedAt).toLocaleDateString("en-IN")}</td>
                <td><span className={r.status === "present" ? "badge badge-green" : "badge badge-red"}>{r.status}</span></td>
              </tr>
            ))}
            {records.length === 0 && <tr><td colSpan={4} style={{ textAlign: "center", color: "#7a8aa0", padding: 32 }}>No attendance records yet.</td></tr>}
          </tbody>
        </table></div>
      </div>
    </div>
    </div>
    </div>

  )
}