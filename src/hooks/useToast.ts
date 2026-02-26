'use client';

import { useState, useCallback } from 'react';

type ToastType = 'error' | 'info' | 'success';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface UseToastReturn {
  toasts: Toast[];
  addToast: (message: string, type: ToastType) => void;
  removeToast: (id: string) => void;
}

const MAX_TOASTS = 3;

let counter = 0;
function generateId(): string {
  return `toast-${Date.now()}-${++counter}`;
}

export function useToast(): UseToastReturn {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message: string, type: ToastType) => {
      const id = generateId();
      setToasts((prev) => {
        const next = [...prev, { id, message, type }];
        // Remove oldest if over limit
        return next.length > MAX_TOASTS ? next.slice(next.length - MAX_TOASTS) : next;
      });

      // Auto-remove after 5 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);
    },
    []
  );

  return { toasts, addToast, removeToast };
}
