'use client';

import RegionPill from './RegionPill';
import PropertyTypeFilter from './PropertyTypeFilter';
import PeriodFilter from './PeriodFilter';
import MobileFilterPopover from './MobileFilterPopover';

/**
 * FilterBar — horizontal row containing the region pill and filter chips.
 * Uses a Popover for fitlers on mobile to improve responsiveness.
 */
export default function FilterBar() {
  return (
    <div className="flex items-center justify-between md:justify-start w-full" aria-label="필터 바">
      <RegionPill />

      {/* Desktop Filters (Hidden on Mobile) */}
      <div className="hidden md:flex items-center gap-2 lg:gap-3 ml-3">
        <PropertyTypeFilter />
        {/* Thin divider */}
        <div className="w-px h-5 bg-slate-200 flex-shrink-0 mx-1" aria-hidden="true" />
        <PeriodFilter />
      </div>

      {/* Mobile Filter Popover (Hidden on Desktop) */}
      <MobileFilterPopover />
    </div>
  );
}
