'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useUIStore } from '@/stores'
import TradeTab from './trade/TradeTab'
import RentTab from './rent/RentTab'
import OverviewTab from './overview/OverviewTab'

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
          {activeTab === 'trade' && <TradeTab />}
          {activeTab === 'rent' && <RentTab />}
          {activeTab === 'overview' && <OverviewTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
