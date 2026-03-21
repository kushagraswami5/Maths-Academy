"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/shared/Sidebar"
import TopBar from "@/components/shared/TopBar"
import { useSidebar } from "@/lib/useSidebar"

export default function PaymentsPage() {
  const router = useRouter()
  const { open, show, hide } = useSidebar()
  const [payments, setPayments] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [filter, setFilter] = useState("all")
  const [form, setForm] = useState({ userId:"", courseId:"", amount:"", method:"cash", month:"", status:"paid" })

  const token = () => localStorage.getItem("token") || ""
  const load = () => {
    fetch("/api/admin/payments", { headers:{ Authorization:`Bearer ${token()}` } }).then(r=>r.json()).then(d=>setPayments(d.payments||[]))
    fetch("/api/admin/students", { headers:{ Authorization:`Bearer ${token()}` } }).then(r=>r.json()).then(d=>setStudents(d.students||[]))
    fetch("/api/admin/courses", { headers:{ Authorization:`Bearer ${token()}` } }).then(r=>r.json()).then(d=>setCourses(d.courses||[]))
  }
  useEffect(() => { const t=token(); if(!t){router.replace("/login");return} load() }, [])

  const save = async () => {
    const res = await fetch("/api/admin/payments", { method:"POST", headers:{"Content-Type":"application/json",Authorization:`Bearer ${token()}`}, body:JSON.stringify({...form,amount:Number(form.amount)}) })
    if(res.ok){ setShowModal(false); load() } else alert("Error")
  }

  const filtered = payments.filter(p=>filter==="all"||p.status===filter)
  const totalCollected = payments.filter(p=>p.status==="paid").reduce((a:number,p:any)=>a+p.amount,0)
  const totalPending = payments.filter(p=>p.status==="pending").reduce((a:number,p:any)=>a+p.amount,0)

  return (
    <div className="app-shell">
      <Sidebar role="admin" open={open} onClose={hide} />
      <div className="main-content">
        <TopBar title="Fee & Payments" onMenuClick={show} />
        <div className="page-body">
          <div className="grid-kpi" style={{ marginBottom: 20 }}>
            {[["Total Collected","₹"+totalCollected.toLocaleString(),"#059669"],["Pending Fees","₹"+totalPending.toLocaleString(),"#e11d48"],["Total Records",payments.length,"#4361ee"]].map(([l,v,c])=>(
              <div key={l as string} className="card" style={{ padding:18, display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ fontSize:22, fontWeight:800, color:c as string }}>{v}</div>
                <div style={{ fontSize:12.5, color:"#7a8aa0" }}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap" }}>
            {["all","paid","pending","failed"].map(s=>(
              <button key={s} onClick={()=>setFilter(s)} className={filter===s?"btn btn-primary btn-sm":"btn btn-outline btn-sm"} style={{ textTransform:"capitalize" }}>{s}</button>
            ))}
            <button className="btn btn-primary btn-sm" style={{ marginLeft:"auto" }} onClick={()=>setShowModal(true)}>+ Record Payment</button>
          </div>
          <div className="card">
            <div className="table-scroll"><table>
              <thead><tr><th>Student</th><th>Course</th><th>Amount</th><th>Method</th><th>Month</th><th>Status</th></tr></thead>
              <tbody>
                {filtered.map((p:any)=>(
                  <tr key={p.id}>
                    <td>
                      <div style={{ fontWeight:600 }}>{p.user?.name}</div>
                      <div style={{ fontSize:11, color:"#7a8aa0" }}>Class {p.user?.class}</div>
                    </td>
                    <td style={{ color:"#7a8aa0" }}>{p.courseTitle||"—"}</td>
                    <td style={{ fontWeight:700, color:"#4361ee", fontFamily:"JetBrains Mono,monospace" }}>₹{p.amount.toLocaleString()}</td>
                    <td style={{ textTransform:"capitalize" }}>{p.method}</td>
                    <td style={{ color:"#7a8aa0" }}>{p.month||"—"}</td>
                    <td><span className={p.status==="paid"?"badge badge-emerald":p.status==="pending"?"badge badge-gold":"badge badge-rose"}>{p.status}</span></td>
                  </tr>
                ))}
                {filtered.length===0 && <tr><td colSpan={6} style={{ textAlign:"center", color:"#7a8aa0", padding:"32px 0" }}>No records.</td></tr>}
              </tbody>
            </table></div>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="modal-bg" onClick={()=>setShowModal(false)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()}>
            <div className="modal-head"><h2 style={{ fontSize:16, fontWeight:700 }}>Record Payment</h2></div>
            <div className="modal-body" style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <select className="input" value={form.userId} onChange={e=>setForm({...form,userId:e.target.value})}>
                <option value="">Select Student</option>
                {students.map(s=><option key={s.id} value={s.id}>{s.name} (Class {s.class})</option>)}
              </select>
              <select className="input" value={form.courseId} onChange={e=>setForm({...form,courseId:e.target.value})}>
                <option value="">Select Course</option>
                {courses.map(c=><option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
              <input className="input" type="number" placeholder="Amount (₹)" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} />
              <input className="input" placeholder="Month (e.g. March 2026)" value={form.month} onChange={e=>setForm({...form,month:e.target.value})} />
              <select className="input" value={form.method} onChange={e=>setForm({...form,method:e.target.value})}>
                {["cash","UPI","bank transfer","cheque"].map(m=><option key={m} value={m}>{m}</option>)}
              </select>
              <select className="input" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
                {["paid","pending","failed"].map(s=><option key={s} value={s}>{s}</option>)}
              </select>
              <div style={{ display:"flex", gap:10 }}>
                <button className="btn btn-primary" onClick={save}>Save</button>
                <button className="btn btn-outline" onClick={()=>setShowModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
