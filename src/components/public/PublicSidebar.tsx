"use client"

import { useEffect, useState } from "react"
import {
  User, Code2, Briefcase, GraduationCap, FolderGit2, Award, Mail, ChevronLeft, Menu,
} from "lucide-react"
import type { SectionLayoutType } from "@/types"
import { SidebarSkeleton } from "@/components/ui/Skeleton"

const fallbackIcons: Record<string, React.ElementType> = {
  User, Code2, Briefcase, GraduationCap, FolderGit2, Award, Mail,
}

interface Props {
  activeSection: string
  setActiveSection: (section: string) => void
}

export default function PublicSidebar({ activeSection, setActiveSection }: Props) {
  const [sections, setSections] = useState<SectionLayoutType[]>([])
  const [sidebarLoading, setSidebarLoading] = useState(true)
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)")
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  useEffect(() => {
    fetch("/api/public/layout")
      .then((r) => r.json())
      .then((data) => setSections(data.filter((s: SectionLayoutType) => s.visible).sort((a: SectionLayoutType, b: SectionLayoutType) => a.order - b.order)))
      .catch(() => {})
      .finally(() => setSidebarLoading(false))
  }, [])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [mobileOpen])

  const handleSectionClick = (section: string) => {
    setActiveSection(section)
    setMobileOpen(false)
  }

  const sidebarContent = (isMobileView: boolean) => (
    <>
      <div className="p-4 flex items-center justify-between border-b border-dark-border">
        {!collapsed && (
          <h2 className="text-lg font-bold gradient-text">Portfolio</h2>
        )}
        {isMobileView ? (
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg hover:bg-dark-border transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-dark-border transition-colors"
          >
            <ChevronLeft className={`w-5 h-5 transition-transform ${collapsed ? "rotate-180" : ""}`} />
          </button>
        )}
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {sidebarLoading ? (
          <SidebarSkeleton />
        ) : sections.map((section) => {
          const Icon = fallbackIcons[section.icon] || User
          const isActive = activeSection === section.section
          return (
            <button
              key={section.id}
              onClick={() => handleSectionClick(section.section)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-primary/20 to-secondary/20 text-white border border-primary/30"
                  : "text-dark-muted hover:text-white hover:bg-dark-border"
              }`}
              title={collapsed && !isMobileView ? section.title : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {(!collapsed || isMobileView) && <span className="text-sm font-medium">{section.title}</span>}
              {isActive && (!collapsed || isMobileView) && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </button>
          )
        })}
      </nav>
    </>
  )

  return (
    <>
      {!isMobile && (
        <aside
          className={`fixed left-0 top-0 h-screen bg-dark-card border-r border-dark-border transition-all duration-300 z-50 flex flex-col ${
            collapsed ? "w-16" : "w-64"
          }`}
        >
          {sidebarContent(false)}
        </aside>
      )}

      {isMobile && (
        <>
          <button
            onClick={() => setMobileOpen(true)}
            className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-dark-card border border-dark-border text-dark-muted hover:text-white transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {mobileOpen && (
            <div
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
          )}

          <aside
            className={`fixed left-0 top-0 h-screen w-64 bg-dark-card border-r border-dark-border z-50 flex flex-col transition-transform duration-300 ${
              mobileOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {sidebarContent(true)}
          </aside>
        </>
      )}
    </>
  )
}
