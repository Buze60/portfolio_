import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

const defaultLayouts = [
  { id: "hero", section: "hero", order: 0, icon: "User", title: "Hero", visible: true },
  { id: "skills", section: "skills", order: 1, icon: "Code2", title: "Skills", visible: true },
  { id: "experience", section: "experience", order: 2, icon: "Briefcase", title: "Experience", visible: true },
  { id: "education", section: "education", order: 3, icon: "GraduationCap", title: "Education", visible: true },
  { id: "projects", section: "projects", order: 4, icon: "FolderGit2", title: "Projects", visible: true },
  { id: "achievements", section: "achievements", order: 5, icon: "Award", title: "Achievements", visible: true },
  { id: "contact", section: "contact", order: 6, icon: "Mail", title: "Contact", visible: true },
]

export async function GET() {
  try {
    const layouts = await prisma.sectionLayout.findMany({
      orderBy: { order: "asc" },
    })
    return NextResponse.json(layouts)
  } catch {
    return NextResponse.json(defaultLayouts)
  }
}
