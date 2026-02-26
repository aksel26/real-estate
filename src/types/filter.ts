/** 매물 유형 */
export type PropertyType = 'apartment' | 'officetel' | 'rowhouse'

/** 매물 유형 표시 레이블 */
export const PROPERTY_TYPE_LABEL: Record<PropertyType, string> = {
  apartment: '아파트',
  officetel: '오피스텔',
  rowhouse: '연립다세대',
}

/** 숫자 범위 */
export interface NumericRange {
  min: number
  max: number
}

/** 가격 범위 (만원) */
export type PriceRange = NumericRange

/** 기간 필터 (조회 개월 수) */
export interface PeriodFilter {
  months: number
}

/** 필터 전체 상태 */
export interface FilterState {
  propertyType: PropertyType
  months: number
  priceRange: PriceRange | null
  areaRange: NumericRange | null
}

/** 전세가율 등급 */
export type JeonseRateGrade = 'danger' | 'warning' | 'safe'
