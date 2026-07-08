"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Plus, Pencil, Trash2 } from "lucide-react"
import type { ExperienceType } from "@/types"

export default function ExperiencePage() {
  const [items, setItems] = useState<ExperienceType[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<ExperienceType | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ company: "", role: "", location: "", startDate: "", endDate: "", description: "", current: false })

  async function fetchItems() {
    try {
      const res = await fetch("/api/admin/experience")
      if (res.ok) setItems(await res.json())
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { fetchItems() }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    const data = { ...form, endDate: form.current ? null : (form.endDate || null), location: form.location || null }
    const res = editing
      ? await fetch("/api/admin/experience", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, id: editing.id }) })
      : await fetch("/api/admin/experience", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
    if (res.ok) { setShowForm(false); setEditing(null); setForm({ company: "", role: "", location: "", startDate: "", endDate: "", description: "", current: false }); fetchItems() }
  }

  async function handleDelete(id: string) {
    if (confirm("Delete this experience?")) {
      await fetch("/api/admin/experience", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) })
      fetchItems()
    }
  }

  function startEdit(item: ExperienceType) {
    setEditing(item)
    setForm({ company: item.company, role: item.role, location: item.location || "", startDate: item.startDate, endDate: item.endDate || "", description: item.description || "", current: item.current })
    setShowForm(true)
  }

  if (loading) return <div className="text-center py-12 text-dark-muted">Loading...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Experience</h1>
          <p className="text-dark-muted mt-1">Manage your work experience</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm({ company: "", role: "", location: "", startDate: "", endDate: "", description: "", current: false }) }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-5 h-5" /> Add Experience
        </button>
      </div>

      {showForm && (
        <motion.form initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSave}
          className="p-6 rounded-xl bg-dark-card border border-dark-border mb-8 space-y-4">
          <h2 className="text-xl font-semibold mb-4">{editing ? "Edit Experience" : "New Experience"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Company</label><input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-dark-bg border border-dark-border focus:border-primary/50 focus:outline-none" required /></div>
            <div><label className="block text-sm font-medium mb-1">Role</label><input type="text" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-dark-bg border border-dark-border focus:border-primary/50 focus:outline-none" required /></div>
            <div><label className="block text-sm font-medium mb-1">Location</label><input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-dark-bg border border-dark-border focus:border-primary/50 focus:outline-none" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1">Start</label><input type="text" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-dark-bg border border-dark-border focus:border-primary/50 focus:outline-none" required placeholder="2020" /></div>
              <div><label className="block text-sm font-medium mb-1">End</label><input type="text" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-dark-bg border border-dark-border focus:border-primary/50 focus:outline-none" placeholder="2024" disabled={form.current} /></div>
            </div>
          </div>
          <div><label className="flex items-center gap-2"><input type="checkbox" checked={form.current} onChange={(e) => setForm({ ...form, current: e.target.checked })} className="rounded" /> <span className="text-sm font-medium">I currently work here</span></label></div>
          <div><label className="block text-sm font-medium mb-1">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-dark-bg border border-dark-border focus:border-primary/50 focus:outline-none resize-none" rows={3} /></div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors">{editing ? "Update" : "Create"}</button>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null) }} className="px-4 py-2 rounded-lg bg-dark-border text-dark-muted hover:text-white transition-colors">Cancel</button>
          </div>
        </motion.form>
      )}

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="p-5 rounded-xl bg-dark-card border border-dark-border flex items-start justify-between group">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-semibold text-lg">{item.role}</h3>
                {item.current && <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/10 text-green-400 border border-green-500/20">Current</span>}
              </div>
              <p className="text-primary">{item.company}</p>
              <p className="text-sm text-dark-muted mt-1">{item.startDate} - {item.endDate || "Present"} {item.location ? `| ${item.location}` : ""}</p>
              {item.description && <p className="text-dark-muted mt-2 text-sm">{item.description}</p>}
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-4">
              <button onClick={() => startEdit(item)} className="p-2 rounded-lg hover:bg-dark-border transition-colors"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
