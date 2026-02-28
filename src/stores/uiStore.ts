import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export type ReportTab = 'trade' | 'rent' | 'overview'
export type SheetSnap = 'peek' | 'half' | 'full'

interface UIState {
  // ── 상태 ──
  rightPanelOpen: boolean
  activeTab: ReportTab
  sheetSnap: SheetSnap

  // ── 액션 ──
  openPanel: () => void
  closePanel: () => void
  togglePanel: () => void
  setActiveTab: (tab: ReportTab) => void
  setSheetSnap: (snap: SheetSnap) => void
}

export const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      rightPanelOpen: false,
      activeTab: 'trade',
      sheetSnap: 'half',

      openPanel: () => set({ rightPanelOpen: true, sheetSnap: 'half' }, false, 'ui/openPanel'),
      closePanel: () => set({ rightPanelOpen: false }, false, 'ui/closePanel'),
      togglePanel: () =>
        set((s) => ({ rightPanelOpen: !s.rightPanelOpen, ...(s.rightPanelOpen ? {} : { sheetSnap: 'half' as const }) }), false, 'ui/togglePanel'),
      setActiveTab: (tab) => set({ activeTab: tab }, false, 'ui/setActiveTab'),
      setSheetSnap: (snap) => set({ sheetSnap: snap }, false, 'ui/setSheetSnap'),
    }),
    { name: 'uiStore', enabled: process.env.NODE_ENV === 'development' }
  )
)
