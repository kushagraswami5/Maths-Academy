"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/shared/Sidebar"
import TopBar from "@/components/shared/TopBar"
import { useSidebar } from "@/lib/useSidebar"

export default function AttendancePage() {
  const router = useRouter()
  const { open, show, hide } = useSidebar()
  const [liveClasses, setLiveClasses] = useState<any[]>([])
  const [selected, setSelected] = useState<any>(null)
  const [students, setStudents] = useState<any[]>([])
  const [attendance, setAttendance] = useState<Record<string,string>>({})
  const [courses, setCourses] = useState<any[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [lcForm, setLcForm] = useState({ title:"", meetUrl:"", scheduledAt:"", courseId:"", duration:60 })

  const token = () => localStorage.getItem("token") || ""
  const load = () => {
    fetch("/api/admin/live", { headers:{ Authorization:`Bearer ${token()}` } }).then(r=>r.json()).then(d=>setLiveClasses(d.liveClasses||[]))
    fetch("/api/admin/courses", { headers:{ Authorization:`Bearer ${token()}` } }).then(r=>r.json()).then(d=>setCourses(d.courses||[]))
  }
  useEffect(() => { const t = localStorage.getItem("token"); if(!t){router.replace("/login");return} load() }, [])

  const openAttendance = async (lc: any) => {
    setSelected(lc)
    const d = await fetch(`/api/admin/attendance/${lc.id}`, { headers:{ Authorization:`Bearer ${token()}` } }).then(r=>r.json())
    setStudents(d.students || [])
    const map: Record<string,string> = {}
    d.attendance?.forEach((a:any) => { map[a.userId] = a.status })
    setAttendance(map)
  }

  const saveAttendance = async () => {
    const records = students.map(s => ({ userId:s.id, status: attendance[s.id] || "absent" }))
    await fetch(`/api/admin/attendance/${selected.id}`, { method:"POST", headers:{"Content-Type":"application/json",Authorization:`Bearer ${token()}`}, body:JSON.stringify({ records }) })
    alert("Attendance saved!"); setSelected(null)
  }

  const addLiveClass = async () => {
    await fetch("/api/admin/live", { method:"POST", headers:{"Content-Type":"application/json",Authorization:`Bearer ${token()}`}, body:JSON.stringify(lcForm) })
    setShowAddModal(false); load()
  }

  return (
    <div className="app-shell">
      <Sidebar role="admin" open={open} onClose={hide} />
      <div className="main-content">
        <TopBar title="Attendance" onMenuClick={show} />
        <div className="page-body">
          <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:16 }}>
            <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>+ Schedule Live Class</button>
          </div>
          <div className="card">
            <div className="table-scroll"><table>
              <thead><tr><th>Class Title</th><th>Course</th><th>Scheduled</th><th>Link</th><th>Action</th></tr></thead>
              <tbody>
                {liveClasses.map((lc:any) => (
                  <tr key={lc.id}>
                    <td style={{ fontWeight:600 }}>{lc.title}</td>
                    <td style={{ color:"#7a8aa0" }}>{lc.course?.title}</td>
                    <td style={{ color:"#7a8aa0", fontSize:12 }}>{new Date(lc.scheduledAt).toLocaleString("en-IN",{dateStyle:"medium",timeStyle:"short"})}</td>
                    <td><a href={lc.meetUrl} target="_blank" style={{ color:"#4361ee", fontWeight:600, fontSize:13 }}>Join Link</a></td>
                    <td><button className="btn btn-outline btn-sm" onClick={() => openAttendance(lc)}>Mark Attendance</button></td>
                  </tr>
                ))}
                {liveClasses.length === 0 && <tr><td colSpan={5} style={{ textAlign:"center", color:"#7a8aa0", padding:"32px 0" }}>No live classes yet.</td></tr>}
              </tbody>
            </table></div>
          </div>
        </div>
      </div>

      {selected && (
        <div className="modal-bg" onClick={() => setSelected(null)}>
          <div className="modal-box" style={{ maxWidth:480 }} onClick={e=>e.stopPropagation()}>
            <div className="modal-head"><h2 style={{ fontSize:16, fontWeight:700 }}>Attendance: {selected.title}</h2></div>
            <div className="modal-body">
              {students.map((s:any) => (
                <div key={s.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:"1px solid #e4e7ef" }}>
                  <div>
                    <div style={{ fontWeight:600, fontSize:13.5 }}>{s.name}</div>
                    <div style={{ fontSize:11.5, color:"#7a8aa0" }}>Class {s.class}</div>
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    {["present","absent"].map(st => (
                      <button key={st} onClick={() => setAttendance({...attendance,[s.id]:st})} className="btn btn-sm" style={{ background: attendance[s.id]===st?(st==="present"?"#059669":"#e11d48"):"#f4f5f9", color: attendance[s.id]===st?"white":"#7a8aa0", border:"none" }}>
                        {st.charAt(0).toUpperCase()+st.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <div style={{ display:"flex", gap:10, marginTop:16 }}>
                <button className="btn btn-primary" onClick={saveAttendance}>Save</button>
                <button className="btn btn-outline" onClick={() => setSelected(null)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="modal-bg" onClick={() => setShowAddModal(false)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()}>
            <div className="modal-head"><h2 style={{ fontSize:16, fontWeight:700 }}>Schedule Live Class</h2></div>
            <div className="modal-body" style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <input className="input" placeholder="Title" value={lcForm.title} onChange={e=>setLcForm({...lcForm,title:e.target.value})} />
              <input className="input" placeholder="Google Meet / Zoom URL" value={lcForm.meetUrl} onChange={e=>setLcForm({...lcForm,meetUrl:e.target.value})} />
              <input className="input" type="datetime-local" value={lcForm.scheduledAt} onChange={e=>setLcForm({...lcForm,scheduledAt:e.target.value})} />
              <input className="input" type="number" placeholder="Duration (minutes)" value={lcForm.duration} onChange={e=>setLcForm({...lcForm,duration:Number(e.target.value)})} />
              <select className="input" value={lcForm.courseId} onChange={e=>setLcForm({...lcForm,courseId:e.target.value})}>
                <option value="">Select Course</option>
                {courses.map(c=><option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
              <div style={{ display:"flex", gap:10 }}>
                <button className="btn btn-primary" onClick={addLiveClass}>Schedule</button>
                <button className="btn btn-outline" onClick={() => setShowAddModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
