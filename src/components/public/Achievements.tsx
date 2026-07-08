"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Award, Trophy, GitMerge, Zap, Star } from "lucide-react"
import type { AchievementType, SectionLayoutType } from "@/types"

const iconMap: Record<string, React.ElementType> = {
  Trophy, GitMerge, Zap, Star, Award,
}

export default function Achievements() {
  const [achievements, setAchievements] = useState<AchievementType[]>([])
  const [layout, setLayout] = useState<SectionLayoutType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [achRes, layoutRes] = await Promise.all([
          fetch("/api/public/achievements"),
          fetch("/api/public/layout"),
        ])
        if (achRes.ok) {
          const data = await achRes.json()
          setAchievements(data)
        }
        if (layoutRes.ok) {
          const layouts = await layoutRes.json()
          setLayout(layouts.find((l: SectionLayoutType) => l.section === "achievements") || null)
        }
      } catch {} finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading || !layout?.visible) return null

  return (
    <section id="achievements" className="py-24 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark-card border border-dark-border mb-4">
            <Award className="w-4 h-4 text-primary" />
            <span className="text-sm text-dark-muted">Achievements</span>
          </div>
          <h2 className="text-4xl font-bold">Achievements & Awards</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {achievements.map((achievement, index) => {
            const Icon = iconMap[achievement.icon] || Award
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-6 rounded-xl bg-dark-card border border-dark-border card-hover"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 shrink-0">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{achievement.title}</h3>
                    {achievement.description && (
                      <p className="text-dark-muted text-sm mb-2">{achievement.description}</p>
                    )}
                    {achievement.date && (
                      <span className="text-xs text-dark-muted">{achievement.date}</span>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
