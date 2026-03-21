"use client"
import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { useSidebar } from "@/lib/useSidebar"

interface TopBarProps {
  title: string
  subtitle?: string
  onMenuClick?: () => void
  actions?: React.ReactNode
}

export default function TopBar({ title, subtitle, onMenuClick, actions }: TopBarProps) {
  const [name, setName] = useState("")
  const [time, setTime] = useState("")
  const ref = useRef<HTMLDivElement>(null)
  const { show } = useSidebar()
  
  const handleMenuClick = onMenuClick || show

  useEffect(() => {
    setName(localStorage.getItem("name") || "")
    const tick = () => setTime(new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"}))
    tick(); const t = setInterval(tick, 60000); return () => clearInterval(t)
  }, [])

  useGSAP(() => {
    if (!ref.current) return
    // gsap.set first then gsap.to — eliminates the flash
    gsap.set(ref.current, { y: -10, opacity: 0 })
    gsap.to(ref.current, { y: 0, opacity: 1, duration: 0.4, ease: "power2.out", clearProps: "transform,opacity" })
  }, { scope: ref })

  const initials = name.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2)||"U"

  return (
    <div ref={ref} style={{ background:"#fff", borderBottom:"1px solid #e4e7ef", height:60, padding:"0 16px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:20 }}>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        {/* Hamburger — mobile only */}
        <button
          className="topbar-hamburger"
          onClick={handleMenuClick}
          aria-label="Open menu"
          style={{ background:"none", border:"none", cursor:"pointer", padding:4, display:"flex", flexDirection:"column", gap:4, flexShrink:0 }}
        >
          <span style={{ display:"block", width:20, height:2, background:"#0b0f1a", borderRadius:2 }}/>
          <span style={{ display:"block", width:20, height:2, background:"#0b0f1a", borderRadius:2 }}/>
          <span style={{ display:"block", width:20, height:2, background:"#0b0f1a", borderRadius:2 }}/>
        </button>
        <div>
          <h1 style={{ fontSize:16, fontWeight:700, color:"#0b0f1a", lineHeight:1.2, fontFamily:"Outfit,sans-serif" }}>{title}</h1>
          {subtitle && <p style={{ fontSize:11, color:"#7a8aa0", marginTop:1 }}>{subtitle}</p>}
        </div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:14 }}>
        {actions && <div style={{ display:"flex", alignItems:"center", gap:8 }}>{actions}</div>}
        <span style={{ fontSize:12, color:"#7a8aa0", fontFamily:"JetBrains Mono,monospace", display:"none" }} className="topbar-time">{time}</span>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:32, height:32, borderRadius:"50%", background:"#0b0f1a", display:"flex", alignItems:"center", justifyContent:"center", color:"#e8a020", fontWeight:700, fontSize:12 }}>{initials}</div>
          <span style={{ fontSize:13, fontWeight:600, color:"#0b0f1a", display:"none" }} className="topbar-name">{name||"User"}</span>
        </div>
      </div>
      <style>{`
        @media(min-width:768px){
          .topbar-hamburger{display:none !important;}
          .topbar-time{display:inline !important;}
          .topbar-name{display:inline !important;}
        }
      `}</style>
    </div>
  )
}
