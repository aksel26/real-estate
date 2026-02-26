import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export type ReportTab = 'trade' | 'rent' | 'overview'

interface UIState {
  // ── 상태 ──
  rightPanelOpen: boolean
  activeTab: ReportTab

  // ── 액션 ──
  openPanel: () => void
  closePanel: () => void
  togglePanel: () => void
  setActiveTab: (tab: ReportTab) => void
}

export const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      rightPanelOpen: false,
      activeTab: 'trade',

      openPanel: () => set({ rightPanelOpen: true }, false, 'ui/openPanel'),
      closePanel: () => set({ rightPanelOpen: false }, false, 'ui/closePanel'),
      togglePanel: () =>
        set((s) => ({ rightPanelOpen: !s.rightPanelOpen }), false, 'ui/togglePanel'),
      setActiveTab: (tab) => set({ activeTab: tab }, false, 'ui/setActiveTab'),
    }),
    { name: 'uiStore', enabled: process.env.NODE_ENV === 'development' }
  )
)
