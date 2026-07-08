import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  const layouts = await prisma.sectionLayout.findMany({
    orderBy: { order: "asc" },
  })
  return NextResponse.json(layouts)
}
