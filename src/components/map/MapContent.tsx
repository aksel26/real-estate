'use client'

import { useState } from 'react'
import { KakaoMap } from './KakaoMap'
import { PolygonLayer } from './PolygonLayer'
import { useMapStoreSync } from './useMapStoreSync'
import { useFilterStore, useSelectionStore } from '@/stores'
import { usePrefetchAdjacentMonths } from '@/hooks/queries'

/**
 * MapContent — rendered inside KakaoMapLoader (only when map SDK is loaded).
 * Mounts the map, polygon overlay, and bidirectional store sync.
 * Also triggers prefetch of adjacent months when a region is selected.
 */
export function MapContent() {
  const [mapInstance, setMapInstance] = useState<kakao.maps.Map | null>(null)

  // Prefetch wiring
  const selectedLawd = useSelectionStore((s) => s.selectedLawd)
  const propertyType = useFilterStore((s) => s.propertyType)

  // Derive a current YM string (current month) for prefetch
  const now = new Date()
  const currentYm =
    String(now.getFullYear()) + String(now.getMonth() + 1).padStart(2, '0')

  usePrefetchAdjacentMonths(propertyType, selectedLawd ?? '', currentYm)

  // Bidirectional map ↔ store sync
  useMapStoreSync({ map: mapInstance })

  return (
    <div className="relative w-full h-full">
      <KakaoMap
        className="w-full h-full"
        onMapReady={setMapInstance}
      />
      <PolygonLayer map={mapInstance} />
    </div>
  )
}
