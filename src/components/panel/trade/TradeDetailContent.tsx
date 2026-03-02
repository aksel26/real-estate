'use client';

import { useAptDetail } from '@/hooks';
import { formatPrice, formatArea } from '@/lib/utils';
import { AptDetailShell, AreaBreakdownChart, AptPriceTrendChart } from '../shared';
import type { TradeRankItem } from '@/types';
import type { TradeItem } from '@/types/trade';

interface Props {
  item: TradeRankItem;
}

function DealRow({ deal }: { deal: TradeItem }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-900">{formatPrice(deal.price)}</span>
          <span className="text-xs text-slate-400">{formatArea(deal.area)}</span>
        </div>
        <p className="mt-0.5 text-[11px] text-slate-400 font-medium">
          {deal.floor}층 · {deal.dealDate}
        </p>
      </div>
    </div>
  );
}

export default function TradeDetailContent({ item }: Props) {
  const { allItems, areaBreakdown, monthlyTrend } = useAptDetail(item.aptName, 'trade');
  const tradeItems = allItems as TradeItem[];

  const recentDeals = [...tradeItems]
    .sort((a, b) => b.dealDate.localeCompare(a.dealDate))
    .slice(0, 20);

  return (
    <AptDetailShell
      aptName={item.aptName}
      medianArea={item.medianArea}
      countTotal={item.countTotal}
    >
      <div className="p-4 space-y-4">
        <AreaBreakdownChart data={areaBreakdown} label="면적별 매매 중위가" color="#3b82f6" />
        <AptPriceTrendChart data={monthlyTrend} label="월별 매매가 추이" color="#3b82f6" />

        <div>
          <h4 className="text-sm font-bold text-slate-800 mb-2">
            최근 거래 내역
            <span className="ml-1.5 text-xs font-medium text-slate-400">
              {recentDeals.length}건
            </span>
          </h4>
          {recentDeals.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-slate-400 font-medium">거래 내역이 없습니다</p>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white px-4">
              {recentDeals.map((deal, idx) => (
                <DealRow key={`${deal.dealDate}-${deal.floor}-${idx}`} deal={deal} />
              ))}
            </div>
          )}
        </div>
      </div>
    </AptDetailShell>
  );
}
