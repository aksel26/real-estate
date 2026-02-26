'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useUIStore } from '@/stores';
import { SPRING_CONFIG } from '@/constants';

interface PanelAreaProps {
  children?: React.ReactNode;
}

/** Close button icon */
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

/** Drag handle for mobile bottom sheet */
function DragHandle() {
  return (
    <div className="flex justify-center pt-3 pb-1 md:hidden" aria-hidden="true">
      <div className="w-10 h-1 rounded-full bg-slate-300" />
    </div>
  );
}

/**
 * PanelArea — animated right-side panel (desktop) / bottom sheet (mobile).
 * Controlled by uiStore.rightPanelOpen.
 */
export default function PanelArea({ children }: PanelAreaProps) {
  const { rightPanelOpen, closePanel } = useUIStore();

  return (
    <AnimatePresence>
      {rightPanelOpen && (
        <>
          {/* Mobile backdrop */}
          <motion.div
            key="panel-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 z-20 md:hidden"
            onClick={closePanel}
            aria-hidden="true"
          />

          {/* Panel — desktop: right side, mobile: bottom sheet */}
          <motion.aside
            key="panel"
            role="complementary"
            aria-label="리포트 패널"
            /* ── Desktop: slide in from right ── */
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={SPRING_CONFIG}
            className={[
              // Shared
              'bg-white shadow-2xl overflow-y-auto overflow-x-hidden z-30',
              // Desktop: fixed right column
              'hidden md:flex md:flex-col md:relative md:w-[384px] md:h-full md:shadow-[-4px_0_24px_-4px_rgba(0,0,0,0.08)]',
            ].join(' ')}
          >
            {/* Close button */}
            <div className="hidden md:flex items-center justify-end px-4 pt-4 pb-0 flex-shrink-0">
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

          {/* Mobile bottom sheet */}
          <motion.aside
            key="panel-mobile"
            role="complementary"
            aria-label="리포트 패널"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={SPRING_CONFIG}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.05, bottom: 0.3 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 80) closePanel();
            }}
            className={[
              'fixed bottom-0 left-0 right-0 z-30',
              'flex flex-col bg-white rounded-t-2xl shadow-2xl',
              'max-h-[60vh] overflow-hidden',
              'md:hidden',
            ].join(' ')}
          >
            <DragHandle />
            {/* Mobile close button */}
            <div className="flex items-center justify-end px-4 pb-2">
              <button
                onClick={closePanel}
                className="flex items-center justify-center w-8 h-8 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="패널 닫기"
              >
                <CloseIcon />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{children}</div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
