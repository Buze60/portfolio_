import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"

async function isAuthenticated() {
  const session = await auth()
  return !!session?.user
}

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const session = await auth()
  const user = await prisma.user.findUnique({ where: { id: session?.user?.id } })
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })
  const { password, ...profile } = user
  return NextResponse.json(profile)
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const session = await auth()
  const data = await request.json()
  const user = await prisma.user.update({ where: { id: session?.user?.id }, data })
  const { password, ...profile } = user
  return NextResponse.json(profile)
}
