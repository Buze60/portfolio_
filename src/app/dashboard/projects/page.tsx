"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Plus, Pencil, Trash2, Upload, X } from "lucide-react"
import type { ProjectType } from "@/types"

export default function ProjectsPage() {
  const [items, setItems] = useState<ProjectType[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<ProjectType | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: "", description: "", techStack: "", link: "", github: "", image: "" })
  const [uploading, setUploading] = useState(false)

  async function fetchItems() {
    try {
      const res = await fetch("/api/admin/projects")
      if (res.ok) setItems(await res.json())
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { fetchItems() }, [])

  async function handleFileUpload(file: File) {
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd })
      if (res.ok) {
        const { url } = await res.json()
        setForm({ ...form, image: url })
      }
    } catch {} finally { setUploading(false) }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    const body = { title: form.title, description: form.description, image: form.image || null, link: form.link || null, github: form.github || null, techStack: form.techStack }
    const res = editing
      ? await fetch("/api/admin/projects", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...body, id: editing.id }) })
      : await fetch("/api/admin/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
    if (res.ok) { setShowForm(false); setEditing(null); setForm({ title: "", description: "", techStack: "", link: "", github: "", image: "" }); fetchItems() }
    else { const err = await res.json(); alert(err.error || "Failed to save") }
  }

  async function handleDelete(id: string) {
    if (confirm("Delete this project?")) {
      await fetch("/api/admin/projects", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) })
      fetchItems()
    }
  }

  function startEdit(item: ProjectType) {
    setEditing(item)
    setForm({ title: item.title, description: item.description, techStack: item.techStack, link: item.link || "", github: item.github || "", image: item.image || "" })
    setShowForm(true)
  }

  if (loading) return <div className="text-center py-12 text-dark-muted">Loading...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-dark-muted mt-1">Manage your portfolio projects</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm({ title: "", description: "", techStack: "", link: "", github: "", image: "" }) }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-5 h-5" /> Add Project
        </button>
      </div>

      {showForm && (
        <motion.form initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSave}
          className="p-6 rounded-xl bg-dark-card border border-dark-border mb-8 space-y-4">
          <h2 className="text-xl font-semibold mb-4">{editing ? "Edit Project" : "New Project"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Title</label><input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-dark-bg border border-dark-border focus:border-primary/50 focus:outline-none" required /></div>
            <div><label className="block text-sm font-medium mb-1">Tech Stack</label><input type="text" value={form.techStack} onChange={(e) => setForm({ ...form, techStack: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-dark-bg border border-dark-border focus:border-primary/50 focus:outline-none" required placeholder="React, Node.js, PostgreSQL" /></div>
            <div><label className="block text-sm font-medium mb-1">Link</label><input type="url" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-dark-bg border border-dark-border focus:border-primary/50 focus:outline-none" placeholder="https://..." /></div>
            <div><label className="block text-sm font-medium mb-1">GitHub</label><input type="url" value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-dark-bg border border-dark-border focus:border-primary/50 focus:outline-none" placeholder="https://github.com/..." /></div>
          </div>
          <div><label className="block text-sm font-medium mb-1">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-dark-bg border border-dark-border focus:border-primary/50 focus:outline-none resize-none" rows={3} required /></div>
          <div>
            <label className="block text-sm font-medium mb-1">Project Image</label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-bg border border-dark-border cursor-pointer hover:border-primary/50 transition-colors">
                <Upload className="w-4 h-4" />
                <span className="text-sm">{uploading ? "Uploading..." : "Upload image"}</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f) }} />
              </label>
              {form.image && (
                <div className="flex items-center gap-2">
                  <img src={form.image} className="w-10 h-10 rounded object-cover" />
                  <button type="button" onClick={() => setForm({ ...form, image: "" })} className="p-1 hover:text-red-400"><X className="w-4 h-4" /></button>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors">{editing ? "Update" : "Create"}</button>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null) }} className="px-4 py-2 rounded-lg bg-dark-border text-dark-muted hover:text-white transition-colors">Cancel</button>
          </div>
        </motion.form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div key={item.id} className="p-5 rounded-xl bg-dark-card border border-dark-border group">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {item.image && <img src={item.image} className="w-12 h-12 rounded-lg object-cover" />}
                <h3 className="font-semibold text-lg">{item.title}</h3>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => startEdit(item)} className="p-2 rounded-lg hover:bg-dark-border transition-colors"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <p className="text-dark-muted text-sm mb-3">{item.description}</p>
            <div className="flex flex-wrap gap-2">
              {item.techStack.split(",").map((tech) => (
                <span key={tech.trim()} className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary border border-primary/20">{tech.trim()}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
