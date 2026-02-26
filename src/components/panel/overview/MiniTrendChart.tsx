'use client'

import { LineChart, Line, ResponsiveContainer } from 'recharts'
import type { TrendPoint } from '@/types'

interface Props {
  monthly: TrendPoint[]
  dataKey: 'tradeMedianPrice' | 'rentMedianDeposit'
  color?: string
}

export default function MiniTrendChart({ monthly, dataKey, color = '#3b82f6' }: Props) {
  const data = [...monthly]
    .sort((a, b) => a.ym.localeCompare(b.ym))
    .map((p) => ({ value: p[dataKey] }))

  return (
    <ResponsiveContainer width="100%" height={48}>
      <LineChart data={data} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
