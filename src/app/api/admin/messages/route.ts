import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"

async function isAuthenticated() {
  const session = await auth()
  return !!session?.user
}

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const messages = await prisma.message.findMany({ orderBy: { createdAt: "desc" } })
  return NextResponse.json(messages)
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id, read } = await request.json()
  const message = await prisma.message.update({ where: { id }, data: { read } })
  return NextResponse.json(message)
}

export async function DELETE(request: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await request.json()
  await prisma.message.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
