'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { useSelectionStore, useUIStore } from '@/stores'
import { useAptRanking } from './useAptRanking'
import { useTradeRanking } from './useTradeRanking'
import { geocodeBatch, buildAddressInput, clearGeocodeCache } from '@/lib/utils/geocode'
import type { AddressInput, GeocodedPoint } from '@/lib/utils/geocode'
import { MAX_MARKERS } from '@/constants/map'

export interface AptMarker {
  aptName: string
  position: GeocodedPoint
  rank: number
  tabType: 'trade' | 'lease'
  displayPrice: number
}

interface MarkerSource {
  aptName: string
  dong: string
  jibun: string
  displayPrice: number
}

export function useAptMarkers() {
  const activeTab = useUIStore((s) => s.activeTab)
  const selectedRegionName = useSelectionStore((s) => s.selectedRegionName)
  const selectedLawd = useSelectionStore((s) => s.selectedLawd)

  const { rankedApts: leaseRanked, isLoading: leaseLoading } = useAptRanking()
  const { rankedApts: tradeRanked, isLoading: tradeLoading } = useTradeRanking()

  const [markers, setMarkers] = useState<AptMarker[]>([])
  const [isGeocoding, setIsGeocoding] = useState(false)
  const prevLawdRef = useRef<string | null>(null)

  // 탭에 따라 MarkerSource[] 생성
  const { sources, isLoading, tabType } = useMemo(() => {
    if (activeTab === 'lease') {
      const sources: MarkerSource[] = leaseRanked.map((a) => ({
        aptName: a.aptName,
        dong: a.dong,
        jibun: a.jibun,
        displayPrice: a.countJeonse > 0 ? a.medianDeposit : a.medianMonthlyRent,
      }))
      return { sources, isLoading: leaseLoading, tabType: 'lease' as const }
    }
    if (activeTab === 'trade') {
      const sources: MarkerSource[] = tradeRanked.map((a) => ({
        aptName: a.aptName,
        dong: a.dong,
        jibun: a.jibun,
        displayPrice: a.medianPrice,
      }))
      return { sources, isLoading: tradeLoading, tabType: 'trade' as const }
    }
    // overview → 마커 없음
    return { sources: [] as MarkerSource[], isLoading: false, tabType: 'trade' as const }
  }, [activeTab, leaseRanked, tradeRanked, leaseLoading, tradeLoading])

  const topSources = useMemo(() => sources.slice(0, MAX_MARKERS), [sources])
  const sourceKey = useMemo(
    () => topSources.map((a) => `${a.aptName}:${a.dong}:${a.jibun}`).join('|'),
    [topSources],
  )
  const topSourcesRef = useRef(topSources)
  topSourcesRef.current = topSources

  // 지역 변경 시 캐시 초기화
  useEffect(() => {
    if (selectedLawd !== prevLawdRef.current) {
      if (prevLawdRef.current !== null) {
        clearGeocodeCache()
      }
      prevLawdRef.current = selectedLawd
    }
  }, [selectedLawd])

  // 랭킹 데이터 → 지오코딩 → 마커
  useEffect(() => {
    if (!selectedRegionName || isLoading || activeTab === 'overview') {
      setMarkers([])
      setIsGeocoding(false)
      return
    }

    const apts = topSourcesRef.current
    const geocodable = apts.filter((a) => a.dong && a.jibun)

    if (geocodable.length === 0) {
      setMarkers([])
      setIsGeocoding(false)
      return
    }

    let cancelled = false
    setIsGeocoding(true)

    const inputs: AddressInput[] = geocodable.map((apt) =>
      buildAddressInput(selectedRegionName, apt.dong, apt.jibun),
    )

    geocodeBatch(inputs).then((results) => {
      if (cancelled) return

      const newMarkers: AptMarker[] = []
      let rank = 1

      for (const apt of geocodable) {
        const input = buildAddressInput(selectedRegionName, apt.dong, apt.jibun)
        const position = results.get(input.full)
        if (position) {
          newMarkers.push({
            aptName: apt.aptName,
            position,
            rank,
            tabType,
            displayPrice: apt.displayPrice,
          })
          rank++
        }
      }

      setMarkers(newMarkers)
      setIsGeocoding(false)
    })

    return () => {
      cancelled = true
      setIsGeocoding(false)
    }
  }, [activeTab, selectedRegionName, sourceKey, isLoading, tabType])

  return { markers, isGeocoding }
}
