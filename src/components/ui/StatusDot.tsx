'use client';

import { motion } from 'motion/react';

type Status = 'loading' | 'success' | 'error';

interface StatusDotProps {
  status: Status;
}

const statusConfig: Record<Status, { dot: string; label: string }> = {
  loading: { dot: 'bg-blue-500', label: '불러오는 중' },
  success: { dot: 'bg-emerald-500', label: '완료' },
  error: { dot: 'bg-red-500', label: '오류' },
};

export default function StatusDot({ status }: StatusDotProps) {
  const config = statusConfig[status];

  return (
    <span className="relative inline-flex items-center justify-center w-2.5 h-2.5" aria-label={config.label}>
      {status === 'loading' && (
        <motion.span
          className={`absolute inset-0 rounded-full ${config.dot} opacity-60`}
          animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 1.6, ease: 'easeInOut', repeat: Infinity }}
        />
      )}
      <span className={`relative w-2.5 h-2.5 rounded-full ${config.dot}`} />
    </span>
  );
}
