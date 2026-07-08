import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"

async function isAuthenticated() {
  const session = await auth()
  return !!session?.user
}

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const skills = await prisma.skill.findMany({ orderBy: { order: "asc" } })
  return NextResponse.json(skills)
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const data = await request.json()
  const maxOrder = await prisma.skill.aggregate({ _max: { order: true } })
  const skill = await prisma.skill.create({ data: { ...data, order: (maxOrder._max.order ?? -1) + 1 } })
  return NextResponse.json(skill)
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const data = await request.json()
  const { id, ...rest } = data
  const skill = await prisma.skill.update({ where: { id }, data: rest })
  return NextResponse.json(skill)
}

export async function DELETE(request: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await request.json()
  await prisma.skill.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
