"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { GitBranch, Link, MessageCircle, Globe } from "lucide-react"
import type { ProfileType, SectionLayoutType } from "@/types"

export default function Hero() {
  const [profile, setProfile] = useState<ProfileType | null>(null)
  const [layout, setLayout] = useState<SectionLayoutType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [profileRes, layoutRes] = await Promise.all([
          fetch("/api/public/profile"),
          fetch("/api/public/layout"),
        ])
        if (profileRes.ok) {
          const data = await profileRes.json()
          setProfile(data)
        }
        if (layoutRes.ok) {
          const layouts = await layoutRes.json()
          const heroLayout = layouts.find((l: SectionLayoutType) => l.section === "hero")
          setLayout(heroLayout || null)
        }
      } catch {} finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading || !profile || !layout?.visible) return null

  const socialLinks = [
    { href: profile.socialGithub, icon: GitBranch, label: "GitHub" },
    { href: profile.socialLinkedin, icon: Link, label: "LinkedIn" },
    { href: profile.socialTwitter, icon: MessageCircle, label: "Twitter" },
    { href: profile.socialWebsite, icon: Globe, label: "Website" },
  ].filter((s) => s.href)

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[128px]" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark-card border border-dark-border mb-8">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-dark-muted">Available for opportunities</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold mb-6"
        >
          Hi, I&apos;m{" "}
          <span className="gradient-text">{profile.name || "Your Name"}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xl md:text-2xl text-dark-muted mb-4"
        >
          {profile.title || "Full Stack Developer"}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-dark-muted max-w-2xl mx-auto mb-8 text-lg"
        >
          {profile.about || ""}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex items-center justify-center gap-4"
        >
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href!}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-dark-card border border-dark-border hover:border-primary/50 transition-all duration-300 hover:glow"
            >
              <link.icon className="w-5 h-5" />
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
