import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"

async function isAuthenticated() {
  const session = await auth()
  return !!session?.user
}

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const items = await prisma.project.findMany({ orderBy: { order: "asc" } })
  return NextResponse.json(items)
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const data = await request.json()
  const maxOrder = await prisma.project.aggregate({ _max: { order: true } })
  const item = await prisma.project.create({ data: { ...data, order: (maxOrder._max.order ?? -1) + 1 } })
  return NextResponse.json(item)
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const data = await request.json()
  const { id, ...rest } = data
  const item = await prisma.project.update({ where: { id }, data: rest })
  return NextResponse.json(item)
}

export async function DELETE(request: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await request.json()
  await prisma.project.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
