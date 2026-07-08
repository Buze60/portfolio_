"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Plus, Pencil, Trash2 } from "lucide-react"
import type { AchievementType } from "@/types"

const iconOptions = ["Award", "Trophy", "GitMerge", "Zap", "Star"]

export default function AchievementsPage() {
  const [items, setItems] = useState<AchievementType[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<AchievementType | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: "", description: "", date: "", icon: "Award" })

  async function fetchItems() {
    try {
      const res = await fetch("/api/admin/achievements")
      if (res.ok) setItems(await res.json())
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { fetchItems() }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    const data = { ...form, description: form.description || null, date: form.date || null }
    const res = editing
      ? await fetch("/api/admin/achievements", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, id: editing.id }) })
      : await fetch("/api/admin/achievements", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
    if (res.ok) { setShowForm(false); setEditing(null); setForm({ title: "", description: "", date: "", icon: "Award" }); fetchItems() }
  }

  async function handleDelete(id: string) {
    if (confirm("Delete this achievement?")) {
      await fetch("/api/admin/achievements", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) })
      fetchItems()
    }
  }

  function startEdit(item: AchievementType) {
    setEditing(item)
    setForm({ title: item.title, description: item.description || "", date: item.date || "", icon: item.icon })
    setShowForm(true)
  }

  if (loading) return <div className="text-center py-12 text-dark-muted">Loading...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Achievements</h1>
          <p className="text-dark-muted mt-1">Manage your achievements and awards</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm({ title: "", description: "", date: "", icon: "Award" }) }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-5 h-5" /> Add Achievement
        </button>
      </div>

      {showForm && (
        <motion.form initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSave}
          className="p-6 rounded-xl bg-dark-card border border-dark-border mb-8 space-y-4">
          <h2 className="text-xl font-semibold mb-4">{editing ? "Edit Achievement" : "New Achievement"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Title</label><input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-dark-bg border border-dark-border focus:border-primary/50 focus:outline-none" required /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1">Date</label><input type="text" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-dark-bg border border-dark-border focus:border-primary/50 focus:outline-none" placeholder="2024" /></div>
              <div><label className="block text-sm font-medium mb-1">Icon</label><select value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-dark-bg border border-dark-border focus:border-primary/50 focus:outline-none">
                {iconOptions.map((icon) => <option key={icon}>{icon}</option>)}
              </select></div>
            </div>
          </div>
          <div><label className="block text-sm font-medium mb-1">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-dark-bg border border-dark-border focus:border-primary/50 focus:outline-none resize-none" rows={3} /></div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors">{editing ? "Update" : "Create"}</button>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null) }} className="px-4 py-2 rounded-lg bg-dark-border text-dark-muted hover:text-white transition-colors">Cancel</button>
          </div>
        </motion.form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div key={item.id} className="p-5 rounded-xl bg-dark-card border border-dark-border group">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 shrink-0">
                  <span className="text-white font-bold text-sm">🏆</span>
                </div>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  {item.description && <p className="text-dark-muted text-sm mt-1">{item.description}</p>}
                  {item.date && <span className="text-xs text-dark-muted mt-1 block">{item.date}</span>}
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-4">
                <button onClick={() => startEdit(item)} className="p-2 rounded-lg hover:bg-dark-border transition-colors"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
