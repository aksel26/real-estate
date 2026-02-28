'use client'

import { useEffect, useRef } from 'react'
import { useMapStore } from '@/stores'
import type { Coordinates } from '@/types/region'

interface UseMapStoreSyncOptions {
  map: kakao.maps.Map | null
  containerRef?: React.RefObject<HTMLElement | null>
}

export function useMapStoreSync({ map, containerRef }: UseMapStoreSyncOptions): void {
  const setCenter = useMapStore((s) => s.setCenter)
  const setZoom = useMapStore((s) => s.setZoom)
  const setBounds = useMapStore((s) => s.setBounds)
  const storeCenter = useMapStore((s) => s.center)
  const storeZoom = useMapStore((s) => s.zoom)

  // Track whether an update is coming from the map (to avoid feedback loops)
  const updatingFromMap = useRef(false)
  const prevStoreCenter = useRef<Coordinates>(storeCenter)
  const prevStoreZoom = useRef<number>(storeZoom)

  // Helper: sync current map view into store
  const syncMapToStore = (currentMap: kakao.maps.Map) => {
    updatingFromMap.current = true

    const center = currentMap.getCenter()
    const zoom = currentMap.getLevel()
    const bounds = currentMap.getBounds()
    const sw = bounds.getSouthWest()
    const ne = bounds.getNorthEast()

    setCenter(center.getLat(), center.getLng())
    setZoom(zoom)
    setBounds(
      { lat: sw.getLat(), lng: sw.getLng() },
      { lat: ne.getLat(), lng: ne.getLng() }
    )

    prevStoreCenter.current = { lat: center.getLat(), lng: center.getLng() }
    prevStoreZoom.current = zoom

    // Reset guard after microtask so Zustand subscribers fire first
    Promise.resolve().then(() => {
      updatingFromMap.current = false
    })
  }

  // Attach map event listeners
  useEffect(() => {
    if (!map) return

    const dragEndHandler = () => syncMapToStore(map)
    const zoomChangedHandler = () => syncMapToStore(map)

    kakao.maps.event.addListener(map, 'dragend', dragEndHandler)
    kakao.maps.event.addListener(map, 'zoom_changed', zoomChangedHandler)

    // Ensure map dimensions match container after layout settles
    map.relayout()
    syncMapToStore(map)

    // Re-sync when the map container resizes (e.g. panel open/close changes flex)
    let observer: ResizeObserver | undefined
    if (containerRef?.current) {
      observer = new ResizeObserver(() => {
        map.relayout()
        syncMapToStore(map)
      })
      observer.observe(containerRef.current)
    }

    // Debounced window resize handler for viewport changes (e.g. desktop↔mobile)
    let resizeTimer: ReturnType<typeof setTimeout> | undefined
    const handleWindowResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        map.relayout()
        syncMapToStore(map)
      }, 200)
    }
    window.addEventListener('resize', handleWindowResize)

    return () => {
      kakao.maps.event.removeListener(map, 'dragend', dragEndHandler)
      kakao.maps.event.removeListener(map, 'zoom_changed', zoomChangedHandler)
      observer?.disconnect()
      window.removeEventListener('resize', handleWindowResize)
      clearTimeout(resizeTimer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map])

  // Respond to programmatic store changes (external navigation)
  useEffect(() => {
    if (!map) return
    if (updatingFromMap.current) return

    const centerChanged =
      storeCenter.lat !== prevStoreCenter.current.lat ||
      storeCenter.lng !== prevStoreCenter.current.lng
    const zoomChanged = storeZoom !== prevStoreZoom.current

    if (centerChanged) {
      map.panTo(new kakao.maps.LatLng(storeCenter.lat, storeCenter.lng))
      prevStoreCenter.current = storeCenter
    }

    if (zoomChanged) {
      map.setLevel(storeZoom, { animate: true })
      prevStoreZoom.current = storeZoom
    }
  }, [map, storeCenter, storeZoom])
}
