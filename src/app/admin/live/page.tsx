"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/shared/Sidebar"
import TopBar from "@/components/shared/TopBar"
import { useSidebar } from "@/lib/useSidebar"

export default function AdminLivePage() {
  const router = useRouter()
  const { open, show, hide } = useSidebar()
  const [liveClasses, setLiveClasses] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ title:"", meetUrl:"", scheduledAt:"", courseId:"", duration:60 })

  const token = () => localStorage.getItem("token") || ""
  const load = () => {
    fetch("/api/admin/live", { headers:{ Authorization:`Bearer ${token()}` } }).then(r=>r.json()).then(d=>setLiveClasses(d.liveClasses||[]))
    fetch("/api/admin/courses", { headers:{ Authorization:`Bearer ${token()}` } }).then(r=>r.json()).then(d=>setCourses(d.courses||[]))
  }
  useEffect(() => { const t=token(); if(!t){router.replace("/login");return} load() }, [])

  const save = async () => {
    const res = await fetch("/api/admin/live", { method:"POST", headers:{"Content-Type":"application/json",Authorization:`Bearer ${token()}`}, body:JSON.stringify(form) })
    if(res.ok){ setShowModal(false); load() } else alert("Error")
  }

  const now = new Date()
  const upcoming = liveClasses.filter(lc => new Date(lc.scheduledAt) >= now)
  const past = liveClasses.filter(lc => new Date(lc.scheduledAt) < now)

  return (
    <div className="app-shell">
      <Sidebar role="admin" open={open} onClose={hide} />
      <div className="main-content">
        <TopBar title="Live Classes" onMenuClick={show} />
        <div className="page-body">
          <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:16 }}>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Schedule Live Class</button>
          </div>
          <h3 style={{ fontSize:11, fontWeight:700, color:"#7a8aa0", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:12 }}>Upcoming Classes</h3>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:14, marginBottom:24 }}>
            {upcoming.map((lc:any) => (
              <div key={lc.id} className="card" style={{ padding:20, borderLeft:"3px solid #4361ee" }}>
                <div style={{ fontWeight:700, fontSize:15, marginBottom:4 }}>{lc.title}</div>
                <div style={{ fontSize:12.5, color:"#7a8aa0", marginBottom:10 }}>{lc.course?.title}</div>
                <div style={{ fontSize:12.5, marginBottom:4 }}>📅 {new Date(lc.scheduledAt).toLocaleString("en-IN",{dateStyle:"medium",timeStyle:"short"})}</div>
                <div style={{ fontSize:12.5, marginBottom:14 }}>⏱ {lc.duration} min</div>
                <a href={lc.meetUrl} target="_blank" className="btn btn-primary btn-sm" style={{ textDecoration:"none" }}>Join Class</a>
              </div>
            ))}
            {upcoming.length===0 && <p style={{ color:"#7a8aa0", fontSize:13 }}>No upcoming classes.</p>}
          </div>
          <h3 style={{ fontSize:11, fontWeight:700, color:"#7a8aa0", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:12 }}>Past Classes</h3>
          <div className="card">
            <div className="table-scroll"><table>
              <thead><tr><th>Title</th><th>Course</th><th>Date</th><th>Duration</th></tr></thead>
              <tbody>
                {past.map((lc:any)=>(
                  <tr key={lc.id}>
                    <td style={{ fontWeight:600 }}>{lc.title}</td>
                    <td style={{ color:"#7a8aa0" }}>{lc.course?.title}</td>
                    <td style={{ color:"#7a8aa0", fontSize:12 }}>{new Date(lc.scheduledAt).toLocaleDateString("en-IN")}</td>
                    <td>{lc.duration} min</td>
                  </tr>
                ))}
                {past.length===0 && <tr><td colSpan={4} style={{ textAlign:"center",color:"#7a8aa0",padding:"24px 0" }}>No past classes.</td></tr>}
              </tbody>
            </table></div>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="modal-bg" onClick={()=>setShowModal(false)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()}>
            <div className="modal-head"><h2 style={{ fontSize:16, fontWeight:700 }}>Schedule Live Class</h2></div>
            <div className="modal-body" style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <input className="input" placeholder="Class Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} />
              <input className="input" placeholder="Google Meet / Zoom URL" value={form.meetUrl} onChange={e=>setForm({...form,meetUrl:e.target.value})} />
              <select className="input" value={form.courseId} onChange={e=>setForm({...form,courseId:e.target.value})}>
                <option value="">Select Course</option>
                {courses.map(c=><option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
              <input className="input" type="datetime-local" value={form.scheduledAt} onChange={e=>setForm({...form,scheduledAt:e.target.value})} />
              <input className="input" type="number" placeholder="Duration (min)" value={form.duration} onChange={e=>setForm({...form,duration:Number(e.target.value)})} />
              <div style={{ display:"flex", gap:10 }}>
                <button className="btn btn-primary" onClick={save}>Schedule</button>
                <button className="btn btn-outline" onClick={()=>setShowModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
