'use client'

import { useReport } from '@/hooks/queries'
import { SampleCountBadge } from '@/components/ui'
import TradeLoadingSkeleton from './TradeLoadingSkeleton'
import PriceSummaryCard from './PriceSummaryCard'
import VolumeCard from './VolumeCard'
import TrendChart from './TrendChart'

export default function TradeTab() {
  const { data, isLoading, isError, refetch } = useReport()

  if (isLoading) {
    return <TradeLoadingSkeleton />
  }

  if (isError && !data) {
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

  if (!data) return null

  return (
    <div className="p-4 space-y-4">
      {isError && (
        <div className="flex items-center justify-between gap-2 rounded-lg bg-amber-50 border border-amber-200 px-4 py-2.5">
          <p className="text-xs font-medium text-amber-700">
            데이터가 오래되었습니다. 최신 정보를 불러오는 중 오류가 발생했습니다.
          </p>
          <button
            onClick={() => refetch()}
            className="shrink-0 px-3 py-1 text-xs font-medium text-amber-700 border border-amber-300 rounded-md hover:bg-amber-100 transition-colors"
          >
            다시 시도
          </button>
        </div>
      )}
      <SampleCountBadge sampleCount={data.trade.sampleCount} />
      <PriceSummaryCard trade={data.trade} />
      <VolumeCard trade={data.trade} />
      <TrendChart monthly={data.monthly} />
    </div>
  )
}
