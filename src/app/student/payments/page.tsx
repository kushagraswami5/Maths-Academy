"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/shared/Sidebar"
import TopBar from "@/components/shared/TopBar"
import { useSidebar } from "@/lib/useSidebar"


export default function StudentPayments() {
  const router = useRouter()
  const { open, show, hide } = useSidebar()
  const [payments, setPayments] = useState<any[]>([])

  useEffect(() => {
    const t = localStorage.getItem("token"); if(!t){router.replace("/login");return}
    fetch("/api/student/payments", { headers:{ Authorization:`Bearer ${t}` } })
      .then(r=>r.json()).then(d=>setPayments(d.payments||[]))
  }, [])

  const paid = payments.filter(p=>p.status==="paid").reduce((a:number,p:any)=>a+p.amount,0)
  const pending = payments.filter(p=>p.status==="pending").reduce((a:number,p:any)=>a+p.amount,0)

  return (
    


<div className="app-shell"><Sidebar role="student" open={open} onClose={hide} /><div className="main-content"><TopBar title="Fee & Payments" onMenuClick={show} /><div className="page-body">
                  <div className="grid-kpi" style={{ marginBottom: 20 }}>
            <div className="card card-p" style={{ textAlign:"center" }}>
              <div style={{ fontSize:26, fontWeight:800, color:"#059669" }}>₹{paid.toLocaleString()}</div>
              <div style={{ fontSize:13, color:"#7a8aa0", marginTop:4 }}>Total Paid</div>
            </div>
            <div className="card card-p" style={{ textAlign:"center" }}>
              <div style={{ fontSize:26, fontWeight:800, color:"#e11d48" }}>₹{pending.toLocaleString()}</div>
              <div style={{ fontSize:13, color:"#7a8aa0", marginTop:4 }}>Pending</div>
            </div>
            <div className="card card-p" style={{ textAlign:"center" }}>
              <div style={{ fontSize:26, fontWeight:800, color:"#4361ee" }}>{payments.length}</div>
              <div style={{ fontSize:13, color:"#7a8aa0", marginTop:4 }}>Transactions</div>
            </div>
          </div>

          {pending > 0 && (
            <div style={{ background:"#fff0f3", border:"1px solid #e11d48", borderRadius:12, padding:16, marginBottom:20, display:"flex", gap:12, alignItems:"center" }}>
              <span style={{ fontSize:24 }}>⚠️</span>
              <div>
                <div style={{ fontWeight:700, color:"#e11d48" }}>Payment Due: ₹{pending.toLocaleString()}</div>
                <div style={{ fontSize:13, color:"#7a8aa0" }}>Please contact your teacher to clear pending fees.</div>
              </div>
            </div>
          )}

          <div className="card card-p">
            <h2 style={{ fontSize:16, fontWeight:700, marginBottom:16 }}>Payment History</h2>
            <div className="table-scroll"><table>
              <thead><tr><th>Month</th><th>Amount</th><th>Method</th><th>Date</th><th>Status</th></tr></thead>
              <tbody>
                {payments.map((p:any) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight:600 }}>{p.month || "—"}</td>
                    <td style={{ fontWeight:700, color:"#4361ee" }}>₹{p.amount.toLocaleString()}</td>
                    <td style={{ textTransform:"capitalize" }}>{p.method}</td>
                    <td style={{ color:"#7a8aa0" }}>{new Date(p.createdAt).toLocaleDateString("en-IN")}</td>
                    <td><span className={p.status==="paid"?"badge badge-green":p.status==="pending"?"badge badge-yellow":"badge badge-red"}>{p.status}</span></td>
                  </tr>
                ))}
                {payments.length===0&&<tr><td colSpan={5} style={{ textAlign:"center", color:"#7a8aa0", padding:32 }}>No payment records.</td></tr>}
              </tbody>
            </table></div>
          </div>
        </div>
    </div>
    </div>
  
  )
}