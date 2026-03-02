import type { RentItem } from './rent'
import type { TradeItem } from './trade'
import type { JeonseRateGrade } from './filter'

/** 면적대 ID */
export type AreaBandId = 'all' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'

/** 면적대 정의 */
export interface AreaBand {
  id: AreaBandId
  label: string
  /** 최소 면적 (㎡), null이면 하한 없음 */
  min: number | null
  /** 최대 면적 (㎡), null이면 상한 없음 */
  max: number | null
}

/** 면적대별 요약 통계 */
export interface AreaBandStats {
  bandId: AreaBandId
  /** 전세 중위 보증금 (만원) */
  medianDeposit: number
  /** 전세 보증금 IQR { q1, q3 } */
  depositIQR: { q1: number; q3: number }
  /** 월세 중위 보증금 (만원) */
  medianMonthlyDeposit: number
  /** 월세 중위 월세 (만원) */
  medianMonthlyRent: number
  totalCount: number
  jeonseCount: number
  monthlyCount: number
  /** 표본 부족 여부 */
  isLowSample: boolean
}

/** 단지별 랭킹 항목 */
export interface AptRankItem {
  aptName: string
  countTotal: number
  countJeonse: number
  countMonthly: number
  /** 전세 중위 보증금 (만원) */
  medianDeposit: number
  /** 월세 중위 월세 (만원) */
  medianMonthlyRent: number
  /** 월세 중위 보증금 (만원) */
  medianMonthlyDeposit: number
  /** 대표 면적 (㎡, 중위) */
  medianArea: number
  /** 대표 법정동 "역삼동" */
  dong: string
  /** 대표 지번 "123-4" */
  jibun: string
  /** 최근 거래 내역 (최대 10건) */
  recentItems: RentItem[]
}

/** 매매 단지별 랭킹 항목 */
export interface TradeRankItem {
  aptName: string
  countTotal: number
  /** 중위 매매가 (만원) */
  medianPrice: number
  /** 대표 면적 (㎡, 중위) */
  medianArea: number
  /** 대표 법정동 */
  dong: string
  /** 대표 지번 */
  jibun: string
  /** 최근 거래 내역 (최대 10건) */
  recentItems: TradeItem[]
}

/** 매매 랭킹 정렬 기준 */
export type TradeSortKey = 'countTotal' | 'medianPrice'

/** 전월세 랭킹 정렬 기준 */
export type RankSortKey = 'countTotal' | 'medianDeposit' | 'medianMonthlyRent'

/** 정렬 방향 */
export type RankSortDir = 'asc' | 'desc'

/** 단지 상세 — 면적별 시세 */
export interface AreaBreakdownItem {
  areaLabel: string
  medianValue: number
  count: number
}

/** 단지 상세 — 월별 추이 */
export interface MonthlyTrendItem {
  ym: string
  medianValue: number
  count: number
}

/** 평형대별 가격 분포 */
export interface PriceDistributionItem {
  bandId: AreaBandId
  bandLabel: string
  tradeMedian: number
  tradeQ1: number
  tradeQ3: number
  tradeCount: number
  rentMedian: number
  rentQ1: number
  rentQ3: number
  rentCount: number
}

/** 전세가율 면적대별 분석 */
export interface JeonseRatioBandItem {
  bandId: AreaBandId
  bandLabel: string
  tradeMedian: number
  jeonseMedian: number
  ratio: number
  grade: JeonseRateGrade
  tradeCount: number
  jeonseCount: number
  isLowSample: boolean
}
