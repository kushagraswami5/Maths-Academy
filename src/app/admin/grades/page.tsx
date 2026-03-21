"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/shared/Sidebar"
import TopBar from "@/components/shared/TopBar"
import { useSidebar } from "@/lib/useSidebar"

export default function GradingPage() {
  const router = useRouter()
  const { open, show, hide } = useSidebar()
  const [submissions, setSubmissions] = useState<any[]>([])
  const [grading, setGrading] = useState<Record<string,{grade:string,feedback:string}>>({})
  const [saving, setSaving] = useState<string|null>(null)
  const [filter, setFilter] = useState("pending")

  const token = () => localStorage.getItem("token") || ""
  const load = () => {
    fetch("/api/admin/grades", { headers:{ Authorization:`Bearer ${token()}` } }).then(r=>r.json()).then(d=>setSubmissions(d.submissions||[]))
  }
  useEffect(() => { const t=token(); if(!t){router.replace("/login");return} load() }, [])

  const saveGrade = async (subId: string) => {
    setSaving(subId)
    const g = grading[subId]
    await fetch(`/api/admin/grades/${subId}`, { method:"PATCH", headers:{"Content-Type":"application/json",Authorization:`Bearer ${token()}`}, body:JSON.stringify({ grade:Number(g?.grade), feedback:g?.feedback||"" }) })
    setSaving(null); load()
  }

  const filtered = submissions.filter(s => filter==="all"||(filter==="pending"?s.grade==null:s.grade!=null))

  return (
    <div className="app-shell">
      <Sidebar role="admin" open={open} onClose={hide} />
      <div className="main-content">
        <TopBar title="Grade Homework" onMenuClick={show} />
        <div className="page-body">
          <div style={{ display:"flex", gap:8, marginBottom:18 }}>
            {["pending","graded","all"].map(f=>(
              <button key={f} onClick={()=>setFilter(f)} className={filter===f?"btn btn-primary btn-sm":"btn btn-outline btn-sm"} style={{ textTransform:"capitalize" }}>
                {f} ({submissions.filter(s=>f==="all"||(f==="pending"?s.grade==null:s.grade!=null)).length})
              </button>
            ))}
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {filtered.map((s:any) => (
              <div key={s.id} className="card" style={{ padding:20 }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:16, alignItems:"start" }}>
                  <div>
                    <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:6 }}>
                      <span style={{ fontWeight:700, fontSize:15 }}>{s.homework?.title}</span>
                      {s.grade!=null?<span className="badge badge-emerald">Graded: {s.grade}/10</span>:<span className="badge badge-gold">Pending</span>}
                    </div>
                    <div style={{ fontSize:12.5, color:"#7a8aa0", marginBottom:8 }}>
                      👤 <strong>{s.user?.name}</strong> · Class {s.user?.class} · {new Date(s.submittedAt).toLocaleDateString("en-IN")}
                    </div>
                    {s.fileUrl && <a href={s.fileUrl} target="_blank" style={{ color:"#4361ee", fontWeight:600, fontSize:13 }}>📎 View Submission</a>}
                    {s.feedback && <div style={{ marginTop:6, fontSize:13, color:"#7a8aa0", fontStyle:"italic" }}>"{s.feedback}"</div>}
                  </div>
                  {s.grade==null && (
                    <div style={{ display:"flex", flexDirection:"column", gap:8, minWidth:220 }}>
                      <div style={{ display:"flex", gap:8 }}>
                        <input className="input" type="number" min="0" max="10" placeholder="Grade /10" style={{ maxWidth:100 }}
                          value={grading[s.id]?.grade||""} onChange={e=>setGrading({...grading,[s.id]:{...grading[s.id],grade:e.target.value}})} />
                        <button className="btn btn-primary btn-sm" onClick={()=>saveGrade(s.id)} disabled={saving===s.id}>
                          {saving===s.id?"Saving…":"Save"}
                        </button>
                      </div>
                      <input className="input" placeholder="Feedback (optional)" value={grading[s.id]?.feedback||""}
                        onChange={e=>setGrading({...grading,[s.id]:{...grading[s.id],feedback:e.target.value}})} />
                    </div>
                  )}
                </div>
              </div>
            ))}
            {filtered.length===0 && (
              <div className="card" style={{ padding:48, textAlign:"center" }}>
                <div style={{ fontSize:36, marginBottom:10 }}>🎉</div>
                <p style={{ color:"#7a8aa0", fontSize:13 }}>No {filter==="all"?"submissions":filter+" submissions"} found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
