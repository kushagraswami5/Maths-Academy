"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/shared/Sidebar"
import TopBar from "@/components/shared/TopBar"
import { useSidebar } from "@/lib/useSidebar"

export default function HomeworkPage() {
  const router = useRouter()
  const { open, show, hide } = useSidebar()
  const [homeworks, setHomeworks] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ title:"", description:"", pdfUrl:"", courseId:"", dueDate:"" })

  const token = () => localStorage.getItem("token") || ""
  const load = () => {
    fetch("/api/admin/homework", { headers:{ Authorization:`Bearer ${token()}` } }).then(r=>r.json()).then(d=>setHomeworks(d.homeworks||[]))
    fetch("/api/admin/courses", { headers:{ Authorization:`Bearer ${token()}` } }).then(r=>r.json()).then(d=>setCourses(d.courses||[]))
  }
  useEffect(() => { const t=token(); if(!t){router.replace("/login");return} load() }, [])

  const save = async () => {
    const res = await fetch("/api/admin/homework", { method:"POST", headers:{"Content-Type":"application/json",Authorization:`Bearer ${token()}`}, body:JSON.stringify(form) })
    if (res.ok) { setShowModal(false); load() } else alert("Error")
  }

  return (
    <div className="app-shell">
      <Sidebar role="admin" open={open} onClose={hide} />
      <div className="main-content">
        <TopBar title="Homework / DPP" onMenuClick={show} />
        <div className="page-body">
          <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:16 }}>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Upload DPP/Homework</button>
          </div>
          <div className="card">
            <div className="table-scroll"><table>
              <thead><tr><th>Title</th><th>Course</th><th>Due Date</th><th>Submissions</th><th>PDF</th></tr></thead>
              <tbody>
                {homeworks.map((h:any) => (
                  <tr key={h.id}>
                    <td style={{ fontWeight:600 }}>{h.title}</td>
                    <td style={{ color:"#7a8aa0" }}>{h.course?.title}</td>
                    <td style={{ color:"#7a8aa0", fontSize:12 }}>{new Date(h.dueDate).toLocaleDateString("en-IN")}</td>
                    <td>{h._count?.submissions||0} submitted</td>
                    <td><a href={h.pdfUrl} target="_blank" style={{ color:"#4361ee", fontWeight:600, fontSize:13 }}>View PDF</a></td>
                  </tr>
                ))}
                {homeworks.length===0 && <tr><td colSpan={5} style={{ textAlign:"center", color:"#7a8aa0", padding:"32px 0" }}>No homework uploaded yet.</td></tr>}
              </tbody>
            </table></div>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="modal-bg" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()}>
            <div className="modal-head"><h2 style={{ fontSize:16, fontWeight:700 }}>Upload Homework / DPP</h2></div>
            <div className="modal-body" style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <input className="input" placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} />
              <textarea className="input" rows={2} placeholder="Description (optional)" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />
              <input className="input" placeholder="PDF URL (Google Drive, etc.)" value={form.pdfUrl} onChange={e=>setForm({...form,pdfUrl:e.target.value})} />
              <select className="input" value={form.courseId} onChange={e=>setForm({...form,courseId:e.target.value})}>
                <option value="">Select Course</option>
                {courses.map(c=><option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
              <input className="input" type="date" value={form.dueDate} onChange={e=>setForm({...form,dueDate:e.target.value})} />
              <div style={{ display:"flex", gap:10 }}>
                <button className="btn btn-primary" onClick={save}>Upload</button>
                <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
