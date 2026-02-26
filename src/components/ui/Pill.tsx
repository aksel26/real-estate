'use client';

import { motion, AnimatePresence } from 'motion/react';

interface PillProps {
  label: string;
  onRemove: () => void;
}

export default function Pill({ label, onRemove }: PillProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0.6, opacity: 0, y: -6 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.7, opacity: 0, y: -4 }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 28,
          mass: 0.8,
        }}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-full shadow-sm"
      >
        <span className="max-w-[160px] truncate">{label}</span>
        <motion.button
          onClick={onRemove}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="flex items-center justify-center w-4 h-4 rounded-full bg-white/20 hover:bg-white/35 transition-colors flex-shrink-0 cursor-pointer"
          aria-label="지역 선택 해제"
        >
          <svg
            width="8"
            height="8"
            viewBox="0 0 8 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M1 1L7 7M7 1L1 7"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
}
