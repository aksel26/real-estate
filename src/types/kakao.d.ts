// Minimal TypeScript declarations for Kakao Map JS SDK (MVP APIs only)

interface Window {
  kakao: typeof kakao
}

declare namespace kakao.maps {
  function load(callback: () => void): void

  class Map {
    constructor(container: HTMLElement, options: MapOptions)
    setCenter(latlng: LatLng): void
    setLevel(level: number, options?: { animate?: boolean }): void
    getCenter(): LatLng
    getLevel(): number
    getBounds(): LatLngBounds
    panTo(latlng: LatLng): void
  }

  interface MapOptions {
    center: LatLng
    level: number
    mapTypeId?: MapTypeId
  }

  type MapTypeId = number

  class LatLng {
    constructor(lat: number, lng: number)
    getLat(): number
    getLng(): number
  }

  class LatLngBounds {
    getSouthWest(): LatLng
    getNorthEast(): LatLng
    extend(latlng: LatLng): void
  }

  class Polygon {
    constructor(options: PolygonOptions)
    setMap(map: Map | null): void
    setOptions(options: Partial<PolygonOptions>): void
    getPath(): LatLng[]
  }

  interface PolygonOptions {
    path: LatLng[]
    fillColor?: string
    fillOpacity?: number
    strokeColor?: string
    strokeWeight?: number
    strokeOpacity?: number
    strokeStyle?: string
    zIndex?: number
  }

  namespace event {
    function addListener(
      target: Map | Polygon,
      type: string,
      handler: (...args: unknown[]) => void
    ): void
    function removeListener(
      target: Map | Polygon,
      type: string,
      handler?: (...args: unknown[]) => void
    ): void
  }

  namespace services {
    class Geocoder {
      addressSearch(
        address: string,
        callback: (result: AddressSearchResult[], status: ServicesStatusType) => void
      ): void
      coord2Address(
        lng: number,
        lat: number,
        callback: (result: Coord2AddressResult[], status: ServicesStatusType) => void
      ): void
    }

    interface AddressSearchResult {
      address_name: string
      category_group_code: string
      category_group_name: string
      category_name: string
      distance: string
      id: string
      phone: string
      place_name: string
      place_url: string
      road_address_name: string
      x: string
      y: string
    }

    interface Coord2AddressResult {
      address: {
        address_name: string
        region_1depth_name: string
        region_2depth_name: string
        region_3depth_name: string
        mountain_yn: string
        main_address_no: string
        sub_address_no: string
        zip_code: string
      } | null
      road_address: {
        address_name: string
        region_1depth_name: string
        region_2depth_name: string
        road_name: string
        underground_yn: string
        main_building_no: string
        sub_building_no: string
        building_name: string
        zone_no: string
      } | null
    }

    type ServicesStatusType = 'OK' | 'ZERO_RESULT' | 'ERROR'
  }
}
