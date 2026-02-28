import { create } from 'zustand'

type ToastType = 'error' | 'info' | 'success'

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastState {
  toasts: Toast[]
  addToast: (message: string, type: ToastType) => void
  removeToast: (id: string) => void
}

const MAX_TOASTS = 3
let counter = 0
function generateId(): string {
  return `toast-${Date.now()}-${++counter}`
}

export const useToastStore = create<ToastState>()((set) => ({
  toasts: [],

  addToast: (message, type) => {
    const id = generateId()
    set((state) => {
      const next = [...state.toasts, { id, message, type }]
      return { toasts: next.length > MAX_TOASTS ? next.slice(next.length - MAX_TOASTS) : next }
    })

    // Auto-remove after 5 seconds
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
    }, 5000)
  },

  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
  },
}))
