'use client';

import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { yearMonthToShortLabel, formatPriceShort } from '@/lib/utils';
import type { TrendPoint } from '@/types';

interface Props {
  monthly: TrendPoint[];
}

export default function TrendChart({ monthly }: Props) {
  const data = [...monthly]
    .sort((a, b) => a.ym.localeCompare(b.ym))
    .map((p) => ({
      label: yearMonthToShortLabel(p.ym),
      price: p.tradeMedianPrice,
      volume: p.tradeCount,
    }));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 lg:p-6">
      <p className="text-sm border-b border-transparent font-medium text-slate-500 mb-4 md:text-base md:mb-5">
        매매 트렌드
      </p>
      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            yAxisId="price"
            orientation="left"
            tickFormatter={formatPriceShort}
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
            width={48}
          />
          <YAxis
            yAxisId="volume"
            orientation="right"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
            width={32}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: '1px solid #e2e8f0',
              fontSize: 12,
            }}
            formatter={(value: number, name: string) => {
              if (name === 'price') return [formatPriceShort(value), '중위가'];
              return [`${value}건`, '거래량'];
            }}
          />
          <Bar
            yAxisId="volume"
            dataKey="volume"
            fill="#cbd5e1"
            radius={[3, 3, 0, 0]}
            maxBarSize={24}
          />
          <Line
            yAxisId="price"
            type="monotone"
            dataKey="price"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: '#3b82f6', r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
