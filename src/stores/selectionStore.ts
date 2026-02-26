import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface SelectionState {
  // ── 상태 ──
  /** 법정동 코드 (예: "11680") */
  selectedLawd: string | null
  /** 표시용 이름 (예: "서울 강남구") */
  selectedRegionName: string | null
  /** 지도 폴리곤 식별자 */
  selectedPolygonId: string | null

  // ── 액션 ──
  selectRegion: (lawd: string, name: string, polygonId?: string) => void
  clearSelection: () => void
}

export const useSelectionStore = create<SelectionState>()(
  devtools(
    (set) => ({
      selectedLawd: null,
      selectedRegionName: null,
      selectedPolygonId: null,

      selectRegion: (lawd, name, polygonId) =>
        set(
          {
            selectedLawd: lawd,
            selectedRegionName: name,
            selectedPolygonId: polygonId ?? lawd,
          },
          false,
          'selection/selectRegion'
        ),

      clearSelection: () =>
        set(
          {
            selectedLawd: null,
            selectedRegionName: null,
            selectedPolygonId: null,
          },
          false,
          'selection/clearSelection'
        ),
    }),
    { name: 'selectionStore', enabled: process.env.NODE_ENV === 'development' }
  )
)
