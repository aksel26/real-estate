'use client';

import FilterBar from './FilterBar';
import { ExportButton } from '@/components/export';
import { TOP_BAR_HEIGHT } from '@/constants';

/**
 * TopBar — fixed top navigation bar with backdrop blur.
 * Left: app title. Center: FilterBar. Right: reserved for future controls.
 */
export default function TopBar() {
  return (
    <header
      style={{ height: TOP_BAR_HEIGHT }}
      className={[
        'fixed top-0 left-0 right-0 z-40',
        'flex items-center px-4 sm:px-5 md:px-8 xl:px-10 gap-3 md:gap-5',
        'bg-white/90 backdrop-blur-md',
        'border-b border-slate-200/60',
        'flex-shrink-0 transition-colors',
      ].join(' ')}
      role="banner"
    >
      {/* Left: App title */}
      <div className="flex-shrink-0 flex items-center pr-2 md:pr-4 border-r border-slate-200/60 h-8">
        <h1 className="text-[15px] md:text-base font-bold tracking-tight text-slate-900 select-none leading-none">
          부동산<span className="text-blue-600 ml-1">리포트</span>
        </h1>
      </div>

      {/* Center: FilterBar — grows to fill available space */}
      <div className="flex-1 flex items-center min-w-0">
        <div className="w-full max-w-xl">
          <FilterBar />
        </div>
      </div>

      {/* Right: export controls */}
      <div className="flex-shrink-0 pl-2">
        <ExportButton />
      </div>
    </header>
  );
}
