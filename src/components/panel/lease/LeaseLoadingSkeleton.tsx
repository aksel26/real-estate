'use client';

import { Skeleton } from '@/components/ui';

export default function LeaseLoadingSkeleton() {
  return (
    <div className="p-4 space-y-4">
      {/* AreaBandChips skeleton */}
      <div className="flex gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} height={28} width={i === 0 ? 48 : 64} rounded />
        ))}
      </div>

      {/* AreaBandSummary skeleton */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 space-y-3">
        <Skeleton height={14} width="25%" />
        <Skeleton height={36} width="45%" />
        <div className="flex gap-2">
          <Skeleton height={24} width="22%" rounded />
          <Skeleton height={24} width="22%" rounded />
        </div>
      </div>

      {/* AptRankList header skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton height={16} width="30%" />
        <Skeleton height={28} width="25%" rounded />
      </div>

      {/* AptRankCard skeletons */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-slate-100 bg-white p-4 space-y-2">
          <div className="flex items-center gap-3">
            <Skeleton height={28} width={28} rounded />
            <Skeleton height={18} width="40%" />
          </div>
          <div className="flex gap-4 mt-2">
            <Skeleton height={14} width="25%" />
            <Skeleton height={14} width="25%" />
          </div>
          <Skeleton height={14} width="35%" />
        </div>
      ))}
    </div>
  );
}
