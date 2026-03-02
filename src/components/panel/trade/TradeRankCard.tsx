'use client';

import { motion } from 'motion/react';
import { formatPrice, formatArea } from '@/lib/utils';
import type { TradeRankItem } from '@/types';

interface Props {
  item: TradeRankItem;
  rank: number;
  onClick: () => void;
}

export default function TradeRankCard({ item, rank, onClick }: Props) {
  return (
    <motion.button
      layout
      onClick={onClick}
      className="w-full rounded-2xl border border-slate-200 bg-white p-4 lg:p-5 text-left hover:border-slate-300 hover:shadow-sm transition-all focus:outline-none group"
    >
      <div className="flex items-start gap-3">
        <span
          className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
            rank <= 3 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
          }`}
        >
          {rank}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors md:text-base">
              {item.aptName}
            </h4>
            <span className="flex-shrink-0 text-xs text-slate-400 font-medium">
              {formatArea(item.medianArea)}
            </span>
          </div>
          <div className="mt-1.5 flex items-center gap-2 text-[12px] font-semibold text-slate-500">
            <span className="bg-slate-50 px-2 py-0.5 rounded text-slate-600">
              {item.countTotal}건
            </span>
            <span className="text-[11px] text-slate-400">{item.dong}</span>
          </div>
          <div className="mt-2 text-[13px] font-medium text-slate-700">
            매매 중위{' '}
            <span className="font-bold text-slate-900">{formatPrice(item.medianPrice)}</span>
          </div>
        </div>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="flex-shrink-0 mt-1 text-slate-300 group-hover:text-blue-400 transition-colors"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </div>
    </motion.button>
  );
}
