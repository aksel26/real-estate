'use client';

import { useSelectionStore } from '@/stores';
import { useReport } from '@/hooks/queries';
import { Skeleton } from '@/components/ui';
import TabNavigation from './TabNavigation';
import TabContent from './TabContent';

export default function ReportPanel() {
  const selectedRegionName = useSelectionStore((s) => s.selectedRegionName);
  const { data, isLoading } = useReport();

  if (!selectedRegionName && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-50 text-center p-6 md:p-8 gap-4 md:gap-5">
        <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-full bg-white border border-slate-100/50 text-slate-300">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="md:w-9 md:h-9"
          >
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-800 mb-1.5 md:text-lg">
            지역을 선택해주세요
          </h3>
          <p className="text-sm text-slate-500 px-4 leading-relaxed md:text-base font-medium">
            지도에서 관심있는 동네를 선택하면
            <br className="hidden md:block" />
            상세 분석 리포트가 표시됩니다
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div className="pt-6 md:pt-8 pb-0 bg-white border-b border-slate-200 z-10">
        <div className="px-5 md:px-6 mb-5 md:mb-6">
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight truncate">
            {selectedRegionName ?? ''}
          </h2>
          {isLoading ? (
            <div className="mt-2.5 mb-1.5">
              <Skeleton height={14} width="50%" />
            </div>
          ) : (
            data?.summary && (
              <p className="text-sm md:text-[15px] font-medium text-slate-500 mt-1.5 truncate">
                {data.summary}
              </p>
            )
          )}
        </div>

        <TabNavigation />
      </div>

      {/* Content */}
      <TabContent />
    </div>
  );
}
