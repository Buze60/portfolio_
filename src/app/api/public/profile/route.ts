import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  const user = await prisma.user.findFirst()
  if (!user) return NextResponse.json({})
  const { password, id, emailVerified, ...profile } = user
  return NextResponse.json(profile)
}
