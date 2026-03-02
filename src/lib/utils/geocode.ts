import { GEOCODE_CONCURRENCY } from '@/constants/map'

export interface GeocodedPoint {
  lat: number
  lng: number
}

export interface AddressInput {
  full: string
  fallback: string
}

/** 세션 내 지오코딩 결과 캐시 (주소 → 좌표) */
const cache = new Map<string, GeocodedPoint | null>()

/**
 * 카카오 Geocoder로 주소 → 좌표 변환 (단건, Promise 래핑)
 */
function geocodeOne(address: string): Promise<GeocodedPoint | null> {
  const cached = cache.get(address)
  if (cached !== undefined) return Promise.resolve(cached)

  return new Promise((resolve) => {
    try {
      const geocoder = new kakao.maps.services.Geocoder()
      geocoder.addressSearch(address, (result, status) => {
        if (status === 'OK' && result.length > 0) {
          const point: GeocodedPoint = {
            lat: parseFloat(result[0].y),
            lng: parseFloat(result[0].x),
          }
          cache.set(address, point)
          resolve(point)
        } else {
          cache.set(address, null)
          if (process.env.NODE_ENV === 'development') {
            console.warn(`[geocode] failed: "${address}"`)
          }
          resolve(null)
        }
      })
    } catch {
      resolve(null)
    }
  })
}

/**
 * 여러 주소를 동시성 제한하여 지오코딩 (full 실패 시 fallback 재시도)
 */
export async function geocodeBatch(
  inputs: AddressInput[],
): Promise<Map<string, GeocodedPoint>> {
  const result = new Map<string, GeocodedPoint>()
  const queue = [...inputs]
  const concurrency = GEOCODE_CONCURRENCY

  async function worker() {
    while (queue.length > 0) {
      const input = queue.shift()!
      let point = await geocodeOne(input.full)
      if (!point && input.fallback !== input.full) {
        point = await geocodeOne(input.fallback)
      }
      if (point) {
        result.set(input.full, point)
      }
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, queue.length) }, () => worker())
  await Promise.all(workers)

  return result
}

const SEOUL_PREFIX = '서울'

/**
 * 단지 정보로 지오코딩용 AddressInput 생성
 * full: "서울 강남구 역삼동 123-4", fallback: "서울 강남구 역삼동"
 */
export function buildAddressInput(regionName: string, dong: string, jibun: string): AddressInput {
  const prefixed = regionName.startsWith(SEOUL_PREFIX) ? regionName : `${SEOUL_PREFIX} ${regionName}`
  return {
    full: [prefixed, dong, jibun].filter(Boolean).join(' '),
    fallback: [prefixed, dong].filter(Boolean).join(' '),
  }
}

/**
 * 단지 정보로 지오코딩용 전체 주소 생성 (하위 호환)
 */
export function buildFullAddress(regionName: string, dong: string, jibun: string): string {
  return buildAddressInput(regionName, dong, jibun).full
}

/**
 * 지오코딩 캐시 초기화
 */
export function clearGeocodeCache() {
  cache.clear()
}
