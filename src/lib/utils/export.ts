import { formatPrice, formatPercent, formatVolume } from './format'
import type { NeighborhoodReport } from '@/types'

function formatYm(ym: string): string {
  return `${ym.slice(0, 4)}.${ym.slice(4, 6)}`
}

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

export function generateMarkdownReport(report: NeighborhoodReport): string {
  const { region, trade, rent, jeonseRate, period, sampleCount, summary } = report

  const tradeArrow = TREND_ARROWS[trade.trend] ?? '─'
  const tradeTrend =
    trade.trendPercent !== 0
      ? `${tradeArrow}${Math.abs(trade.trendPercent).toFixed(1)}%`
      : '변동없음'

  const jeonseLabel = JEONSE_LABELS[jeonseRate.level] ?? ''

  const lines: string[] = [
    `# ${region.name} 동네 리포트 (최근 ${period.months}개월)`,
    '',
    `> ${summary}`,
    '',
    '## 매매',
    `- 중위 매매가: ${formatPrice(trade.medianPrice)}`,
    `- 변화율: ${tradeTrend}`,
    `- 거래량: ${formatVolume(trade.totalCount)}`,
    `- 가격 범위: ${formatPrice(trade.priceRange.q1)} ~ ${formatPrice(trade.priceRange.q3)}`,
    '',
    '## 전월세',
    `- 전세 중위 보증금: ${formatPrice(rent.medianDeposit)}`,
    `- 월세 중위: ${rent.medianMonthly.toLocaleString('ko-KR')}만원`,
    `- 전세 ${rent.jeonseCount.toLocaleString('ko-KR')}건 / 월세 ${rent.monthlyCount.toLocaleString('ko-KR')}건`,
    '',
    '## 전세가율',
    `- ${formatPercent(jeonseRate.value)} (${jeonseLabel})`,
    '',
    '---',
    `기간: ${formatYm(period.startYm)} ~ ${formatYm(period.endYm)} | 표본수: 매매 ${formatVolume(sampleCount.trade)}, 전월세 ${formatVolume(sampleCount.rent)}`,
    '데이터 출처: 공공데이터포털 실거래가 | 참고용 집계이며 투자 판단의 근거로 사용할 수 없습니다.',
  ]

  return lines.join('\n')
}
