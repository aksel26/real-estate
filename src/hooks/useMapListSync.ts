'use client'

import { useCallback } from 'react'
import { useMapStore } from '@/stores'

interface UseMapListSyncReturn {
  highlightRegion: (code: string) => void
  clearHighlight: () => void
}

/**
 * Hook for syncing list hover state with map polygon highlights.
 * Call highlightRegion(code) when a list item is hovered to trigger
 * the corresponding polygon hover style on the map.
 */
export function useMapListSync(): UseMapListSyncReturn {
  const setHoverRegion = useMapStore((s) => s.setHoverRegion)

  const highlightRegion = useCallback(
    (code: string) => {
      setHoverRegion(code)
    },
    [setHoverRegion]
  )

  const clearHighlight = useCallback(() => {
    setHoverRegion(null)
  }, [setHoverRegion])

  return { highlightRegion, clearHighlight }
}
