"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Mail, Send, CheckCircle2 } from "lucide-react"
import type { SectionLayoutType } from "@/types"

export default function Contact() {
  const [layout, setLayout] = useState<SectionLayoutType | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" })
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/public/layout")
        if (res.ok) {
          const layouts = await res.json()
          setLayout(layouts.find((l: SectionLayoutType) => l.section === "contact") || null)
        }
      } catch {} finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("sending")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setStatus("sent")
        setFormData({ name: "", email: "", subject: "", message: "" })
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    }
  }

  if (loading || !layout?.visible) return null

  return (
    <section id="contact" className="py-24 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/5 to-transparent" />
      <div className="max-w-2xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark-card border border-dark-border mb-4">
            <Mail className="w-4 h-4 text-primary" />
            <span className="text-sm text-dark-muted">Get in Touch</span>
          </div>
          <h2 className="text-4xl font-bold">Contact Me</h2>
          <p className="text-dark-muted mt-4">
            Have a project in mind or just want to say hi? Drop me a message!
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-dark-card border border-dark-border focus:border-primary/50 focus:outline-none transition-colors"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-dark-card border border-dark-border focus:border-primary/50 focus:outline-none transition-colors"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Subject</label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-dark-card border border-dark-border focus:border-primary/50 focus:outline-none transition-colors"
              placeholder="What's this about?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Message</label>
            <textarea
              rows={5}
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-dark-card border border-dark-border focus:border-primary/50 focus:outline-none transition-colors resize-none"
              placeholder="Your message..."
            />
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {status === "sending" ? (
              "Sending..."
            ) : status === "sent" ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Message Sent!
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Send Message
              </>
            )}
          </button>

          {status === "error" && (
            <p className="text-red-400 text-sm text-center">Something went wrong. Please try again.</p>
          )}
        </motion.form>
      </div>
    </section>
  )
}
