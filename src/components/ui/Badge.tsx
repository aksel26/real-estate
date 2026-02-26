'use client';

import { motion } from 'motion/react';

type Grade = 'danger' | 'warning' | 'safe';

interface BadgeProps {
  grade: Grade;
  label: string;
}

const gradeConfig: Record<Grade, { bg: string; text: string; ring: string; dot: string }> = {
  danger: {
    bg: 'bg-red-50',
    text: 'text-red-600',
    ring: 'ring-red-200',
    dot: 'bg-red-500',
  },
  warning: {
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    ring: 'ring-amber-200',
    dot: 'bg-amber-500',
  },
  safe: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    ring: 'ring-emerald-200',
    dot: 'bg-emerald-500',
  },
};

export default function Badge({ grade, label }: BadgeProps) {
  const config = gradeConfig[grade];

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ${config.bg} ${config.text} ${config.ring}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${config.dot}`} />
      {label}
    </motion.div>
  );
}
