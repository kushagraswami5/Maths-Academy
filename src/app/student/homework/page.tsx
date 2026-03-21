"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/shared/Sidebar"
import TopBar from "@/components/shared/TopBar"
import { useSidebar } from "@/lib/useSidebar"


export default function StudentHomework() {
  const router = useRouter()
  const { open, show, hide } = useSidebar()
  const [homeworks, setHomeworks] = useState<any[]>([])
  const [submissions, setSubmissions] = useState<any[]>([])
  const [activeHw, setActiveHw] = useState<any>(null)
  const [fileUrl, setFileUrl] = useState("")

  const token = () => localStorage.getItem("token") || ""
  const load = () => {
    fetch("/api/student/homework", { headers:{ Authorization:`Bearer ${token()}` } })
      .then(r=>r.json()).then(d=>{ setHomeworks(d.homeworks||[]); setSubmissions(d.submissions||[]) })
  }
  useEffect(() => { const t = localStorage.getItem("token"); if(!t){router.replace("/login");return} load() }, [])

  const submit = async () => {
    const res = await fetch("/api/student/homework/submit", {
      method:"POST", headers:{"Content-Type":"application/json", Authorization:`Bearer ${token()}`},
      body:JSON.stringify({ homeworkId:activeHw.id, fileUrl })
    })
    if (res.ok) { setActiveHw(null); setFileUrl(""); load() } else alert("Error submitting")
  }

  const submittedIds = new Set(submissions.map((s:any) => s.homeworkId))

  const isOverdue = (dueDate: string) => new Date(dueDate) < new Date()

  return (
    


<div className="app-shell"><Sidebar role="student" open={open} onClose={hide} /><div className="main-content"><TopBar title="Homework & DPP" onMenuClick={show} /><div className="page-body">
                  <h3 style={{ fontWeight:700, marginBottom:16, fontSize:15, color:"#7a8aa0", textTransform:"uppercase", letterSpacing:"0.05em" }}>Pending</h3>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:16, marginBottom:32 }}>
            {homeworks.filter((h:any) => !submittedIds.has(h.id)).map((h:any) => (
              <div key={h.id} className="card card-p" style={{ borderLeft:`4px solid ${isOverdue(h.dueDate)?"#e11d48":"#e8a020"}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <div style={{ fontWeight:700, fontSize:15 }}>{h.title}</div>
                  {isOverdue(h.dueDate) && <span className="badge badge-rose">Overdue</span>}
                </div>
                <div style={{ fontSize:13, color:"#7a8aa0", margin:"6px 0" }}>{h.course?.title}</div>
                {h.description && <p style={{ fontSize:13, color:"#7a8aa0", marginBottom:8 }}>{h.description}</p>}
                <div style={{ fontSize:13, marginBottom:14, color: isOverdue(h.dueDate) ? "#e11d48" : "#7a8aa0" }}>
                  📅 Due: {new Date(h.dueDate).toLocaleDateString("en-IN")}
                </div>
                <div style={{ display:"flex", gap:10 }}>
                  <a href={h.pdfUrl} target="_blank" className="btn btn-outline" style={{ fontSize:13, padding:"6px 14px", textDecoration:"none" }}>📄 View PDF</a>
                  <button className="btn btn-primary" style={{ fontSize:13, padding:"6px 14px" }} onClick={() => setActiveHw(h)}>Submit</button>
                </div>
              </div>
            ))}
            {homeworks.filter((h:any) => !submittedIds.has(h.id)).length === 0 &&
              <p style={{ color:"#7a8aa0", fontSize:14 }}>All homework submitted! 🎉</p>}
          </div>

          <h3 style={{ fontWeight:700, marginBottom:16, fontSize:15, color:"#7a8aa0", textTransform:"uppercase", letterSpacing:"0.05em" }}>Submitted</h3>
          <div className="card card-p">
            <div className="table-scroll"><table>
              <thead><tr><th>Title</th><th>Course</th><th>Submitted</th><th>Grade</th><th>Feedback</th></tr></thead>
              <tbody>
                {submissions.map((s:any) => (
                  <tr key={s.id}>
                    <td style={{ fontWeight:600 }}>{s.homework?.title}</td>
                    <td>{s.homework?.course?.title}</td>
                    <td style={{ color:"#7a8aa0" }}>{new Date(s.submittedAt).toLocaleDateString("en-IN")}</td>
                    <td>{s.grade != null ? <span className="badge badge-emerald">{s.grade}/10</span> : <span className="badge badge-gold">Pending</span>}</td>
                    <td style={{ color:"#7a8aa0", fontSize:13 }}>{s.feedback || "—"}</td>
                  </tr>
                ))}
                {submissions.length === 0 && <tr><td colSpan={5} style={{ textAlign:"center", color:"#7a8aa0", padding:32 }}>No submissions yet.</td></tr>}
              </tbody>
            </table></div>
          </div>
        </div>
      </div>

      {activeHw && (
        <div style={{ position:"fixed", inset:0, background:"#0008", display:"flex", alignItems:"center", justifyContent:"center", zIndex:100 }}>
          <div className="card card-p" style={{ width:440 }}>
            <h2 style={{ fontSize:18, fontWeight:700, marginBottom:6 }}>Submit: {activeHw.title}</h2>
            <p style={{ fontSize:13, color:"#7a8aa0", marginBottom:20 }}>Paste a link to your solution (Google Drive, OneDrive, etc.)</p>
            <input className="input" placeholder="Submission link (Google Drive, etc.)" value={fileUrl} onChange={e=>setFileUrl(e.target.value)} />
            <div style={{ display:"flex", gap:10, marginTop:16 }}>
              <button className="btn btn-primary" onClick={submit}>Submit</button>
              <button className="btn btn-outline" onClick={() => setActiveHw(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
