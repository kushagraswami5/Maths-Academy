"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/shared/Sidebar"
import TopBar from "@/components/shared/TopBar"
import { useSidebar } from "@/lib/useSidebar"

export default function LecturesPage() {
  const router = useRouter()
  const { open, show, hide } = useSidebar()
  const [courses, setCourses] = useState<any[]>([])
  const [selectedCourse, setSelectedCourse] = useState("")
  const [lectures, setLectures] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ title:"", videoUrl:"", duration:"", order:"" })
  const [saving, setSaving] = useState(false)

  const token = () => localStorage.getItem("token") || ""

  useEffect(() => {
    const t = token(); if(!t){router.replace("/login");return}
    fetch("/api/admin/courses", { headers:{ Authorization:`Bearer ${t}` } }).then(r=>r.json()).then(d=>setCourses(d.courses||[]))
  }, [])

  useEffect(() => {
    if (!selectedCourse) return
    fetch(`/api/admin/lectures?courseId=${selectedCourse}`, { headers:{ Authorization:`Bearer ${token()}` } }).then(r=>r.json()).then(d=>setLectures(d.lectures||[]))
  }, [selectedCourse])

  const save = async () => {
    setSaving(true)
    const res = await fetch("/api/admin/lectures", { method:"POST", headers:{"Content-Type":"application/json",Authorization:`Bearer ${token()}`}, body:JSON.stringify({...form,courseId:selectedCourse,duration:Number(form.duration),order:Number(form.order)}) })
    setSaving(false)
    if (res.ok) { setShowModal(false); setForm({title:"",videoUrl:"",duration:"",order:""}); fetch(`/api/admin/lectures?courseId=${selectedCourse}`,{headers:{Authorization:`Bearer ${token()}`}}).then(r=>r.json()).then(d=>setLectures(d.lectures||[])) }
    else alert("Error saving lecture")
  }

  const deleteLecture = async (id: string) => {
    if (!confirm("Delete this lecture?")) return
    await fetch(`/api/admin/lectures/${id}`, { method:"DELETE", headers:{ Authorization:`Bearer ${token()}` } })
    setLectures(lectures.filter(l=>l.id!==id))
  }

  return (
    <div className="app-shell">
      <Sidebar role="admin" open={open} onClose={hide} />
      <div className="main-content">
        <TopBar title="Recorded Lectures" onMenuClick={show} />
        <div className="page-body">
          <div style={{ display:"flex", gap:12, marginBottom:20, alignItems:"center" }}>
            <select className="input" style={{ maxWidth:320 }} value={selectedCourse} onChange={e=>setSelectedCourse(e.target.value)}>
              <option value="">— Select a course —</option>
              {courses.map(c=><option key={c.id} value={c.id}>{c.title} (Class {c.class})</option>)}
            </select>
            {selectedCourse && <button className="btn btn-primary" onClick={()=>setShowModal(true)}>+ Add Lecture</button>}
          </div>
          {!selectedCourse && (
            <div className="card" style={{ padding:48, textAlign:"center" }}>
              <div style={{ fontSize:36, marginBottom:10 }}>📚</div>
              <p style={{ color:"#7a8aa0", fontSize:13 }}>Select a course to manage its lectures.</p>
            </div>
          )}
          {selectedCourse && (
            <div className="card">
              <div className="table-scroll"><table>
                <thead><tr><th>#</th><th>Title</th><th>Duration</th><th>Video</th><th>Action</th></tr></thead>
                <tbody>
                  {lectures.sort((a,b)=>a.order-b.order).map((l:any) => (
                    <tr key={l.id}>
                      <td style={{ fontWeight:700, color:"#4361ee", fontFamily:"JetBrains Mono,monospace" }}>{l.order||"—"}</td>
                      <td style={{ fontWeight:600 }}>{l.title}</td>
                      <td style={{ color:"#7a8aa0" }}>{l.duration?`${l.duration} min`:"—"}</td>
                      <td><a href={l.videoUrl} target="_blank" style={{ color:"#4361ee", fontWeight:600, fontSize:13 }}>▶ Watch</a></td>
                      <td><button className="btn btn-danger-soft btn-sm" onClick={()=>deleteLecture(l.id)}>Delete</button></td>
                    </tr>
                  ))}
                  {lectures.length===0 && <tr><td colSpan={5} style={{ textAlign:"center", color:"#7a8aa0", padding:"32px 0" }}>No lectures yet.</td></tr>}
                </tbody>
              </table></div>
            </div>
          )}
        </div>
      </div>
      {showModal && (
        <div className="modal-bg" onClick={()=>setShowModal(false)}>
          <div className="modal-box modal-lg" onClick={e=>e.stopPropagation()}>
            <div className="modal-head"><h2 style={{ fontSize:16, fontWeight:700 }}>Add Lecture</h2></div>
            <div className="modal-body" style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <input className="input" placeholder="Lecture Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} />
              <input className="input" placeholder="Video URL (YouTube, Drive, Loom...)" value={form.videoUrl} onChange={e=>setForm({...form,videoUrl:e.target.value})} />
              <div className="grid-2" style={{ marginBottom: 16 }}>
                <input className="input" type="number" placeholder="Duration (minutes)" value={form.duration} onChange={e=>setForm({...form,duration:e.target.value})} />
                <input className="input" type="number" placeholder="Order (1, 2, 3...)" value={form.order} onChange={e=>setForm({...form,order:e.target.value})} />
              </div>
              <div style={{ display:"flex", gap:10 }}>
                <button className="btn btn-primary" onClick={save} disabled={saving}>{saving?"Saving…":"Add Lecture"}</button>
                <button className="btn btn-outline" onClick={()=>setShowModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
