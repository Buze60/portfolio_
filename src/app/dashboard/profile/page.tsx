"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Save, Upload, Loader2 } from "lucide-react"
import type { ProfileType } from "@/types"

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileType | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({
    name: "", title: "", about: "", phone: "", location: "",
    image: "",
    socialGithub: "", socialLinkedin: "", socialTwitter: "", socialWebsite: "",
  })

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const body = new FormData()
      body.append("file", file)
      const uploadRes = await fetch("/api/admin/upload", { method: "POST", body })
      if (uploadRes.ok) {
        const { url } = await uploadRes.json()
        const updatedForm = { ...form, image: url }
        const saveRes = await fetch("/api/admin/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedForm),
        })
        if (saveRes.ok) {
          setForm(updatedForm)
          setSaved(true)
          setTimeout(() => setSaved(false), 3000)
        }
      }
    } catch {} finally {
      setUploading(false)
    }
  }

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/admin/profile")
        if (res.ok) {
          const data = await res.json()
          setProfile(data)
          setForm({
            name: data.name || "",
            title: data.title || "",
            about: data.about || "",
            phone: data.phone || "",
            location: data.location || "",
            image: data.image || "",
            socialGithub: data.socialGithub || "",
            socialLinkedin: data.socialLinkedin || "",
            socialTwitter: data.socialTwitter || "",
            socialWebsite: data.socialWebsite || "",
          })
        }
      } catch {} finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    try {
      await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {} finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-center py-12 text-dark-muted">Loading...</div>

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-dark-muted mt-1">Edit your personal information and social links</p>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="max-w-3xl space-y-8"
      >
        <div className="p-6 rounded-xl bg-dark-card border border-dark-border space-y-4">
          <h2 className="text-xl font-semibold">Personal Information</h2>

          <div className="flex items-center gap-6 mb-4">
            <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
              className="relative w-24 h-24 rounded-full overflow-hidden bg-dark-bg border-2 border-dark-border shrink-0 cursor-pointer hover:border-primary/50 transition-colors group">
              {uploading ? (
                <div className="w-full h-full flex items-center justify-center text-dark-muted">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : form.image ? (
                <img src={form.image} alt="Profile" className="w-full h-full object-cover group-hover:opacity-75 transition-opacity" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-dark-muted">
                  <Upload className="w-8 h-8" />
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                <Upload className="w-6 h-6 text-white" />
              </div>
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Profile Photo</label>
              <p className="text-sm text-dark-muted">Click the avatar to upload a new photo</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-dark-bg border border-dark-border focus:border-primary/50 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-dark-bg border border-dark-border focus:border-primary/50 focus:outline-none" placeholder="Full Stack Developer" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-dark-bg border border-dark-border focus:border-primary/50 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-dark-bg border border-dark-border focus:border-primary/50 focus:outline-none" placeholder="San Francisco, CA" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">About</label>
            <textarea value={form.about} onChange={(e) => setForm({ ...form, about: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-dark-bg border border-dark-border focus:border-primary/50 focus:outline-none resize-none" rows={4} />
          </div>
        </div>

        <div className="p-6 rounded-xl bg-dark-card border border-dark-border space-y-4">
          <h2 className="text-xl font-semibold">Social Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">GitHub</label>
              <input type="url" value={form.socialGithub} onChange={(e) => setForm({ ...form, socialGithub: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-dark-bg border border-dark-border focus:border-primary/50 focus:outline-none" placeholder="https://github.com/..." />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">LinkedIn</label>
              <input type="url" value={form.socialLinkedin} onChange={(e) => setForm({ ...form, socialLinkedin: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-dark-bg border border-dark-border focus:border-primary/50 focus:outline-none" placeholder="https://linkedin.com/..." />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Twitter</label>
              <input type="url" value={form.socialTwitter} onChange={(e) => setForm({ ...form, socialTwitter: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-dark-bg border border-dark-border focus:border-primary/50 focus:outline-none" placeholder="https://twitter.com/..." />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Website</label>
              <input type="url" value={form.socialWebsite} onChange={(e) => setForm({ ...form, socialWebsite: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-dark-bg border border-dark-border focus:border-primary/50 focus:outline-none" placeholder="https://..." />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
            <Save className="w-5 h-5" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
          {saved && (
            <span className="text-green-400 text-sm">Profile updated!</span>
          )}
        </div>
      </motion.form>
    </div>
  )
}
