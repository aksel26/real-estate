'use client';

import { AnimatePresence } from 'motion/react';
import { useUIStore } from '@/stores';
import { useAptRanking } from '@/hooks/useAptRanking';
import AreaBandChips from './AreaBandChips';
import AreaBandSummary from './AreaBandSummary';
import LeaseLoadingSkeleton from './LeaseLoadingSkeleton';
import { AptRankList, AptDetailView } from './ranking';

export default function LeasePanel() {
  const selectedAptName = useUIStore((s) => s.selectedAptName);
  const { bandStats, rankedApts, isLoading, isError } = useAptRanking();

  if (isLoading) {
    return <LeaseLoadingSkeleton />;
  }

  if (isError && rankedApts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-sm font-semibold text-slate-800">데이터를 불러오지 못했습니다</p>
      </div>
    );
  }

  const selectedApt = selectedAptName
    ? rankedApts.find((a) => a.aptName === selectedAptName) ?? null
    : null;

  return (
    <div className="relative min-h-full">
      <div className="p-4 space-y-4">
        <AreaBandChips />
        <AreaBandSummary stats={bandStats} />
        <AptRankList items={rankedApts} />
      </div>

      <AnimatePresence>
        {selectedApt && <AptDetailView item={selectedApt} />}
      </AnimatePresence>
    </div>
  );
}
