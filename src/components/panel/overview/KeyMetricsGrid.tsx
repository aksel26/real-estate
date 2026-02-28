'use client'

import { formatPrice, formatVolume, formatPercent } from '@/lib/utils'
import { Badge } from '@/components/ui'
import { JEONSE_RATE_THRESHOLDS } from '@/constants/filter'
import type { NeighborhoodReport } from '@/types'

interface Props {
  report: NeighborhoodReport
}

type Grade = 'danger' | 'warning' | 'safe'

function getJeonseGrade(value: number): { grade: Grade; label: string } {
  if (value >= JEONSE_RATE_THRESHOLDS.danger) return { grade: 'danger', label: '주의' }
  if (value >= JEONSE_RATE_THRESHOLDS.warning) return { grade: 'warning', label: '보통' }
  return { grade: 'safe', label: '양호' }
}

function getTrendArrow(trend: string): { arrow: string; color: string } {
  if (trend === 'up') return { arrow: '▲', color: 'text-red-500' }
  if (trend === 'down') return { arrow: '▼', color: 'text-blue-500' }
  return { arrow: '─', color: 'text-slate-400' }
}

export default function KeyMetricsGrid({ report }: Props) {
  const { trade, rent, jeonseRate, monthly } = report
  const lastMonth = monthly.length > 0
    ? [...monthly].sort((a, b) => b.ym.localeCompare(a.ym))[0]
    : null
  const { grade, label } = getJeonseGrade(jeonseRate.value)
  const { arrow, color } = getTrendArrow(trade.trend)

  return (
    <div className="grid grid-cols-2 gap-3 xl:gap-4">
      {/* 매매 중위가 */}
      <div className="rounded-xl border border-slate-100 bg-white p-3">
        <p className="text-xs text-slate-500">매매 중위가</p>
        <p className="mt-1 text-base font-bold text-slate-900 leading-tight">
          {formatPrice(trade.medianPrice)}
        </p>
        <p className={`mt-0.5 text-xs font-medium ${color}`}>
          {arrow} {trade.trendPercent !== 0 ? `${Math.abs(trade.trendPercent).toFixed(1)}%` : '변동없음'}
        </p>
      </div>

      {/* 전세 보증금 중위 */}
      <div className="rounded-xl border border-slate-100 bg-white p-3">
        <p className="text-xs text-slate-500">전세 보증금 중위</p>
        <p className="mt-1 text-base font-bold text-slate-900 leading-tight">
          {formatPrice(rent.medianDeposit)}
        </p>
        {(() => {
          const { arrow, color } = getTrendArrow(rent.trend)
          return (
            <p className={`mt-0.5 text-xs font-medium ${color}`}>
              {arrow} {rent.trendPercent !== 0 ? `${Math.abs(rent.trendPercent).toFixed(1)}%` : '변동없음'}
            </p>
          )
        })()}
      </div>

      {/* 거래량 */}
      <div className="rounded-xl border border-slate-100 bg-white p-3">
        <p className="text-xs text-slate-500">매매 거래량</p>
        <p className="mt-1 text-base font-bold text-slate-900 leading-tight">
          {lastMonth ? `${lastMonth.tradeCount.toLocaleString('ko-KR')}건` : formatVolume(trade.totalCount)}
        </p>
        <p className="mt-0.5 text-xs text-slate-400">
          {lastMonth ? '최근 월' : '전체 기간'}
        </p>
      </div>

      {/* 전세가율 */}
      <div className="rounded-xl border border-slate-100 bg-white p-3">
        <p className="text-xs text-slate-500">전세가율</p>
        <p className="mt-1 text-base font-bold text-slate-900 leading-tight">
          {formatPercent(jeonseRate.value)}
        </p>
        <div className="mt-0.5">
          <Badge grade={grade} label={label} />
        </div>
      </div>
    </div>
  )
}
