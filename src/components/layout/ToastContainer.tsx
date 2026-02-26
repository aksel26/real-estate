'use client';

import { AnimatePresence, motion } from 'motion/react';

type ToastType = 'error' | 'info' | 'success';

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

const typeConfig: Record<ToastType, { bg: string; text: string; icon: React.ReactNode }> = {
  error: {
    bg: 'bg-red-50 ring-1 ring-red-200',
    text: 'text-red-700',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="7" stroke="#ef4444" strokeWidth="1.5" />
        <path d="M8 5v3.5M8 11v.5" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  info: {
    bg: 'bg-blue-50 ring-1 ring-blue-200',
    text: 'text-blue-700',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="7" stroke="#3b82f6" strokeWidth="1.5" />
        <path d="M8 7v4M8 5v.5" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  success: {
    bg: 'bg-emerald-50 ring-1 ring-emerald-200',
    text: 'text-emerald-700',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="7" stroke="#10b981" strokeWidth="1.5" />
        <path d="M5 8l2 2 4-4" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
};

export default function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div
      className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none"
      aria-live="polite"
      aria-label="알림"
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const config = typeConfig[toast.type];
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 48, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 48, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              className={`pointer-events-auto flex items-start gap-2.5 px-4 py-3 rounded-xl shadow-lg max-w-sm ${config.bg}`}
              role="alert"
            >
              <span className="flex-shrink-0 mt-0.5">{config.icon}</span>
              <p className={`text-sm font-medium leading-snug flex-1 ${config.text}`}>
                {toast.message}
              </p>
              <motion.button
                onClick={() => onDismiss(toast.id)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`flex-shrink-0 mt-0.5 cursor-pointer ${config.text} opacity-60 hover:opacity-100 transition-opacity`}
                aria-label="닫기"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path
                    d="M1 1l12 12M13 1L1 13"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </motion.button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
