'use client';

import { Chip } from '@/components/ui';
import { useFilterStore } from '@/stores';
import { PERIOD_OPTIONS } from '@/constants';

/**
 * PeriodFilter — chip group for 3개월 / 6개월 / 12개월 selection.
 */
export default function PeriodFilter() {
  const months = useFilterStore((s) => s.months);
  const setMonths = useFilterStore((s) => s.setMonths);

  return (
    <div
      role="group"
      aria-label="조회 기간 필터"
      className="flex items-center gap-1.5"
    >
      {PERIOD_OPTIONS.map((option) => (
        <Chip
          key={option.value}
          label={option.label}
          selected={months === option.value}
          onClick={() => setMonths(option.value)}
        />
      ))}
    </div>
  );
}
