'use client'

import { motion } from 'motion/react'
import { useUIStore } from '@/stores'
import type { ReportTab } from '@/stores'

const TABS: { id: ReportTab; label: string }[] = [
  { id: 'trade', label: '매매' },
  { id: 'rent', label: '전월세' },
  { id: 'overview', label: '요약' },
]

export default function TabNavigation() {
  const activeTab = useUIStore((s) => s.activeTab)
  const setActiveTab = useUIStore((s) => s.setActiveTab)

  return (
    <div className="flex border-b border-slate-200 px-4">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className="relative px-4 py-3 text-sm font-medium transition-colors focus:outline-none"
          style={{ color: activeTab === tab.id ? '#3b82f6' : '#64748b' }}
        >
          {tab.label}
          {activeTab === tab.id && (
            <motion.div
              layoutId="tab-indicator"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full"
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            />
          )}
        </button>
      ))}
    </div>
  )
}
