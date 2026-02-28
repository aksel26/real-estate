'use client';

import TopBar from './TopBar';
import MapArea from './MapArea';
import PanelArea from './PanelArea';
import { TOP_BAR_HEIGHT } from '@/constants';

interface MainLayoutProps {
  /** Map component — passed as child to MapArea */
  map?: React.ReactNode;
  /** Report panel content — passed as child to PanelArea */
  panel?: React.ReactNode;
}

/**
 * MainLayout — full-viewport application shell.
 *
 * Structure:
 *   TopBar (fixed, 56px)
 *   └─ Content row (remaining height)
 *       ├─ MapArea  (flex-1, ≥70%)
 *       └─ PanelArea (384px desktop / bottom sheet mobile, conditional)
 */
export default function MainLayout({ map, panel }: MainLayoutProps) {
  return (
    <div className="h-dvh w-full overflow-hidden flex flex-col bg-slate-50">
      <TopBar />

      {/* Content area below the fixed TopBar */}
      <div
        style={{ paddingTop: TOP_BAR_HEIGHT }}
        className="flex flex-row flex-1 min-h-0 overflow-hidden"
      >
        <MapArea>{map}</MapArea>
        <PanelArea>{panel}</PanelArea>
      </div>
    </div>
  );
}
