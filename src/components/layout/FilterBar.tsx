'use client';

import RegionPill from './RegionPill';
import PropertyTypeFilter from './PropertyTypeFilter';
import PeriodFilter from './PeriodFilter';

/**
 * FilterBar — horizontal row containing the region pill and filter chips.
 * Scrollable on mobile to handle overflow gracefully.
 */
export default function FilterBar() {
  return (
    <div
      className={[
        'flex items-center gap-2',
        // Mobile: horizontal scroll, hide scrollbar
        'overflow-x-auto',
        '[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]',
      ].join(' ')}
      aria-label="필터 바"
    >
      <RegionPill />
      <PropertyTypeFilter />
      {/* Thin divider */}
      <div className="w-px h-5 bg-slate-200 flex-shrink-0" aria-hidden="true" />
      <PeriodFilter />
    </div>
  );
}
