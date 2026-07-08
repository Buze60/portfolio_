import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const items = await prisma.achievement.findMany({
      where: { visible: true },
      orderBy: { order: "asc" },
    })
    return NextResponse.json(items)
  } catch {
    return NextResponse.json([])
  }
}
