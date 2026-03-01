'use client';

import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import PropertyTypeFilter from './PropertyTypeFilter';
import PeriodFilter from './PeriodFilter';

export default function MobileFilterPopover() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 닫힘 처리
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [open]);

  return (
    <div ref={ref} className="relative md:hidden flex-shrink-0 ml-auto">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center justify-center p-2 rounded-full transition-colors focus:outline-none ${
          open ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-100'
        }`}
        aria-label="상세 필터"
      >
        <svg
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
          />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute left-1/2 -ml-28 sm:left-auto sm:right-0 sm:-ml-0 top-full mt-3 w-72 sm:w-80 p-5 bg-white border border-slate-200/70 rounded-2xl shadow-xl z-50 flex flex-col gap-5 origin-top"
          >
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-2.5 px-0.5">매물 유형</p>
              <div className="flex flex-wrap gap-1.5">
                <PropertyTypeFilter />
              </div>
            </div>

            <div className="w-full h-px bg-slate-100" aria-hidden="true" />

            <div>
              <p className="text-xs font-semibold text-slate-500 mb-2.5 px-0.5">조회 기간</p>
              <div className="flex flex-wrap gap-1.5">
                <PeriodFilter />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
