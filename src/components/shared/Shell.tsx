"use client"
import { useState } from "react"
import Sidebar from "./Sidebar"
import TopBar from "./TopBar"
import MobileDrawer from "./MobileDrawer"

interface ShellProps {
  role: "admin" | "student"
  title: string
  actions?: React.ReactNode
  children: React.ReactNode
}

export default function Shell({ role, title, actions, children }: ShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="app-shell">
      <Sidebar role={role} />
      <MobileDrawer role={role} open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <div className="main-content">
        {/* Mobile top bar */}
        <div className="mobile-topbar">
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <button onClick={() => setDrawerOpen(true)} style={{ background:"transparent",border:"none",cursor:"pointer",fontSize:20,color:"var(--t1)",padding:"4px 6px",borderRadius:6 }}>☰</button>
            <div style={{ width:28,height:28,background:"var(--gold)",borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:13,color:"var(--ink)",fontFamily:"'Outfit',sans-serif" }}>M</div>
            <span style={{ fontWeight:700,fontSize:15,fontFamily:"'Outfit',sans-serif" }}>{title}</span>
          </div>
          {actions && <div>{actions}</div>}
        </div>

        <TopBar title={title} actions={actions} />
        <div className="page-body">{children}</div>
      </div>
    </div>
  )
}
