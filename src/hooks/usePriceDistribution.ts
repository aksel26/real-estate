'use client'

import { useMemo } from 'react'
import { useMultiMonthTrades } from './useMultiMonthTrades'
import { useMultiMonthRents } from './useMultiMonthRents'
import { computePriceDistribution } from '@/lib/utils'
import type { PriceDistributionItem } from '@/types'

export function usePriceDistribution() {
  const { items: tradeItems, isLoading: tradeLoading } = useMultiMonthTrades()
  const { items: rentItems, isLoading: rentLoading } = useMultiMonthRents()

  const isLoading = tradeLoading || rentLoading

  const distribution = useMemo<PriceDistributionItem[]>(() => {
    if (tradeItems.length === 0 && rentItems.length === 0) return []
    return computePriceDistribution(tradeItems, rentItems)
  }, [tradeItems, rentItems])

  return { distribution, isLoading }
}
