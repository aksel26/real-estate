'use client';

import { formatPrice } from '@/lib/utils';
import type { RentReport } from '@/types';

interface Props {
  rent: RentReport;
}

export default function MonthlyRentCard({ rent }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 lg:p-6 flex flex-col justify-between">
      <p className="text-sm border-b border-transparent font-medium text-slate-500 md:text-base">
        월세 현황
      </p>
      <div className="mt-3 md:mt-4">
        <p className="text-xl font-extrabold text-slate-900 md:text-2xl lg:text-3xl tracking-tight">
          보증금 {formatPrice(rent.medianDeposit)}{' '}
          <span className="text-slate-300 font-normal px-0.5">/</span> 월세{' '}
          {formatPrice(rent.medianMonthly)}
        </p>
        <div className="mt-3 flex items-center gap-2 text-[13px] font-semibold text-slate-500">
          <span className="bg-slate-50 px-2.5 py-1 rounded-md text-slate-600">
            전세 {rent.jeonseCount.toLocaleString('ko-KR')}건
          </span>
          <span className="bg-slate-50 px-2.5 py-1 rounded-md text-slate-600">
            월세 {rent.monthlyCount.toLocaleString('ko-KR')}건
          </span>
        </div>
      </div>
    </div>
  );
}
