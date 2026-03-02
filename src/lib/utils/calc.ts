import type { JeonseRateGrade } from '@/types/filter'
import type { PriceDistributionItem, JeonseRatioBandItem } from '@/types/ranking'
import type { TradeItem } from '@/types/trade'
import type { RentItem } from '@/types/rent'
import { JEONSE_RATE_THRESHOLDS } from '@/constants/filter'
import { AREA_BANDS } from '@/constants/ranking'

/**
 * 숫자 배열의 중위값(median)을 계산
 * @param numbers 숫자 배열
 * @returns 중위값, 빈 배열이면 0
 */
export function calculateMedian(numbers: number[]): number {
  if (numbers.length === 0) return 0

  const sorted = [...numbers].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)

  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2
  }
  return sorted[mid]
}

/**
 * 숫자 배열의 특정 분위수(quantile)를 계산
 * @param numbers 숫자 배열
 * @param q 0~1 범위의 분위 (0.25 = Q1, 0.75 = Q3)
 * @returns 분위값
 */
export function calculateQuantile(numbers: number[], q: number): number {
  if (numbers.length === 0) return 0

  const sorted = [...numbers].sort((a, b) => a - b)
  const pos = (sorted.length - 1) * q
  const base = Math.floor(pos)
  const rest = pos - base

  if (base + 1 < sorted.length) {
    return sorted[base] + rest * (sorted[base + 1] - sorted[base])
  }
  return sorted[base]
}

/**
 * 전세가율(%)과 등급을 계산
 * @param depositMedian 전세 중위 보증금 (만원)
 * @param priceMedian 매매 중위가 (만원)
 * @returns { rate: number, grade: JeonseRateGrade }
 */
export function calculateJeonseRate(
  depositMedian: number,
  priceMedian: number
): { rate: number; grade: JeonseRateGrade } {
  if (priceMedian === 0) {
    return { rate: 0, grade: 'safe' }
  }

  const rate = (depositMedian / priceMedian) * 100

  let grade: JeonseRateGrade
  if (rate >= JEONSE_RATE_THRESHOLDS.danger) {
    grade = 'danger'
  } else if (rate >= JEONSE_RATE_THRESHOLDS.warning) {
    grade = 'warning'
  } else {
    grade = 'safe'
  }

  return { rate, grade }
}

/**
 * 숫자 배열의 평균을 계산
 * @param numbers 숫자 배열
 * @returns 평균값, 빈 배열이면 0
 */
export function calculateMean(numbers: number[]): number {
  if (numbers.length === 0) return 0
  return numbers.reduce((sum, n) => sum + n, 0) / numbers.length
}

/**
 * 두 값 사이의 변동률(%)을 계산
 * @param from 시작값
 * @param to 종료값
 * @returns 변동률 (양수: 상승, 음수: 하락)
 */
export function calculateChangeRate(from: number, to: number): number {
  if (from === 0) return 0
  return ((to - from) / from) * 100
}

function filterItemsByBand<T extends { area: number }>(
  items: T[],
  min: number | null,
  max: number | null,
): T[] {
  return items.filter((item) => {
    if (min !== null && item.area < min) return false
    if (max !== null && item.area >= max) return false
    return true
  })
}

/**
 * 면적대별 매매/전세 가격 분포 계산
 */
export function computePriceDistribution(
  tradeItems: TradeItem[],
  rentItems: RentItem[],
): PriceDistributionItem[] {
  const jeonseItems = rentItems.filter((i) => i.rentType === 'jeonse')

  return AREA_BANDS.filter((b) => b.id !== 'all').map((band) => {
    const trades = filterItemsByBand(tradeItems, band.min, band.max)
    const rents = filterItemsByBand(jeonseItems, band.min, band.max)

    const tradePrices = trades.map((t) => t.price)
    const rentDeposits = rents.map((r) => r.deposit)

    return {
      bandId: band.id,
      bandLabel: band.label,
      tradeMedian: calculateMedian(tradePrices),
      tradeQ1: calculateQuantile(tradePrices, 0.25),
      tradeQ3: calculateQuantile(tradePrices, 0.75),
      tradeCount: trades.length,
      rentMedian: calculateMedian(rentDeposits),
      rentQ1: calculateQuantile(rentDeposits, 0.25),
      rentQ3: calculateQuantile(rentDeposits, 0.75),
      rentCount: rents.length,
    }
  })
}

/**
 * 면적대별 전세가율 계산
 */
export function computeJeonseRatioByBand(
  tradeItems: TradeItem[],
  rentItems: RentItem[],
): JeonseRatioBandItem[] {
  const jeonseItems = rentItems.filter((i) => i.rentType === 'jeonse')

  return AREA_BANDS.filter((b) => b.id !== 'all').map((band) => {
    const trades = filterItemsByBand(tradeItems, band.min, band.max)
    const rents = filterItemsByBand(jeonseItems, band.min, band.max)

    const tradeMedian = calculateMedian(trades.map((t) => t.price))
    const jeonseMedian = calculateMedian(rents.map((r) => r.deposit))

    const { rate, grade } = calculateJeonseRate(jeonseMedian, tradeMedian)

    return {
      bandId: band.id,
      bandLabel: band.label,
      tradeMedian,
      jeonseMedian,
      ratio: rate,
      grade,
      tradeCount: trades.length,
      jeonseCount: rents.length,
      isLowSample: trades.length < 5 || rents.length < 5,
    }
  })
}
