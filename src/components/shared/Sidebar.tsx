"use client"
import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

const adminNav = [
  { label:"Dashboard",    href:"/admin",               icon:"⬡" },
  { label:"Students",     href:"/admin/students",      icon:"○", section:"Manage" },
  { label:"Courses",      href:"/admin/courses",       icon:"◈" },
  { label:"Lectures",     href:"/admin/lectures",      icon:"▷" },
  { label:"Live Classes", href:"/admin/live",          icon:"⬤" },
  { label:"Tests",        href:"/admin/tests",         icon:"◇" },
  { label:"Homework",     href:"/admin/homework",      icon:"□" },
  { label:"Grade HW",     href:"/admin/grades",        icon:"✧" },
  { label:"Attendance",   href:"/admin/attendance",    icon:"▣", section:"Reports" },
  { label:"Payments",     href:"/admin/payments",      icon:"◎" },
  { label:"Analytics",    href:"/admin/analytics",     icon:"△" },
  { label:"Notify",       href:"/admin/notifications", icon:"◯" },
]
const studentNav = [
  { label:"Dashboard",     href:"/dashboard",             icon:"⬡" },
  { label:"My Courses",    href:"/student/courses",       icon:"◈", section:"Learn" },
  { label:"Lectures",      href:"/student/lectures",      icon:"▷" },
  { label:"Live Classes",  href:"/student/live",          icon:"⬤" },
  { label:"Tests",         href:"/student/tests",         icon:"◇" },
  { label:"Homework",      href:"/student/homework",      icon:"□" },
  { label:"Attendance",    href:"/student/attendance",    icon:"▣", section:"Track" },
  { label:"Payments",      href:"/student/payments",      icon:"◎" },
  { label:"Notifications", href:"/student/notifications", icon:"◯" },
]

interface SidebarInnerProps {
  role: "admin"|"student"
  collapsed?: boolean
  setCollapsed?: (v: boolean) => void
  onLinkClick?: () => void
}

function SidebarInner({ role, collapsed=false, setCollapsed, onLinkClick }: SidebarInnerProps) {
  const pathname = usePathname()
  const router = useRouter()
  const navRef = useRef<HTMLElement>(null)
  const nav = role === "admin" ? adminNav : studentNav

  useGSAP(() => {
    if (!navRef.current) return
    const links = navRef.current.querySelectorAll("a")
    // gsap.set first (invisible), then gsap.to (animate in) — prevents flash
    gsap.set(links, { x: -16, opacity: 0 })
    gsap.to(links, { x: 0, opacity: 1, duration: 0.4, stagger: 0.04, ease: "power2.out", clearProps: "transform,opacity" })
  }, { scope: navRef })

  const logout = () => {
    ["token","email","role","name"].forEach(k => localStorage.removeItem(k))
    router.replace("/login")
  }

  return (
    <>
      {/* Logo */}
      <div style={{ height:58, display:"flex", alignItems:"center", gap:10, padding:collapsed?"0 14px":"0 18px", borderBottom:"1px solid rgba(255,255,255,0.07)", flexShrink:0 }}>
        <div style={{ width:30, height:30, background:"#e8a020", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:14, color:"#0b0f1a", flexShrink:0 }}>M</div>
        {!collapsed && <div style={{ overflow:"hidden" }}>
          <div style={{ color:"white", fontWeight:700, fontSize:13.5, lineHeight:1.1, whiteSpace:"nowrap" }}>Maths Academy</div>
          <div style={{ color:"#e8a020", fontSize:9, fontWeight:700, letterSpacing:".14em", textTransform:"uppercase" }}>
            {role==="admin"?"Admin Panel":"Student Portal"}
          </div>
        </div>}
      </div>

      {/* Nav */}
      <nav ref={navRef} style={{ flex:1, padding:"8px 7px", overflowY:"auto", scrollbarWidth:"none" }}>
        {nav.map((item:any) => {
          const active = pathname===item.href || (item.href!=="/admin"&&item.href!=="/dashboard"&&pathname.startsWith(item.href))
          return (
            <div key={item.href}>
              {item.section && !collapsed && <div style={{ padding:"11px 9px 3px", fontSize:9, fontWeight:700, color:"rgba(255,255,255,0.22)", textTransform:"uppercase", letterSpacing:".12em" }}>{item.section}</div>}
              <Link href={item.href} title={collapsed?item.label:""} onClick={onLinkClick} style={{
                display:"flex", alignItems:"center", gap:9,
                padding:collapsed?"9px 14px":"8px 10px", borderRadius:8, marginBottom:1,
                background:active?"rgba(255,255,255,0.09)":"transparent",
                color:active?"white":"rgba(255,255,255,0.45)",
                textDecoration:"none", fontSize:13.5, fontWeight:active?600:400,
                transition:"background .13s", borderLeft:`2.5px solid ${active?"#e8a020":"transparent"}`,
              }}>
                <span style={{ fontSize:13, flexShrink:0 }}>{item.icon}</span>
                {!collapsed && <span style={{ whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{item.label}</span>}
              </Link>
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding:"7px 7px 10px", borderTop:"1px solid rgba(255,255,255,0.07)", flexShrink:0 }}>
        {setCollapsed && <button onClick={()=>setCollapsed(!collapsed)} style={{ width:"100%", padding:"7px", background:"transparent", border:"none", color:"rgba(255,255,255,0.3)", cursor:"pointer", borderRadius:7, display:"flex", alignItems:"center", justifyContent:collapsed?"center":"flex-start", gap:8, marginBottom:4, fontSize:12, fontFamily:"Outfit,sans-serif" }}>
          <span>{collapsed?"→":"←"}</span>{!collapsed&&"Collapse"}
        </button>}
        <button onClick={logout} style={{ width:"100%", padding:"8px 10px", background:"rgba(225,29,72,0.1)", border:"none", color:"#f87171", cursor:"pointer", borderRadius:7, fontSize:13, fontWeight:600, display:"flex", alignItems:"center", justifyContent:collapsed?"center":"flex-start", gap:7, fontFamily:"Outfit,sans-serif" }}>
          <span>⎋</span>{!collapsed&&"Sign Out"}
        </button>
      </div>
    </>
  )
}

import { useSidebar } from "@/lib/useSidebar"

interface SidebarProps {
  role: "admin"|"student"
  open?: boolean
  onClose?: () => void
}

export default function Sidebar({ role, open=false, onClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const { open: globalOpen, hide } = useSidebar()

  const isDrawerOpen = open || globalOpen
  const handleClose = onClose || hide

  return (
    <>
      {/* Mobile overlay */}
      <div className={`sidebar-overlay${isDrawerOpen?" active":""}`} onClick={handleClose} />

      {/* Mobile drawer */}
      <div className={`sidebar-drawer${isDrawerOpen?" open":""}`}>
        <SidebarInner role={role} onLinkClick={handleClose} />
      </div>

      {/* Desktop sidebar */}
      <aside className="sidebar-desktop" style={{
        width:collapsed?60:220, minHeight:"100vh",
        background:"#0b0f1a", flexDirection:"column",
        transition:"width 0.25s cubic-bezier(0.4,0,0.2,1)",
        flexShrink:0, position:"sticky", top:0, zIndex:30, overflow:"hidden",
      }}>
        <SidebarInner role={role} collapsed={collapsed} setCollapsed={setCollapsed} />
      </aside>
    </>
  )
}
