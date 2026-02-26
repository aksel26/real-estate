import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { PropertyType, NumericRange } from '@/types/filter'

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

  // ── 액션 ──
  setPropertyType: (type: PropertyType) => void
  setMonths: (months: number) => void
  setPriceRange: (range: NumericRange | null) => void
  setAreaRange: (range: NumericRange | null) => void
  resetFilters: () => void
}

const initialState = {
  propertyType: 'apartment' as PropertyType,
  months: 6,
  priceRange: null,
  areaRange: null,
}

export const useFilterStore = create<FilterState>()(
  devtools(
    (set) => ({
      ...initialState,

      setPropertyType: (type) => set({ propertyType: type }, false, 'filter/setPropertyType'),
      setMonths: (months) => set({ months }, false, 'filter/setMonths'),
      setPriceRange: (range) => set({ priceRange: range }, false, 'filter/setPriceRange'),
      setAreaRange: (range) => set({ areaRange: range }, false, 'filter/setAreaRange'),
      resetFilters: () => set(initialState, false, 'filter/resetFilters'),
    }),
    { name: 'filterStore', enabled: process.env.NODE_ENV === 'development' }
  )
)
