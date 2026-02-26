'use client'

import { formatVolume } from '@/lib/utils'
import type { TradeReport } from '@/types'

interface Props {
  trade: TradeReport
}

const TREND_ICONS: Record<string, { icon: string; color: string }> = {
  up: { icon: '▲', color: 'text-red-500' },
  down: { icon: '▼', color: 'text-blue-500' },
  flat: { icon: '─', color: 'text-slate-400' },
}

export default function VolumeCard({ trade }: Props) {
  const trend = TREND_ICONS[trade.trend] ?? TREND_ICONS.flat

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-4">
      <p className="text-xs font-medium text-slate-500">총 거래량</p>
      <div className="mt-1 flex items-center gap-2">
        <span className="text-xl font-bold text-slate-900">
          {formatVolume(trade.totalCount)}
        </span>
        <span className={`text-sm font-semibold ${trend.color}`}>
          {trend.icon}{' '}
          {trade.trendPercent !== 0 && (
            <span>{Math.abs(trade.trendPercent).toFixed(1)}%</span>
          )}
        </span>
      </div>
      <p className="mt-1 text-xs text-slate-400">전월 대비</p>
    </div>
  )
}
