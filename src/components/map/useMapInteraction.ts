'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useSelectionStore, useUIStore, useMapStore } from '@/stores'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import type { PolygonEntry } from './usePolygons'

interface UseMapInteractionOptions {
  map: kakao.maps.Map | null
  polygonsRef: React.RefObject<Map<string, PolygonEntry>>
  findRegionAtPoint: (lat: number, lng: number) => { code: string; name: string } | null
  setPolygonStyle: (code: string, style: 'default' | 'hover' | 'selected') => void
  /** When true, polygons are loaded and ready for interaction */
  ready: boolean
}

export function useMapInteraction({
  map,
  polygonsRef,
  findRegionAtPoint,
  setPolygonStyle,
  ready,
}: UseMapInteractionOptions): void {
  const selectRegion = useSelectionStore((s) => s.selectRegion)
  const openPanel = useUIStore((s) => s.openPanel)
  const setHoverRegion = useMapStore((s) => s.setHoverRegion)
  const selectedPolygonId = useSelectionStore((s) => s.selectedPolygonId)

  const hasFinePointer = useMediaQuery('(pointer: fine)')

  const selectedCodeRef = useRef<string | null>(null)
  const hoveredCodeRef = useRef<string | null>(null)
  const draggingRef = useRef(false)

  // Keep selectedCodeRef in sync with store
  useEffect(() => {
    selectedCodeRef.current = selectedPolygonId
  }, [selectedPolygonId])

  const handleClick = useCallback(
    (code: string, name: string) => {
      const prev = selectedCodeRef.current

      // Deselect previous
      if (prev && prev !== code) {
        setPolygonStyle(prev, 'default')
      }

      setPolygonStyle(code, 'selected')
      selectedCodeRef.current = code
      selectRegion(code, name, code)
      openPanel()
    },
    [selectRegion, openPanel, setPolygonStyle]
  )

  useEffect(() => {
    if (!map || !ready) return

    const dragStartHandler = () => {
      draggingRef.current = true
    }
    const dragEndHandler = () => {
      draggingRef.current = false
    }

    const clickHandler = (...args: unknown[]) => {
      const e = args[0] as { latLng: kakao.maps.LatLng }
      const latlng = e.latLng
      const result = findRegionAtPoint(latlng.getLat(), latlng.getLng())
      if (result) {
        handleClick(result.code, result.name)
      }
    }

    const moveHandler = (...args: unknown[]) => {
      if (draggingRef.current) return

      const e = args[0] as { latLng: kakao.maps.LatLng }
      const latlng = e.latLng
      const result = findRegionAtPoint(latlng.getLat(), latlng.getLng())
      const prevHover = hoveredCodeRef.current

      if (result) {
        if (prevHover === result.code) return
        // Clear previous hover
        if (prevHover && prevHover !== selectedCodeRef.current) {
          setPolygonStyle(prevHover, 'default')
        }
        hoveredCodeRef.current = result.code
        setHoverRegion(result.code)
        if (selectedCodeRef.current !== result.code) {
          setPolygonStyle(result.code, 'hover')
        }
      } else {
        if (prevHover) {
          if (prevHover !== selectedCodeRef.current) {
            setPolygonStyle(prevHover, 'default')
          }
          hoveredCodeRef.current = null
          setHoverRegion(null)
        }
      }
    }

    kakao.maps.event.addListener(map, 'dragstart', dragStartHandler)
    kakao.maps.event.addListener(map, 'dragend', dragEndHandler)
    kakao.maps.event.addListener(map, 'click', clickHandler)

    // hover 효과는 마우스가 있는 디바이스에서만 (모바일 터치 드래그 간섭 방지)
    if (hasFinePointer) {
      kakao.maps.event.addListener(map, 'mousemove', moveHandler)
    }

    return () => {
      kakao.maps.event.removeListener(map, 'dragstart', dragStartHandler)
      kakao.maps.event.removeListener(map, 'dragend', dragEndHandler)
      kakao.maps.event.removeListener(map, 'click', clickHandler)
      if (hasFinePointer) {
        kakao.maps.event.removeListener(map, 'mousemove', moveHandler)
      }
      hoveredCodeRef.current = null
      draggingRef.current = false
    }
  }, [map, ready, hasFinePointer, findRegionAtPoint, handleClick, setPolygonStyle, setHoverRegion])
}
