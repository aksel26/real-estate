'use client'

import { useEffect, useRef } from 'react'
import { useUIStore, useMapStore } from '@/stores'
import { useAptMarkers } from '@/hooks/useAptMarkers'
import { formatPrice } from '@/lib/utils'

interface MarkerLayerProps {
  map: kakao.maps.Map | null
}

function setStyles(el: HTMLElement, styles: Record<string, string>) {
  for (const [key, value] of Object.entries(styles)) {
    el.style.setProperty(key, value)
  }
}

function createMarkerContent(
  rank: number,
  aptName: string,
  price: string,
  isSelected: boolean,
): HTMLElement {
  const bg = isSelected ? '#2563eb' : '#1e293b'
  const shadow = isSelected
    ? '0 4px 14px rgba(37,99,235,0.4)'
    : '0 2px 8px rgba(0,0,0,0.2)'

  const wrapper = document.createElement('div')
  setStyles(wrapper, {
    cursor: 'pointer',
    'user-select': 'none',
    'white-space': 'nowrap',
  })

  // 배지 컨테이너
  const badge = document.createElement('div')
  setStyles(badge, {
    display: 'flex',
    'align-items': 'center',
    gap: '6px',
    background: bg,
    color: '#fff',
    padding: '5px 10px 5px 6px',
    'border-radius': '20px',
    'font-size': '12px',
    'font-weight': '600',
    'box-shadow': shadow,
    transition: 'background 0.2s, box-shadow 0.2s',
    transform: isSelected ? 'scale(1.08)' : 'scale(1)',
  })

  // 순위 번호
  const rankSpan = document.createElement('span')
  setStyles(rankSpan, {
    display: 'flex',
    'align-items': 'center',
    'justify-content': 'center',
    width: '20px',
    height: '20px',
    'border-radius': '50%',
    background: 'rgba(255,255,255,0.2)',
    'font-size': '11px',
    'font-weight': '700',
  })
  rankSpan.textContent = String(rank)

  // 단지명
  const nameSpan = document.createElement('span')
  setStyles(nameSpan, {
    'max-width': '100px',
    overflow: 'hidden',
    'text-overflow': 'ellipsis',
  })
  nameSpan.textContent = aptName

  // 가격
  const priceSpan = document.createElement('span')
  setStyles(priceSpan, {
    color: 'rgba(255,255,255,0.7)',
    'font-size': '11px',
  })
  priceSpan.textContent = price

  badge.appendChild(rankSpan)
  badge.appendChild(nameSpan)
  badge.appendChild(priceSpan)

  // 꼬리 삼각형
  const tail = document.createElement('div')
  setStyles(tail, {
    width: '0',
    height: '0',
    margin: '0 auto',
    'border-left': '6px solid transparent',
    'border-right': '6px solid transparent',
    'border-top': `6px solid ${bg}`,
    transition: 'border-top-color 0.2s',
  })

  wrapper.appendChild(badge)
  wrapper.appendChild(tail)

  return wrapper
}

export function MarkerLayer({ map }: MarkerLayerProps) {
  const { markers } = useAptMarkers()
  const selectedAptName = useUIStore((s) => s.selectedAptName)
  const selectApt = useUIStore((s) => s.selectApt)
  const selectAptRef = useRef(selectApt)
  selectAptRef.current = selectApt
  const overlaysRef = useRef<kakao.maps.CustomOverlay[]>([])
  const pannedForRef = useRef<string | null>(null)
  const setCenter = useMapStore((s) => s.setCenter)
  const setZoom = useMapStore((s) => s.setZoom)

  // 선택된 단지로 지도 이동
  useEffect(() => {
    if (!selectedAptName || !map) {
      pannedForRef.current = null
      return
    }
    if (pannedForRef.current === selectedAptName) return

    const marker = markers.find((m) => m.aptName === selectedAptName)
    if (!marker) return

    pannedForRef.current = selectedAptName
    setCenter(marker.position.lat, marker.position.lng)
    if (useMapStore.getState().zoom > 4) {
      setZoom(4)
    }
  }, [selectedAptName, markers, map, setCenter, setZoom])

  useEffect(() => {
    if (!map) return

    // 기존 오버레이 제거
    for (const overlay of overlaysRef.current) {
      overlay.setMap(null)
    }
    overlaysRef.current = []

    if (markers.length === 0) return

    const newOverlays: kakao.maps.CustomOverlay[] = []

    for (const marker of markers) {
      const price = marker.displayPrice > 0 ? formatPrice(marker.displayPrice) : ''

      const isSelected = selectedAptName === marker.aptName
      const content = createMarkerContent(marker.rank, marker.aptName, price, isSelected)

      content.addEventListener('click', (e) => {
        e.stopPropagation()
        selectAptRef.current(marker.aptName)
      })

      const overlay = new kakao.maps.CustomOverlay({
        position: new kakao.maps.LatLng(marker.position.lat, marker.position.lng),
        content,
        clickable: true,
        xAnchor: 0.5,
        yAnchor: 1.2,
        zIndex: isSelected ? 100 : 10 + (20 - marker.rank),
      })

      overlay.setMap(map)
      newOverlays.push(overlay)
    }

    overlaysRef.current = newOverlays

    return () => {
      for (const overlay of newOverlays) {
        overlay.setMap(null)
      }
    }
  }, [map, markers, selectedAptName])

  return null
}
