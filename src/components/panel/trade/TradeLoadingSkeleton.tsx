'use client'

import { Skeleton } from '@/components/ui'

export default function TradeLoadingSkeleton() {
  return (
    <div className="p-4 space-y-4">
      {/* PriceSummaryCard skeleton */}
      <div className="rounded-xl border border-slate-100 bg-white p-4 space-y-3">
        <Skeleton height={16} width="40%" />
        <Skeleton height={28} width="60%" />
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="space-y-1">
            <Skeleton height={12} width="50%" />
            <Skeleton height={18} width="70%" />
          </div>
          <div className="space-y-1">
            <Skeleton height={12} width="50%" />
            <Skeleton height={18} width="70%" />
          </div>
        </div>
      </div>

      {/* VolumeCard skeleton */}
      <div className="rounded-xl border border-slate-100 bg-white p-4 space-y-2">
        <Skeleton height={14} width="30%" />
        <div className="flex items-center gap-2">
          <Skeleton height={24} width="40%" />
          <Skeleton height={16} width="20%" />
        </div>
      </div>

      {/* TrendChart skeleton */}
      <div className="rounded-xl border border-slate-100 bg-white p-4 space-y-3">
        <Skeleton height={14} width="35%" />
        <Skeleton height={240} className="rounded-lg" />
      </div>
    </div>
  )
}
