"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Code2, Server, Wrench } from "lucide-react"
import type { SkillType, SectionLayoutType } from "@/types"

const categoryIcons: Record<string, React.ElementType> = {
  Frontend: Code2,
  Backend: Server,
  Tools: Wrench,
}

const categoryColors: Record<string, string> = {
  Frontend: "from-blue-500 to-cyan-500",
  Backend: "from-green-500 to-emerald-500",
  Tools: "from-purple-500 to-pink-500",
}

export default function Skills() {
  const [skills, setSkills] = useState<SkillType[]>([])
  const [layout, setLayout] = useState<SectionLayoutType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [skillsRes, layoutRes] = await Promise.all([
          fetch("/api/public/skills"),
          fetch("/api/public/layout"),
        ])
        if (skillsRes.ok) {
          const data = await skillsRes.json()
          setSkills(data)
        }
        if (layoutRes.ok) {
          const layouts = await layoutRes.json()
          setLayout(layouts.find((l: SectionLayoutType) => l.section === "skills") || null)
        }
      } catch {} finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading || !layout?.visible) return null

  const categories = [...new Set(skills.map((s) => s.category))]

  return (
    <section id="skills" className="py-24 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark-card border border-dark-border mb-4">
            <Code2 className="w-4 h-4 text-primary" />
            <span className="text-sm text-dark-muted">Skills & Technologies</span>
          </div>
          <h2 className="text-4xl font-bold">What I Know</h2>
        </motion.div>

        <div className="space-y-12">
          {categories.map((category) => {
            const Icon = categoryIcons[category] || Code2
            const gradient = categoryColors[category] || "from-primary to-secondary"
            const categorySkills = skills.filter((s) => s.category === category)

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-2.5 rounded-lg bg-gradient-to-br ${gradient}`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">{category}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categorySkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="group p-4 rounded-xl bg-dark-card border border-dark-border card-hover"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-sm text-dark-muted">{skill.level}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-dark-border overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
