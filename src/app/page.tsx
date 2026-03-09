import Navbar from "@/components/Navbar"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-white">

      <Navbar/>


      {/* HERO SECTION */}
      <section className="grid grid-cols-1 md:grid-cols-2 items-center px-6 md:px-12 py-16 md:py-24 gap-10">

        {/* LEFT SIDE */}
        <div className="text-center md:text-left">

          <h1 className="text-3xl md:text-5xl font-bold leading-tight text-gray-900">
            DELHI'S <span className="text-yellow-500">#1</span> ONLINE COACHING FOR
            <span className="text-yellow-500 block">
              Class 8–10 Maths
            </span>
          </h1>

          <p className="mt-4 md:mt-6 text-gray-600 text-base md:text-lg">
            Master concepts, ace board exams, and learn maths with
            live interactive classes, weekly tests, and personal
            doubt solving.
          </p>

          <div className="mt-6 flex justify-center md:justify-start">

            <Link
              href="/register"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium"
            >
              Book Demo
            </Link>

          </div>

        </div>


        {/* RIGHT SIDE IMAGE */}
        <div className="flex justify-center">

          <img
            src="/hero-teaching.png"
            alt="Live teaching"
            className="w-[280px] md:w-[450px]"
          />

        </div>

      </section>


      {/* FEATURES */}
      <section className="bg-gray-50 py-16 md:py-20 px-6 md:px-10">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">

          <div>
            <h3 className="text-lg md:text-xl text-black font-semibold">
              Live Interactive Classes
            </h3>
            <p className="text-gray-600 mt-2">
              Learn directly with teacher in live sessions.
            </p>
          </div>

          <div>
            <h3 className="text-lg md:text-xl text-black font-semibold">
              Weekly Tests
            </h3>
            <p className="text-gray-600 mt-2">
              Track progress with regular tests.
            </p>
          </div>

          <div>
            <h3 className="text-lg md:text-xl text-black font-semibold">
              Recorded Lectures
            </h3>
            <p className="text-gray-600 mt-2">
              Revise concepts anytime with recordings.
            </p>
          </div>

        </div>

      </section>

    </main>
  )
}