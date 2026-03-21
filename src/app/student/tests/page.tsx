"use client"
import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/shared/Sidebar"
import TopBar from "@/components/shared/TopBar"
import { useSidebar } from "@/lib/useSidebar"

export default function StudentTests() {
  const router = useRouter()
  const { open, show, hide } = useSidebar()
  const [tests, setTests] = useState<any[]>([])
  const [submissions, setSubmissions] = useState<any[]>([])
  const [activeTest, setActiveTest] = useState<any>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState<any>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const answersRef = useRef<Record<string, string>>({})
  const activeTestRef = useRef<any>(null)
  const intervalRef = useRef<any>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)

  const token = () => localStorage.getItem("token") || ""
  const loadTests = () => {
    fetch("/api/student/tests", { headers: { Authorization: `Bearer ${token()}` } })
      .then(r => r.json()).then(d => { setTests(d.tests || []); setSubmissions(d.submissions || []) })
  }

  useEffect(() => { const t = token(); if (!t) { router.replace("/login"); return } loadTests() }, [])
  useEffect(() => { answersRef.current = answers }, [answers])
  useEffect(() => { activeTestRef.current = activeTest }, [activeTest])

  useGSAP(() => {
    if (cardsRef.current) {
      const els = Array.from(cardsRef.current.children)
      gsap.set(els, { y: 16, opacity: 0 })
      gsap.to(els, { y: 0, opacity: 1, duration: 0.4, stagger: 0.07, ease: "power2.out", clearProps: "transform,opacity" })
    }
  }, { dependencies: [tests], scope: cardsRef })

  useGSAP(() => {
    if (resultRef.current && submitted) {
      gsap.set(resultRef.current, { scale: 0.9, opacity: 0 })
      gsap.to(resultRef.current, { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(1.5)", clearProps: "transform,opacity" })
    }
  }, { dependencies: [submitted], scope: resultRef })

  const startTest = (test: any) => {
    setActiveTest(test); setAnswers({}); answersRef.current = {}; activeTestRef.current = test
    setTimeLeft(test.duration * 60)
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => { if (prev <= 1) { clearInterval(intervalRef.current); submitTest(); return 0 } return prev - 1 })
    }, 1000)
  }

  const submitTest = async () => {
    const test = activeTestRef.current; if (!test) return
    clearInterval(intervalRef.current)
    const res = await fetch("/api/student/tests/submit", {
      method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
      body: JSON.stringify({ testId: test.id, answers: answersRef.current })
    })
    const d = await res.json()
    setSubmitted(d); setActiveTest(null); activeTestRef.current = null; loadTests()
  }

  const submittedIds = new Set(submissions.map((s: any) => s.testId))
  const mins = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60
  const pct = activeTest ? (timeLeft / (activeTest.duration * 60)) * 100 : 0

  if (submitted) return (
    <div className="app-shell">
      <Sidebar role="student" open={open} onClose={hide} />
      <div className="main-content" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div ref={resultRef} style={{ textAlign: "center", maxWidth: 380, padding: 40 }}>
          <div style={{ fontSize: 60, marginBottom: 16 }}>{(submitted.score / submitted.totalMarks) >= 0.6 ? "🏆" : "📚"}</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Test Submitted!</h2>
          <div style={{ fontSize: 52, fontWeight: 800, color: "#4361ee", fontFamily: "Outfit,sans-serif", letterSpacing: "-0.03em", lineHeight: 1, margin: "16px 0 8px" }}>
            {submitted.score}<span style={{ fontSize: 24, color: "#7a8aa0" }}>/{submitted.totalMarks}</span>
          </div>
          <div style={{ fontSize: 16, color: "#3d4a63", marginBottom: 6 }}>{Math.round((submitted.score / submitted.totalMarks) * 100)}% Score</div>
          <div style={{ height: 8, borderRadius: 8, background: "#e4e7ef", overflow: "hidden", margin: "18px 0 20px" }}>
            <div style={{ height: "100%", borderRadius: 8, background: (submitted.score / submitted.totalMarks) >= 0.6 ? "#059669" : "#e11d48", width: ((submitted.score / submitted.totalMarks) * 100) + "%", transition: "width 1s ease" }} />
          </div>
          <p style={{ fontSize: 14, color: "#7a8aa0", marginBottom: 24 }}>
            {(submitted.score / submitted.totalMarks) >= 0.8 ? "Excellent work! 🌟" : (submitted.score / submitted.totalMarks) >= 0.6 ? "Good job! Keep practicing." : "Keep studying! You'll do better next time."}
          </p>
          <button className="btn btn-primary" onClick={() => setSubmitted(null)}>← Back to Tests</button>
        </div>
      </div>
    </div>
  )

  if (activeTest) return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#f4f5f9" }}>
      {/* Test header */}
      <div style={{ background: "#0b0f1a", padding: "0 28px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 20 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: "white" }}>{activeTest.title}</div>
          <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.4)" }}>{activeTest.questions.length} questions · {activeTest.totalMarks} marks</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{ background: timeLeft < 300 ? "#e11d48" : "#4361ee", padding: "6px 18px", borderRadius: 8, fontWeight: 800, fontSize: 18, color: "white", fontFamily: "JetBrains Mono, monospace" }}>
            {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
          </div>
          <div style={{ width: 80, height: 3, borderRadius: 3, background: "rgba(255,255,255,0.15)", overflow: "hidden" }}>
            <div style={{ height: "100%", background: pct > 30 ? "#059669" : "#e11d48", width: pct + "%", transition: "width 1s linear" }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{Object.keys(answers).length}/{activeTest.questions.length} answered</span>
          <button className="btn btn-gold" onClick={submitTest}>Submit Test</button>
        </div>
      </div>

      {/* Questions */}
      <div style={{ flex: 1, overflow: "auto", padding: "24px 28px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", gap: 14 }}>
          {activeTest.questions.map((q: any, i: number) => (
            <div key={q.id} className="card" style={{ borderLeft: `3px solid ${answers[q.id] ? "#059669" : "#e4e7ef"}`, padding: 20, transition: "border-color 0.2s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                <span style={{ fontWeight: 700, fontSize: 14.5, lineHeight: 1.4 }}>Q{i + 1}. {q.text}</span>
                <span className="badge badge-indigo" style={{ flexShrink: 0, marginLeft: 12 }}>{q.marks}m</span>
              </div>
              <div className="grid-2" style={{ marginBottom: 16 }}>
                {(["A", "B", "C", "D"] as const).map(opt => (
                  <div key={opt} onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))} style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "10px 13px", borderRadius: 9,
                    border: `1.5px solid ${answers[q.id] === opt ? "#4361ee" : "#e4e7ef"}`,
                    background: answers[q.id] === opt ? "#eef1ff" : "#f9fafb",
                    cursor: "pointer", transition: "all 0.14s",
                  }}>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", border: `2px solid ${answers[q.id] === opt ? "#4361ee" : "#e4e7ef"}`, background: answers[q.id] === opt ? "#4361ee" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: answers[q.id] === opt ? "white" : "#7a8aa0", flexShrink: 0 }}>{opt}</div>
                    <span style={{ fontSize: 13.5, color: answers[q.id] === opt ? "#4361ee" : "#0b0f1a", fontWeight: answers[q.id] === opt ? 600 : 400 }}>{(q as any)[`option${opt}`]}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <button className="btn btn-primary btn-lg" style={{ width: "100%" }} onClick={submitTest}>
            Submit Test ({Object.keys(answers).length}/{activeTest.questions.length} answered)
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="app-shell">
      <Sidebar role="student" open={open} onClose={hide} />
      <div className="main-content">
        <TopBar title="Tests & Quizzes" onMenuClick={show} />
        <div className="page-body">
          <h3 style={{ fontSize: 11.5, fontWeight: 700, color: "#7a8aa0", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Available Tests</h3>
          <div ref={cardsRef} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: 14, marginBottom: 28 }}>
            {tests.filter(t => t.isPublished && !submittedIds.has(t.id)).map(t => (
              <div key={t.id} className="card" style={{ padding: 20, borderTop: "3px solid #4361ee" }}>
                <div style={{ fontWeight: 700, fontSize: 15.5, marginBottom: 4 }}>{t.title}</div>
                <div style={{ fontSize: 12.5, color: "#7a8aa0", marginBottom: 14 }}>{t.course?.title}</div>
                <div style={{ display: "flex", gap: 12, fontSize: 12, color: "#7a8aa0", marginBottom: 16 }}>
                  <span>📝 {t.questions?.length || 0} Qs</span>
                  <span>⏱ {t.duration} min</span>
                  <span>🏆 {t.totalMarks} marks</span>
                </div>
                <button className="btn btn-primary" style={{ width: "100%" }} onClick={() => startTest(t)}>Start Test →</button>
              </div>
            ))}
            {tests.filter(t => t.isPublished && !submittedIds.has(t.id)).length === 0 && (
              <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "40px 0", color: "#7a8aa0" }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>◇</div>
                <p style={{ fontSize: 13 }}>No pending tests right now.</p>
              </div>
            )}
          </div>

          <h3 style={{ fontSize: 11.5, fontWeight: 700, color: "#7a8aa0", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Past Results</h3>
          <div className="card">
            <div className="table-scroll"><table>
              <thead><tr><th>Test</th><th>Score</th><th>%</th><th>Result</th><th>Date</th></tr></thead>
              <tbody>
                {submissions.map((s: any) => {
                  const p = Math.round((s.score / s.test?.totalMarks) * 100)
                  return (
                    <tr key={s.id}>
                      <td style={{ fontWeight: 600 }}>{s.test?.title}</td>
                      <td style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 13 }}>{s.score}/{s.test?.totalMarks}</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                          <div style={{ width: 60, height: 5, borderRadius: 5, background: "#f9fafb", overflow: "hidden" }}>
                            <div style={{ height: "100%", borderRadius: 5, background: p >= 60 ? "#059669" : "#e11d48", width: p + "%" }} />
                          </div>
                          <span style={{ fontSize: 12.5, fontWeight: 600 }}>{p}%</span>
                        </div>
                      </td>
                      <td><span className={p >= 60 ? "badge badge-emerald" : "badge badge-rose"}>{p >= 60 ? "Pass" : "Fail"}</span></td>
                      <td style={{ color: "#7a8aa0", fontSize: 12 }}>{new Date(s.submittedAt).toLocaleDateString("en-IN")}</td>
                    </tr>
                  )
                })}
                {submissions.length === 0 && <tr><td colSpan={5} style={{ textAlign: "center", color: "#7a8aa0", padding: "32px 0" }}>No tests taken yet.</td></tr>}
              </tbody>
            </table></div>
          </div>
        </div>
      </div>
    </div>
  )
}
