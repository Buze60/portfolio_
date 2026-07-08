"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { FolderGit2, ExternalLink, GitBranch } from "lucide-react"
import type { ProjectType, SectionLayoutType } from "@/types"

export default function Projects() {
  const [projects, setProjects] = useState<ProjectType[]>([])
  const [layout, setLayout] = useState<SectionLayoutType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [projRes, layoutRes] = await Promise.all([
          fetch("/api/public/projects"),
          fetch("/api/public/layout"),
        ])
        if (projRes.ok) {
          const data = await projRes.json()
          setProjects(data)
        }
        if (layoutRes.ok) {
          const layouts = await layoutRes.json()
          setLayout(layouts.find((l: SectionLayoutType) => l.section === "projects") || null)
        }
      } catch {} finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading || !layout?.visible) return null

  return (
    <section id="projects" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark-card border border-dark-border mb-4">
            <FolderGit2 className="w-4 h-4 text-primary" />
            <span className="text-sm text-dark-muted">Projects</span>
          </div>
          <h2 className="text-4xl font-bold">Featured Projects</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-6 rounded-xl bg-dark-card border border-dark-border card-hover flex flex-col"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
                <FolderGit2 className="w-6 h-6 text-white" />
              </div>

              <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
              <p className="text-dark-muted text-sm mb-4 flex-1">{project.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {project.techStack.split(",").map((tech) => (
                  <span
                    key={tech.trim()}
                    className="px-2.5 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20"
                  >
                    {tech.trim()}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-dark-border">
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-dark-muted hover:text-primary transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Live
                  </a>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-dark-muted hover:text-primary transition-colors"
                  >
                    <GitBranch className="w-4 h-4" />
                    Code
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
