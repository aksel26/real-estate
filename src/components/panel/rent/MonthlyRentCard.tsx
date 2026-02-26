'use client'

import { formatPrice } from '@/lib/utils'
import type { RentReport } from '@/types'

interface Props {
  rent: RentReport
}

export default function MonthlyRentCard({ rent }: Props) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-4">
      <p className="text-xs font-medium text-slate-500">월세 현황</p>
      <p className="mt-1 text-lg font-bold text-slate-900">
        보증금 {formatPrice(rent.medianDeposit)}{' '}
        <span className="text-slate-400 font-normal">/</span>{' '}
        월세 {formatPrice(rent.medianMonthly)}
      </p>
      <div className="mt-2 flex gap-3 text-xs text-slate-500">
        <span>전세 {rent.jeonseCount.toLocaleString('ko-KR')}건</span>
        <span>월세 {rent.monthlyCount.toLocaleString('ko-KR')}건</span>
      </div>
    </div>
  )
}
