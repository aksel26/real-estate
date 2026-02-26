'use client'

import Script from 'next/script'
import { useState, useCallback } from 'react'

type LoadState = 'loading' | 'loaded' | 'error'

interface KakaoMapLoaderProps {
  children: React.ReactNode
}

export function KakaoMapLoader({ children }: KakaoMapLoaderProps) {
  const [state, setState] = useState<LoadState>('loading')

  const appKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY

  const handleLoad = useCallback(() => {
    if (typeof window === 'undefined' || !window.kakao?.maps) {
      setState('error')
      return
    }
    window.kakao.maps.load(() => {
      setState('loaded')
    })
  }, [])

  const handleError = useCallback(() => {
    setState('error')
  }, [])

  if (!appKey) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-500">
        <p className="text-sm">카카오맵 API 키가 설정되지 않았습니다.</p>
      </div>
    )
  }

  return (
    <>
      <Script
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false&libraries=services`}
        strategy="afterInteractive"
        onLoad={handleLoad}
        onError={handleError}
      />
      {state === 'loading' && (
        <div className="flex h-full w-full items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
            <p className="text-sm text-gray-500">지도를 불러오는 중...</p>
          </div>
        </div>
      )}
      {state === 'error' && (
        <div className="flex h-full w-full items-center justify-center bg-gray-100">
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="text-sm font-medium text-red-600">지도를 불러오지 못했습니다.</p>
            <p className="text-xs text-gray-500">네트워크 연결을 확인해 주세요.</p>
          </div>
        </div>
      )}
      {state === 'loaded' && children}
    </>
  )
}
