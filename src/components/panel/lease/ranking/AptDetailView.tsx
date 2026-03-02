'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { useAptDetail } from '@/hooks';
import { formatPrice, formatArea } from '@/lib/utils';
import { AptDetailShell, AreaBreakdownChart, AptPriceTrendChart } from '../../shared';
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
  const [subTab, setSubTab] = useState<SubTab>('jeonse');
  const { areaBreakdown, monthlyTrend } = useAptDetail(item.aptName, 'rent');

  const filteredDeals = item.recentItems
    .filter((d) => d.rentType === subTab)
    .sort((a, b) => b.dealDate.localeCompare(a.dealDate))
    .slice(0, 10);

  return (
    <AptDetailShell
      aptName={item.aptName}
      medianArea={item.medianArea}
      countTotal={item.countTotal}
    >
      {/* Charts */}
      <div className="p-4 space-y-4">
        <AreaBreakdownChart data={areaBreakdown} label="면적별 전세 중위가" color="#8b5cf6" />
        <AptPriceTrendChart data={monthlyTrend} label="월별 전세가 추이" color="#8b5cf6" />
      </div>

      {/* Sub tabs */}
      <div className="bg-white border-b border-slate-100 flex">
        {(
          [
            { id: 'jeonse' as SubTab, label: '전세', count: item.countJeonse },
            { id: 'monthly' as SubTab, label: '월세', count: item.countMonthly },
          ] as const
        ).map((tab) => (
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
      <div className="p-4">
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
    </AptDetailShell>
  );
}
