'use client'

import { useReport } from '@/hooks/queries'
import { Skeleton } from '@/components/ui'
import KeyMetricsGrid from './KeyMetricsGrid'
import MiniTrendChart from './MiniTrendChart'

function OverviewLoadingSkeleton() {
  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-slate-100 bg-white p-3 space-y-2">
            <Skeleton height={12} width="50%" />
            <Skeleton height={20} width="70%" />
            <Skeleton height={12} width="40%" />
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-slate-100 bg-white p-4 space-y-2">
        <Skeleton height={12} width="40%" />
        <Skeleton height={48} />
      </div>
    </div>
  )
}

export default function OverviewTab() {
  const { data, isLoading, isError, refetch } = useReport()

  if (isLoading) {
    return <OverviewLoadingSkeleton />
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
      <KeyMetricsGrid report={data} />

      {data.monthly.length > 0 && (
        <div className="rounded-xl border border-slate-100 bg-white p-4">
          <p className="text-xs font-medium text-slate-500 mb-2">매매가 추이</p>
          <MiniTrendChart monthly={data.monthly} dataKey="tradeMedianPrice" color="#3b82f6" />
        </div>
      )}

      {data.monthly.length > 0 && (
        <div className="rounded-xl border border-slate-100 bg-white p-4">
          <p className="text-xs font-medium text-slate-500 mb-2">전세 보증금 추이</p>
          <MiniTrendChart monthly={data.monthly} dataKey="rentMedianDeposit" color="#8b5cf6" />
        </div>
      )}
    </div>
  )
}
