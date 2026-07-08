"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Code2, GraduationCap, Briefcase, FolderGit2, Award, MessageSquare } from "lucide-react"
import DashboardCard from "@/components/dashboard/DashboardCard"
import Link from "next/link"

export default function Dashboard() {
  const [stats, setStats] = useState({
    skills: 0,
    education: 0,
    experience: 0,
    projects: 0,
    achievements: 0,
    unreadMessages: 0,
  })

  useEffect(() => {
    async function fetchStats() {
      try {
        const endpoints = ["skills", "education", "experience", "projects", "achievements", "messages"]
        const results = await Promise.all(
          endpoints.map((ep) => fetch(`/api/admin/${ep}`).then((r) => r.ok ? r.json() : []))
        )
        setStats({
          skills: results[0].length,
          education: results[1].length,
          experience: results[2].length,
          projects: results[3].length,
          achievements: results[4].length,
          unreadMessages: results[5].filter((m: any) => !m.read).length,
        })
      } catch {}
    }
    fetchStats()
  }, [])

  const cards = [
    { title: "Skills", value: stats.skills, icon: Code2, color: "from-blue-500 to-cyan-500", href: "/dashboard/skills" },
    { title: "Education", value: stats.education, icon: GraduationCap, color: "from-green-500 to-emerald-500", href: "/dashboard/education" },
    { title: "Experience", value: stats.experience, icon: Briefcase, color: "from-purple-500 to-pink-500", href: "/dashboard/experience" },
    { title: "Projects", value: stats.projects, icon: FolderGit2, color: "from-orange-500 to-red-500", href: "/dashboard/projects" },
    { title: "Achievements", value: stats.achievements, icon: Award, color: "from-amber-500 to-yellow-500", href: "/dashboard/achievements" },
    { title: "Unread Messages", value: stats.unreadMessages, icon: MessageSquare, color: "from-rose-500 to-purple-500", href: "/dashboard/messages" },
  ]

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
        <p className="text-dark-muted mb-8">Welcome to your portfolio dashboard. Manage your content here.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <Link key={card.href} href={card.href}>
            <DashboardCard
              title={card.title}
              value={card.value}
              icon={card.icon}
              color={card.color}
            />
          </Link>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 p-6 rounded-xl bg-dark-card border border-dark-border"
      >
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Edit Profile", href: "/dashboard" },
            { label: "Manage Skills", href: "/dashboard/skills" },
            { label: "View Messages", href: "/dashboard/messages" },
            { label: "Customize Layout", href: "/dashboard/layout-editor" },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="p-4 rounded-xl bg-dark-bg border border-dark-border hover:border-primary/50 transition-all text-center text-sm font-medium"
            >
              {action.label}
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
