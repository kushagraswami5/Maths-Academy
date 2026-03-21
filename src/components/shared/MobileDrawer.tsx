"use client"
import { useEffect, useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

type NavItem = { label: string; href: string; icon: string }

const adminNav: NavItem[] = [
  { label:"Dashboard",    href:"/admin",               icon:"▦" },
  { label:"Students",     href:"/admin/students",      icon:"◈" },
  { label:"Courses",      href:"/admin/courses",       icon:"◉" },
  { label:"Lectures",     href:"/admin/lectures",      icon:"▷" },
  { label:"Live Classes", href:"/admin/live",          icon:"◎" },
  { label:"Tests",        href:"/admin/tests",         icon:"◻" },
  { label:"Homework",     href:"/admin/homework",      icon:"◈" },
  { label:"Grade HW",     href:"/admin/grades",        icon:"◇" },
  { label:"Attendance",   href:"/admin/attendance",    icon:"◆" },
  { label:"Payments",     href:"/admin/payments",      icon:"◑" },
  { label:"Analytics",    href:"/admin/analytics",     icon:"◐" },
  { label:"Notifications",href:"/admin/notifications", icon:"◔" },
]
const studentNav: NavItem[] = [
  { label:"Dashboard",    href:"/dashboard",           icon:"▦" },
  { label:"My Courses",   href:"/student/courses",     icon:"◉" },
  { label:"Lectures",     href:"/student/lectures",    icon:"▷" },
  { label:"Live Classes", href:"/student/live",        icon:"◎" },
  { label:"Tests",        href:"/student/tests",       icon:"◻" },
  { label:"Homework",     href:"/student/homework",    icon:"◈" },
  { label:"Attendance",   href:"/student/attendance",  icon:"◆" },
  { label:"Payments",     href:"/student/payments",    icon:"◑" },
  { label:"Notifications",href:"/student/notifications",icon:"◔" },
]

export default function MobileDrawer({ role, open, onClose }: { role:"admin"|"student"; open:boolean; onClose:()=>void }) {
  const pathname = usePathname()
  const router = useRouter()
  const nav = role === "admin" ? adminNav : studentNav
  const drawerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (typeof window === "undefined" || !drawerRef.current) return
    if (open) {
      gsap.fromTo(drawerRef.current, { x: -260 }, { x: 0, duration: 0.3, ease: "power3.out" })
      const items = drawerRef.current.querySelectorAll(".drawer-item")
      gsap.fromTo(items, { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: 0.25, stagger: 0.03, ease: "power2.out", delay: 0.1 })
    }
  }, { dependencies: [open], scope: drawerRef })

  if (!open) return null

  const logout = () => { localStorage.clear(); router.replace("/login") }
  const isActive = (href: string) => pathname === href || (href !== "/admin" && href !== "/dashboard" && pathname.startsWith(href))

  return (
    <div style={{ position:"fixed", inset:0, zIndex:500 }} onClick={onClose}>
      {/* Backdrop */}
      <div style={{ position:"absolute", inset:0, background:"rgba(10,12,16,0.65)", backdropFilter:"blur(4px)" }} />
      {/* Drawer */}
      <div ref={drawerRef} onClick={e => e.stopPropagation()} style={{
        position:"absolute", left:0, top:0, bottom:0, width:260,
        background:"var(--ink)", display:"flex", flexDirection:"column",
        boxShadow:"4px 0 32px rgba(0,0,0,0.3)",
      }}>
        {/* Header */}
        <div style={{ padding:"20px 16px 14px", borderBottom:"1px solid var(--ink4)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:32,height:32,background:"var(--gold)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:15,color:"var(--ink)",fontFamily:"'Outfit',sans-serif" }}>M</div>
            <div style={{ color:"white",fontWeight:700,fontSize:13.5,fontFamily:"'Outfit',sans-serif" }}>Maths Academy</div>
          </div>
          <button onClick={onClose} style={{ background:"transparent",border:"none",color:"rgba(255,255,255,0.5)",cursor:"pointer",fontSize:18,padding:4,borderRadius:6 }}>✕</button>
        </div>
        {/* Nav */}
        <nav style={{ flex:1, padding:"10px 8px", overflowY:"auto", scrollbarWidth:"none" }}>
          {nav.map(item => {
            const active = isActive(item.href)
            return (
              <Link key={item.href} href={item.href} className="drawer-item" onClick={onClose} style={{
                display:"flex", alignItems:"center", gap:10,
                padding:"9px 12px", borderRadius:9, marginBottom:2,
                background:active?"var(--gold)":"transparent",
                color:active?"var(--ink)":"rgba(255,255,255,0.6)",
                textDecoration:"none", fontSize:14, fontWeight:active?700:500,
                fontFamily:"'Outfit',sans-serif", transition:"all 0.12s",
              }}>
                <span style={{ fontSize:12,width:16,textAlign:"center",flexShrink:0 }}>{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>
        {/* Logout */}
        <div style={{ padding:"10px 8px 16px", borderTop:"1px solid var(--ink4)" }}>
          <button onClick={logout} style={{ width:"100%",padding:"9px 12px",background:"transparent",border:"1px solid rgba(255,255,255,0.08)",borderRadius:9,color:"rgba(255,255,255,0.45)",cursor:"pointer",fontSize:13,fontWeight:500,display:"flex",alignItems:"center",gap:8,fontFamily:"'Outfit',sans-serif" }}>
            <span>⎋</span> Sign out
          </button>
        </div>
      </div>
    </div>
  )
}
