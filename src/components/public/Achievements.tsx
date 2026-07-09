"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Award, Trophy, GitMerge, Zap, Star, FileText, X, ExternalLink } from "lucide-react"
import type { AchievementType, SectionLayoutType } from "@/types"

const iconMap: Record<string, React.ElementType> = {
  Trophy, GitMerge, Zap, Star, Award,
}

export default function Achievements() {
  const [achievements, setAchievements] = useState<AchievementType[]>([])
  const [layout, setLayout] = useState<SectionLayoutType | null>(null)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<AchievementType | null>(null)

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
      <div className="max-w-6xl mx-auto relative z-10">
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
            const isPdf = achievement.image?.match(/\.(pdf)$/i)
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelected(achievement)}
                className="group rounded-xl bg-dark-card border border-dark-border card-hover overflow-hidden cursor-pointer"
              >
                {achievement.image ? (
                  <div className="relative aspect-[3/1] overflow-hidden">
                    {isPdf ? (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-500/20 to-orange-500/20">
                        <FileText className="w-16 h-16 text-amber-400" />
                      </div>
                    ) : (
                      <img
                        src={achievement.image}
                        alt={achievement.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-card to-transparent" />
                  </div>
                ) : (
                  <div className="aspect-[3/1] flex items-center justify-center bg-gradient-to-br from-amber-500/10 to-orange-500/10">
                    <Icon className="w-12 h-12 text-amber-400/60" />
                  </div>
                )}

                <div className="p-5">
                  <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">{achievement.title}</h3>
                  {achievement.description && (
                    <p className="text-dark-muted text-sm line-clamp-2">{achievement.description}</p>
                  )}
                  {achievement.date && (
                    <span className="text-xs text-dark-muted mt-2 block">{achievement.date}</span>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setSelected(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-dark-card rounded-2xl border border-dark-border overflow-hidden max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-5 border-b border-dark-border">
              <h3 className="text-xl font-bold">{selected.title}</h3>
              <button onClick={() => setSelected(null)} className="p-2 rounded-lg hover:bg-dark-border transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {selected.image && (
                <div className="rounded-xl overflow-hidden">
                  {selected.image.match(/\.(pdf)$/i) ? (
                    <a href={selected.image} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 rounded-xl bg-dark-bg border border-dark-border hover:border-primary/50 transition-colors">
                      <FileText className="w-8 h-8 text-amber-400" />
                      <div>
                        <p className="font-medium">View Certificate</p>
                        <p className="text-sm text-dark-muted">Open PDF in new tab</p>
                      </div>
                      <ExternalLink className="w-5 h-5 ml-auto text-dark-muted" />
                    </a>
                  ) : (
                    <img src={selected.image} alt={selected.title} className="w-full rounded-xl" />
                  )}
                </div>
              )}

              {selected.description && (
                <p className="text-dark-muted leading-relaxed">{selected.description}</p>
              )}

              {selected.date && (
                <div className="flex items-center gap-2 text-sm text-dark-muted">
                  <span className="px-3 py-1 rounded-full bg-dark-bg border border-dark-border">{selected.date}</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </section>
  )
}
