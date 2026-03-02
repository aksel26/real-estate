'use client'

import { useMemo } from 'react'
import { useMultiMonthTrades } from './useMultiMonthTrades'
import { useMultiMonthRents } from './useMultiMonthRents'
import { computeJeonseRatioByBand, calculateJeonseRate, calculateMedian } from '@/lib/utils'
import type { JeonseRatioBandItem } from '@/types'
import type { JeonseRateGrade } from '@/types/filter'

interface JeonseRatioResult {
  bands: JeonseRatioBandItem[]
  overall: { ratio: number; grade: JeonseRateGrade }
  isLoading: boolean
}

export function useJeonseRatio(): JeonseRatioResult {
  const { items: tradeItems, isLoading: tradeLoading } = useMultiMonthTrades()
  const { items: rentItems, isLoading: rentLoading } = useMultiMonthRents()

  const isLoading = tradeLoading || rentLoading

  const bands = useMemo<JeonseRatioBandItem[]>(() => {
    if (tradeItems.length === 0 && rentItems.length === 0) return []
    return computeJeonseRatioByBand(tradeItems, rentItems)
  }, [tradeItems, rentItems])

  const overall = useMemo(() => {
    const tradePrices = tradeItems.map((t) => t.price)
    const jeonseDeposits = rentItems
      .filter((r) => r.rentType === 'jeonse')
      .map((r) => r.deposit)

    const tradeMedian = calculateMedian(tradePrices)
    const jeonseMedian = calculateMedian(jeonseDeposits)
    const { rate, grade } = calculateJeonseRate(jeonseMedian, tradeMedian)
    return { ratio: rate, grade }
  }, [tradeItems, rentItems])

  return { bands, overall, isLoading }
}
