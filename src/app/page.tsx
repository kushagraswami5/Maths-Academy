import Link from "next/link"

export default function Home() {
  return (
    <main style={{ fontFamily: "Outfit, sans-serif", background: "#fff", color: "#0b0f1a" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; }
        .nav-link { color: #3d4a63; font-size: 14.5px; font-weight: 500; transition: color 0.15s; }
        .nav-link:hover { color: #0b0f1a; }
        .btn-dark { background: #0b0f1a; color: white; padding: 10px 22px; border-radius: 9px; font-weight: 700; font-size: 14px; display: inline-block; transition: all 0.18s; }
        .btn-dark:hover { background: #1a2035; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(11,15,26,0.2); }
        .btn-gold { background: #e8a020; color: #0b0f1a; padding: 10px 22px; border-radius: 9px; font-weight: 700; font-size: 14px; display: inline-block; transition: all 0.18s; }
        .btn-gold:hover { background: #f0b840; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(232,160,32,0.3); }
        .feature { background: #fff; border: 1px solid #e4e7ef; border-radius: 14px; padding: 24px; transition: all 0.2s; }
        .feature:hover { border-color: #0b0f1a; box-shadow: 0 8px 24px rgba(0,0,0,0.07); transform: translateY(-3px); }
        @media (max-width: 850px) {
          .nav-links { display: none !important; }
          .hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; padding-top: 48px !important; text-align: center; }
          .hero-grid h1 { font-size: 38px !important; margin: 0 auto 16px !important; }
          .hero-grid p { margin: 0 auto 24px !important; }
          .hero-grid .btn-gold, .hero-grid .btn-dark { width: 100%; display: block; text-align: center; margin-bottom: 12px; }
          .hero-grid .btn-container { flex-direction: column; gap: 0 !important; }
          .hero-stats { flex-wrap: wrap; justify-content: center; gap: 24px !important; margin-top: 24px !important; padding-top: 24px !important; }
          .stats-strip { grid-template-columns: 1fr 1fr !important; gap: 24px !important; }
          .stats-strip > div { border-right: none !important; }
          .about-grid { grid-template-columns: 1fr !important; gap: 40px !important; text-align: center; }
          .about-grid .about-stats { justify-content: center; }
          .footer-content { flex-direction: column; text-align: center; gap: 20px !important; }
        }
      `}</style>

      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, background: "rgba(255,255,255,0.94)", backdropFilter: "blur(16px)", borderBottom: "1px solid #e4e7ef", zIndex: 100 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, background: "#0b0f1a", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", color: "#e8a020", fontWeight: 800, fontSize: 16 }}>M</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, color: "#0b0f1a", lineHeight: 1 }}>Maths Academy</div>
              <div style={{ fontSize: 9.5, color: "#e8a020", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>Delhi's #1</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
            <div className="nav-links" style={{ display: "flex", gap: 28, alignItems: "center" }}>
              <a href="#features" className="nav-link">Features</a>
              <a href="#how" className="nav-link">How it works</a>
              <a href="#classes" className="nav-link">Classes</a>
            </div>
            <Link href="/login" className="btn-dark nav-links" style={{ padding: "8px 18px", fontSize: 13 }}>Login</Link>
            <Link href="/register" className="btn-gold" style={{ padding: "8px 18px", fontSize: 13 }}>Book Free Demo</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero-grid" style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px 64px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(232,160,32,0.1)", border: "1px solid rgba(232,160,32,0.25)", borderRadius: 100, padding: "4px 12px", marginBottom: 20 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#e8a020" }} />
            <span style={{ fontSize: 11.5, fontWeight: 700, color: "#a06800", letterSpacing: "0.06em" }}>DELHI'S TOP MATHS COACHING</span>
          </div>
          <h1 style={{ fontSize: 52, fontWeight: 800, lineHeight: 1.06, letterSpacing: "-0.03em", color: "#0b0f1a", marginBottom: 20 }}>
            Master Maths,<br /><span style={{ color: "#e8a020" }}>Ace Your Boards.</span>
          </h1>
          <p style={{ fontSize: 16.5, color: "#3d4a63", lineHeight: 1.72, marginBottom: 34, maxWidth: 460 }}>
            Live interactive classes, weekly tests with instant analytics, personalised doubt-solving and complete study material for Class 8–10.
          </p>
          <div className="btn-container" style={{ display: "flex", gap: 12 }}>
            <Link href="/register" className="btn-gold" style={{ padding: "12px 26px", fontSize: 15 }}>📅 Book Free Demo</Link>
            <Link href="/login" className="btn-dark" style={{ padding: "12px 26px", fontSize: 15 }}>Login →</Link>
          </div>
          <div className="hero-stats" style={{ display: "flex", gap: 32, marginTop: 40, paddingTop: 32, borderTop: "1px solid #e4e7ef" }}>
            {[["200+", "Students"], ["98%", "Pass Rate"], ["4.9★", "Rating"]].map(([v, l]) => (
              <div key={l}>
                <div style={{ fontWeight: 800, fontSize: 22, color: "#0b0f1a", letterSpacing: "-0.02em" }}>{v}</div>
                <div style={{ fontSize: 12, color: "#7a8aa0", marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: "#f4f5f9", borderRadius: 20, padding: 6, boxShadow: "0 20px 60px rgba(0,0,0,0.08)" }}>
          <img src="/hero-teaching.png" alt="Live teaching" style={{ width: "100%", borderRadius: 16, display: "block" }} />
          <div style={{ background: "white", borderRadius: 14, margin: 8, padding: "16px 18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#e11d48", animation: "pulse 1.5s infinite" }} />
              <span style={{ fontWeight: 700, fontSize: 14 }}>Live Now — Algebra Chapter 3</span>
            </div>
            <div style={{ display: "flex", gap: 16, fontSize: 12.5, color: "#7a8aa0" }}>
              <span>👥 32 students</span><span>⏱ 45 min left</span>
              <span style={{ color: "#0b0f1a", fontWeight: 700, marginLeft: "auto" }}>Join Class →</span>
            </div>
          </div>
        </div>
      </section>

      {/* DARK STATS STRIP */}
      <section style={{ background: "#0b0f1a", padding: "36px 24px" }}>
        <div className="stats-strip" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", textAlign: "center" }}>
          {[["500+", "Live classes held"], ["₹0", "Cost to try"], ["3", "Classes 8, 9, 10"], ["24h", "Doubt resolution"]].map(([v, l]) => (
            <div key={l} style={{ padding: "0 20px", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontWeight: 800, fontSize: 32, color: "#e8a020", letterSpacing: "-0.02em" }}>{v}</div>
              <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT INSTRUCTOR */}
      <section id="about" style={{ background: "#f4f5f9", padding: "80px 24px" }}>
        <div className="about-grid" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          <div style={{ background: "#fff", borderRadius: 24, padding: 32, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 380, border: "1px solid #e4e7ef" }}>
            <div style={{ width: 140, height: 140, background: "rgba(232,160,32,0.1)", border: "2px solid #e8a020", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64 }}>👨‍🏫</div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#e8a020", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 10 }}>About Your Instructor</div>
            <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.025em", marginBottom: 18 }}>Learn from an NIT Delhi Computer Science Undergraduate</h2>
            <p style={{ fontSize: 15.5, color: "#3d4a63", lineHeight: 1.7, marginBottom: 18 }}>
              Hi! I'm the founder and main instructor at Maths Academy. I am a Computer Science undergraduate from <strong>NIT Delhi</strong>, having cleared some of the toughest competitive exams in the country.
            </p>
            <p style={{ fontSize: 15.5, color: "#3d4a63", lineHeight: 1.7, marginBottom: 26 }}>
              My goal is to break down complex mathematical concepts into easily digestible, intuitive lessons. I'll provide you with the exact strategies and frameworks I used to excel in my boards and entrance exams, ensuring you achieve top marks with confidence.
            </p>
            <div className="about-stats" style={{ display: "flex", gap: 32, alignItems: "center" }}>
               <div style={{ display: "flex", flexDirection: "column" }}>
                 <span style={{ fontWeight: 800, fontSize: 24, color: "#0b0f1a", letterSpacing: "-0.02em" }}>NIT</span>
                 <span style={{ fontSize: 12, color: "#7a8aa0", fontWeight: 600 }}>Delhi</span>
               </div>
               <div style={{ width: 1, height: 36, background: "#d0d5e8" }} />
               <div style={{ display: "flex", flexDirection: "column" }}>
                 <span style={{ fontWeight: 800, fontSize: 24, color: "#0b0f1a", letterSpacing: "-0.02em" }}>B.Tech</span>
                 <span style={{ fontSize: 12, color: "#7a8aa0", fontWeight: 600 }}>Computer Science</span>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#e8a020", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 10 }}>Everything you need</div>
          <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.025em" }}>A complete learning platform</h2>
        </div>
        <div className="grid-kpi" style={{ marginBottom: 20 }}>
          {[
            ["📡", "Live Interactive Classes", "Join real-time classes, ask questions, and learn faster with live interaction."],
            ["📹", "Recorded Lectures", "Every class is recorded. Watch and re-watch at any time to revise concepts."],
            ["📝", "Auto-Graded Tests", "Take weekly MCQ tests with a timer. Get your score instantly."],
            ["📋", "DPP & Homework", "Download daily practice problems as PDFs. Submit your work online."],
            ["✅", "Attendance Tracking", "Monitor attendance with a visual tracker and class-by-class history."],
            ["📊", "Progress Analytics", "Test scores, class comparisons, top students and revenue in one dashboard."],
            ["💰", "Fee Management", "Record and track payments, send automatic reminders for pending fees."],
            ["🔔", "Smart Notifications", "Notify all students, a class group, or individual students instantly."],
            ["👨‍👩‍👧", "Parent-Friendly", "Parent email captured at registration for performance and fee updates."],
          ].map(([icon, title, desc]) => (
            <div key={title as string} className="feature">
              <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
              <h3 style={{ fontWeight: 700, fontSize: 15.5, marginBottom: 7, letterSpacing: "-0.01em" }}>{title}</h3>
              <p style={{ fontSize: 13.5, color: "#3d4a63", lineHeight: 1.65 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{ background: "#fff", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#e8a020", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 10 }}>Simple Process</div>
            <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.025em" }}>How it works</h2>
          </div>
          <div className="grid-kpi">
            {[
              ["1", "Book a Free Demo", "Register an account and schedule a free demo class to experience our interactive teaching style."],
              ["2", "Choose Your Batch", "Select the batch that fits your schedule for Class 8, 9, or 10 Mathematics."],
              ["3", "Start Learning Live", "Join daily live classes, access recorded lectures, and track your progress in real-time."]
            ].map(([num, title, desc]) => (
              <div key={num} style={{ background: "#f4f5f9", padding: 32, borderRadius: 20, position: "relative", overflow: "hidden", border: "1px solid #e4e7ef" }}>
                <div style={{ position: "absolute", top: -20, right: -10, fontSize: 120, fontWeight: 800, color: "rgba(11,15,26,0.03)", lineHeight: 1 }}>{num}</div>
                <div style={{ width: 40, height: 40, background: "#0b0f1a", color: "#e8a020", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, marginBottom: 20 }}>{num}</div>
                <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 10, letterSpacing: "-0.01em", color: "#0b0f1a" }}>{title}</h3>
                <p style={{ fontSize: 14.5, color: "#3d4a63", lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLASSES */}
      <section id="classes" style={{ background: "#f4f5f9", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#e8a020", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 10 }}>Our Offerings</div>
            <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.025em" }}>Classes We Teach</h2>
          </div>
          <div className="grid-kpi">
            {[
              ["Class 8", "Build a strong mathematical foundation with focus on algebraic expressions, geometry, and basic statistics."],
              ["Class 9", "Step up your preparation with advanced algebra, surface areas, volumes, and probability."],
              ["Class 10", "Master board exams with complete coverage of trigonometry, quadratic equations, and arithmetic progressions."]
            ].map(([cls, desc]) => (
              <div key={cls} style={{ background: "#fff", padding: 32, borderRadius: 20, border: "1px solid #e4e7ef", textAlign: "center" }}>
                <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: 32, padding: "0 16px", background: "rgba(232,160,32,0.1)", color: "#a06800", borderRadius: 100, fontSize: 12, fontWeight: 700, marginBottom: 16 }}>CBSE / ICSE</div>
                <h3 style={{ fontWeight: 800, fontSize: 28, marginBottom: 12, color: "#0b0f1a", letterSpacing: "-0.02em" }}>{cls}</h3>
                <p style={{ fontSize: 14.5, color: "#3d4a63", lineHeight: 1.6, marginBottom: 24 }}>{desc}</p>
                <Link href="/register" style={{ color: "#e8a020", fontWeight: 700 }}>Explore Syllabus →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#0b0f1a", padding: "72px 24px", textAlign: "center" }}>
        <h2 style={{ fontWeight: 800, fontSize: 36, color: "white", letterSpacing: "-0.025em", marginBottom: 14 }}>Ready to ace your exams?</h2>
        <p style={{ color: "rgba(255,255,255,0.42)", fontSize: 15, marginBottom: 32, maxWidth: 440, margin: "0 auto 32px" }}>Join 200+ students who improved their Maths scores.</p>
        <Link href="/register" className="btn-gold" style={{ padding: "14px 36px", fontSize: 16 }}>Book Free Demo — It's Free</Link>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#06080f", padding: "28px 24px" }}>
        <div className="footer-content" style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, background: "#e8a020", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, color: "#0b0f1a" }}>M</div>
            <span style={{ color: "rgba(255,255,255,0.6)", fontWeight: 600, fontSize: 14 }}>Maths Academy</span>
          </div>
          <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 12.5 }}>Delhi's #1 Online Coaching for Class 8–10 Maths</span>
          <div style={{ display: "flex", gap: 20 }}>
            <Link href="/login" style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>Login</Link>
            <Link href="/register" style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>Register</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
