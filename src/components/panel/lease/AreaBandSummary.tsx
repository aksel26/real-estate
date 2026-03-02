'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { formatPrice } from '@/lib/utils';
import { SampleCountBadge } from '@/components/ui';
import { LOW_SAMPLE_THRESHOLD } from '@/constants/ranking';
import type { AreaBandStats } from '@/types';

interface Props {
  stats: AreaBandStats;
}

export default function AreaBandSummary({ stats }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full p-5 lg:p-6 text-left focus:outline-none flex flex-col justify-between"
      >
        <div className="flex items-center justify-between w-full group">
          <span className="text-sm font-medium text-slate-500 md:text-base">면적대 요약</span>
          <div className="flex items-center gap-1.5 text-slate-400 group-hover:text-violet-500 transition-colors">
            <span className="text-[11px] font-medium">{expanded ? '접기' : '자세히 보기'}</span>
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="bg-slate-50 p-1 rounded-full group-hover:bg-violet-50 transition-colors flex items-center justify-center"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </motion.div>
          </div>
        </div>

        {/* 전세 중위 보증금 (메인) */}
        <div className="mt-3 md:mt-4 w-full">
          <p className="text-3xl font-extrabold text-slate-900 tracking-tight md:text-4xl">
            {stats.jeonseCount > 0 ? formatPrice(stats.medianDeposit) : '—'}
          </p>
          <p className="mt-1 text-xs font-medium text-slate-400">전세 중위 보증금</p>
        </div>

        {/* 건수 + 표본 배지 */}
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <span className="bg-slate-50 px-2.5 py-1 rounded-md text-[13px] font-semibold text-slate-600">
            전세 {stats.jeonseCount.toLocaleString('ko-KR')}건
          </span>
          <span className="bg-slate-50 px-2.5 py-1 rounded-md text-[13px] font-semibold text-slate-600">
            월세 {stats.monthlyCount.toLocaleString('ko-KR')}건
          </span>
          {stats.isLowSample && (
            <SampleCountBadge sampleCount={stats.totalCount} threshold={LOW_SAMPLE_THRESHOLD} />
          )}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="detail"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 grid grid-cols-2 gap-4 border-t border-slate-50 pt-3">
              <div>
                <p className="text-xs text-slate-500">전세 75분위</p>
                <p className="mt-0.5 text-sm font-semibold text-slate-800">
                  {stats.jeonseCount > 0 ? formatPrice(stats.depositIQR.q3) : '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">전세 25분위</p>
                <p className="mt-0.5 text-sm font-semibold text-slate-800">
                  {stats.jeonseCount > 0 ? formatPrice(stats.depositIQR.q1) : '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">월세 중위 보증금</p>
                <p className="mt-0.5 text-sm font-semibold text-slate-800">
                  {stats.monthlyCount > 0 ? formatPrice(stats.medianMonthlyDeposit) : '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">월세 중위 월세</p>
                <p className="mt-0.5 text-sm font-semibold text-slate-800">
                  {stats.monthlyCount > 0 ? formatPrice(stats.medianMonthlyRent) : '—'}
                </p>
              </div>
            </div>
            <div className="px-4 pb-4">
              <p className="text-[11px] text-slate-400 font-medium">
                * 참고용 통계입니다 (표본 기반 집계)
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
