import type { JeonseRateGrade } from '@/types/filter'
import { JEONSE_RATE_THRESHOLDS } from '@/constants/filter'

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
