"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { GraduationCap, Calendar } from "lucide-react"
import type { EducationType, SectionLayoutType } from "@/types"

export default function Education() {
  const [education, setEducation] = useState<EducationType[]>([])
  const [layout, setLayout] = useState<SectionLayoutType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [eduRes, layoutRes] = await Promise.all([
          fetch("/api/public/education"),
          fetch("/api/public/layout"),
        ])
        if (eduRes.ok) {
          const data = await eduRes.json()
          setEducation(data)
        }
        if (layoutRes.ok) {
          const layouts = await layoutRes.json()
          setLayout(layouts.find((l: SectionLayoutType) => l.section === "education") || null)
        }
      } catch {} finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading || !layout?.visible) return null

  return (
    <section id="education" className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark-card border border-dark-border mb-4">
            <GraduationCap className="w-4 h-4 text-primary" />
            <span className="text-sm text-dark-muted">Education</span>
          </div>
          <h2 className="text-4xl font-bold">My Education</h2>
        </motion.div>

        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-secondary to-transparent" />

          <div className="space-y-8">
            {education.map((edu, index) => (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-20"
              >
                <div className="absolute left-4 top-6 w-9 h-9 rounded-full bg-dark-card border-2 border-primary flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-primary" />
                </div>

                <div className="p-6 rounded-xl bg-dark-card border border-dark-border card-hover">
                  <div className="flex items-center gap-2 text-sm text-dark-muted mb-3">
                    <Calendar className="w-4 h-4" />
                    <span>{edu.startDate} - {edu.endDate || "Present"}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-1">{edu.degree} in {edu.field}</h3>
                  <p className="text-primary font-medium mb-3">{edu.school}</p>
                  {edu.description && (
                    <p className="text-dark-muted">{edu.description}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
