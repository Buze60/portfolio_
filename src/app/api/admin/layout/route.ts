import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"

async function isAuthenticated() {
  const session = await auth()
  return !!session?.user
}

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const layouts = await prisma.sectionLayout.findMany({ orderBy: { order: "asc" } })
  return NextResponse.json(layouts)
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const data = await request.json()
  const layout = await prisma.sectionLayout.update({ where: { id: data.id }, data })
  return NextResponse.json(layout)
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { layouts } = await request.json()
  for (const layout of layouts) {
    await prisma.sectionLayout.update({ where: { id: layout.id }, data: { order: layout.order } })
  }
  return NextResponse.json({ success: true })
}
