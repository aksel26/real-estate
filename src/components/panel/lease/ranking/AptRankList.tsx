'use client';

import { useState } from 'react';
import { AnimatePresence, LayoutGroup } from 'motion/react';
import { useUIStore } from '@/stores';
import { RANK_SORT_OPTIONS, DEFAULT_RANK_LIMIT } from '@/constants/ranking';
import AptRankCard from './AptRankCard';
import type { AptRankItem, RankSortKey, RankSortDir } from '@/types';

interface Props {
  items: AptRankItem[];
}

export default function AptRankList({ items }: Props) {
  const [showAll, setShowAll] = useState(false);
  const rankSortKey = useUIStore((s) => s.rankSortKey);
  const rankSortDir = useUIStore((s) => s.rankSortDir);
  const setRankSort = useUIStore((s) => s.setRankSort);
  const selectApt = useUIStore((s) => s.selectApt);
  const sheetSnap = useUIStore((s) => s.sheetSnap);
  const setSheetSnap = useUIStore((s) => s.setSheetSnap);

  const visibleItems = showAll ? items : items.slice(0, DEFAULT_RANK_LIMIT);
  const hasMore = items.length > DEFAULT_RANK_LIMIT;

  const currentSortLabel =
    RANK_SORT_OPTIONS.find((o) => o.key === rankSortKey && o.dir === rankSortDir)?.label ??
    RANK_SORT_OPTIONS[0].label;

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const idx = Number(e.target.value);
    const option = RANK_SORT_OPTIONS[idx];
    setRankSort(option.key as RankSortKey, option.dir as RankSortDir);
    setShowAll(false);
  };

  const currentSortIndex = RANK_SORT_OPTIONS.findIndex(
    (o) => o.key === rankSortKey && o.dir === rankSortDir,
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-slate-800 md:text-base">
          단지 랭킹
          <span className="ml-1.5 text-xs font-medium text-slate-400">
            {items.length}개 단지
          </span>
        </h3>
        <div className="relative">
          <select
            value={currentSortIndex >= 0 ? currentSortIndex : 0}
            onChange={handleSortChange}
            className="appearance-none bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-7 py-1.5 text-xs font-medium text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-300 cursor-pointer"
          >
            {RANK_SORT_OPTIONS.map((option, idx) => (
              <option key={idx} value={idx}>
                {option.label}
              </option>
            ))}
          </select>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </div>

      {/* List */}
      {items.length === 0 ? (
        <div className="rounded-2xl border border-slate-100 bg-white p-6 text-center">
          <p className="text-sm text-slate-400 font-medium">해당 면적대에 거래 데이터가 없습니다</p>
        </div>
      ) : (
        <LayoutGroup>
          <div className="space-y-2.5">
            <AnimatePresence>
              {visibleItems.map((item, idx) => (
                <AptRankCard
                  key={item.aptName}
                  item={item}
                  rank={idx + 1}
                  onClick={() => {
                    selectApt(item.aptName);
                    if (sheetSnap === 'full') {
                      setSheetSnap('half');
                    }
                  }}
                />
              ))}
            </AnimatePresence>
          </div>
        </LayoutGroup>
      )}

      {/* 더보기 */}
      {hasMore && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="w-full mt-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-500 hover:text-slate-700 hover:border-slate-300 transition-colors"
        >
          나머지 {items.length - DEFAULT_RANK_LIMIT}개 단지 더보기
        </button>
      )}
    </div>
  );
}
