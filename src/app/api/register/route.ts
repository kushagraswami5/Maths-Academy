import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {

  try {

    const {
      name,
      email,
      parentEmail,
      studentMobile,
      studentClass,
      password
    } = await req.json()

    // check existing user
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        parentEmail,
        studentMobile,
        class: studentClass,
        password: hashedPassword
      }
    })

    return NextResponse.json({
      message: "User registered successfully",
      user
    })

  } catch (error) {

    console.log(error)

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )

  }

}