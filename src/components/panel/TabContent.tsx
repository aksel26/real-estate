'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useUIStore } from '@/stores'
import TradeTab from './trade/TradeTab'
import OverviewTab from './overview/OverviewTab'
import { LeasePanel } from './lease'

export default function TabContent() {
  const activeTab = useUIStore((s) => s.activeTab)

  return (
    <div className="flex-1 overflow-y-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="h-full"
        >
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'lease' && <LeasePanel />}
          {activeTab === 'trade' && <TradeTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
