"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard, Code2, GraduationCap, Briefcase, FolderGit2,
  Award, MessageSquare, Palette, LogOut, Settings, ChevronLeft, User, Menu,
} from "lucide-react"
import { signOut } from "next-auth/react"
import { useState, useEffect } from "react"

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/skills", label: "Skills", icon: Code2 },
  { href: "/dashboard/education", label: "Education", icon: GraduationCap },
  { href: "/dashboard/experience", label: "Experience", icon: Briefcase },
  { href: "/dashboard/projects", label: "Projects", icon: FolderGit2 },
  { href: "/dashboard/achievements", label: "Achievements", icon: Award },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/messages", label: "Messages", icon: MessageSquare },
  { href: "/dashboard/layout-editor", label: "Layout Editor", icon: Palette },
]

export default function Sidebar() {
  const pathname = usePathname()
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
    if (mobileOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [mobileOpen])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <>
      {!isMobile && (
        <aside
          className={`fixed left-0 top-0 h-screen bg-dark-card border-r border-dark-border transition-all duration-300 z-50 flex flex-col ${
            collapsed ? "w-16" : "w-64"
          }`}
        >
          <div className="p-4 flex items-center justify-between border-b border-dark-border">
            {!collapsed && (
              <Link href="/dashboard" className="text-xl font-bold gradient-text">
                Dashboard
              </Link>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-lg hover:bg-dark-border transition-colors"
            >
              <ChevronLeft className={`w-5 h-5 transition-transform ${collapsed ? "rotate-180" : ""}`} />
            </button>
          </div>

          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-primary/20 to-secondary/20 text-white border border-primary/30"
                      : "text-dark-muted hover:text-white hover:bg-dark-border"
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                </Link>
              )
            })}
          </nav>

          <div className="p-3 border-t border-dark-border">
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-dark-muted hover:text-white hover:bg-dark-border transition-all duration-200 mb-1"
              title="View Portfolio"
            >
              <Settings className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="text-sm font-medium">View Site</span>}
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-dark-muted hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 w-full"
              title="Logout"
            >
              <LogOut className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="text-sm font-medium">Logout</span>}
            </button>
          </div>
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
            <div className="p-4 flex items-center justify-between border-b border-dark-border">
              <Link href="/dashboard" className="text-xl font-bold gradient-text">
                Dashboard
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg hover:bg-dark-border transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-primary/20 to-secondary/20 text-white border border-primary/30"
                        : "text-dark-muted hover:text-white hover:bg-dark-border"
                    }`}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            <div className="p-3 border-t border-dark-border">
              <Link
                href="/"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-dark-muted hover:text-white hover:bg-dark-border transition-all duration-200 mb-1"
              >
                <Settings className="w-5 h-5 shrink-0" />
                <span className="text-sm font-medium">View Site</span>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-dark-muted hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 w-full"
              >
                <LogOut className="w-5 h-5 shrink-0" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </aside>
        </>
      )}
    </>
  )
}
