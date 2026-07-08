"use client"

import { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { GripVertical, Eye, EyeOff, Save } from "lucide-react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import DragDropWrapper from "@/components/dashboard/DragDropWrapper"
import type { SectionLayoutType } from "@/types"

const iconOptions = [
  "User", "Code2", "Briefcase", "GraduationCap", "FolderGit2", "Award", "Mail",
]

function SortableSection({
  section,
  onToggleVisibility,
  onIconChange,
  onTitleChange,
}: {
  section: SectionLayoutType
  onToggleVisibility: (id: string) => void
  onIconChange: (id: string, icon: string) => void
  onTitleChange: (id: string, title: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className={`p-5 rounded-xl bg-dark-card border ${isDragging ? "border-primary" : "border-dark-border"} transition-all`}>
      <div className="flex items-center gap-4">
        <button {...attributes} {...listeners} className="p-1.5 rounded-lg hover:bg-dark-border transition-colors cursor-grab active:cursor-grabbing">
          <GripVertical className="w-5 h-5 text-dark-muted" />
        </button>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div>
            <label className="block text-xs text-dark-muted mb-1">Section Title</label>
            <input
              type="text"
              value={section.title}
              onChange={(e) => onTitleChange(section.id, e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-dark-bg border border-dark-border focus:border-primary/50 focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-xs text-dark-muted mb-1">Icon</label>
            <select
              value={section.icon}
              onChange={(e) => onIconChange(section.id, e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-dark-bg border border-dark-border focus:border-primary/50 focus:outline-none text-sm"
            >
              {iconOptions.map((icon) => (
                <option key={icon} value={icon}>{icon}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-3">
            <span className="text-xs text-dark-muted">Position: {section.order + 1}</span>
            <button
              onClick={() => onToggleVisibility(section.id)}
              className={`p-2 rounded-lg transition-colors ${
                section.visible
                  ? "bg-primary/10 text-primary hover:bg-primary/20"
                  : "bg-dark-border text-dark-muted hover:text-white"
              }`}
              title={section.visible ? "Hide section" : "Show section"}
            >
              {section.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LayoutEditorPage() {
  const [sections, setSections] = useState<SectionLayoutType[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [changed, setChanged] = useState(false)
  const [previewProfile, setPreviewProfile] = useState<any>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [layoutRes, profileRes] = await Promise.all([
          fetch("/api/admin/layout"),
          fetch("/api/admin/profile"),
        ])
        if (layoutRes.ok) setSections(await layoutRes.json())
        if (profileRes.ok) setPreviewProfile(await profileRes.json())
      } catch {} finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleReorder = useCallback((updated: { id: string; order: number }[]) => {
    setSections((prev) =>
      prev.map((s) => {
        const match = updated.find((u) => u.id === s.id)
        return match ? { ...s, order: match.order } : s
      })
    )
    setChanged(true)
  }, [])

  const handleToggleVisibility = useCallback(async (id: string) => {
    const section = sections.find((s) => s.id === id)
    if (!section) return
    const updated = { ...section, visible: !section.visible }
    setSections((prev) => prev.map((s) => (s.id === id ? updated : s)))

    await fetch("/api/admin/layout", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, visible: !section.visible }),
    })
  }, [sections])

  const handleIconChange = useCallback(async (id: string, icon: string) => {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, icon } : s)))
    await fetch("/api/admin/layout", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, icon }),
    })
  }, [])

  const handleTitleChange = useCallback(async (id: string, title: string) => {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, title } : s)))
    await fetch("/api/admin/layout", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, title }),
    })
  }, [])

  async function saveOrder() {
    setSaving(true)
    try {
      await fetch("/api/admin/layout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ layouts: sections.map((s) => ({ id: s.id, order: s.order })) }),
      })
      setChanged(false)
    } catch {} finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-center py-12 text-dark-muted">Loading...</div>

  const sortedSections = [...sections].sort((a, b) => a.order - b.order)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Layout Editor</h1>
          <p className="text-dark-muted mt-1">
            Drag to reorder sections, toggle visibility, change icons & titles
          </p>
        </div>
        <button
          onClick={saveOrder}
          disabled={!changed || saving}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
            changed
              ? "bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90"
              : "bg-dark-border text-dark-muted cursor-not-allowed"
          }`}
        >
          <Save className="w-5 h-5" />
          {saving ? "Saving..." : "Save Order"}
        </button>
      </div>

      <div className="space-y-3 mb-12">
        <DragDropWrapper items={sortedSections} onReorder={handleReorder}>
          {sortedSections.map((section) => (
            <SortableSection
              key={section.id}
              section={section}
              onToggleVisibility={handleToggleVisibility}
              onIconChange={handleIconChange}
              onTitleChange={handleTitleChange}
            />
          ))}
        </DragDropWrapper>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-xl bg-dark-card border border-dark-border"
      >
        <h2 className="text-xl font-semibold mb-4">Layout Preview</h2>
        <p className="text-sm text-dark-muted mb-4">
          This shows the order sections will appear on your portfolio:
        </p>
        <div className="flex flex-wrap gap-2">
          {sortedSections
            .filter((s) => s.visible)
            .map((section, index) => (
              <div
                key={section.id}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-bg border border-dark-border"
              >
                <span className="text-xs text-dark-muted">{index + 1}.</span>
                <span className="text-sm font-medium">{section.title}</span>
                <span className="text-xs text-dark-muted">({section.icon})</span>
              </div>
            ))}
        </div>
      </motion.div>
    </div>
  )
}
