'use client';

import { motion } from 'motion/react';
import Button from '@/components/ui/Button';

interface MapErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export default function MapErrorFallback({
  error: _error,
  resetErrorBoundary,
}: MapErrorFallbackProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center gap-4 w-full h-full bg-slate-100 text-center p-8"
      role="alert"
    >
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-200">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
            stroke="#94a3b8"
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="9" r="2.5" stroke="#94a3b8" strokeWidth="1.75" />
        </svg>
      </div>

      <div className="space-y-1.5">
        <p className="text-sm font-semibold text-slate-700">지도를 불러올 수 없습니다</p>
        <p className="text-xs text-slate-500 leading-relaxed">
          카카오맵 API 키를 확인해주세요
        </p>
      </div>

      <Button variant="secondary" size="sm" onClick={resetErrorBoundary}>
        다시 시도
      </Button>
    </motion.div>
  );
}
