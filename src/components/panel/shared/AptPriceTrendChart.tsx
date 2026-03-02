'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { formatPrice } from '@/lib/utils';
import type { MonthlyTrendItem } from '@/types';

interface Props {
  data: MonthlyTrendItem[];
  color?: string;
  label: string;
}

export default function AptPriceTrendChart({ data, color = '#3b82f6', label }: Props) {
  if (data.length === 0) return null;

  const chartData = data.map((d) => ({
    ym: d.ym.slice(2), // "2026-01" → "26-01"
    medianValue: d.medianValue,
    count: d.count,
  }));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 lg:p-5">
      <p className="text-sm font-medium text-slate-500 mb-3">{label}</p>
      <ResponsiveContainer width="100%" height={120}>
        <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
          <XAxis dataKey="ym" tick={{ fontSize: 11 }} />
          <YAxis tickFormatter={(v) => formatPrice(v)} tick={{ fontSize: 11 }} width={60} />
          <Tooltip
            formatter={(value: number) => [formatPrice(value), '중위가']}
            labelFormatter={(label) => `20${label}`}
          />
          <Line
            type="monotone"
            dataKey="medianValue"
            stroke={color}
            strokeWidth={2}
            dot={{ r: 3, fill: color }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
