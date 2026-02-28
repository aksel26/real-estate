import type { PropertyType } from './filter'

/** 추세 방향 */
export type TrendDirection = 'up' | 'down' | 'flat'

/** 사분위수 범위 */
export interface QuantileRange {
  min: number
  max: number
  /** 25% 분위 */
  q1: number
  /** 75% 분위 */
  q3: number
}

/** 개별 매매 거래 항목 */
export interface TradeItem {
  /** 단지명 */
  aptName: string
  /** 전용면적 (㎡) */
  area: number
  /** 거래금액 (만원) */
  price: number
  /** 층 */
  floor: number
  /** 거래일 "2026-01-15" */
  dealDate: string
  /** 지번 */
  jibun: string
  /** 건축년도 */
  builtYear: number
}

/** 월별 매매 데이터 메타 */
export interface TradeMeta {
  lawd: string
  /** 연월 "YYYYMM" */
  ym: string
  propertyType: PropertyType
  totalCount: number
  /** ISO 8601 */
  fetchedAt: string
}

/** 월별 매매 데이터 */
export interface TradeSummary {
  items: TradeItem[]
  meta: TradeMeta
}

/** 매매 집계 요약 */
export interface TradeReport {
  medianPrice: number
  totalCount: number
  priceRange: QuantileRange
  trend: TrendDirection
  trendPercent: number
  sampleCount: number
}
