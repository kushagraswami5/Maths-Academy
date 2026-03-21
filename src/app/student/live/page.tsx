"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/shared/Sidebar"
import TopBar from "@/components/shared/TopBar"
import { useSidebar } from "@/lib/useSidebar"


export default function StudentLive() {
  const router = useRouter()
  const { open, show, hide } = useSidebar()
  const [liveClasses, setLiveClasses] = useState<any[]>([])

  useEffect(() => {
    const t = localStorage.getItem("token"); if(!t){router.replace("/login");return}
    fetch("/api/student/live", { headers:{ Authorization:`Bearer ${t}` } })
      .then(r=>r.json()).then(d=>setLiveClasses(d.liveClasses||[]))
  }, [])

  const now = new Date()
  const upcoming = liveClasses.filter(lc => new Date(lc.scheduledAt) >= now)
  const past = liveClasses.filter(lc => new Date(lc.scheduledAt) < now)

  const isLive = (lc: any) => {
    const start = new Date(lc.scheduledAt)
    const end = new Date(start.getTime() + lc.duration * 60000)
    return now >= start && now <= end
  }

  return (
    


<div className="app-shell"><Sidebar role="student" open={open} onClose={hide} /><div className="main-content"><TopBar title="Live Classes" onMenuClick={show} /><div className="page-body">
                  {upcoming.some(isLive) && (
            <div style={{ background:"linear-gradient(135deg,#ef4444,#dc2626)", borderRadius:16, padding:20, marginBottom:24, color:"white", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ width:10, height:10, borderRadius:"50%", background:"white", display:"inline-block", animation:"pulse 1s infinite" }} />
                  <span style={{ fontWeight:800, fontSize:18 }}>LIVE NOW</span>
                </div>
                {upcoming.filter(isLive).map(lc=>(
                  <div key={lc.id} style={{ marginTop:6 }}>
                    <div style={{ fontWeight:700, fontSize:16 }}>{lc.title}</div>
                    <div style={{ opacity:0.85, fontSize:13 }}>{lc.course?.title}</div>
                  </div>
                ))}
              </div>
              {upcoming.filter(isLive).map(lc=>(
                <a key={lc.id} href={lc.meetUrl} target="_blank" style={{ background:"white", color:"#ef4444", padding:"10px 24px", borderRadius:10, fontWeight:700, fontSize:14, textDecoration:"none" }}>Join Now →</a>
              ))}
            </div>
          )}

          <h3 style={{ fontWeight:700, marginBottom:16, fontSize:15, color:"#7a8aa0", textTransform:"uppercase", letterSpacing:"0.05em" }}>Upcoming Classes</h3>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:16, marginBottom:32 }}>
            {upcoming.filter(lc=>!isLive(lc)).map((lc:any) => {
              const d = new Date(lc.scheduledAt)
              return (
                <div key={lc.id} className="card card-p" style={{ borderTop:"4px solid #4361ee" }}>
                  <div style={{ fontWeight:700, fontSize:15 }}>{lc.title}</div>
                  <div style={{ fontSize:13, color:"#7a8aa0", margin:"4px 0 14px" }}>{lc.course?.title}</div>
                  <div style={{ fontSize:13, marginBottom:6 }}>📅 {d.toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"short"})}</div>
                  <div style={{ fontSize:13, marginBottom:14 }}>🕐 {d.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})} • ⏱ {lc.duration} min</div>
                  <a href={lc.meetUrl} target="_blank" className="btn btn-outline" style={{ display:"inline-block", textDecoration:"none", fontSize:13, padding:"8px 16px" }}>📡 Add to Calendar</a>
                </div>
              )
            })}
            {upcoming.filter(lc=>!isLive(lc)).length === 0 && <p style={{ color:"#7a8aa0", fontSize:14 }}>No upcoming classes scheduled.</p>}
          </div>

          <h3 style={{ fontWeight:700, marginBottom:16, fontSize:15, color:"#7a8aa0", textTransform:"uppercase", letterSpacing:"0.05em" }}>Past Classes</h3>
          <div className="card card-p">
            <div className="table-scroll"><table>
              <thead><tr><th>Title</th><th>Course</th><th>Date</th><th>Duration</th></tr></thead>
              <tbody>
                {past.map((lc:any)=>(
                  <tr key={lc.id}>
                    <td style={{ fontWeight:600 }}>{lc.title}</td>
                    <td>{lc.course?.title}</td>
                    <td style={{ color:"#7a8aa0" }}>{new Date(lc.scheduledAt).toLocaleDateString("en-IN",{dateStyle:"medium"})}</td>
                    <td>{lc.duration} min</td>
                  </tr>
                ))}
                {past.length===0&&<tr><td colSpan={4} style={{ textAlign:"center", color:"#7a8aa0", padding:24 }}>No past classes.</td></tr>}
              </tbody>
            </table></div>
          </div>
        </div>
    </div>
    </div>
  
  )
}