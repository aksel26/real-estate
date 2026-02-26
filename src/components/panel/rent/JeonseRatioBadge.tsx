'use client'

import { Badge } from '@/components/ui'
import { formatPercent } from '@/lib/utils'
import { JEONSE_RATE_THRESHOLDS } from '@/constants/filter'
import type { PriceStats } from '@/types'

interface Props {
  jeonseRate: PriceStats
}

type Grade = 'danger' | 'warning' | 'safe'

function getGrade(value: number): { grade: Grade; label: string } {
  if (value >= JEONSE_RATE_THRESHOLDS.danger) {
    return { grade: 'danger', label: '주의' }
  }
  if (value >= JEONSE_RATE_THRESHOLDS.warning) {
    return { grade: 'warning', label: '보통' }
  }
  return { grade: 'safe', label: '양호' }
}

export default function JeonseRatioBadge({ jeonseRate }: Props) {
  const { grade, label } = getGrade(jeonseRate.value)

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-4">
      <p className="text-xs font-medium text-slate-500 mb-2">전세가율</p>
      <div className="flex items-center gap-3">
        <span className="text-3xl font-bold text-slate-900">
          {formatPercent(jeonseRate.value)}
        </span>
        <Badge grade={grade} label={label} />
      </div>
      <p className="mt-2 text-xs text-slate-400 leading-relaxed">
        {jeonseRate.description}
      </p>
    </div>
  )
}
