"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/shared/Sidebar"
import TopBar from "@/components/shared/TopBar"
import { useSidebar } from "@/lib/useSidebar"


export default function StudentNotifications() {
  const router = useRouter()
  const { open, show, hide } = useSidebar()
  const [notifications, setNotifications] = useState<any[]>([])

  const token = () => localStorage.getItem("token") || ""
  const load = () => {
    fetch("/api/student/notifications", { headers:{ Authorization:`Bearer ${token()}` } })
      .then(r=>r.json()).then(d=>setNotifications(d.notifications||[]))
  }
  useEffect(() => { const t=localStorage.getItem("token"); if(!t){router.replace("/login");return} load() }, [])

  const markRead = async (id: string) => {
    await fetch(`/api/student/notifications/${id}/read`, { method:"PATCH", headers:{ Authorization:`Bearer ${token()}` } })
    load()
  }

  const markAllRead = async () => {
    await fetch("/api/student/notifications/read-all", { method:"PATCH", headers:{ Authorization:`Bearer ${token()}` } })
    load()
  }

  const typeIcon: Record<string,string> = { test:"📝", homework:"📋", payment:"💰", live:"📡", general:"🔔" }
  const unreadCount = notifications.filter(n=>!n.isRead).length

  return (
    


<div className="app-shell"><Sidebar role="student" open={open} onClose={hide} /><div className="main-content"><TopBar title="Notifications" onMenuClick={show} /><div className="page-body">
        <div style={{ padding:28, maxWidth:720 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
            <div style={{ display:"flex", gap:8, alignItems:"center" }}>
              <h2 style={{ fontWeight:700, fontSize:18 }}>All Notifications</h2>
              {unreadCount>0 && <span className="badge badge-rose">{unreadCount} new</span>}
            </div>
            {unreadCount>0 && <button className="btn btn-outline" style={{ fontSize:13 }} onClick={markAllRead}>Mark all read</button>}
          </div>
          {notifications.length === 0 && (
            <div className="card card-p" style={{ textAlign:"center", padding:48 }}>
              <div style={{ fontSize:48 }}>🔕</div>
              <p style={{ color:"#7a8aa0", marginTop:12 }}>No notifications yet.</p>
            </div>
          )}
          {notifications.map((n:any) => (
            <div key={n.id} onClick={() => !n.isRead && markRead(n.id)} style={{
              background: n.isRead ? "#ffffff" : "#eef1ff",
              border: `1px solid ${n.isRead ? "#e4e7ef" : "#4361ee"}`,
              borderRadius:12, padding:16, marginBottom:10, cursor: n.isRead ? "default" : "pointer",
              display:"flex", gap:14, transition:"background 0.2s",
            }}>
              <div style={{ width:40, height:40, borderRadius:10, background:"#f4f5f9", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>
                {typeIcon[n.type] || "🔔"}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <span style={{ fontWeight:700, fontSize:15 }}>{n.title}</span>
                  <span style={{ fontSize:11, color:"#b0bcc8" }}>{new Date(n.createdAt).toLocaleString("en-IN",{dateStyle:"medium",timeStyle:"short"})}</span>
                </div>
                <p style={{ fontSize:14, color:"#7a8aa0", marginTop:4 }}>{n.message}</p>
                <div style={{ marginTop:8, display:"flex", gap:8 }}>
                  <span className={`badge badge-${n.type==="payment"?"yellow":n.type==="test"?"blue":n.type==="live"?"red":"blue"}`}>{n.type}</span>
                  {!n.isRead && <span className="badge badge-indigo">New</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
    </div>
    </div>
    </div>
  
  )
}