"use client"

import { useEffect, useState } from "react"
import {
  User, Code2, Briefcase, GraduationCap, FolderGit2, Award, Mail, ChevronLeft,
} from "lucide-react"
import type { SectionLayoutType } from "@/types"

const fallbackIcons: Record<string, React.ElementType> = {
  User, Code2, Briefcase, GraduationCap, FolderGit2, Award, Mail,
}

interface Props {
  activeSection: string
  setActiveSection: (section: string) => void
}

export default function PublicSidebar({ activeSection, setActiveSection }: Props) {
  const [sections, setSections] = useState<SectionLayoutType[]>([])
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    fetch("/api/public/layout")
      .then((r) => r.json())
      .then((data) => setSections(data.filter((s: SectionLayoutType) => s.visible).sort((a: SectionLayoutType, b: SectionLayoutType) => a.order - b.order)))
      .catch(() => {})
  }, [])

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-dark-card border-r border-dark-border transition-all duration-300 z-50 flex flex-col ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="p-4 flex items-center justify-between border-b border-dark-border">
        {!collapsed && (
          <h2 className="text-lg font-bold gradient-text">Portfolio</h2>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-dark-border transition-colors"
        >
          <ChevronLeft className={`w-5 h-5 transition-transform ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {sections.map((section) => {
          const Icon = fallbackIcons[section.icon] || User
          const isActive = activeSection === section.section
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.section)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-primary/20 to-secondary/20 text-white border border-primary/30"
                  : "text-dark-muted hover:text-white hover:bg-dark-border"
              }`}
              title={collapsed ? section.title : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{section.title}</span>}
              {isActive && !collapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
