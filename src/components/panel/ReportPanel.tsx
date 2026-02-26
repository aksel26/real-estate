'use client'

import { useSelectionStore } from '@/stores'
import { useReport } from '@/hooks/queries'
import TabNavigation from './TabNavigation'
import TabContent from './TabContent'

export default function ReportPanel() {
  const selectedRegionName = useSelectionStore((s) => s.selectedRegionName)
  const { isLoading } = useReport()

  if (!selectedRegionName && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <p className="text-sm text-slate-400">지도에서 지역을 선택하면{'\n'}리포트가 표시됩니다</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div className="px-4 pt-4 pb-0 bg-white border-b border-slate-100">
        <h2 className="text-base font-bold text-slate-900 truncate">
          {selectedRegionName ?? ''}
        </h2>
        <TabNavigation />
      </div>

      {/* Content */}
      <TabContent />
    </div>
  )
}
