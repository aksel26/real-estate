import type { PropertyType } from '@/types/filter'

/** 매물 유형 선택 항목 */
export const PROPERTY_TYPES: Array<{ label: string; value: PropertyType }> = [
  { label: '아파트', value: 'apartment' },
  { label: '오피스텔', value: 'officetel' },
  { label: '연립다세대', value: 'rowhouse' },
]

/** 기본 조회 개월 수 */
export const DEFAULT_MONTHS = 6

/** 선택 가능한 조회 기간 옵션 */
export const PERIOD_OPTIONS: Array<{ label: string; value: number }> = [
  { label: '3개월', value: 3 },
  { label: '6개월', value: 6 },
  { label: '12개월', value: 12 },
]

/**
 * 전세가율 임계값 (%)
 * danger: ≥80%, warning: 60-80%, safe: <60%
 */
export const JEONSE_RATE_THRESHOLDS = {
  danger: 80,
  warning: 60,
} as const

/**
 * 표본 수 충분 여부 임계값
 * sampleCount >= 30 → 충분, < 30 → 부족
 */
export const SAMPLE_COUNT_THRESHOLD = 30
