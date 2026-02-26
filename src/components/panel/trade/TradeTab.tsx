'use client'

import { useReport } from '@/hooks/queries'
import TradeLoadingSkeleton from './TradeLoadingSkeleton'
import PriceSummaryCard from './PriceSummaryCard'
import VolumeCard from './VolumeCard'
import TrendChart from './TrendChart'

export default function TradeTab() {
  const { data, isLoading, isError, refetch } = useReport()

  if (isLoading) {
    return <TradeLoadingSkeleton />
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-sm font-semibold text-slate-800">데이터를 불러오지 못했습니다</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 text-xs font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
        >
          다시 시도
        </button>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <PriceSummaryCard trade={data.trade} />
      <VolumeCard trade={data.trade} />
      <TrendChart monthly={data.monthly} />
    </div>
  )
}
