'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useJeonseRatio } from '@/hooks';
import { Badge, Skeleton } from '@/components/ui';
import type { JeonseRateGrade } from '@/types/filter';

const GRADE_LABEL: Record<JeonseRateGrade, string> = {
  danger: '위험',
  warning: '주의',
  safe: '양호',
};

const GRADE_BAR_COLOR: Record<JeonseRateGrade, string> = {
  danger: 'bg-red-500',
  warning: 'bg-amber-500',
  safe: 'bg-emerald-500',
};

const GRADE_BAR_BG: Record<JeonseRateGrade, string> = {
  danger: 'bg-red-100',
  warning: 'bg-amber-100',
  safe: 'bg-emerald-100',
};

export default function JeonseRatioCard() {
  const { bands, overall, isLoading } = useJeonseRatio();
  const [expanded, setExpanded] = useState(false);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 lg:p-6 space-y-3">
        <Skeleton height={14} width="40%" />
        <Skeleton height={32} width="30%" />
        <Skeleton height={14} width="20%" />
      </div>
    );
  }

  if (bands.length === 0) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-slate-500 md:text-base">전세가율 분석</p>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1"
        >
          {expanded ? '접기' : '자세히 보기'}
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </div>

      {/* Overall */}
      <div className="flex items-center gap-3">
        <span className="text-2xl font-extrabold text-slate-900 tracking-tight lg:text-3xl">
          {overall.ratio.toFixed(1)}%
        </span>
        <Badge grade={overall.grade} label={GRADE_LABEL[overall.grade]} />
      </div>

      {/* Expandable band breakdown */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="mt-4 space-y-3 pt-4 border-t border-slate-100">
              {bands.map((band) => (
                <div key={band.bandId} className={`${band.isLowSample ? 'opacity-60' : ''}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-slate-600">{band.bandLabel}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">
                        {band.ratio.toFixed(1)}%
                      </span>
                      <Badge grade={band.grade} label={GRADE_LABEL[band.grade]} />
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className={`h-2 rounded-full ${GRADE_BAR_BG[band.grade]}`}>
                    <div
                      className={`h-full rounded-full transition-all ${GRADE_BAR_COLOR[band.grade]}`}
                      style={{ width: `${Math.min(band.ratio, 100)}%` }}
                    />
                  </div>
                  {band.isLowSample && (
                    <p className="mt-0.5 text-[10px] text-slate-400">(표본 부족)</p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
