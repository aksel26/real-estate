'use client'

import { useState, useRef } from 'react'
import { KakaoMap } from './KakaoMap'
import { PolygonLayer } from './PolygonLayer'
import { MarkerLayer } from './MarkerLayer'
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
  const containerRef = useRef<HTMLDivElement>(null)

  // Prefetch wiring
  const selectedLawd = useSelectionStore((s) => s.selectedLawd)
  const propertyType = useFilterStore((s) => s.propertyType)

  // Derive a current YM string (current month) for prefetch
  const now = new Date()
  const currentYm =
    String(now.getFullYear()) + String(now.getMonth() + 1).padStart(2, '0')

  usePrefetchAdjacentMonths(propertyType, selectedLawd ?? '', currentYm)

  // Bidirectional map ↔ store sync
  useMapStoreSync({ map: mapInstance, containerRef })

  return (
    <div ref={containerRef} className="relative w-full h-full touch-none [&_*]:touch-none">
      <KakaoMap
        className="w-full h-full"
        onMapReady={setMapInstance}
      />
      <PolygonLayer map={mapInstance} />
      <MarkerLayer map={mapInstance} />
    </div>
  )
}
