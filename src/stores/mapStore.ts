import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { MapBounds } from '@/types/map'
import type { Coordinates } from '@/types/region'

interface MapState {
  // ── 상태 ──
  center: Coordinates
  zoom: number
  bounds: MapBounds | null
  /** 마우스 오버 중인 지역 ID */
  hoverRegionId: string | null

  // ── 액션 ──
  setCenter: (lat: number, lng: number) => void
  setZoom: (zoom: number) => void
  setBounds: (sw: Coordinates, ne: Coordinates) => void
  setHoverRegion: (id: string | null) => void
  resetMap: () => void
}

const DEFAULT_CENTER: Coordinates = { lat: 37.5665, lng: 126.978 } // 서울시청
const DEFAULT_ZOOM = 8

const initialState = {
  center: DEFAULT_CENTER,
  zoom: DEFAULT_ZOOM,
  bounds: null,
  hoverRegionId: null,
}

export const useMapStore = create<MapState>()(
  devtools(
    (set) => ({
      ...initialState,

      setCenter: (lat, lng) => set({ center: { lat, lng } }, false, 'map/setCenter'),
      setZoom: (zoom) => set({ zoom }, false, 'map/setZoom'),
      setBounds: (sw, ne) => set({ bounds: { sw, ne } }, false, 'map/setBounds'),
      setHoverRegion: (id) => set({ hoverRegionId: id }, false, 'map/setHoverRegion'),
      resetMap: () => set(initialState, false, 'map/resetMap'),
    }),
    { name: 'mapStore', enabled: process.env.NODE_ENV === 'development' }
  )
)
