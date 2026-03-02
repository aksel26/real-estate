import type { PropertyType } from './filter'
import type { QuantileRange, TrendDirection } from './trade'

/** 전세/월세 구분 */
export type RentType = 'jeonse' | 'monthly'

/** 개별 전월세 거래 항목 */
export interface RentItem {
  /** 단지명 */
  aptName: string
  /** 전용면적 (㎡) */
  area: number
  rentType: RentType
  /** 보증금 (만원) */
  deposit: number
  /** 월세 (만원, 전세면 0) */
  monthlyRent: number
  /** 층 */
  floor: number
  /** 거래일 "2026-01-15" */
  dealDate: string
  /** 법정동 이름 "역삼동" */
  dong: string
  /** 지번 */
  jibun: string
  /** 건축년도 */
  builtYear: number
}

/** 월별 전월세 데이터 메타 */
export interface RentMeta {
  lawd: string
  /** 연월 "YYYYMM" */
  ym: string
  propertyType: PropertyType
  totalCount: number
  /** ISO 8601 */
  fetchedAt: string
}

/** 월별 전월세 데이터 */
export interface RentSummary {
  items: RentItem[]
  meta: RentMeta
}

/** 전월세 집계 요약 */
export interface RentReport {
  /** 전세 중위 보증금 (만원) */
  medianDeposit: number
  /** 월세 중위 월세 (만원) */
  medianMonthly: number
  totalCount: number
  jeonseCount: number
  monthlyCount: number
  depositRange: QuantileRange
  sampleCount: number
  trend: TrendDirection
  trendPercent: number
}
