import { formatPrice, formatPercent, formatVolume } from './format'
import type { NeighborhoodReport } from '@/types'

const TREND_ARROWS: Record<string, string> = {
  up: '▲',
  down: '▼',
  flat: '─',
}

const JEONSE_LABELS: Record<string, string> = {
  caution: '주의',
  normal: '보통',
  good: '양호',
}

export function generateSummary(report: NeighborhoodReport): string {
  const { trade, jeonseRate, period } = report

  const arrow = TREND_ARROWS[trade.trend] ?? '─'
  const trendText =
    trade.trendPercent !== 0
      ? `${arrow}${Math.abs(trade.trendPercent).toFixed(1)}%`
      : '변동없음'

  const jeonseLabel = JEONSE_LABELS[jeonseRate.level] ?? ''

  return `최근 ${period.months}개월 중위 매매가 ${formatPrice(trade.medianPrice)}(${trendText}), 거래량 ${formatVolume(trade.totalCount)}, 전세가율 ${formatPercent(jeonseRate.value)}(${jeonseLabel})`
}
