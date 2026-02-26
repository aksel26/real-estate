'use client'

import type { GeoJsonData } from '@/types/map'

/**
 * Validate and parse a raw GeoJSON value.
 * Throws if the data does not look like a valid FeatureCollection.
 */
export function parseGeoJson(data: unknown): GeoJsonData {
  if (
    typeof data !== 'object' ||
    data === null ||
    (data as Record<string, unknown>)['type'] !== 'FeatureCollection' ||
    !Array.isArray((data as Record<string, unknown>)['features'])
  ) {
    throw new Error('Invalid GeoJSON: expected a FeatureCollection')
  }
  return data as GeoJsonData
}

/**
 * Calculate the centroid of the first ring of a polygon.
 * GeoJSON coordinates are [lng, lat] pairs.
 */
export function getPolygonCenter(coordinates: number[][][]): { lat: number; lng: number } {
  const ring = coordinates[0]
  if (!ring || ring.length === 0) {
    return { lat: 0, lng: 0 }
  }

  let sumLat = 0
  let sumLng = 0
  // Exclude the closing point (same as first) if present
  const points = ring[ring.length - 1][0] === ring[0][0] && ring[ring.length - 1][1] === ring[0][1]
    ? ring.slice(0, -1)
    : ring

  for (const [lng, lat] of points) {
    sumLng += lng
    sumLat += lat
  }

  return {
    lat: sumLat / points.length,
    lng: sumLng / points.length,
  }
}

/**
 * Convert GeoJSON coordinate ring ([lng, lat]) to Kakao LatLng array.
 */
export function convertToKakaoPath(coordinates: number[][]): kakao.maps.LatLng[] {
  return coordinates.map(([lng, lat]) => new kakao.maps.LatLng(lat, lng))
}
