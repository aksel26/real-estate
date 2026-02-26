import type { PropertyType } from './filter'
import type { TradeReport } from './trade'
import type { RentReport } from './rent'

/** 전세가율 레벨 */
export type JeonseRateLevel = 'caution' | 'normal' | 'good'
// caution: 70% 이상 (깡통전세 위험)
// normal: 50~70%
// good: 50% 미만

/** 전세가율 정보 */
export interface PriceStats {
  /** 전세가율 (%) = 전세 중위 보증금 / 매매 중위가 × 100 */
  value: number
  level: JeonseRateLevel
  /** "전세가율 72.3% — 주의" */
  description: string
}

/** 월별 트렌드 데이터 포인트 */
export interface TrendPoint {
  /** 연월 "YYYYMM" */
  ym: string
  tradeCount: number
  tradeMedianPrice: number
  rentCount: number
  rentMedianDeposit: number
}

/** 리포트 전체 응답 */
export interface NeighborhoodReport {
  region: {
    lawd: string
    name: string
  }
  propertyType: PropertyType
  period: {
    months: number
    /** "202507" */
    startYm: string
    /** "202601" */
    endYm: string
  }
  trade: TradeReport
  rent: RentReport
  jeonseRate: PriceStats
  monthly: TrendPoint[]
}
