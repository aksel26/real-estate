'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useSelectionStore, useUIStore, useMapStore } from '@/stores'
import type { PolygonEntry } from './usePolygons'

interface UseMapInteractionOptions {
  polygonsRef: React.RefObject<Map<string, PolygonEntry>>
  setPolygonStyle: (code: string, style: 'default' | 'hover' | 'selected') => void
}

export function useMapInteraction({
  polygonsRef,
  setPolygonStyle,
}: UseMapInteractionOptions): void {
  const selectRegion = useSelectionStore((s) => s.selectRegion)
  const openPanel = useUIStore((s) => s.openPanel)
  const setHoverRegion = useMapStore((s) => s.setHoverRegion)
  const selectedPolygonId = useSelectionStore((s) => s.selectedPolygonId)

  const selectedCodeRef = useRef<string | null>(null)
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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

  const handleMouseOver = useCallback(
    (code: string) => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current)
      hoverTimerRef.current = setTimeout(() => {
        setHoverRegion(code)
        // Only apply hover style if not selected
        if (selectedCodeRef.current !== code) {
          setPolygonStyle(code, 'hover')
        }
      }, 16)
    },
    [setHoverRegion, setPolygonStyle]
  )

  const handleMouseOut = useCallback(
    (code: string) => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current)
      setHoverRegion(null)
      // Restore to selected or default
      if (selectedCodeRef.current === code) {
        setPolygonStyle(code, 'selected')
      } else {
        setPolygonStyle(code, 'default')
      }
    },
    [setHoverRegion, setPolygonStyle]
  )

  useEffect(() => {
    const polygons = polygonsRef.current
    if (!polygons || polygons.size === 0) return

    const listeners: Array<() => void> = []

    polygons.forEach(({ polygon, feature }, code) => {
      const name = feature.properties.name

      const clickHandler = () => handleClick(code, name)
      const overHandler = () => handleMouseOver(code)
      const outHandler = () => handleMouseOut(code)

      kakao.maps.event.addListener(polygon, 'click', clickHandler)
      kakao.maps.event.addListener(polygon, 'mouseover', overHandler)
      kakao.maps.event.addListener(polygon, 'mouseout', outHandler)

      listeners.push(() => {
        kakao.maps.event.removeListener(polygon, 'click', clickHandler)
        kakao.maps.event.removeListener(polygon, 'mouseover', overHandler)
        kakao.maps.event.removeListener(polygon, 'mouseout', outHandler)
      })
    })

    return () => {
      listeners.forEach((remove) => remove())
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current)
    }
  }, [polygonsRef, handleClick, handleMouseOver, handleMouseOut])
}
