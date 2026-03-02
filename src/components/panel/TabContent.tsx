'use client'

import { useUIStore } from '@/stores'
import TradeTab from './trade/TradeTab'
import OverviewTab from './overview/OverviewTab'
import { LeasePanel } from './lease'

export default function TabContent() {
  const activeTab = useUIStore((s) => s.activeTab)

  return (
    <div className="flex-1 overflow-y-auto min-h-0">
      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'lease' && <LeasePanel />}
      {activeTab === 'trade' && <TradeTab />}
    </div>
  )
}
