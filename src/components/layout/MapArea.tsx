'use client';

import { memo } from 'react';

interface MapAreaProps {
  children?: React.ReactNode;
}

/**
 * MapArea — stable container for the Kakao Map.
 * Wrapped in memo to prevent re-renders when the panel opens/closes.
 */
const MapArea = memo(function MapArea({ children }: MapAreaProps) {
  return (
    <div
      className="relative flex-1 min-w-0 h-full overflow-hidden bg-slate-100"
      aria-label="지도 영역"
    >
      {children ?? (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm text-slate-400 select-none">지도를 불러오는 중…</span>
        </div>
      )}
    </div>
  );
});

export default MapArea;
