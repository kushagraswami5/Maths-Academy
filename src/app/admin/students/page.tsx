"use client"
import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/shared/Sidebar"
import TopBar from "@/components/shared/TopBar"
import { useSidebar } from "@/lib/useSidebar"

export default function StudentsPage() {
  const router = useRouter()
  const { open, show, hide } = useSidebar()
  const [students, setStudents] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [classFilter, setClassFilter] = useState("")
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [enrollModal, setEnrollModal] = useState<any>(null)
  const [enrollCourseId, setEnrollCourseId] = useState("")
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [form, setForm] = useState({ name: "", email: "", parentEmail: "", studentMobile: "", class: "8", password: "" })
  const tableRef = useRef<HTMLDivElement>(null)

  const token = () => localStorage.getItem("token") || ""

  const load = () => {
    fetch("/api/admin/students", { headers: { Authorization: `Bearer ${token()}` } }).then(r => r.json()).then(d => setStudents(d.students || [])).finally(() => setLoading(false))
    fetch("/api/admin/courses", { headers: { Authorization: `Bearer ${token()}` } }).then(r => r.json()).then(d => setCourses(d.courses || []))
  }

  useEffect(() => {
    const t = token(); if (!t) { router.replace("/login"); return }
    load()
  }, [])

  useGSAP(() => {
    if (!loading && tableRef.current) {
      const rows = tableRef.current.querySelectorAll("tbody tr")
      gsap.set(rows, { y: 12, opacity: 0 })
      gsap.to(rows, { y: 0, opacity: 1, duration: 0.35, stagger: 0.05, ease: "power2.out", clearProps: "transform,opacity" })
    }
  }, { dependencies: [loading, search, classFilter], scope: tableRef })

  const filtered = students.filter(s =>
    (!search || s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase())) &&
    (!classFilter || s.class === classFilter)
  )

  const addStudent = async () => {
    const res = await fetch("/api/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, studentClass: form.class }) })
    const d = await res.json()
    if (res.ok) { setShowModal(false); setForm({ name: "", email: "", parentEmail: "", studentMobile: "", class: "8", password: "" }); load() } else alert(d.error)
  }

  const toggleActive = async (id: string, current: boolean) => {
    await fetch(`/api/admin/students/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` }, body: JSON.stringify({ isActive: !current }) })
    load()
  }

  const openEnroll = async (student: any) => {
    setEnrollModal(student)
    const d = await fetch(`/api/admin/students/${student.id}/enrollments`, { headers: { Authorization: `Bearer ${token()}` } }).then(r => r.json())
    setEnrollments(d.enrollments || [])
  }

  const enroll = async () => {
    if (!enrollCourseId) return
    await fetch("/api/admin/enroll", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` }, body: JSON.stringify({ userId: enrollModal.id, courseId: enrollCourseId }) })
    const d = await fetch(`/api/admin/students/${enrollModal.id}/enrollments`, { headers: { Authorization: `Bearer ${token()}` } }).then(r => r.json())
    setEnrollments(d.enrollments || []); setEnrollCourseId("")
  }

  const unenroll = async (courseId: string) => {
    await fetch("/api/admin/enroll", { method: "DELETE", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` }, body: JSON.stringify({ userId: enrollModal.id, courseId }) })
    setEnrollments(enrollments.filter(e => e.courseId !== courseId))
  }

  return (
    <div className="app-shell">
      <Sidebar role="admin" open={open} onClose={hide} />
      <div className="main-content">
        <TopBar title="Students" onMenuClick={show} />
        <div className="page-body">
          {/* Toolbar */}
          <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
            <input className="input" style={{ maxWidth: 260 }} placeholder="Search by name or email…" value={search} onChange={e => setSearch(e.target.value)} />
            <select className="input" style={{ maxWidth: 140 }} value={classFilter} onChange={e => setClassFilter(e.target.value)}>
              <option value="">All Classes</option>
              <option value="8">Class 8</option>
              <option value="9">Class 9</option>
              <option value="10">Class 10</option>
            </select>
            <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Student</button>
            </div>
          </div>

          <div ref={tableRef} className="card">
            {loading ? (
              <div style={{ display: "flex", gap: 10, alignItems: "center", color: "#7a8aa0", padding: 24 }}><div className="spinner" /> Loading…</div>
            ) : (
              <div className="table-scroll"><table>
                <thead><tr><th>Student</th><th>Class</th><th>Mobile</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {filtered.map((s: any) => (
                    <tr key={s.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#0b0f1a", display: "flex", alignItems: "center", justifyContent: "center", color: "#e8a020", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                            {s.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 13.5 }}>{s.name}</div>
                            <div style={{ fontSize: 11.5, color: "#7a8aa0" }}>{s.email}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className="badge badge-ink">Class {s.class}</span></td>
                      <td style={{ fontSize: 13, color: "#3d4a63", fontFamily: "JetBrains Mono, monospace" }}>{s.studentMobile}</td>
                      <td><span className={s.isActive ? "badge badge-emerald" : "badge badge-rose"}>{s.isActive ? "Active" : "Inactive"}</span></td>
                      <td>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button className="btn btn-outline btn-sm" onClick={() => openEnroll(s)}>Enroll</button>
                          <button className="btn btn-sm" style={{ background: s.isActive ? "#fff0f3" : "#ecfdf5", color: s.isActive ? "#e11d48" : "#059669", border: "none", cursor: "pointer" }} onClick={() => toggleActive(s.id, s.isActive)}>
                            {s.isActive ? "Deactivate" : "Activate"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && <tr><td colSpan={5} style={{ textAlign: "center", color: "#7a8aa0", padding: "36px 0" }}>No students found.</td></tr>}
                </tbody>
              </table></div>
            )}
          </div>
        </div>
      </div>

      {/* Add Student Modal */}
      {showModal && (
        <div className="modal-bg" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-head"><h2 style={{ fontSize: 17, fontWeight: 700 }}>Add New Student</h2></div>
            <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[["name", "Full Name", "text"], ["email", "Email", "email"], ["parentEmail", "Parent Email", "email"], ["studentMobile", "Mobile", "tel"], ["password", "Password", "password"]].map(([k, p, t]) => (
                <div key={k}>
                  <label style={{ display: "block", fontSize: 11.5, fontWeight: 600, color: "#3d4a63", marginBottom: 5 }}>{p}</label>
                  <input className="input" type={t} placeholder={p} value={(form as any)[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} />
                </div>
              ))}
              <div>
                <label style={{ display: "block", fontSize: 11.5, fontWeight: 600, color: "#3d4a63", marginBottom: 5 }}>Class</label>
                <select className="input" value={form.class} onChange={e => setForm({ ...form, class: e.target.value })}>
                  <option value="8">Class 8</option><option value="9">Class 9</option><option value="10">Class 10</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={addStudent}>Add Student</button>
                <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enroll Modal */}
      {enrollModal && (
        <div className="modal-bg" onClick={() => setEnrollModal(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 700 }}>Manage Enrollments</h2>
                <p style={{ fontSize: 12, color: "#7a8aa0", marginTop: 2 }}>{enrollModal.name} · Class {enrollModal.class}</p>
              </div>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: "#7a8aa0", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>Enrolled Courses</div>
                {enrollments.length === 0 ? (
                  <p style={{ fontSize: 13, color: "#7a8aa0" }}>Not enrolled in any course.</p>
                ) : enrollments.map((e: any) => {
                  const c = courses.find(c => c.id === e.courseId)
                  return c ? (
                    <div key={e.courseId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid #e4e7ef" }}>
                      <span style={{ fontSize: 13.5, fontWeight: 500 }}>{c.title} <span className="badge badge-ink" style={{ marginLeft: 6, fontSize: 10 }}>Class {c.class}</span></span>
                      <button className="btn btn-danger-soft btn-sm" onClick={() => unenroll(e.courseId)}>Remove</button>
                    </div>
                  ) : null
                })}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                <select className="input" value={enrollCourseId} onChange={e => setEnrollCourseId(e.target.value)}>
                  <option value="">Add to a course…</option>
                  {courses.filter(c => !enrollments.find(e => e.courseId === c.id)).map(c => (
                    <option key={c.id} value={c.id}>{c.title} (Class {c.class})</option>
                  ))}
                </select>
                <button className="btn btn-primary" onClick={enroll}>Enroll</button>
              </div>
              <button className="btn btn-outline" style={{ width: "100%", marginTop: 12 }} onClick={() => { setEnrollModal(null); setEnrollments([]) }}>Done</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
