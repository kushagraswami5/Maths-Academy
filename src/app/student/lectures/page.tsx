"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/shared/Sidebar"
import TopBar from "@/components/shared/TopBar"
import { useSidebar } from "@/lib/useSidebar"


export default function StudentLectures() {
  const router = useRouter()
  const { open, show, hide } = useSidebar()
  const [courses, setCourses] = useState<any[]>([])
  const [selectedCourse, setSelectedCourse] = useState("")
  const [lectures, setLectures] = useState<any[]>([])
  const [playing, setPlaying] = useState<any>(null)

  const token = () => localStorage.getItem("token") || ""

  useEffect(() => {
    const t = localStorage.getItem("token"); if(!t){router.replace("/login");return}
    fetch("/api/student/courses", { headers:{ Authorization:`Bearer ${t}` } })
      .then(r=>r.json()).then(d=>{ setCourses(d.courses||[]); if(d.courses?.length>0) setSelectedCourse(d.courses[0].id) })
  }, [])

  useEffect(() => {
    if (!selectedCourse) return
    fetch(`/api/admin/lectures?courseId=${selectedCourse}`, { headers:{ Authorization:`Bearer ${token()}` } })
      .then(r=>r.json()).then(d=>setLectures(d.lectures||[]))
  }, [selectedCourse])

  // Convert YouTube URL to embed
  const getEmbedUrl = (url: string) => {
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`
    return url
  }

  return (
    


<div className="app-shell"><Sidebar role="student" open={open} onClose={hide} /><div className="main-content"><TopBar title="Recorded Lectures" onMenuClick={show} /><div className="page-body">
                  {/* Course selector */}
          <div style={{ display:"flex", gap:10, marginBottom:24, flexWrap:"wrap" }}>
            {courses.map((c:any) => (
              <button key={c.id} onClick={()=>setSelectedCourse(c.id)} style={{ padding:"8px 18px", borderRadius:10, border:`2px solid ${selectedCourse===c.id?"#4361ee":"#e4e7ef"}`, background:selectedCourse===c.id?"#eef1ff":"white", color:selectedCourse===c.id?"#4361ee":"#7a8aa0", fontWeight:600, fontSize:13, cursor:"pointer" }}>
                {c.title}
              </button>
            ))}
          </div>

          {/* Video player */}
          {playing && (
            <div className="card card-p" style={{ marginBottom:24 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                <div>
                  <h3 style={{ fontWeight:700, fontSize:16 }}>{playing.title}</h3>
                  {playing.duration && <span style={{ fontSize:13, color:"#7a8aa0" }}>⏱ {playing.duration} min</span>}
                </div>
                <button onClick={()=>setPlaying(null)} style={{ background:"#fff0f3", color:"#e11d48", border:"none", borderRadius:8, padding:"6px 14px", cursor:"pointer", fontWeight:600, fontSize:13 }}>✕ Close</button>
              </div>
              <div style={{ borderRadius:12, overflow:"hidden", background:"#000", aspectRatio:"16/9" }}>
                <iframe src={getEmbedUrl(playing.videoUrl)} style={{ width:"100%", height:"100%", border:"none" }} allowFullScreen allow="autoplay; encrypted-media" />
              </div>
            </div>
          )}

          {/* Lecture list */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:14 }}>
            {lectures.map((l:any, i:number) => (
              <div key={l.id} className="card card-p" style={{ cursor:"pointer", transition:"all 0.2s", borderTop: playing?.id===l.id ? "4px solid #4361ee" : "4px solid #e4e7ef" }}
                onClick={()=>setPlaying(l)}>
                <div style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
                  <div style={{ width:44, height:44, borderRadius:12, background: playing?.id===l.id ? "#4361ee" : "#f4f5f9", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>
                    {playing?.id===l.id ? "▶" : "📹"}
                  </div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:14, marginBottom:4 }}>{l.title}</div>
                    <div style={{ fontSize:12, color:"#7a8aa0" }}>Lecture {l.order || i+1}{l.duration ? ` • ${l.duration} min` : ""}</div>
                  </div>
                </div>
              </div>
            ))}
            {lectures.length === 0 && (
              <div style={{ gridColumn:"1/-1", textAlign:"center", padding:48, color:"#7a8aa0" }}>
                <div style={{ fontSize:40 }}>📹</div>
                <p style={{ marginTop:12 }}>No lectures uploaded yet for this course.</p>
              </div>
            )}
          </div>
        </div>
    </div>
    </div>
  
  )
}