'use client'

import Badge from './Badge'
import { SAMPLE_COUNT_THRESHOLD } from '@/constants/filter'

interface Props {
  sampleCount: number
  threshold?: number
}

export default function SampleCountBadge({ sampleCount, threshold = SAMPLE_COUNT_THRESHOLD }: Props) {
  const isSufficient = sampleCount >= threshold
  return (
    <Badge
      grade={isSufficient ? 'safe' : 'warning'}
      label={`표본 ${isSufficient ? '충분' : '부족'} (${sampleCount.toLocaleString('ko-KR')}건)`}
    />
  )
}
