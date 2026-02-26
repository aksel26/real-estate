'use client'

import { Skeleton } from '@/components/ui'

export default function RentLoadingSkeleton() {
  return (
    <div className="p-4 space-y-4">
      {/* JeonseRatioBadge skeleton */}
      <div className="rounded-xl border border-slate-100 bg-white p-4 space-y-2">
        <Skeleton height={14} width="25%" />
        <div className="flex items-center gap-3">
          <Skeleton height={36} width="30%" />
          <Skeleton height={24} width="20%" rounded />
        </div>
      </div>

      {/* DepositSummaryCard skeleton */}
      <div className="rounded-xl border border-slate-100 bg-white p-4 space-y-3">
        <Skeleton height={16} width="40%" />
        <Skeleton height={28} width="60%" />
      </div>

      {/* MonthlyRentCard skeleton */}
      <div className="rounded-xl border border-slate-100 bg-white p-4 space-y-2">
        <Skeleton height={14} width="20%" />
        <Skeleton height={24} width="70%" />
        <div className="flex gap-3">
          <Skeleton height={12} width="20%" />
          <Skeleton height={12} width="20%" />
        </div>
      </div>

      {/* RentTrendChart skeleton */}
      <div className="rounded-xl border border-slate-100 bg-white p-4 space-y-3">
        <Skeleton height={14} width="35%" />
        <Skeleton height={200} className="rounded-lg" />
      </div>
    </div>
  )
}
