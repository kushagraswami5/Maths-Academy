"use client"
import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPass, setShowPass] = useState(false)
  const leftRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!leftRef.current || !formRef.current) return
    const fields = formRef.current.querySelectorAll(".field")
    gsap.set(leftRef.current, { x: -30, opacity: 0 })
    gsap.set(formRef.current, { x: 30, opacity: 0 })
    gsap.set(fields, { y: 14, opacity: 0 })
    const tl = gsap.timeline()
    tl.to(leftRef.current,  { x: 0, opacity: 1, duration: 0.55, ease: "power2.out", clearProps: "transform,opacity" })
      .to(formRef.current,  { x: 0, opacity: 1, duration: 0.55, ease: "power2.out", clearProps: "transform,opacity" }, "-=0.35")
      .to(fields, { y: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: "power2.out", clearProps: "transform,opacity" }, "-=0.25")
  }, { scope: formRef }) // scope not explicitly needed for both if we use generic refs

  const login = async (e: any) => {
    e.preventDefault()
    setLoading(true); setError("")
    try {
      const res = await fetch("/api/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem("token", data.token)
        localStorage.setItem("email", email)
        localStorage.setItem("role", data.role)
        localStorage.setItem("name", data.name)
        router.push(data.role === "admin" ? "/admin" : "/dashboard")
      } else {
        setError(data.error || "Login failed")
      }
    } catch { setError("Connection error. Try again.") }
    setLoading(false)
  }

  return (
    <div className="layout-container" style={{ minHeight: "100vh", display: "flex", fontFamily: "Outfit, sans-serif", background: "#f4f5f9" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400&display=swap');
        .inp{width:100%;padding:11px 14px;border:1.5px solid #e4e7ef;border-radius:9px;font-size:14px;font-family:Outfit,sans-serif;outline:none;transition:all 0.18s;background:#fff;color:#0b0f1a;}
        .inp:focus{border-color:#0b0f1a;box-shadow:0 0 0 3px rgba(11,15,26,0.06);}
        .inp::placeholder{color:#b0bcc8;}
        .sbtn{width:100%;padding:12px;background:#0b0f1a;color:#fff;border:none;border-radius:9px;font-size:14px;font-weight:700;font-family:Outfit,sans-serif;cursor:pointer;transition:all 0.18s;display:flex;align-items:center;justify-content:center;gap:8px;}
        .sbtn:hover:not(:disabled){background:#1a2035;transform:translateY(-1px);box-shadow:0 6px 18px rgba(11,15,26,0.22);}
        .sbtn:disabled{opacity:0.6;cursor:not-allowed;}
        .spinner{width:15px;height:15px;border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:spin 0.7s linear infinite;}
        @keyframes spin{to{transform:rotate(360deg);}}
        @media (max-width: 850px) {
          .layout-container { flex-direction: column !important; }
          .left-col { width: 100% !important; padding: 40px 24px !important; min-height: auto !important; }
          .right-col { padding: 40px 24px !important; align-items: flex-start !important; }
          .stats-grid { grid-template-columns: 1fr !important; }
          .left-col h1 { font-size: 34px !important; }
        }
      `}</style>

      {/* LEFT */}
      <div ref={leftRef} className="left-col" style={{ width: 480, background: "#0b0f1a", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 52, position: "relative", overflow: "hidden", flexShrink: 0 }}>
        <div style={{ position: "absolute", top: -120, right: -120, width: 380, height: 380, borderRadius: "50%", border: "1px solid rgba(232,160,32,0.07)" }} />
        <div style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, borderRadius: "50%", border: "1px solid rgba(232,160,32,0.12)" }} />
        <div style={{ position: "absolute", bottom: -80, left: -80, width: 320, height: 320, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.03)" }} />

        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 60 }}>
            <div style={{ width: 40, height: 40, background: "#e8a020", borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 19, color: "#0b0f1a" }}>M</div>
            <div>
              <div style={{ color: "white", fontWeight: 700, fontSize: 16, lineHeight: 1 }}>Maths Academy</div>
              <div style={{ color: "#e8a020", fontSize: 10, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", marginTop: 3 }}>Delhi's #1 Coaching</div>
            </div>
          </div>
          <h1 style={{ fontSize: 42, fontWeight: 800, color: "white", lineHeight: 1.07, letterSpacing: "-0.03em", marginBottom: 18 }}>
            Master Maths.<br /><span style={{ color: "#e8a020" }}>Ace Boards.</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14.5, lineHeight: 1.72, maxWidth: 300 }}>
            Live classes, weekly tests, personalised doubt-solving and complete study material for Class 8–10.
          </p>
        </div>

        <div style={{ position: "relative" }}>
          <div className="stats-grid grid-2" style={{ marginBottom: 16 }}>
            {[["📡","Live Classes","Interactive sessions"],["📝","Auto-Graded Tests","Instant results"],["📊","Analytics","Track progress"],["💰","Fee Management","Easy payments"]].map(([icon,t,s]) => (
              <div key={t} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 11, padding: "12px 14px" }}>
                <div style={{ fontSize: 18, marginBottom: 5 }}>{icon}</div>
                <div style={{ color: "white", fontWeight: 600, fontSize: 12 }}>{t}</div>
                <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, marginTop: 2 }}>{s}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 28, paddingTop: 22, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            {[["200+","Students"],["98%","Pass Rate"],["4.9★","Rating"]].map(([v,l]) => (
              <div key={l}>
                <div style={{ color: "#e8a020", fontWeight: 800, fontSize: 20, letterSpacing: "-0.02em" }}>{v}</div>
                <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="right-col" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 48 }}>
        <div ref={formRef} style={{ width: "100%", maxWidth: 390 }}>
          <div className="field" style={{ marginBottom: 34 }}>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: "#0b0f1a", letterSpacing: "-0.025em" }}>Welcome back</h2>
            <p style={{ color: "#7a8aa0", fontSize: 13.5, marginTop: 5 }}>Sign in to access your dashboard</p>
          </div>

          <form onSubmit={login} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="field">
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#3d4a63", marginBottom: 6 }}>Email Address</label>
              <input className="inp" type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
            </div>

            <div className="field">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#3d4a63" }}>Password</label>
                <span style={{ fontSize: 12, color: "#4361ee", cursor: "pointer", fontWeight: 500 }}>Forgot?</span>
              </div>
              <div style={{ position: "relative" }}>
                <input className="inp" type={showPass ? "text" : "password"} placeholder="Your password" value={password} onChange={e => setPassword(e.target.value)} required style={{ paddingRight: 52 }} />
                <button type="button" onClick={() => setShowPass(s => !s)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#7a8aa0", fontSize: 12, fontFamily: "Outfit,sans-serif", fontWeight: 600 }}>
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && (
              <div className="field" style={{ background: "rgba(225,29,72,0.07)", border: "1px solid rgba(225,29,72,0.2)", borderRadius: 8, padding: "10px 13px", display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ color: "#e11d48" }}>⚠</span>
                <span style={{ color: "#e11d48", fontSize: 13, fontWeight: 500 }}>{error}</span>
              </div>
            )}

            <button type="submit" className="sbtn field" disabled={loading} style={{ marginTop: 4 }}>
              {loading ? <><div className="spinner" />Signing in…</> : "Sign In →"}
            </button>
          </form>

          <p className="field" style={{ textAlign: "center", fontSize: 13, color: "#7a8aa0", marginTop: 22 }}>
            New student?{" "}
            <Link href="/register" style={{ color: "#0b0f1a", fontWeight: 700, textDecoration: "none" }}>Register for free demo</Link>
          </p>

        </div>
      </div>
    </div>
  )
}
