'use client'

import { useEffect, useRef, useCallback } from 'react'
import { parseGeoJson, convertToKakaoPath } from '@/lib/utils/geo'
import { POLYGON_STYLES } from '@/constants/map'
import type { GeoJsonData, PolygonFeature } from '@/types/map'

export interface PolygonEntry {
  polygon: kakao.maps.Polygon
  feature: PolygonFeature
}

interface UsePolygonsReturn {
  polygonsRef: React.RefObject<Map<string, PolygonEntry>>
  setPolygonStyle: (code: string, style: 'default' | 'hover' | 'selected') => void
}

export function usePolygons(map: kakao.maps.Map | null): UsePolygonsReturn {
  const polygonsRef = useRef<Map<string, PolygonEntry>>(new Map())
  const mapRef = useRef<kakao.maps.Map | null>(null)

  const setPolygonStyle = useCallback(
    (code: string, style: 'default' | 'hover' | 'selected') => {
      const entry = polygonsRef.current.get(code)
      if (!entry) return
      const s = POLYGON_STYLES[style]
      entry.polygon.setOptions({
        fillColor: s.fillColor,
        fillOpacity: s.fillOpacity,
        strokeColor: s.strokeColor,
        strokeWeight: s.strokeWidth,
      })
    },
    []
  )

  useEffect(() => {
    if (!map) return
    mapRef.current = map

    let cancelled = false

    async function loadPolygons() {
      let geoData: GeoJsonData
      try {
        const res = await fetch('/geo/seoul-sigungu.json')
        if (!res.ok) throw new Error(`Failed to fetch GeoJSON: ${res.status}`)
        const raw: unknown = await res.json()
        geoData = parseGeoJson(raw)
      } catch (err) {
        console.error('[usePolygons] GeoJSON load error:', err)
        return
      }

      if (cancelled || !mapRef.current) return

      const currentMap = mapRef.current
      const defaultStyle = POLYGON_STYLES.default

      for (const feature of geoData.features) {
        if (cancelled) break

        const { geometry, properties } = feature
        if (geometry.type !== 'Polygon') continue

        const coords = geometry.coordinates as number[][][]
        const path = convertToKakaoPath(coords[0])

        const polygon = new kakao.maps.Polygon({
          path,
          fillColor: defaultStyle.fillColor,
          fillOpacity: defaultStyle.fillOpacity,
          strokeColor: defaultStyle.strokeColor,
          strokeWeight: defaultStyle.strokeWidth,
          strokeOpacity: 1,
        })

        polygon.setMap(currentMap)
        polygonsRef.current.set(properties.code, { polygon, feature })
      }
    }

    loadPolygons()

    const polygonMap = polygonsRef.current
    return () => {
      cancelled = true
      polygonMap.forEach(({ polygon }) => {
        polygon.setMap(null)
      })
      polygonMap.clear()
    }
  }, [map])

  return { polygonsRef, setPolygonStyle }
}
