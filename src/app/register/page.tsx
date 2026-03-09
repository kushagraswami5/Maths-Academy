"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {

  const [name,setName] = useState("")
  const [email,setEmail] = useState("")
  const [parentEmail,setParentEmail] = useState("")
  const [studentMobile,setStudentMobile] = useState("")
  const [password,setPassword] = useState("")
  const [studentClass,setStudentClass] = useState("8")
  const router = useRouter()
  const register = async (e:any) => {
    e.preventDefault()

    const res = await fetch("/api/register",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        name,
        email,
        parentEmail,
        studentMobile,
        studentClass,
        password
      })
    })

    const data = await res.json()

  if(res.ok){

    alert("Registration successful")

    router.replace("/login")   // 🔹 use replace instead of push

  }else{

    alert(data.error)

  }

}

  return (

    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-white">

      <div className="grid md:grid-cols-2 gap-10 items-center max-w-6xl w-full">

        {/* LEFT SIDE FORM */}

        <div className="bg-white shadow-xl rounded-2xl p-8">

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Register to Join the Best
          </h2>

          <p className="text-gray-500 mb-6">
            Join the best. Secure your spot now.
          </p>

          <form onSubmit={register} className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Student Email */}
            <input
              type="email"
              placeholder="Student Email"
              className="border rounded-lg text-gray-500 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />

            {/* Student Name */}
            <input
              type="text"
              placeholder="Student Full Name"
              className="border text-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e)=>setName(e.target.value)}
            />

            {/* Parent Email */}
            <input
              type="email"
              placeholder="Parent Email"
              className="border text-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={parentEmail}
              onChange={(e)=>setParentEmail(e.target.value)}
            />

            {/* Class */}
            <select
              className="border text-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={studentClass}
              onChange={(e)=>setStudentClass(e.target.value)}
            >
              <option value="8">Class 8</option>
              <option value="9">Class 9</option>
              <option value="10">Class 10</option>
            </select>

            {/* Password */}
            <input
              type="password"
              placeholder="Set Password"
              className="border text-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />

            {/* Mobile */}
            <input
              type="tel"
              placeholder="Student Mobile Number"
              className="border text-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={studentMobile}
              onChange={(e)=>setStudentMobile(e.target.value)}
            />

            {/* Button */}
            <button
              className="md:col-span-2 w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
            >
              Register For Free Demo
            </button>

          </form>

        </div>


        {/* RIGHT SIDE HERO */}

        <div className="hidden md:flex flex-col items-center justify-center text-center">
            <img
            src="/Demo.gif"
            alt="online class"
            className="w-[380px]"
          />

          <div className="mt-6 text-gray-700">
            <h3 className="font-semibold text-lg">
              Booking a Demo Ensures
            </h3>

            <ul className="mt-3 space-y-2 text-gray-500 text-sm">

              <li>✔️ Personalized batch matching</li>
              <li>✔️ Faculty interaction</li>
              <li>✔️ Full platform preview</li>

            </ul>

          </div>

        </div>

      </div>

    </div>

  )
}