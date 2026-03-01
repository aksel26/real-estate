'use client';

import { useCallback, useEffect, useRef } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  animate,
  useDragControls,
} from 'motion/react';
import { useUIStore } from '@/stores';
import type { SheetSnap } from '@/stores';
import { useIsDesktop } from '@/hooks/useMediaQuery';
import { SPRING_CONFIG, BOTTOM_SHEET } from '@/constants';

interface PanelAreaProps {
  children?: React.ReactNode;
}

/* ── Icons ── */

function CloseIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M3 3L13 13M13 3L3 13"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DragHandle() {
  return (
    <div className="flex justify-center pt-3 pb-1" aria-hidden="true">
      <div className="w-10 h-1 rounded-full bg-slate-300" />
    </div>
  );
}

/* ── Snap helpers ── */

function getSnapY(snap: SheetSnap, vh: number): number {
  switch (snap) {
    case 'full':
      return vh * (1 - BOTTOM_SHEET.SNAP_FULL);
    case 'half':
      return vh * (1 - BOTTOM_SHEET.SNAP_HALF);
    case 'peek':
      return vh * (1 - BOTTOM_SHEET.SNAP_PEEK);
  }
}

function snapToFraction(snap: SheetSnap): number {
  switch (snap) {
    case 'full':
      return BOTTOM_SHEET.SNAP_FULL;
    case 'half':
      return BOTTOM_SHEET.SNAP_HALF;
    case 'peek':
      return BOTTOM_SHEET.SNAP_PEEK;
  }
}

function findNearestSnap(
  currentY: number,
  velocity: number,
  vh: number
): SheetSnap | 'close' {
  const fullY = getSnapY('full', vh);
  const halfY = getSnapY('half', vh);
  const peekY = getSnapY('peek', vh);

  // Fast swipe — jump to next snap in swipe direction
  if (Math.abs(velocity) > BOTTOM_SHEET.VELOCITY_THRESHOLD) {
    if (velocity < 0) {
      // Swiping up
      if (currentY > halfY) return 'half';
      return 'full';
    } else {
      // Swiping down
      if (currentY < halfY) return 'half';
      if (currentY < peekY) return 'peek';
      return 'close';
    }
  }

  // Slow drag — nearest snap, or close if past peek
  if (currentY > peekY + vh * 0.08) return 'close';

  const distances = [
    { snap: 'full' as const, d: Math.abs(currentY - fullY) },
    { snap: 'half' as const, d: Math.abs(currentY - halfY) },
    { snap: 'peek' as const, d: Math.abs(currentY - peekY) },
  ];
  distances.sort((a, b) => a.d - b.d);
  return distances[0].snap;
}

/* ── Snap indicator ── */

function SnapIndicator({
  current,
  onSnap,
}: {
  current: SheetSnap;
  onSnap: (snap: SheetSnap) => void;
}) {
  const snaps: SheetSnap[] = ['full', 'half', 'peek'];
  return (
    <div className="flex items-center justify-center gap-1.5 py-1" aria-label="스냅 포인트">
      {snaps.map((s) => (
        <button
          key={s}
          onClick={() => onSnap(s)}
          className={`w-1.5 h-1.5 rounded-full transition-colors ${
            s === current ? 'bg-slate-500' : 'bg-slate-300'
          }`}
          aria-label={`${s} 높이로 이동`}
        />
      ))}
    </div>
  );
}

/* ── Desktop Panel ── */

function DesktopPanel({
  children,
  closePanel,
}: {
  children: React.ReactNode;
  closePanel: () => void;
}) {
  return (
    <motion.aside
      key="panel-desktop"
      role="complementary"
      aria-label="리포트 패널"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={SPRING_CONFIG}
      className={[
        'bg-white shadow-2xl overflow-y-auto overflow-x-hidden z-30',
        'flex flex-col relative h-full',
        'w-[384px] xl:w-[420px] 2xl:w-[480px]',
        'shadow-[-4px_0_24px_-4px_rgba(0,0,0,0.08)]',
      ].join(' ')}
    >
      <div className="flex items-center justify-end px-4 pt-4 pb-0 flex-shrink-0">
        <motion.button
          onClick={closePanel}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="flex items-center justify-center w-8 h-8 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="패널 닫기"
        >
          <CloseIcon />
        </motion.button>
      </div>
      <div className="flex-1 min-h-0">{children}</div>
    </motion.aside>
  );
}

/* ── Mobile Bottom Sheet ── */

function MobileBottomSheet({
  children,
  closePanel,
}: {
  children: React.ReactNode;
  closePanel: () => void;
}) {
  const { sheetSnap, setSheetSnap } = useUIStore();
  const y = useMotionValue(0);
  const dragControls = useDragControls();

  const animateToSnap = useCallback(
    (snap: SheetSnap) => {
      const vh = window.innerHeight;
      const currentSnapY = getSnapY(sheetSnap, vh);
      const targetSnapY = getSnapY(snap, vh);
      const targetOffset = targetSnapY - currentSnapY;

      animate(y, targetOffset, {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        onComplete: () => {
          y.set(0);
          setSheetSnap(snap);
        },
      });
    },
    [sheetSnap, setSheetSnap, y]
  );

  const handleDragEnd = useCallback(
    (_: unknown, info: { offset: { y: number }; velocity: { y: number } }) => {
      const vh = window.innerHeight;
      const currentSnapY = getSnapY(sheetSnap, vh);
      const visualY = currentSnapY + y.get();
      const result = findNearestSnap(visualY, info.velocity.y, vh);

      if (result === 'close') {
        closePanel();
        return;
      }

      const targetSnapY = getSnapY(result, vh);
      const targetOffset = targetSnapY - currentSnapY;

      animate(y, targetOffset, {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        onComplete: () => {
          y.set(0);
          setSheetSnap(result);
        },
      });
    },
    [sheetSnap, closePanel, setSheetSnap, y]
  );

  const snapHeight = `${snapToFraction(sheetSnap) * 100}vh`;

  return (
    <motion.aside
      key="panel-mobile"
      role="complementary"
      aria-label="리포트 패널"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={SPRING_CONFIG}
      style={{ height: snapHeight, y }}
      drag="y"
      dragControls={dragControls}
      dragListener={false}
      dragElastic={{ top: 0.05, bottom: 0.3 }}
      onDragEnd={handleDragEnd}
      className={[
        'fixed bottom-0 left-0 right-0 z-30',
        'flex flex-col bg-white rounded-t-2xl shadow-2xl',
        'overflow-hidden',
      ].join(' ')}
    >
      {/* Drag handle area — only this triggers drag */}
      <div
        onPointerDown={(e) => dragControls.start(e)}
        className="flex-shrink-0 cursor-grab active:cursor-grabbing touch-none"
      >
        <DragHandle />
        <SnapIndicator current={sheetSnap} onSnap={animateToSnap} />
      </div>

      {/* Header with close button */}
      <div className="flex items-center justify-end px-4 pb-2 flex-shrink-0">
        <button
          onClick={closePanel}
          className="flex items-center justify-center w-8 h-8 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="패널 닫기"
        >
          <CloseIcon />
        </button>
      </div>

      {/* Scrollable content — not draggable, allows normal scroll */}
      <div className="flex-1 overflow-y-auto overscroll-contain">{children}</div>
    </motion.aside>
  );
}

/* ── Main PanelArea ── */

export default function PanelArea({ children }: PanelAreaProps) {
  const { rightPanelOpen, closePanel, setSheetSnap } = useUIStore();
  const isDesktop = useIsDesktop();

  const prevIsDesktop = useRef(isDesktop);

  useEffect(() => {
    if (prevIsDesktop.current !== isDesktop) {
      if (!isDesktop && rightPanelOpen) {
        setSheetSnap('half');
      }
      prevIsDesktop.current = isDesktop;
    }
  }, [isDesktop, rightPanelOpen, setSheetSnap]);

  return (
    <AnimatePresence mode="wait">
      {rightPanelOpen &&
        (isDesktop ? (
          <DesktopPanel closePanel={closePanel}>{children}</DesktopPanel>
        ) : (
          <MobileBottomSheet closePanel={closePanel}>{children}</MobileBottomSheet>
        ))}
    </AnimatePresence>
  );
}
