'use client'

import { useRef, useCallback, useEffect } from 'react'

interface MapInitOptions {
  center?: { lat: number; lng: number }
  level?: number
}

const DEFAULT_CENTER = { lat: 37.5665, lng: 126.978 } // 서울시청
const DEFAULT_LEVEL = 11

export function useKakaoMap() {
  const mapRef = useRef<kakao.maps.Map | null>(null)
  // Track listeners for cleanup
  const listenersRef = useRef<Array<{ target: kakao.maps.Map; type: string; handler: (...args: unknown[]) => void }>>([])

  const initMap = useCallback((container: HTMLElement, options?: MapInitOptions) => {
    if (mapRef.current) return mapRef.current

    const center = options?.center ?? DEFAULT_CENTER
    const level = options?.level ?? DEFAULT_LEVEL

    const map = new kakao.maps.Map(container, {
      center: new kakao.maps.LatLng(center.lat, center.lng),
      level,
    })

    mapRef.current = map
    return map
  }, [])

  const getMap = useCallback(() => {
    return mapRef.current
  }, [])

  const addMapListener = useCallback(
    (type: string, handler: (...args: unknown[]) => void) => {
      const map = mapRef.current
      if (!map) return
      kakao.maps.event.addListener(map, type, handler)
      listenersRef.current.push({ target: map, type, handler })
    },
    []
  )

  useEffect(() => {
    return () => {
      const listeners = listenersRef.current
      listeners.forEach(({ target, type, handler }) => {
        kakao.maps.event.removeListener(target, type, handler)
      })
      listenersRef.current = []
      mapRef.current = null
    }
  }, [])

  return { mapRef, initMap, getMap, addMapListener }
}
