'use client'

import { useMemo } from 'react'
import { useMultiMonthRents } from './useMultiMonthRents'
import { useMultiMonthTrades } from './useMultiMonthTrades'
import { computeAreaBreakdown, computeMonthlyTrend } from '@/lib/utils'
import type { AreaBreakdownItem, MonthlyTrendItem } from '@/types'
import type { RentItem } from '@/types/rent'
import type { TradeItem } from '@/types/trade'

export function useAptDetail(aptName: string | null, mode: 'rent' | 'trade') {
  const { items: rentItems, isLoading: rentLoading } = useMultiMonthRents()
  const { items: tradeItems, isLoading: tradeLoading } = useMultiMonthTrades()

  const isLoading = mode === 'rent' ? rentLoading : tradeLoading

  const filteredRentItems = useMemo(() => {
    if (!aptName || mode !== 'rent') return [] as RentItem[]
    return rentItems.filter((item) => item.aptName === aptName)
  }, [aptName, mode, rentItems])

  const filteredTradeItems = useMemo(() => {
    if (!aptName || mode !== 'trade') return [] as TradeItem[]
    return tradeItems.filter((item) => item.aptName === aptName)
  }, [aptName, mode, tradeItems])

  const areaBreakdown = useMemo(() => {
    if (mode === 'rent') {
      return computeAreaBreakdown(filteredRentItems, 'deposit')
    }
    return computeAreaBreakdown(filteredTradeItems, 'price')
  }, [mode, filteredRentItems, filteredTradeItems])

  const monthlyTrend = useMemo(() => {
    if (mode === 'rent') {
      return computeMonthlyTrend(filteredRentItems, 'deposit')
    }
    return computeMonthlyTrend(filteredTradeItems, 'price')
  }, [mode, filteredRentItems, filteredTradeItems])

  const allItems = mode === 'rent' ? filteredRentItems : filteredTradeItems

  return { allItems, areaBreakdown, monthlyTrend, isLoading }
}
