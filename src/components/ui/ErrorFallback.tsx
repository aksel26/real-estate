'use client';

import { motion } from 'motion/react';
import Button from './Button';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export default function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center gap-4 p-8 text-center"
      role="alert"
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-red-50">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 9v4M12 17v.5"
            stroke="#ef4444"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
          <path
            d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
            stroke="#ef4444"
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="space-y-1">
        <p className="text-sm font-semibold text-slate-800">데이터를 불러오지 못했습니다</p>
        <p className="text-xs text-slate-500 max-w-[220px] leading-relaxed">
          {error.message || '알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'}
        </p>
      </div>

      <Button variant="secondary" size="sm" onClick={resetErrorBoundary}>
        다시 시도
      </Button>
    </motion.div>
  );
}
