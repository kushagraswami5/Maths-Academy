import jwt from "jsonwebtoken"
import { NextRequest } from "next/server"

export function getUserFromToken(req: Request): { userId: string } | null {
  try {
    const auth = req.headers.get("authorization")
    if (!auth?.startsWith("Bearer ")) return null
    const token = auth.split(" ")[1]
    return jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string }
  } catch {
    return null
  }
}

export function requireAdmin(decoded: any, user: any) {
  return user?.role === "admin"
}
