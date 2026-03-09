"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {

  const router = useRouter()

  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")

  const login = async (e:any)=>{
    e.preventDefault()

    const res = await fetch("/api/login",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        email,
        password
      })
    })

    const data = await res.json()

    if(res.ok){
      localStorage.setItem("token",data.token)
      alert("Login successful")
      router.push("/dashboard")
    }else{
      alert(data.error)
    }
  }

  return (

    <div
      className="min-h-screen bg-white flex items-center justify-center px-6 py-16"
      
    >

      <div className="grid md:grid-cols-2 gap-10 items-center max-w-6xl w-full">

        {/* LEFT LOGIN CARD */}

        <div className="bg-white shadow-xl rounded-2xl p-8">

          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Login to Your Account
          </h2>

          <p className="text-gray-500 mb-6">
            Access your live classes, recorded lectures, and performance dashboard.
          </p>

          <form onSubmit={login} className="space-y-4">

            <input
              type="email"
              placeholder="Student Email / ID"
              className="w-full border text-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full border text-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />

            <div className="text-right text-sm text-blue-600 cursor-pointer">
              Forgot Password?
            </div>

            <button
              className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
            >
              LOGIN NOW
            </button>

          </form>

          <p className="text-sm text-gray-500 mt-6 text-center">
            Don't have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={()=>router.push("/register")}
            >
              Register now
            </span>
          </p>

        </div>

        {/* RIGHT SIDE HERO */}

        <div className="hidden md:flex flex-col items-center justify-center text-center">

          <img
            src="/login.gif"
            alt="online class"
            className="w-[380px]"
          />

          <div className="mt-6 text-gray-700">

            <h3 className="font-semibold text-lg">
              Choose Your Live Batch
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              Select the best batch and start learning instantly.
            </p>

          </div>

        </div>

      </div>

    </div>

  )
}