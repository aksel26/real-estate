'use client'

import { usePolygons } from './usePolygons'
import { useMapInteraction } from './useMapInteraction'

interface PolygonLayerProps {
  map: kakao.maps.Map | null
}

export function PolygonLayer({ map }: PolygonLayerProps) {
  const { polygonsRef, setPolygonStyle, findRegionAtPoint, ready } = usePolygons(map)

  // Attach map-level click/mousemove listeners that use point-in-polygon
  // hit-testing instead of per-polygon event listeners.
  // This keeps polygons non-clickable so mobile drag/zoom works normally.
  useMapInteraction({ map, polygonsRef, findRegionAtPoint, setPolygonStyle, ready })

  return null
}
