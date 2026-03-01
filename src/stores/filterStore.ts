import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { PropertyType, NumericRange } from '@/types/filter'
import type { AreaBandId } from '@/types/ranking'

interface FilterState {
  // ── 상태 ──
  /** 매물 유형 */
  propertyType: PropertyType
  /** 조회 개월 수 (기본: 6) */
  months: number
  /** 가격 범위 필터 (만원) */
  priceRange: NumericRange | null
  /** 면적 범위 필터 (㎡) */
  areaRange: NumericRange | null
  /** 면적대 필터 (전월세 단지 랭킹) */
  areaBand: AreaBandId

  // ── 액션 ──
  setPropertyType: (type: PropertyType) => void
  setMonths: (months: number) => void
  setPriceRange: (range: NumericRange | null) => void
  setAreaRange: (range: NumericRange | null) => void
  setAreaBand: (band: AreaBandId) => void
  resetFilters: () => void
}

const initialState = {
  propertyType: 'apartment' as PropertyType,
  months: 6,
  priceRange: null,
  areaRange: null,
  areaBand: 'all' as AreaBandId,
}

export const useFilterStore = create<FilterState>()(
  devtools(
    (set) => ({
      ...initialState,

      setPropertyType: (type) => set({ propertyType: type }, false, 'filter/setPropertyType'),
      setMonths: (months) => set({ months }, false, 'filter/setMonths'),
      setPriceRange: (range) => set({ priceRange: range }, false, 'filter/setPriceRange'),
      setAreaRange: (range) => set({ areaRange: range }, false, 'filter/setAreaRange'),
      setAreaBand: (band) => set({ areaBand: band }, false, 'filter/setAreaBand'),
      resetFilters: () => set(initialState, false, 'filter/resetFilters'),
    }),
    { name: 'filterStore', enabled: process.env.NODE_ENV === 'development' }
  )
)
