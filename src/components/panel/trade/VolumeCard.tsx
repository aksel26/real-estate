'use client';

import { formatVolume } from '@/lib/utils';
import type { TradeReport } from '@/types';

interface Props {
  trade: TradeReport;
}

const TREND_ICONS: Record<string, { icon: string; color: string }> = {
  up: { icon: '▲', color: 'text-red-500' },
  down: { icon: '▼', color: 'text-blue-500' },
  flat: { icon: '─', color: 'text-slate-400' },
};

export default function VolumeCard({ trade }: Props) {
  const trend = TREND_ICONS[trade.trend] ?? TREND_ICONS.flat;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 lg:p-6 flex flex-col justify-between">
      <p className="text-sm border-b border-transparent font-medium text-slate-500 md:text-base">
        총 거래량
      </p>
      <div className="mt-3 flex items-baseline gap-2.5 md:mt-4">
        <span className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
          {formatVolume(trade.totalCount)}
        </span>
        <span className={`text-sm font-bold ${trend.color} flex items-center`}>
          {trend.icon}{' '}
          {trade.trendPercent !== 0 && (
            <span className="ml-1">{Math.abs(trade.trendPercent).toFixed(1)}%</span>
          )}
        </span>
      </div>
      <p className="mt-1.5 text-xs text-slate-400 font-medium">전월 대비</p>
    </div>
  );
}
