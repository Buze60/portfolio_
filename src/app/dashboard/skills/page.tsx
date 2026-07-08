"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Plus, Pencil, Trash2, Code2 } from "lucide-react"
import type { SkillType } from "@/types"

const iconOptions = ["Code2", "FileJson", "FileType", "Atom", "Globe", "Server", "Terminal", "Database", "Paintbrush", "GitBranch", "Container", "Wrench"]

export default function SkillsPage() {
  const [skills, setSkills] = useState<SkillType[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<SkillType | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: "", icon: "Code2", category: "Frontend", level: 50 })

  async function fetchSkills() {
    try {
      const res = await fetch("/api/admin/skills")
      if (res.ok) setSkills(await res.json())
    } catch {} finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchSkills() }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    const res = editing
      ? await fetch("/api/admin/skills", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, id: editing.id }) })
      : await fetch("/api/admin/skills", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
    if (res.ok) {
      setShowForm(false)
      setEditing(null)
      setForm({ name: "", icon: "Code2", category: "Frontend", level: 50 })
      fetchSkills()
    }
  }

  async function handleDelete(id: string) {
    if (confirm("Delete this skill?")) {
      await fetch("/api/admin/skills", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) })
      fetchSkills()
    }
  }

  function startEdit(skill: SkillType) {
    setEditing(skill)
    setForm({ name: skill.name, icon: skill.icon, category: skill.category, level: skill.level })
    setShowForm(true)
  }

  if (loading) return <div className="text-center py-12 text-dark-muted">Loading...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Skills</h1>
          <p className="text-dark-muted mt-1">Manage your skills and technologies</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditing(null); setForm({ name: "", icon: "Code2", category: "Frontend", level: 50 }) }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5" /> Add Skill
        </button>
      </div>

      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSave}
          className="p-6 rounded-xl bg-dark-card border border-dark-border mb-8 space-y-4"
        >
          <h2 className="text-xl font-semibold mb-4">{editing ? "Edit Skill" : "New Skill"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-dark-bg border border-dark-border focus:border-primary/50 focus:outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-dark-bg border border-dark-border focus:border-primary/50 focus:outline-none">
                {["Frontend", "Backend", "Tools"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Icon</label>
              <select value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-dark-bg border border-dark-border focus:border-primary/50 focus:outline-none">
                {iconOptions.map((icon) => <option key={icon}>{icon}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Level ({form.level}%)</label>
              <input type="range" min={0} max={100} value={form.level} onChange={(e) => setForm({ ...form, level: parseInt(e.target.value) })} className="w-full" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors">{editing ? "Update" : "Create"}</button>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null) }} className="px-4 py-2 rounded-lg bg-dark-border text-dark-muted hover:text-white transition-colors">Cancel</button>
          </div>
        </motion.form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill) => (
          <div key={skill.id} className="p-4 rounded-xl bg-dark-card border border-dark-border flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium">{skill.name}</p>
                <p className="text-sm text-dark-muted">{skill.category} - {skill.level}%</p>
              </div>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => startEdit(skill)} className="p-2 rounded-lg hover:bg-dark-border transition-colors"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(skill.id)} className="p-2 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
