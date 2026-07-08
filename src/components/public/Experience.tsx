"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Briefcase, Calendar, MapPin } from "lucide-react"
import type { ExperienceType, SectionLayoutType } from "@/types"

export default function Experience() {
  const [experience, setExperience] = useState<ExperienceType[]>([])
  const [layout, setLayout] = useState<SectionLayoutType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [expRes, layoutRes] = await Promise.all([
          fetch("/api/public/experience"),
          fetch("/api/public/layout"),
        ])
        if (expRes.ok) {
          const data = await expRes.json()
          setExperience(data)
        }
        if (layoutRes.ok) {
          const layouts = await layoutRes.json()
          setLayout(layouts.find((l: SectionLayoutType) => l.section === "experience") || null)
        }
      } catch {} finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading || !layout?.visible) return null

  return (
    <section id="experience" className="py-24 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/5 to-transparent" />
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark-card border border-dark-border mb-4">
            <Briefcase className="w-4 h-4 text-primary" />
            <span className="text-sm text-dark-muted">Experience</span>
          </div>
          <h2 className="text-4xl font-bold">Work Experience</h2>
        </motion.div>

        <div className="space-y-6">
          {experience.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-xl bg-dark-card border border-dark-border card-hover"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{exp.role}</h3>
                  <p className="text-primary font-medium">{exp.company}</p>
                </div>
                {exp.current && (
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                    Current
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-dark-muted mb-4">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>{exp.startDate} - {exp.endDate || "Present"}</span>
                </div>
                {exp.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <span>{exp.location}</span>
                  </div>
                )}
              </div>

              {exp.description && (
                <p className="text-dark-muted leading-relaxed">{exp.description}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
