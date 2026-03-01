'use client';

import { formatPrice, formatVolume, formatPercent } from '@/lib/utils';
import { Badge } from '@/components/ui';
import { JEONSE_RATE_THRESHOLDS } from '@/constants/filter';
import type { NeighborhoodReport } from '@/types';

interface Props {
  report: NeighborhoodReport;
}

type Grade = 'danger' | 'warning' | 'safe';

function getJeonseGrade(value: number): { grade: Grade; label: string } {
  if (value >= JEONSE_RATE_THRESHOLDS.danger) return { grade: 'danger', label: '주의' };
  if (value >= JEONSE_RATE_THRESHOLDS.warning) return { grade: 'warning', label: '보통' };
  return { grade: 'safe', label: '양호' };
}

function getTrendArrow(trend: string): { arrow: string; color: string } {
  if (trend === 'up') return { arrow: '▲', color: 'text-red-500' };
  if (trend === 'down') return { arrow: '▼', color: 'text-blue-500' };
  return { arrow: '─', color: 'text-slate-400' };
}

export default function KeyMetricsGrid({ report }: Props) {
  const { trade, rent, jeonseRate, monthly } = report;
  const lastMonth =
    monthly.length > 0 ? [...monthly].sort((a, b) => b.ym.localeCompare(a.ym))[0] : null;
  const { grade, label } = getJeonseGrade(jeonseRate.value);
  const { arrow, color } = getTrendArrow(trade.trend);

  return (
    <div className="grid grid-cols-2 gap-3 xl:gap-4">
      {/* 매매 중위가 */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 lg:p-5 flex flex-col justify-between">
        <p className="text-xs font-medium text-slate-500 line-clamp-1 md:text-sm">매매 중위가</p>
        <div className="mt-2 md:mt-3">
          <p className="text-lg font-extrabold text-slate-900 tracking-tight leading-tight md:text-xl lg:text-2xl">
            {formatPrice(trade.medianPrice)}
          </p>
          <p className={`mt-1.5 text-xs font-bold ${color} md:text-sm`}>
            {arrow}{' '}
            {trade.trendPercent !== 0 ? `${Math.abs(trade.trendPercent).toFixed(1)}%` : '변동없음'}
          </p>
        </div>
      </div>

      {/* 전세 보증금 중위 */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 lg:p-5 flex flex-col justify-between">
        <p className="text-xs font-medium text-slate-500 line-clamp-1 md:text-sm">
          전세 보증금 중위
        </p>
        <div className="mt-2 md:mt-3">
          <p className="text-lg font-extrabold text-slate-900 tracking-tight leading-tight md:text-xl lg:text-2xl">
            {formatPrice(rent.medianDeposit)}
          </p>
          {(() => {
            const { arrow, color } = getTrendArrow(rent.trend);
            return (
              <p className={`mt-1.5 text-xs font-bold ${color} md:text-sm`}>
                {arrow}{' '}
                {rent.trendPercent !== 0
                  ? `${Math.abs(rent.trendPercent).toFixed(1)}%`
                  : '변동없음'}
              </p>
            );
          })()}
        </div>
      </div>

      {/* 거래량 */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 lg:p-5 flex flex-col justify-between">
        <p className="text-xs font-medium text-slate-500 line-clamp-1 md:text-sm">매매 거래량</p>
        <div className="mt-2 md:mt-3">
          <p className="text-lg font-extrabold text-slate-900 tracking-tight leading-tight md:text-xl lg:text-2xl">
            {lastMonth
              ? `${lastMonth.tradeCount.toLocaleString('ko-KR')}건`
              : formatVolume(trade.totalCount)}
          </p>
          <p className="mt-1.5 text-[11px] font-medium text-slate-400 md:text-xs">
            {lastMonth ? '최근 월' : '전체 기간'}
          </p>
        </div>
      </div>

      {/* 전세가율 */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 lg:p-5 flex flex-col justify-between">
        <p className="text-xs font-medium text-slate-500 line-clamp-1 md:text-sm">전세가율</p>
        <div className="mt-2 md:mt-3">
          <p className="text-lg font-extrabold text-slate-900 tracking-tight leading-tight mb-2 md:mb-3 md:text-xl lg:text-2xl">
            {formatPercent(jeonseRate.value)}
          </p>
          <div>
            <Badge grade={grade} label={label} />
          </div>
        </div>
      </div>
    </div>
  );
}
