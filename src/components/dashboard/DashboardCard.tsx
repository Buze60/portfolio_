"use client"

import { motion } from "framer-motion"

interface DashboardCardProps {
  title: string
  value: string | number
  icon: React.ElementType
  color: string
}

export default function DashboardCard({ title, value, icon: Icon, color }: DashboardCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-xl bg-dark-card border border-dark-border card-hover"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-dark-muted">{title}</span>
        <div className={`p-3 rounded-lg bg-gradient-to-br ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </motion.div>
  )
}
