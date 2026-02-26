'use client'

import { useEffect, useRef } from 'react'
import { usePolygons } from './usePolygons'
import { useMapInteraction } from './useMapInteraction'

interface PolygonLayerProps {
  map: kakao.maps.Map | null
}

export function PolygonLayer({ map }: PolygonLayerProps) {
  const { polygonsRef, setPolygonStyle } = usePolygons(map)

  // We need to attach interactions after polygons are loaded.
  // usePolygons populates polygonsRef asynchronously, so we re-run the
  // interaction effect when the map changes. The interaction hook reads
  // polygonsRef directly, so it picks up entries added after mount.
  useMapInteraction({ polygonsRef, setPolygonStyle })

  return null
}
