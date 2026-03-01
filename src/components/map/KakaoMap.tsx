'use client'

import { useRef, useEffect } from 'react'
import { useKakaoMap } from './useKakaoMap'

interface KakaoMapProps {
  className?: string
  onMapReady?: (map: kakao.maps.Map) => void
}

const DEFAULT_CENTER = { lat: 37.5665, lng: 126.978 } // 서울시청
const DEFAULT_LEVEL = 8

export function KakaoMap({ className, onMapReady }: KakaoMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { initMap, mapRef } = useKakaoMap()
  const onMapReadyRef = useRef(onMapReady)
  onMapReadyRef.current = onMapReady

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const map = initMap(container, {
      center: DEFAULT_CENTER,
      level: DEFAULT_LEVEL,
    })

    if (map && onMapReadyRef.current) {
      onMapReadyRef.current(map)
    }
  }, [initMap])

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: '100%', height: '100%' }}
    />
  )
}
