import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const skills = await prisma.skill.findMany({
      where: { visible: true },
      orderBy: { order: "asc" },
    })
    return NextResponse.json(skills)
  } catch {
    return NextResponse.json([])
  }
}
