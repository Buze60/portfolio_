import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"

async function isAuthenticated() {
  try { return !!(await auth())?.user } catch { return false }
}

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const items = await prisma.achievement.findMany({ orderBy: { order: "asc" } })
    return NextResponse.json(items)
  } catch { return NextResponse.json([]) }
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const { title, description, image, date, icon } = await request.json()
    if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 })
    const maxOrder = await prisma.achievement.aggregate({ _max: { order: true } })
    const item = await prisma.achievement.create({
      data: { title, description: description ?? null, image: image ?? null, date: date ?? null, icon, order: (maxOrder._max.order ?? -1) + 1 },
    })
    return NextResponse.json(item)
  } catch (e) {
    console.error("POST /api/admin/achievements error:", e)
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const { id, title, description, image, date, icon } = await request.json()
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 })
    const item = await prisma.achievement.update({
      where: { id },
      data: { title, description: description ?? null, image: image ?? null, date: date ?? null, icon },
    })
    return NextResponse.json(item)
  } catch (e) {
    console.error("PUT /api/admin/achievements error:", e)
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const { id } = await request.json()
    await prisma.achievement.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch { return NextResponse.json({ error: "Database error" }, { status: 500 }) }
}
