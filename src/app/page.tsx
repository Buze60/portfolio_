"use client"

import { useEffect, useState } from "react"
import { Camera } from "lucide-react"
import PublicSidebar from "@/components/public/PublicSidebar"
import Hero from "@/components/public/Hero"
import Skills from "@/components/public/Skills"
import Experience from "@/components/public/Experience"
import Education from "@/components/public/Education"
import Projects from "@/components/public/Projects"
import Achievements from "@/components/public/Achievements"
import Contact from "@/components/public/Contact"
import type { ProfileType } from "@/types"

export default function Home() {
  const [activeSection, setActiveSection] = useState("hero")
  const [profile, setProfile] = useState<ProfileType | null>(null)
  const [showPhoto, setShowPhoto] = useState(false)

  useEffect(() => {
    fetch("/api/public/profile")
      .then((r) => r.json())
      .then((data) => setProfile(data))
      .catch(() => {})
  }, [])

  const sections = [
    { key: "hero", component: <Hero key="hero" /> },
    { key: "skills", component: <Skills key="skills" /> },
    { key: "experience", component: <Experience key="experience" /> },
    { key: "education", component: <Education key="education" /> },
    { key: "projects", component: <Projects key="projects" /> },
    { key: "achievements", component: <Achievements key="achievements" /> },
    { key: "contact", component: <Contact key="contact" /> },
  ]

  return (
    <div className="h-screen flex overflow-hidden bg-dark-bg">
      <PublicSidebar activeSection={activeSection} setActiveSection={setActiveSection} />

      <main className="flex-1 pl-16 lg:pl-64 h-screen relative">
        <div className="absolute top-6 right-6 z-30 flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-lg font-bold text-white leading-tight">{profile?.name || "Portfolio"}</p>
            <p className="text-sm text-dark-muted">{profile?.title || ""}</p>
          </div>
          <button
            onClick={() => setShowPhoto(true)}
            className="w-16 h-16 rounded-full overflow-hidden border-2 border-dark-border ring-2 ring-primary/30 shrink-0 cursor-pointer hover:ring-primary/60 transition-all"
          >
            {profile?.image ? (
              <img src={profile.image} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
            )}
          </button>
        </div>

        {showPhoto && profile?.image && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setShowPhoto(false)}
          >
            <div className="relative max-w-2xl mx-4" onClick={(e) => e.stopPropagation()}>
              <img src={profile.image} alt={profile.name || ""} className="w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl" />
              <button
                onClick={() => setShowPhoto(false)}
                className="absolute -top-12 right-0 text-white/70 hover:text-white text-lg"
              >
                Close ✕
              </button>
            </div>
          </div>
        )}

        {sections.map((s) => (
          <div
            key={s.key}
            className={`absolute inset-0 overflow-y-auto ${activeSection === s.key ? "block" : "hidden"}`}
          >
            {s.component}
          </div>
        ))}
      </main>
    </div>
  )
}
