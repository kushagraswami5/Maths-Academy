"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/shared/Sidebar"
import TopBar from "@/components/shared/TopBar"
import { useSidebar } from "@/lib/useSidebar"

export default function NotificationsPage() {
  const router = useRouter()
  const { open, show, hide } = useSidebar()
  const [students, setStudents] = useState<any[]>([])
  const [form, setForm] = useState({ title:"", message:"", type:"general", targetClass:"all", userId:"" })
  const [sent, setSent] = useState<any[]>([])
  const [adminNotifs, setAdminNotifs] = useState<any[]>([])
  const [sending, setSending] = useState(false)
  const [tab, setTab] = useState<"inbox"|"send">("inbox")

  const token = () => localStorage.getItem("token") || ""
  const load = () => {
    fetch("/api/admin/students", { headers:{ Authorization:`Bearer ${token()}` } }).then(r=>r.json()).then(d=>setStudents(d.students||[]))
    fetch("/api/admin/notifications", { headers:{ Authorization:`Bearer ${token()}` } }).then(r=>r.json()).then(d=>setSent(d.notifications||[]))
    fetch("/api/admin/notifications/inbox", { headers:{ Authorization:`Bearer ${token()}` } }).then(r=>r.json()).then(d=>setAdminNotifs(d.notifications||[]))
  }
  useEffect(() => { const t=token(); if(!t){router.replace("/login");return} load() }, [])

  const send = async () => {
    setSending(true)
    await fetch("/api/admin/notifications", { method:"POST", headers:{"Content-Type":"application/json",Authorization:`Bearer ${token()}`}, body:JSON.stringify(form) })
    setForm({ title:"", message:"", type:"general", targetClass:"all", userId:"" }); load(); setSending(false)
  }

  const markRead = async (id: string) => {
    await fetch(`/api/admin/notifications/inbox/${id}/read`, { method:"PATCH", headers:{ Authorization:`Bearer ${token()}` } }); load()
  }

  const markAllRead = async () => {
    await fetch("/api/admin/notifications/inbox/read-all", { method:"PATCH", headers:{ Authorization:`Bearer ${token()}` } }); load()
  }

  const unread = adminNotifs.filter(n=>!n.isRead).length

  return (
    <div className="app-shell">
      <Sidebar role="admin" open={open} onClose={hide} />
      <div className="main-content">
        <TopBar title="Notifications" onMenuClick={show} />
        <div className="page-body">
          <div style={{ display:"flex", gap:10, marginBottom:20 }}>
            <button onClick={()=>setTab("inbox")} className={tab==="inbox"?"btn btn-primary":"btn btn-outline"} style={{ display:"flex", alignItems:"center", gap:8 }}>
              📬 Inbox
              {unread>0 && <span style={{ background:"#e11d48", color:"white", borderRadius:"50%", width:18, height:18, fontSize:10, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center" }}>{unread}</span>}
            </button>
            <button onClick={()=>setTab("send")} className={tab==="send"?"btn btn-primary":"btn btn-outline"}>📤 Send</button>
          </div>

          {tab==="inbox" && (
            <div>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
                <h2 style={{ fontSize:15, fontWeight:700 }}>Your Notifications</h2>
                {unread>0 && <button className="btn btn-outline btn-sm" onClick={markAllRead}>Mark all read</button>}
              </div>
              {adminNotifs.length===0 && (
                <div className="card" style={{ padding:48, textAlign:"center" }}>
                  <div style={{ fontSize:32, marginBottom:10 }}>🔕</div>
                  <p style={{ color:"#7a8aa0", fontSize:13 }}>No notifications yet.</p>
                </div>
              )}
              {adminNotifs.map((n:any) => (
                <div key={n.id} onClick={()=>!n.isRead&&markRead(n.id)} style={{ background:n.isRead?"#fff":"#eef1ff", border:`1px solid ${n.isRead?"#e4e7ef":"#4361ee"}`, borderRadius:12, padding:16, marginBottom:8, cursor:n.isRead?"default":"pointer", display:"flex", gap:14 }}>
                  <div style={{ width:40, height:40, borderRadius:10, background:"#f4f5f9", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>
                    {n.title.includes("Registration")?"🎓":"🔔"}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", justifyContent:"space-between" }}>
                      <span style={{ fontWeight:700, fontSize:14 }}>{n.title}</span>
                      <span style={{ fontSize:11, color:"#7a8aa0" }}>{new Date(n.createdAt).toLocaleString("en-IN",{dateStyle:"medium",timeStyle:"short"})}</span>
                    </div>
                    <p style={{ fontSize:13, color:"#3d4a63", marginTop:3 }}>{n.message}</p>
                    {!n.isRead && <span className="badge badge-indigo" style={{ marginTop:6, display:"inline-block" }}>New</span>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab==="send" && (
            <div className="grid-2" style={{ marginBottom: 16 }}>
              <div className="card" style={{ padding:22 }}>
                <h2 style={{ fontSize:15, fontWeight:700, marginBottom:16 }}>Send Notification</h2>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  <input className="input" placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} />
                  <textarea className="input" rows={4} placeholder="Message…" value={form.message} onChange={e=>setForm({...form,message:e.target.value})} />
                  <select className="input" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
                    {["general","test","homework","payment","live"].map(t=><option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
                  </select>
                  <select className="input" value={form.targetClass} onChange={e=>setForm({...form,targetClass:e.target.value,userId:""})}>
                    <option value="all">All Students</option>
                    <option value="8">Class 8</option><option value="9">Class 9</option><option value="10">Class 10</option>
                    <option value="individual">Individual</option>
                  </select>
                  {form.targetClass==="individual" && (
                    <select className="input" value={form.userId} onChange={e=>setForm({...form,userId:e.target.value})}>
                      <option value="">Select student…</option>
                      {students.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  )}
                  <button className="btn btn-primary" onClick={send} disabled={sending}>{sending?"Sending…":"📤 Send"}</button>
                </div>
              </div>
              <div className="card" style={{ padding:22 }}>
                <h2 style={{ fontSize:15, fontWeight:700, marginBottom:14 }}>Recently Sent</h2>
                {sent.length===0 && <p style={{ color:"#7a8aa0", fontSize:13 }}>No notifications sent yet.</p>}
                {sent.slice(0,10).map((n:any) => (
                  <div key={n.id} style={{ padding:"10px 0", borderBottom:"1px solid #e4e7ef" }}>
                    <div style={{ fontWeight:600, fontSize:13.5 }}>{n.title}</div>
                    <div style={{ fontSize:12, color:"#7a8aa0", marginTop:3 }}>{n.message?.slice(0,70)}{(n.message?.length||0)>70?"…":""}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
