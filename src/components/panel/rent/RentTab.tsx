'use client'

import { useReport } from '@/hooks/queries'
import RentLoadingSkeleton from './RentLoadingSkeleton'
import JeonseRatioBadge from './JeonseRatioBadge'
import DepositSummaryCard from './DepositSummaryCard'
import MonthlyRentCard from './MonthlyRentCard'
import RentTrendChart from './RentTrendChart'

export default function RentTab() {
  const { data, isLoading, isError, refetch } = useReport()

  if (isLoading) {
    return <RentLoadingSkeleton />
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
      <JeonseRatioBadge jeonseRate={data.jeonseRate} />
      <DepositSummaryCard rent={data.rent} />
      <MonthlyRentCard rent={data.rent} />
      <RentTrendChart monthly={data.monthly} />
    </div>
  )
}
