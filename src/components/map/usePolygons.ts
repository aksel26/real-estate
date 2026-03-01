'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { parseGeoJson, convertToKakaoPath, pointInPolygon } from '@/lib/utils/geo';
import { POLYGON_STYLES } from '@/constants/map';
import type { GeoJsonData, PolygonFeature } from '@/types/map';

export interface PolygonEntry {
  polygon: kakao.maps.Polygon;
  /** Additional polygons for MultiPolygon geometries */
  subPolygons?: kakao.maps.Polygon[];
  feature: PolygonFeature;
}

interface UsePolygonsReturn {
  polygonsRef: React.RefObject<Map<string, PolygonEntry>>;
  setPolygonStyle: (code: string, style: 'default' | 'hover' | 'selected') => void;
  findRegionAtPoint: (lat: number, lng: number) => { code: string; name: string } | null;
  /** true after all polygons have been created and added to the map */
  ready: boolean;
}

export function usePolygons(map: kakao.maps.Map | null): UsePolygonsReturn {
  const polygonsRef = useRef<Map<string, PolygonEntry>>(new Map());
  const mapRef = useRef<kakao.maps.Map | null>(null);
  const [ready, setReady] = useState(false);

  const setPolygonStyle = useCallback((code: string, style: 'default' | 'hover' | 'selected') => {
    const entry = polygonsRef.current.get(code);
    if (!entry) return;
    const s = POLYGON_STYLES[style];
    const opts = {
      fillColor: s.fillColor,
      fillOpacity: s.fillOpacity,
      strokeColor: s.strokeColor,
      strokeWeight: s.strokeWidth,
      strokeStyle: s.strokeStyle || 'solid', // Default to solid if not provided
    };
    entry.polygon.setOptions(opts);
    entry.subPolygons?.forEach((p) => p.setOptions(opts));
  }, []);

  const findRegionAtPoint = useCallback((lat: number, lng: number) => {
    let found: { code: string; name: string } | null = null;
    polygonsRef.current.forEach((entry, code) => {
      if (found) return;
      const { geometry } = entry.feature;
      const rings =
        geometry.type === 'Polygon'
          ? [(geometry.coordinates as number[][][])[0]]
          : (geometry.coordinates as number[][][][]).map((p) => p[0]);
      for (let i = 0; i < rings.length; i++) {
        if (pointInPolygon(lat, lng, rings[i])) {
          found = { code, name: entry.feature.properties.name };
          return;
        }
      }
    });
    return found;
  }, []);

  useEffect(() => {
    if (!map) return;
    mapRef.current = map;

    let cancelled = false;

    async function loadPolygons() {
      let geoData: GeoJsonData;
      try {
        const res = await fetch('/geo/seoul-sigungu.json');
        if (!res.ok) throw new Error(`Failed to fetch GeoJSON: ${res.status}`);
        const raw: unknown = await res.json();
        geoData = parseGeoJson(raw);
      } catch (err) {
        console.error('[usePolygons] GeoJSON load error:', err);
        return;
      }

      if (cancelled || !mapRef.current) return;

      const currentMap = mapRef.current;
      const defaultStyle = POLYGON_STYLES.default;

      for (const feature of geoData.features) {
        if (cancelled) break;

        const { geometry, properties } = feature;

        let rings: number[][][] = [];

        if (geometry.type === 'Polygon') {
          const coords = geometry.coordinates as number[][][];
          rings = [coords[0]];
        } else if (geometry.type === 'MultiPolygon') {
          const coords = geometry.coordinates as number[][][][];
          rings = coords.map((poly) => poly[0]);
        } else {
          continue;
        }

        // Create one kakao Polygon per ring; store primary + extras
        let primaryPolygon: kakao.maps.Polygon | null = null;
        const subPolygons: kakao.maps.Polygon[] = [];

        for (const ring of rings) {
          const path = convertToKakaoPath(ring);

          const polygon = new kakao.maps.Polygon({
            path,
            clickable: false,
            fillColor: defaultStyle.fillColor,
            fillOpacity: defaultStyle.fillOpacity,
            strokeColor: defaultStyle.strokeColor,
            strokeWeight: defaultStyle.strokeWidth,
            strokeStyle: defaultStyle.strokeStyle || 'solid',
            strokeOpacity: 1,
          });

          polygon.setMap(currentMap);

          if (!primaryPolygon) {
            primaryPolygon = polygon;
          } else {
            subPolygons.push(polygon);
          }
        }

        if (primaryPolygon) {
          polygonsRef.current.set(properties.code, {
            polygon: primaryPolygon,
            subPolygons: subPolygons.length > 0 ? subPolygons : undefined,
            feature,
          });
        }
      }
    }

    loadPolygons().then(() => {
      if (!cancelled) setReady(true);
    });

    const polygonMap = polygonsRef.current;
    return () => {
      cancelled = true;
      setReady(false);
      polygonMap.forEach(({ polygon, subPolygons }) => {
        polygon.setMap(null);
        subPolygons?.forEach((p) => p.setMap(null));
      });
      polygonMap.clear();
    };
  }, [map]);

  return { polygonsRef, setPolygonStyle, findRegionAtPoint, ready };
}
