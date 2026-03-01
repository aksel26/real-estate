'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { formatPrice } from '@/lib/utils';
import type { RentReport } from '@/types';

interface Props {
  rent: RentReport;
}

export default function DepositSummaryCard({ rent }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div layout className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full p-5 lg:p-6 text-left focus:outline-none flex flex-col justify-between"
      >
        <div className="flex items-center justify-between w-full group">
          <span className="text-sm font-medium text-slate-500 md:text-base">전세 중위 보증금</span>
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
        <div className="mt-3 md:mt-4 w-full">
          <p className="text-3xl font-extrabold text-slate-900 tracking-tight md:text-4xl">
            {formatPrice(rent.medianDeposit)}
          </p>
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
                <p className="text-xs text-slate-500">75분위</p>
                <p className="mt-0.5 text-sm font-semibold text-slate-800">
                  {formatPrice(rent.depositRange.q3)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">25분위</p>
                <p className="mt-0.5 text-sm font-semibold text-slate-800">
                  {formatPrice(rent.depositRange.q1)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">최고 보증금</p>
                <p className="mt-0.5 text-sm font-semibold text-slate-800">
                  {formatPrice(rent.depositRange.max)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">최저 보증금</p>
                <p className="mt-0.5 text-sm font-semibold text-slate-800">
                  {formatPrice(rent.depositRange.min)}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
