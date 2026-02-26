'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { yearMonthToShortLabel, formatPriceShort } from '@/lib/utils'
import type { TrendPoint } from '@/types'

interface Props {
  monthly: TrendPoint[]
}

export default function RentTrendChart({ monthly }: Props) {
  const data = [...monthly]
    .sort((a, b) => a.ym.localeCompare(b.ym))
    .map((p) => ({
      label: yearMonthToShortLabel(p.ym),
      deposit: p.rentMedianDeposit,
    }))

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-4">
      <p className="text-xs font-medium text-slate-500 mb-3">전세 보증금 트렌드</p>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={formatPriceShort}
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
            width={48}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: '1px solid #e2e8f0',
              fontSize: 12,
            }}
            formatter={(value: number) => [formatPriceShort(value), '중위 보증금']}
          />
          <Line
            type="monotone"
            dataKey="deposit"
            stroke="#8b5cf6"
            strokeWidth={2}
            dot={{ fill: '#8b5cf6', r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
