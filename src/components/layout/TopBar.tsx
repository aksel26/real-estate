'use client';

import FilterBar from './FilterBar';
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
        'flex items-center px-4 md:px-6 gap-4',
        'bg-white/80 backdrop-blur-sm',
        'border-b border-slate-200/70',
        'flex-shrink-0',
      ].join(' ')}
      role="banner"
    >
      {/* Left: App title */}
      <div className="flex-shrink-0">
        <h1 className="text-[15px] font-semibold tracking-tight text-slate-900 select-none leading-none">
          부동산 리포트
        </h1>
      </div>

      {/* Center: FilterBar — grows to fill available space */}
      <div className="flex-1 flex items-center justify-center min-w-0">
        <FilterBar />
      </div>

      {/* Right: reserved for future controls (settings, etc.) */}
      <div className="flex-shrink-0 w-[80px] hidden md:block" aria-hidden="true" />
    </header>
  );
}
