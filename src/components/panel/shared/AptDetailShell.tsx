'use client';

import { motion } from 'motion/react';
import { useUIStore } from '@/stores';
import { formatArea } from '@/lib/utils';

interface Props {
  aptName: string;
  medianArea: number;
  countTotal: number;
  children: React.ReactNode;
}

export default function AptDetailShell({ aptName, medianArea, countTotal, children }: Props) {
  const clearAptSelection = useUIStore((s) => s.clearAptSelection);

  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="absolute inset-0 bg-slate-50 z-20 flex flex-col"
    >
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3">
        <button
          onClick={clearAptSelection}
          className="p-1 -ml-1 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-slate-600"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-slate-900 truncate md:text-base">{aptName}</h3>
          <p className="text-[11px] text-slate-400 font-medium">
            {formatArea(medianArea)} · 총 {countTotal}건
          </p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">{children}</div>
    </motion.div>
  );
}
