'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { useUIStore } from '@/stores';
import { formatPrice, formatArea } from '@/lib/utils';
import type { AptRankItem, RentItem } from '@/types';

type SubTab = 'jeonse' | 'monthly';

interface Props {
  item: AptRankItem;
}

function DealRow({ deal }: { deal: RentItem }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-900">
            {deal.rentType === 'jeonse'
              ? formatPrice(deal.deposit)
              : `${formatPrice(deal.deposit)} / ${formatPrice(deal.monthlyRent)}`}
          </span>
          <span className="text-xs text-slate-400">{formatArea(deal.area)}</span>
        </div>
        <p className="mt-0.5 text-[11px] text-slate-400 font-medium">
          {deal.floor}층 · {deal.dealDate}
        </p>
      </div>
    </div>
  );
}

export default function AptDetailView({ item }: Props) {
  const clearAptSelection = useUIStore((s) => s.clearAptSelection);
  const [subTab, setSubTab] = useState<SubTab>('jeonse');

  const filteredDeals = item.recentItems
    .filter((d) => d.rentType === subTab)
    .sort((a, b) => b.dealDate.localeCompare(a.dealDate))
    .slice(0, 10);

  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="absolute inset-0 bg-slate-50 z-20 flex flex-col"
    >
      {/* Header */}
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
          <h3 className="text-sm font-bold text-slate-900 truncate md:text-base">
            {item.aptName}
          </h3>
          <p className="text-[11px] text-slate-400 font-medium">
            {formatArea(item.medianArea)} · 총 {item.countTotal}건
          </p>
        </div>
      </div>

      {/* Sub tabs */}
      <div className="bg-white border-b border-slate-100 flex">
        {([
          { id: 'jeonse' as SubTab, label: '전세', count: item.countJeonse },
          { id: 'monthly' as SubTab, label: '월세', count: item.countMonthly },
        ]).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id)}
            className={`flex-1 py-2.5 text-[13px] font-medium transition-colors relative ${
              subTab === tab.id ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab.label}
            <span className="ml-1 text-[11px]">({tab.count})</span>
            {subTab === tab.id && (
              <motion.div
                layoutId="apt-detail-tab"
                className="absolute bottom-0 left-2 right-2 h-0.5 bg-slate-900 rounded-t-full"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Deal list */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredDeals.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-slate-400 font-medium">
              {subTab === 'jeonse' ? '전세' : '월세'} 거래 내역이 없습니다
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white px-4">
            {filteredDeals.map((deal, idx) => (
              <DealRow key={`${deal.dealDate}-${deal.floor}-${idx}`} deal={deal} />
            ))}
          </div>
        )}
        <p className="mt-3 text-center text-[11px] text-slate-400 font-medium">
          * 최근 거래 최대 10건 (참고용)
        </p>
      </div>
    </motion.div>
  );
}
