"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/shared/Sidebar"
import TopBar from "@/components/shared/TopBar"
import { useSidebar } from "@/lib/useSidebar"

export default function CoursesPage() {
  const router = useRouter()
  const { open, show, hide } = useSidebar()
  const [courses, setCourses] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ title:"", description:"", class:"8", price:"" })
  const [loading, setLoading] = useState(true)

  const token = () => localStorage.getItem("token") || ""
  const load = () => {
    const t = token(); if (!t) { router.replace("/login"); return }
    fetch("/api/admin/courses", { headers:{ Authorization:`Bearer ${t}` } }).then(r=>r.json()).then(d=>setCourses(d.courses||[])).finally(()=>setLoading(false))
  }
  useEffect(() => { load() }, [])

  const save = async () => {
    const res = await fetch("/api/admin/courses", { method:"POST", headers:{"Content-Type":"application/json", Authorization:`Bearer ${token()}`}, body:JSON.stringify({...form, price:Number(form.price)}) })
    if (res.ok) { setShowModal(false); setForm({title:"",description:"",class:"8",price:""}); load() } else alert("Error")
  }

  return (
    <div className="app-shell">
      <Sidebar role="admin" open={open} onClose={hide} />
      <div className="main-content">
        <TopBar title="Courses" onMenuClick={show} />
        <div className="page-body">
          <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:16 }}>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Course</button>
          </div>
          {loading ? (
            <div style={{ display:"flex", gap:10, alignItems:"center", color:"#7a8aa0" }}><div className="spinner" /> Loading…</div>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:16 }}>
              {courses.map((c:any) => (
                <div key={c.id} className="card" style={{ padding:20, borderTop:"3px solid #4361ee" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                    <div>
                      <h3 style={{ fontWeight:700, fontSize:15.5 }}>{c.title}</h3>
                      <span className="badge badge-indigo" style={{ marginTop:6, display:"inline-block" }}>Class {c.class}</span>
                    </div>
                    <span style={{ fontWeight:800, color:"#4361ee", fontSize:18, fontFamily:"Outfit,sans-serif" }}>₹{c.price}</span>
                  </div>
                  <p style={{ color:"#7a8aa0", fontSize:13, marginBottom:12 }}>{c.description}</p>
                  <div style={{ display:"flex", gap:14, fontSize:12.5, color:"#7a8aa0" }}>
                    <span>📚 {c._count?.lectures||0} Lectures</span>
                    <span>👥 {c._count?.enrollments||0} Students</span>
                  </div>
                </div>
              ))}
              {courses.length === 0 && <p style={{ color:"#7a8aa0", fontSize:13 }}>No courses yet.</p>}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-bg" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()}>
            <div className="modal-head"><h2 style={{ fontSize:16, fontWeight:700 }}>Add Course</h2></div>
            <div className="modal-body" style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <input className="input" placeholder="Course Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} />
              <textarea className="input" placeholder="Description" rows={3} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />
              <select className="input" value={form.class} onChange={e=>setForm({...form,class:e.target.value})}>
                <option value="8">Class 8</option><option value="9">Class 9</option><option value="10">Class 10</option>
              </select>
              <input className="input" type="number" placeholder="Price (₹)" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} />
              <div style={{ display:"flex", gap:10 }}>
                <button className="btn btn-primary" onClick={save}>Save Course</button>
                <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
