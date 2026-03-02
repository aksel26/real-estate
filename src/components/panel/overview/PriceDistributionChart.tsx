'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ErrorBar } from 'recharts';
import { usePriceDistribution } from '@/hooks';
import { formatPrice } from '@/lib/utils';
import { Skeleton } from '@/components/ui';

type Mode = 'trade' | 'rent';

export default function PriceDistributionChart() {
  const { distribution, isLoading } = usePriceDistribution();
  const [mode, setMode] = useState<Mode>('trade');

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 lg:p-6 space-y-3">
        <Skeleton height={14} width="40%" />
        <Skeleton height={200} />
      </div>
    );
  }

  if (distribution.length === 0) return null;

  const chartData = distribution
    .filter((d) => (mode === 'trade' ? d.tradeCount > 0 : d.rentCount > 0))
    .map((d) => ({
      bandLabel: d.bandLabel,
      median: mode === 'trade' ? d.tradeMedian : d.rentMedian,
      q1: mode === 'trade' ? d.tradeQ1 : d.rentQ1,
      q3: mode === 'trade' ? d.tradeQ3 : d.rentQ3,
      count: mode === 'trade' ? d.tradeCount : d.rentCount,
      errorLow: mode === 'trade' ? d.tradeMedian - d.tradeQ1 : d.rentMedian - d.rentQ1,
      errorHigh: mode === 'trade' ? d.tradeQ3 - d.tradeMedian : d.rentQ3 - d.rentMedian,
    }));

  if (chartData.length === 0) return null;

  const barColor = mode === 'trade' ? '#3b82f6' : '#8b5cf6';

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 lg:p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-slate-500 md:text-base">평형대별 가격 분포</p>
        <div className="flex gap-1">
          {([
            { id: 'trade' as Mode, label: '매매가' },
            { id: 'rent' as Mode, label: '전세보증금' },
          ]).map((opt) => (
            <button
              key={opt.id}
              onClick={() => setMode(opt.id)}
              className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                mode === opt.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} margin={{ top: 15, right: 10, bottom: 5, left: 10 }}>
          <XAxis dataKey="bandLabel" tick={{ fontSize: 11 }} />
          <YAxis tickFormatter={(v) => formatPrice(v)} tick={{ fontSize: 11 }} width={65} />
          <Tooltip
            formatter={(value: number, name: string) => {
              if (name === 'median') return [formatPrice(value), '중위가'];
              return [formatPrice(value), name];
            }}
            labelFormatter={(label) => {
              const item = chartData.find((d) => d.bandLabel === label);
              return `${label} (${item?.count ?? 0}건)`;
            }}
          />
          <Bar
            dataKey="median"
            fill={barColor}
            radius={[4, 4, 0, 0]}
            barSize={32}
            fillOpacity={0.85}
          >
            <ErrorBar
              dataKey="errorHigh"
              direction="y"
              width={8}
              stroke={barColor}
              strokeWidth={1.5}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
