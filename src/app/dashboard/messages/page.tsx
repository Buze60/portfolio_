"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Mail, Trash2, CheckCheck } from "lucide-react"
import type { MessageType } from "@/types"

export default function MessagesPage() {
  const [messages, setMessages] = useState<MessageType[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<MessageType | null>(null)

  async function fetchMessages() {
    try {
      const res = await fetch("/api/admin/messages")
      if (res.ok) setMessages(await res.json())
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { fetchMessages() }, [])

  async function toggleRead(id: string, read: boolean) {
    await fetch("/api/admin/messages", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, read: !read }),
    })
    fetchMessages()
  }

  async function handleDelete(id: string) {
    if (confirm("Delete this message?")) {
      await fetch("/api/admin/messages", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      if (selected?.id === id) setSelected(null)
      fetchMessages()
    }
  }

  if (loading) return <div className="text-center py-12 text-dark-muted">Loading...</div>

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-dark-muted mt-1">Messages from your portfolio visitors</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          {messages.length === 0 ? (
            <p className="text-dark-muted text-center py-12">No messages yet.</p>
          ) : (
            messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelected(msg)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selected?.id === msg.id
                    ? "bg-dark-card border-primary/50"
                    : "bg-dark-card border-dark-border hover:border-dark-muted/50"
                } ${!msg.read ? "ring-1 ring-primary/30" : ""}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className={`font-medium ${!msg.read ? "text-white" : "text-dark-muted"}`}>
                      {msg.name}
                    </p>
                    <p className="text-xs text-dark-muted">{msg.email}</p>
                  </div>
                  <span className="text-xs text-dark-muted">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {msg.subject && (
                  <p className="text-sm font-medium mb-1">{msg.subject}</p>
                )}
                <p className="text-sm text-dark-muted line-clamp-2">{msg.message}</p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleRead(msg.id, msg.read) }}
                    className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-colors ${
                      msg.read ? "text-dark-muted hover:text-white" : "text-primary"
                    }`}
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    {msg.read ? "Unread" : "Read"}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(msg.id) }}
                    className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg text-dark-muted hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {selected && (
          <div className="p-6 rounded-xl bg-dark-card border border-dark-border h-fit sticky top-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg">{selected.name}</h3>
                <a href={`mailto:${selected.email}`} className="text-sm text-primary hover:underline">
                  {selected.email}
                </a>
              </div>
              <span className="text-xs text-dark-muted">
                {new Date(selected.createdAt).toLocaleString()}
              </span>
            </div>
            {selected.subject && (
              <p className="font-medium mb-3 text-primary">Subject: {selected.subject}</p>
            )}
            <p className="text-dark-muted whitespace-pre-wrap leading-relaxed">{selected.message}</p>
          </div>
        )}
      </div>
    </div>
  )
}
