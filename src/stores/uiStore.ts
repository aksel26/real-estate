import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { RankSortKey, RankSortDir } from '@/types/ranking'

export type ReportTab = 'overview' | 'lease' | 'trade'
export type SheetSnap = 'peek' | 'half' | 'full'

interface UIState {
  // ── 상태 ──
  rightPanelOpen: boolean
  activeTab: ReportTab
  sheetSnap: SheetSnap
  /** 단지 드릴다운 선택 */
  selectedAptName: string | null
  /** 랭킹 정렬 기준 */
  rankSortKey: RankSortKey
  /** 랭킹 정렬 방향 */
  rankSortDir: RankSortDir

  // ── 액션 ──
  openPanel: () => void
  closePanel: () => void
  togglePanel: () => void
  setActiveTab: (tab: ReportTab) => void
  setSheetSnap: (snap: SheetSnap) => void
  selectApt: (aptName: string) => void
  clearAptSelection: () => void
  setRankSort: (key: RankSortKey, dir: RankSortDir) => void
}

export const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      rightPanelOpen: false,
      activeTab: 'lease',
      sheetSnap: 'half',
      selectedAptName: null,
      rankSortKey: 'countTotal',
      rankSortDir: 'desc',

      openPanel: () => set({ rightPanelOpen: true, sheetSnap: 'half' }, false, 'ui/openPanel'),
      closePanel: () => set({ rightPanelOpen: false }, false, 'ui/closePanel'),
      togglePanel: () =>
        set((s) => ({ rightPanelOpen: !s.rightPanelOpen, ...(s.rightPanelOpen ? {} : { sheetSnap: 'half' as const }) }), false, 'ui/togglePanel'),
      setActiveTab: (tab) => set({ activeTab: tab, selectedAptName: null }, false, 'ui/setActiveTab'),
      setSheetSnap: (snap) => set({ sheetSnap: snap }, false, 'ui/setSheetSnap'),
      selectApt: (aptName) => set({ selectedAptName: aptName }, false, 'ui/selectApt'),
      clearAptSelection: () => set({ selectedAptName: null }, false, 'ui/clearAptSelection'),
      setRankSort: (key, dir) => set({ rankSortKey: key, rankSortDir: dir }, false, 'ui/setRankSort'),
    }),
    { name: 'uiStore', enabled: process.env.NODE_ENV === 'development' }
  )
)
