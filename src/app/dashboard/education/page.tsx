"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Plus, Pencil, Trash2 } from "lucide-react"
import type { EducationType } from "@/types"

export default function EducationPage() {
  const [items, setItems] = useState<EducationType[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<EducationType | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ school: "", degree: "", field: "", startDate: "", endDate: "", description: "" })

  async function fetchItems() {
    try {
      const res = await fetch("/api/admin/education")
      if (res.ok) setItems(await res.json())
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { fetchItems() }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    const data = { ...form, endDate: form.endDate || null }
    const res = editing
      ? await fetch("/api/admin/education", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, id: editing.id }) })
      : await fetch("/api/admin/education", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
    if (res.ok) { setShowForm(false); setEditing(null); setForm({ school: "", degree: "", field: "", startDate: "", endDate: "", description: "" }); fetchItems() }
  }

  async function handleDelete(id: string) {
    if (confirm("Delete this education entry?")) {
      await fetch("/api/admin/education", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) })
      fetchItems()
    }
  }

  function startEdit(item: EducationType) {
    setEditing(item)
    setForm({ school: item.school, degree: item.degree, field: item.field, startDate: item.startDate, endDate: item.endDate || "", description: item.description || "" })
    setShowForm(true)
  }

  if (loading) return <div className="text-center py-12 text-dark-muted">Loading...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Education</h1>
          <p className="text-dark-muted mt-1">Manage your education history</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm({ school: "", degree: "", field: "", startDate: "", endDate: "", description: "" }) }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-5 h-5" /> Add Education
        </button>
      </div>

      {showForm && (
        <motion.form initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSave}
          className="p-6 rounded-xl bg-dark-card border border-dark-border mb-8 space-y-4">
          <h2 className="text-xl font-semibold mb-4">{editing ? "Edit Education" : "New Education"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">School</label><input type="text" value={form.school} onChange={(e) => setForm({ ...form, school: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-dark-bg border border-dark-border focus:border-primary/50 focus:outline-none" required /></div>
            <div><label className="block text-sm font-medium mb-1">Degree</label><input type="text" value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-dark-bg border border-dark-border focus:border-primary/50 focus:outline-none" required /></div>
            <div><label className="block text-sm font-medium mb-1">Field</label><input type="text" value={form.field} onChange={(e) => setForm({ ...form, field: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-dark-bg border border-dark-border focus:border-primary/50 focus:outline-none" required /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1">Start</label><input type="text" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-dark-bg border border-dark-border focus:border-primary/50 focus:outline-none" required placeholder="2020" /></div>
              <div><label className="block text-sm font-medium mb-1">End</label><input type="text" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-dark-bg border border-dark-border focus:border-primary/50 focus:outline-none" placeholder="2024 or empty" /></div>
            </div>
          </div>
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
            <div>
              <h3 className="font-semibold text-lg">{item.degree} in {item.field}</h3>
              <p className="text-primary">{item.school}</p>
              <p className="text-sm text-dark-muted mt-1">{item.startDate} - {item.endDate || "Present"}</p>
              {item.description && <p className="text-dark-muted mt-2 text-sm">{item.description}</p>}
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              <button onClick={() => startEdit(item)} className="p-2 rounded-lg hover:bg-dark-border transition-colors"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
