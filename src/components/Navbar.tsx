"use client"

import { useState } from "react"
import Link from "next/link"

export default function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-md">

      <div className="flex items-center justify-between px-6 py-4">

        {/* Logo */}
        <h1 className="text-xl font-bold text-blue-700">
          Maths Academy
        </h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 text-gray-700">
          <Link href="/">Home</Link>
          <Link href="/live">Live Classes</Link>
          <Link href="/dpp">DPP</Link>
          <Link href="/material">Study Material</Link>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex gap-4">

          <Link
            href="/login"
            className="border border-green-500 text-green-500 px-4 py-2 rounded-lg font-medium"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium"
          >
            Free Demo / Register
          </Link>

        </div>

        {/* Hamburger */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="flex flex-col px-6 pb-4 gap-4 md:hidden text-gray-700">

          <Link href="/">Home</Link>
          <Link href="/live">Live Classes</Link>
          <Link href="/dpp">DPP</Link>
          <Link href="/material">Study Material</Link>

          <Link
            href="/login"
            className="border border-green-500 text-green-500 px-4 py-2 rounded-lg w-fit"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="bg-green-500 text-white px-4 py-2 rounded-lg w-fit"
          >
            Free Demo / Register
          </Link>

        </div>
      )}

    </nav>
  )
}