'use client';

import { motion } from 'motion/react';

interface ChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export default function Chip({ label, selected, onClick }: ChipProps) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.94 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={`relative px-2.5 py-1 md:px-3 md:py-1.5 rounded-full text-xs md:text-sm font-medium transition-colors cursor-pointer select-none ${
        selected
          ? 'bg-blue-600 text-white shadow-sm'
          : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-slate-300 hover:text-slate-800'
      }`}
    >
      {selected && (
        <motion.span
          layoutId="chip-selected-bg"
          className="absolute inset-0 rounded-full bg-blue-600"
          style={{ zIndex: -1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}
      {label}
    </motion.button>
  );
}
