'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useLoadingState } from '@/hooks/useLoadingState';

export default function GlobalStatusBar() {
  const { isAnyLoading, hasError } = useLoadingState();

  const isVisible = isAnyLoading || hasError;

  const barColor = hasError
    ? 'bg-red-500'
    : 'bg-blue-500';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="global-status-bar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed top-0 left-0 right-0 z-50 h-0.5 overflow-hidden"
          role="progressbar"
          aria-label="데이터 불러오는 중"
          aria-busy={isAnyLoading}
        >
          <motion.div
            className={`h-full ${barColor}`}
            initial={{ width: '0%' }}
            animate={{ width: isAnyLoading ? '85%' : '100%' }}
            transition={
              isAnyLoading
                ? { duration: 8, ease: [0.1, 0.5, 0.8, 1.0] }
                : { duration: 0.3, ease: 'easeOut' }
            }
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
