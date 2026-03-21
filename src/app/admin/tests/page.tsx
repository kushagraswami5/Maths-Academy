"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/shared/Sidebar"
import TopBar from "@/components/shared/TopBar"
import { useSidebar } from "@/lib/useSidebar"

type Question = { text:string; optionA:string; optionB:string; optionC:string; optionD:string; correctOption:string; marks:number }

export default function TestsPage() {
  const router = useRouter()
  const { open, show, hide } = useSidebar()
  const [tests, setTests] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ title:"", courseId:"", totalMarks:100, duration:60, scheduledAt:"" })
  const [questions, setQuestions] = useState<Question[]>([{ text:"", optionA:"", optionB:"", optionC:"", optionD:"", correctOption:"A", marks:4 }])
  const [loading, setLoading] = useState(true)

  const token = () => localStorage.getItem("token") || ""
  const load = () => {
    fetch("/api/admin/tests", { headers:{ Authorization:`Bearer ${token()}` } }).then(r=>r.json()).then(d=>setTests(d.tests||[]))
    fetch("/api/admin/courses", { headers:{ Authorization:`Bearer ${token()}` } }).then(r=>r.json()).then(d=>setCourses(d.courses||[])).finally(()=>setLoading(false))
  }
  useEffect(() => { const t=token(); if(!t){router.replace("/login");return} load() }, [])

  const addQ = () => setQuestions([...questions,{ text:"", optionA:"", optionB:"", optionC:"", optionD:"", correctOption:"A", marks:4 }])
  const updateQ = (i: number, k: string, v: any) => setQuestions(questions.map((q,idx)=>idx===i?{...q,[k]:v}:q))

  const save = async () => {
    const res = await fetch("/api/admin/tests", { method:"POST", headers:{"Content-Type":"application/json",Authorization:`Bearer ${token()}`}, body:JSON.stringify({...form,questions}) })
    if(res.ok){ setShowModal(false); setStep(1); load() } else alert("Error saving test")
  }

  const publish = async (id: string) => {
    await fetch(`/api/admin/tests/${id}/publish`, { method:"PATCH", headers:{ Authorization:`Bearer ${token()}` } }); load()
  }

  return (
    <div className="app-shell">
      <Sidebar role="admin" open={open} onClose={hide} />
      <div className="main-content">
        <TopBar title="Tests & Quizzes" onMenuClick={show} />
        <div className="page-body">
          <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:16 }}>
            <button className="btn btn-primary" onClick={()=>setShowModal(true)}>+ Create Test</button>
          </div>
          <div className="card">
            {loading ? (
              <div style={{ display:"flex", gap:10, alignItems:"center", color:"#7a8aa0", padding:24 }}><div className="spinner" /> Loading…</div>
            ) : (
              <div className="table-scroll"><table>
                <thead><tr><th>Title</th><th>Course</th><th>Questions</th><th>Duration</th><th>Scheduled</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                  {tests.map((t:any)=>(
                    <tr key={t.id}>
                      <td style={{ fontWeight:600 }}>{t.title}</td>
                      <td style={{ color:"#7a8aa0" }}>{t.course?.title}</td>
                      <td>{t._count?.questions||0} Qs</td>
                      <td>{t.duration} min</td>
                      <td style={{ color:"#7a8aa0", fontSize:12 }}>{new Date(t.scheduledAt).toLocaleDateString("en-IN")}</td>
                      <td><span className={t.isPublished?"badge badge-emerald":"badge badge-gold"}>{t.isPublished?"Published":"Draft"}</span></td>
                      <td>{!t.isPublished && <button className="btn btn-primary btn-sm" onClick={()=>publish(t.id)}>Publish</button>}</td>
                    </tr>
                  ))}
                  {tests.length===0 && <tr><td colSpan={7} style={{ textAlign:"center", color:"#7a8aa0", padding:"32px 0" }}>No tests yet.</td></tr>}
                </tbody>
              </table></div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-bg" onClick={()=>setShowModal(false)}>
          <div className="modal-box modal-lg" style={{ maxHeight:"90vh", overflowY:"auto" }} onClick={e=>e.stopPropagation()}>
            <div className="modal-head"><h2 style={{ fontSize:16, fontWeight:700 }}>Create Test — Step {step}/2</h2></div>
            <div className="modal-body">
              {step===1 && (
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  <input className="input" placeholder="Test Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} />
                  <select className="input" value={form.courseId} onChange={e=>setForm({...form,courseId:e.target.value})}>
                    <option value="">Select Course</option>
                    {courses.map(c=><option key={c.id} value={c.id}>{c.title}</option>)}
                  </select>
                  <div className="grid-2" style={{ marginBottom: 16 }}>
                    <input className="input" type="number" placeholder="Duration (min)" value={form.duration} onChange={e=>setForm({...form,duration:Number(e.target.value)})} />
                    <input className="input" type="number" placeholder="Total Marks" value={form.totalMarks} onChange={e=>setForm({...form,totalMarks:Number(e.target.value)})} />
                  </div>
                  <input className="input" type="datetime-local" value={form.scheduledAt} onChange={e=>setForm({...form,scheduledAt:e.target.value})} />
                  <button className="btn btn-primary" onClick={()=>setStep(2)}>Next: Add Questions →</button>
                </div>
              )}
              {step===2 && (
                <div>
                  {questions.map((q,i)=>(
                    <div key={i} style={{ border:"1.5px solid #e4e7ef", borderRadius:10, padding:14, marginBottom:12 }}>
                      <div style={{ fontWeight:600, fontSize:13, marginBottom:8, color:"#4361ee" }}>Q{i+1}</div>
                      <input className="input" placeholder="Question text" style={{ marginBottom:8 }} value={q.text} onChange={e=>updateQ(i,"text",e.target.value)} />
                      <div className="grid-2" style={{ marginBottom: 16 }}>
                        {["A","B","C","D"].map(opt=>(
                          <input key={opt} className="input" placeholder={`Option ${opt}`} value={(q as any)[`option${opt}`]} onChange={e=>updateQ(i,`option${opt}`,e.target.value)} />
                        ))}
                      </div>
                      <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                        <select className="input" style={{ maxWidth:160 }} value={q.correctOption} onChange={e=>updateQ(i,"correctOption",e.target.value)}>
                          {["A","B","C","D"].map(o=><option key={o} value={o}>Correct: {o}</option>)}
                        </select>
                        <input className="input" type="number" style={{ maxWidth:100 }} placeholder="Marks" value={q.marks} onChange={e=>updateQ(i,"marks",Number(e.target.value))} />
                      </div>
                    </div>
                  ))}
                  <button className="btn btn-outline" style={{ width:"100%", marginBottom:12 }} onClick={addQ}>+ Add Question</button>
                  <div style={{ display:"flex", gap:10 }}>
                    <button className="btn btn-outline" onClick={()=>setStep(1)}>← Back</button>
                    <button className="btn btn-primary" onClick={save}>Save as Draft</button>
                    <button className="btn btn-outline" onClick={()=>setShowModal(false)}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
