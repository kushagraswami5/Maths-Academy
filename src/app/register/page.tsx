"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", parentEmail: "", studentMobile: "", password: "", studentClass: "8" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const set = (k: string) => (e: any) => setForm({ ...form, [k]: e.target.value })

  const register = async (e: any) => {
    e.preventDefault()
    setLoading(true); setError("")
    const res = await fetch("/api/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
    const data = await res.json()
    setLoading(false)
    if (res.ok) router.replace("/login")
    else setError(data.error)
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f4f5f9", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "Outfit, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .reg-wrap { animation: fadeIn 0.5s ease forwards; }
        .rinp {
          width: 100%; padding: 11px 13px;
          border: 1.5px solid #e4e7ef; border-radius: 9px;
          font-size: 13.5px; font-family: Outfit, sans-serif;
          background: #ffffff; color: #0b0f1a; outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
          display: block;
        }
        .rinp:focus { border-color: #0b0f1a; box-shadow: 0 0 0 3px rgba(11,15,26,0.07); }
        .rinp::placeholder { color: #b0bcc8; }
        .rlabel { display: block; font-size: 11.5px; font-weight: 600; color: #3d4a63; margin-bottom: 5px; letter-spacing: 0.01em; }
        .submit-btn { width: 100%; padding: 12px; background: #0b0f1a; color: white; border: none; border-radius: 9px; font-size: 14.5px; font-weight: 700; font-family: Outfit, sans-serif; cursor: pointer; transition: all 0.18s; }
        .submit-btn:hover:not(:disabled) { background: #1a2035; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(11,15,26,0.2); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; vertical-align: middle; margin-right: 6px; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="reg-wrap" style={{ display: "grid", gridTemplateColumns: "420px 1fr", width: "100%", maxWidth: 900, borderRadius: 20, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.12)" }}>

        {/* LEFT */}
        <div style={{ background: "#0b0f1a", padding: 46, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 44, textDecoration: "none" }}>
              <div style={{ width: 36, height: 36, background: "#e8a020", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 17, color: "#0b0f1a" }}>M</div>
              <div style={{ color: "white", fontWeight: 700, fontSize: 15 }}>Maths Academy</div>
            </Link>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: "white", letterSpacing: "-0.025em", lineHeight: 1.1, marginBottom: 12 }}>
              Start your<br /><span style={{ color: "#e8a020" }}>free journey</span>
            </h2>
            <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 13.5, lineHeight: 1.7, marginBottom: 32 }}>Register for a free demo. No payment required to get started.</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {["✅  Free demo class — no commitment", "📡  Live classes on Google Meet", "📝  Weekly auto-graded tests", "📊  Progress analytics dashboard", "🔔  Smart notifications"].map(t => (
              <div key={t} style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>{t}</div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ background: "white", padding: 42 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0b0f1a", marginBottom: 4, letterSpacing: "-0.02em" }}>Create account</h2>
          <p style={{ fontSize: 13, color: "#7a8aa0", marginBottom: 24 }}>
            Already have an account? <Link href="/login" style={{ color: "#0b0f1a", fontWeight: 700, textDecoration: "none" }}>Sign in</Link>
          </p>

          <form onSubmit={register} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div className="grid-2" style={{ marginBottom: 16 }}>
              <div>
                <label className="rlabel">Full Name</label>
                <input className="rinp" placeholder="Rahul Sharma" value={form.name} onChange={set("name")} required />
              </div>
              <div>
                <label className="rlabel">Class</label>
                <select className="rinp" value={form.studentClass} onChange={set("studentClass")}>
                  <option value="8">Class 8</option>
                  <option value="9">Class 9</option>
                  <option value="10">Class 10</option>
                </select>
              </div>
            </div>
            <div>
              <label className="rlabel">Student Email</label>
              <input className="rinp" type="email" placeholder="student@email.com" value={form.email} onChange={set("email")} required />
            </div>
            <div>
              <label className="rlabel">Parent Email</label>
              <input className="rinp" type="email" placeholder="parent@email.com" value={form.parentEmail} onChange={set("parentEmail")} required />
            </div>
            <div className="grid-2" style={{ marginBottom: 16 }}>
              <div>
                <label className="rlabel">Mobile</label>
                <input className="rinp" type="tel" placeholder="+91 98765 43210" value={form.studentMobile} onChange={set("studentMobile")} required />
              </div>
              <div>
                <label className="rlabel">Password</label>
                <input className="rinp" type="password" placeholder="Min 6 characters" value={form.password} onChange={set("password")} required minLength={6} />
              </div>
            </div>

            {error && (
              <div style={{ background: "rgba(225,29,72,0.07)", border: "1px solid rgba(225,29,72,0.2)", borderRadius: 8, padding: "9px 13px", color: "#e11d48", fontSize: 13 }}>⚠ {error}</div>
            )}

            <button type="submit" className="submit-btn" disabled={loading} style={{ marginTop: 4 }}>
              {loading ? <><span className="spinner" />Registering…</> : "Register for Free Demo →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
