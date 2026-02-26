# 아키텍처 설계 문서 — 지도 기반 부동산 리포트 앱

버전: v0.1 (MVP)
작성일: 2026-02-26
기반 문서: `PRD_real-estate-mcp_map-report.md`

---

## 1. 디렉토리 구조

```
src/
├── app/
│   ├── layout.tsx                  # RootLayout: 폰트, Providers, 전역 메타
│   ├── page.tsx                    # 메인: Map + ReportPanel
│   ├── subscription/
│   │   └── page.tsx                # 청약 지도/리스트 (V1)
│   ├── auction/
│   │   └── page.tsx                # 공매 지도/리스트 (V1)
│   └── api/
│       ├── region-code/
│       │   └── route.ts            # GET /api/region-code?q=...
│       ├── trades/
│       │   └── route.ts            # GET /api/trades?type=...&lawd=...&ym=...
│       ├── rents/
│       │   └── route.ts            # GET /api/rents?type=...&lawd=...&ym=...
│       └── report/
│           └── route.ts            # GET /api/report?type=...&lawd=...&months=...
│
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx            # 전체 레이아웃 (Map 70% + Panel 30%)
│   │   ├── TopBar.tsx              # 상단: 지역 pill, 기간/유형 필터
│   │   └── RegionPill.tsx          # 선택 지역 pill 배지 (bounce-in 모션)
│   │
│   ├── map/
│   │   ├── KakaoMap.tsx            # 카카오맵 래퍼 (ref 기반)
│   │   ├── KakaoMapLoader.tsx      # Script 로드 + 초기화 관리
│   │   ├── PolygonLayer.tsx        # 시군구/행정동 폴리곤 오버레이
│   │   └── useKakaoMap.ts          # 맵 인스턴스 ref + 이벤트 바인딩 훅
│   │
│   ├── report/
│   │   ├── ReportPanel.tsx         # 우측 리포트 패널 (AnimatePresence slide)
│   │   ├── ReportTabs.tsx          # 탭 네비게이션 (매매/전월세/요약)
│   │   ├── TradeTab.tsx            # 매매 요약 탭
│   │   ├── RentTab.tsx             # 전월세 요약 탭
│   │   ├── SummaryTab.tsx          # 종합 요약 탭 (전세가율 등)
│   │   ├── StatCard.tsx            # 지표 카드 (접힘/펼침 모션)
│   │   ├── TrendChart.tsx          # 월별 트렌드 차트
│   │   └── JeonseRateBadge.tsx     # 전세가율 배지 (주의/보통/양호)
│   │
│   ├── filter/
│   │   ├── PropertyTypeFilter.tsx  # 아파트/오피스텔/연립 칩 필터
│   │   ├── PeriodFilter.tsx        # 기간 선택
│   │   └── FilterChip.tsx          # 개별 필터 칩 (애니메이션)
│   │
│   └── ui/
│       ├── Skeleton.tsx            # 로딩 스켈레톤
│       ├── StatusDot.tsx           # 상태 표시 dot (로딩/성공/실패)
│       ├── ErrorFallback.tsx       # 에러 상태 + 재시도 버튼
│       └── Toast.tsx               # 토스트 알림
│
├── lib/
│   ├── mcp/
│   │   ├── client.ts              # MCP 서버 HTTP 호출 클라이언트
│   │   ├── types.ts               # MCP 요청/응답 원본 타입
│   │   └── normalizer.ts          # MCP 응답 → 앱 내부 타입 변환
│   │
│   ├── api/
│   │   ├── fetcher.ts             # 클라이언트용 fetch 래퍼 (base URL, 에러 처리)
│   │   └── validation.ts          # 입력 검증 (lawd 코드, ym 포맷 등)
│   │
│   ├── geo/
│   │   ├── regions.ts             # 시군구/행정동 정적 데이터 (코드/이름/중심좌표)
│   │   └── polygons.ts            # GeoJSON 폴리곤 데이터 로더
│   │
│   ├── calc/
│   │   └── statistics.ts          # 중위값, 전세가율, 분위 계산 유틸
│   │
│   └── constants.ts               # 앱 상수 (기본 기간, 기본 유형, 줌 레벨 등)
│
├── hooks/
│   ├── queries/
│   │   ├── useReport.ts           # /api/report TanStack Query 훅
│   │   ├── useTrades.ts           # /api/trades TanStack Query 훅
│   │   ├── useRents.ts            # /api/rents TanStack Query 훅
│   │   └── useRegionCode.ts       # /api/region-code TanStack Query 훅
│   │
│   ├── useMapInteraction.ts       # 지도 클릭/호버 → store 업데이트 훅
│   ├── usePrefetch.ts             # 인접 월 프리패치 로직
│   └── useFilterSync.ts           # 필터 변경 → queryKey 동기화
│
├── stores/
│   ├── mapStore.ts                # 지도 뷰 상태
│   ├── selectionStore.ts          # 지역 선택 상태
│   ├── uiStore.ts                 # UI 패널/탭 상태
│   └── filterStore.ts             # 필터 상태 (유형/기간/가격대)
│
├── types/
│   ├── region.ts                  # Region, RegionCode 등
│   ├── trade.ts                   # TradeData, TradeSummary 등
│   ├── rent.ts                    # RentData, RentSummary 등
│   ├── report.ts                  # ReportSummary, MonthlyStats 등
│   ├── filter.ts                  # PropertyType, FilterState 등
│   └── map.ts                     # MapBounds, MapCenter, PolygonData 등
│
├── providers/
│   ├── QueryProvider.tsx          # TanStack QueryClientProvider
│   └── KakaoMapProvider.tsx       # 카카오맵 SDK 로드 컨텍스트
│
└── styles/
    └── globals.css                # Tailwind v4 @import, CSS 변수
```

### 설계 근거

| 결정 | 이유 |
|------|------|
| `lib/mcp/`를 별도 분리 | MCP 클라이언트 로직을 Route Handler에서 분리하여 MCP 툴 추가/변경 시 프론트 영향 최소화 (PRD 목표 3) |
| `hooks/queries/`에 Query 훅 집중 | queryKey 패턴, staleTime, gcTime 등 캐싱 정책을 한 곳에서 관리 |
| `stores/`를 도메인별 분리 | 서로 독립적인 상태 슬라이스로 관심사 분리, 불필요한 리렌더 방지 |
| `lib/geo/`에 정적 지역 데이터 | 폴리곤/중심좌표를 사전 데이터로 보관하여 지오코딩 API 호출 최소화 (PRD 리스크 3) |

---

## 2. 데이터 플로우 아키텍처

### 전체 흐름도

```
┌─────────────────────────────────────────────────────────────────────┐
│ Client (Browser)                                                    │
│                                                                     │
│  Zustand Stores ──queryKey 재료──▶ TanStack Query                  │
│  (map/selection/                    │                               │
│   ui/filter)                        │ fetch                        │
│       ▲                             ▼                               │
│       │ 사용자 액션          /api/report                            │
│       │ (클릭/필터)          /api/trades   ◀── Route Handlers ──┐  │
│       │                      /api/rents                          │  │
│                              /api/region-code                    │  │
└──────────────────────────────────────────────────────────────────┘  │
                                                                      │
                                    Next.js Server (BFF)              │
                                    ┌─────────────────────────────┐   │
                                    │  1. 입력 검증 (validation)   │◀──┘
                                    │  2. MCP 호출 (lib/mcp/)     │
                                    │  3. 응답 정규화 (normalizer) │
                                    │  4. 캐시 태그 + revalidate   │
                                    └─────────────┬───────────────┘
                                                  │ HTTP
                                                  ▼
                                    ┌─────────────────────────────┐
                                    │  real-estate-mcp (MCP 서버)  │
                                    │  - 공공데이터 API 호출        │
                                    │  - 데이터 가공/반환           │
                                    └─────────────────────────────┘
```

### 단계별 상세

**Step 1: 사용자 액션 → Zustand 업데이트**
```
사용자가 지도에서 강남구 폴리곤 클릭
  → KakaoMap.onClick 이벤트
  → selectionStore.selectRegion("11680", "서울 강남구")
  → uiStore.openPanel()
```

**Step 2: Zustand 상태 → TanStack Query Key 구성**
```
Query 훅이 store를 subscribe:
  const { selectedLawd } = useSelectionStore()
  const { propertyType, months } = useFilterStore()

  queryKey = ['report', propertyType, selectedLawd, months]
  // selectedLawd 변경 시 자동 refetch
```

**Step 3: TanStack Query → Route Handler**
```
queryFn: () => fetcher(`/api/report?type=${propertyType}&lawd=${lawd}&months=${months}`)
  - 캐시 히트: 즉시 반환 (네트워크 요청 없음)
  - 캐시 미스: Route Handler로 GET 요청
```

**Step 4: Route Handler → MCP 서버**
```
/api/report/route.ts:
  1. searchParams 파싱 + 유효성 검증 (lawd 5자리, months 1~12)
  2. 최근 N개월 ym 목록 생성
  3. Promise.all로 MCP 병렬 호출:
     - mcpClient.callTool('get_apartment_trades', { lawd, ym }) × N
     - mcpClient.callTool('get_apartment_rents', { lawd, ym }) × N
  4. normalizer로 원본 → ReportSummary 변환
  5. Next.js cache tag 부여 + revalidate 설정
  6. JSON 응답 반환
```

**Step 5: 컴포넌트 렌더링**
```
TanStack Query 상태에 따라:
  - isLoading: Skeleton UI
  - isError: ErrorFallback + 재시도 버튼
  - isSuccess: StatCard, TrendChart 등 데이터 렌더
  - isStale + 이전 데이터 존재: stale 표시로 이전 데이터 유지
```

---

## 3. 상태 관리 설계

### 핵심 원칙
- **Zustand**: queryKey 재료 + UI/지도 상태만 관리. 서버 데이터 저장 금지.
- **TanStack Query**: 모든 서버 데이터의 캐시, 동기화, 로딩/에러 상태 관리.
- **분리 기준**: "서버에서 온 데이터인가?" → TanStack Query. "클라이언트에서 발생한 상태인가?" → Zustand.

### 3.1 mapStore

```typescript
// src/stores/mapStore.ts
import { create } from 'zustand'

interface MapState {
  // ── 상태 ──
  center: { lat: number; lng: number }
  zoom: number
  bounds: {
    sw: { lat: number; lng: number }
    ne: { lat: number; lng: number }
  } | null
  hoverRegionCode: string | null   // 마우스 오버 중인 지역 코드

  // ── 액션 ──
  setCenter: (lat: number, lng: number) => void
  setZoom: (zoom: number) => void
  setBounds: (sw: { lat: number; lng: number }, ne: { lat: number; lng: number }) => void
  setHoverRegion: (code: string | null) => void
  resetMap: () => void
}

const DEFAULT_CENTER = { lat: 37.5665, lng: 126.978 } // 서울시청
const DEFAULT_ZOOM = 11

export const useMapStore = create<MapState>((set) => ({
  center: DEFAULT_CENTER,
  zoom: DEFAULT_ZOOM,
  bounds: null,
  hoverRegionCode: null,

  setCenter: (lat, lng) => set({ center: { lat, lng } }),
  setZoom: (zoom) => set({ zoom }),
  setBounds: (sw, ne) => set({ bounds: { sw, ne } }),
  setHoverRegion: (code) => set({ hoverRegionCode: code }),
  resetMap: () => set({ center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM, bounds: null, hoverRegionCode: null }),
}))
```

### 3.2 selectionStore

```typescript
// src/stores/selectionStore.ts
import { create } from 'zustand'

interface SelectionState {
  // ── 상태 ──
  selectedLawd: string | null       // 법정동 코드 (예: "11680")
  selectedRegionName: string | null  // 표시용 이름 (예: "서울 강남구")
  selectedPolygonId: string | null   // 지도 폴리곤 식별자

  // ── 액션 ──
  selectRegion: (lawd: string, name: string, polygonId?: string) => void
  clearSelection: () => void
}

export const useSelectionStore = create<SelectionState>((set) => ({
  selectedLawd: null,
  selectedRegionName: null,
  selectedPolygonId: null,

  selectRegion: (lawd, name, polygonId) =>
    set({
      selectedLawd: lawd,
      selectedRegionName: name,
      selectedPolygonId: polygonId ?? lawd,
    }),
  clearSelection: () =>
    set({
      selectedLawd: null,
      selectedRegionName: null,
      selectedPolygonId: null,
    }),
}))
```

### 3.3 uiStore

```typescript
// src/stores/uiStore.ts
import { create } from 'zustand'

type ReportTab = 'trade' | 'rent' | 'summary'

interface UIState {
  // ── 상태 ──
  rightPanelOpen: boolean
  activeTab: ReportTab

  // ── 액션 ──
  openPanel: () => void
  closePanel: () => void
  togglePanel: () => void
  setActiveTab: (tab: ReportTab) => void
}

export const useUIStore = create<UIState>((set) => ({
  rightPanelOpen: false,
  activeTab: 'trade',

  openPanel: () => set({ rightPanelOpen: true }),
  closePanel: () => set({ rightPanelOpen: false }),
  togglePanel: () => set((s) => ({ rightPanelOpen: !s.rightPanelOpen })),
  setActiveTab: (tab) => set({ activeTab: tab }),
}))
```

### 3.4 filterStore

```typescript
// src/stores/filterStore.ts
import { create } from 'zustand'
import type { PropertyType } from '@/types/filter'

interface FilterState {
  // ── 상태 ──
  propertyType: PropertyType           // 'apartment' | 'officetel' | 'rowhouse'
  months: number                       // 조회 개월 수 (기본: 6)
  priceRange: { min: number; max: number } | null  // V1: 가격 범위 필터
  areaRange: { min: number; max: number } | null   // V1: 면적 범위 필터

  // ── 액션 ──
  setPropertyType: (type: PropertyType) => void
  setMonths: (months: number) => void
  setPriceRange: (range: { min: number; max: number } | null) => void
  setAreaRange: (range: { min: number; max: number } | null) => void
  resetFilters: () => void
}

export const useFilterStore = create<FilterState>((set) => ({
  propertyType: 'apartment',
  months: 6,
  priceRange: null,
  areaRange: null,

  setPropertyType: (type) => set({ propertyType: type }),
  setMonths: (months) => set({ months }),
  setPriceRange: (range) => set({ priceRange: range }),
  setAreaRange: (range) => set({ areaRange: range }),
  resetFilters: () =>
    set({
      propertyType: 'apartment',
      months: 6,
      priceRange: null,
      areaRange: null,
    }),
}))
```

### Store 간 관계도

```
filterStore.propertyType ─┐
filterStore.months ────────┤
                           ├──▶ queryKey 구성 ──▶ TanStack Query
selectionStore.selectedLawd┘
                                      │
uiStore.rightPanelOpen ◀── selectionStore.selectRegion() 부수효과
uiStore.activeTab ────────────────────┘ (탭에 따라 다른 query 훅 활성화)

mapStore.hoverRegionCode ──▶ PolygonLayer 하이라이트 렌더링
mapStore.center/zoom ──────▶ KakaoMap 뷰 동기화
```

---

## 4. API Route 설계

### 4.1 GET /api/region-code

**목적**: 지역 검색어 → 법정동 코드 변환

```typescript
// src/app/api/region-code/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { mcpClient } from '@/lib/mcp/client'
import { validateRegionQuery } from '@/lib/api/validation'

// 요청: GET /api/region-code?q=서울+강남구+삼성동
// 응답:
interface RegionCodeResponse {
  lawd: string              // "11680"
  name: string              // "서울특별시 강남구"
  level: 'sigungu' | 'dong' // 지역 레벨
  candidates?: Array<{      // 동명 중복 시 후보 목록
    lawd: string
    name: string
  }>
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')

  // 1. 입력 검증
  const validation = validateRegionQuery(q)
  if (!validation.ok) {
    return NextResponse.json({ error: validation.message }, { status: 400 })
  }

  // 2. MCP 호출
  const result = await mcpClient.callTool('search_region_code', { query: q })

  // 3. 정규화 + 응답
  return NextResponse.json(normalizeRegionCode(result), {
    headers: { 'Cache-Control': 'public, max-age=86400' }, // 지역코드는 거의 불변
  })
}
```

### 4.2 GET /api/trades

**목적**: 특정 지역/월의 실거래(매매) 원본 데이터 조회

```typescript
// src/app/api/trades/route.ts

// 요청: GET /api/trades?type=apartment&lawd=11680&ym=202601
// 응답:
interface TradesResponse {
  items: TradeItem[]
  meta: {
    lawd: string
    ym: string
    propertyType: PropertyType
    totalCount: number
    fetchedAt: string  // ISO 8601
  }
}

interface TradeItem {
  aptName: string          // 단지명
  area: number             // 전용면적 (㎡)
  price: number            // 거래금액 (만원)
  floor: number            // 층
  dealDate: string         // 거래일 "2026-01-15"
  jibun: string            // 지번
  builtYear: number        // 건축년도
}

export async function GET(request: NextRequest) {
  const { type, lawd, ym } = parseTradeParams(request.nextUrl.searchParams)

  // 입력 검증
  if (!isValidLawd(lawd) || !isValidYm(ym) || !isValidPropertyType(type)) {
    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })
  }

  // MCP 호출 (타입별 분기)
  const toolName = MCP_TOOL_MAP[type] // 'get_apartment_trades' 등
  const raw = await mcpClient.callTool(toolName, {
    lawd_cd: lawd,
    deal_ymd: ym,
  })

  const normalized = normalizeTrades(raw, type)

  return NextResponse.json(normalized, {
    next: { tags: [`trades:${type}:${lawd}:${ym}`] },           // 캐시 태그
    headers: { 'Cache-Control': 'public, s-maxage=3600' },      // 1시간
  })
}
```

### 4.3 GET /api/rents

**목적**: 특정 지역/월의 전월세 원본 데이터 조회

```typescript
// src/app/api/rents/route.ts

// 요청: GET /api/rents?type=apartment&lawd=11680&ym=202601
// 응답:
interface RentsResponse {
  items: RentItem[]
  meta: {
    lawd: string
    ym: string
    propertyType: PropertyType
    totalCount: number
    fetchedAt: string
  }
}

interface RentItem {
  aptName: string
  area: number              // 전용면적 (㎡)
  rentType: 'jeonse' | 'monthly'  // 전세/월세
  deposit: number           // 보증금 (만원)
  monthlyRent: number       // 월세 (만원, 전세면 0)
  floor: number
  dealDate: string
  jibun: string
  builtYear: number
}

// 캐시 전략: trades와 동일
// next: { tags: [`rents:${type}:${lawd}:${ym}`] }
// Cache-Control: public, s-maxage=3600
```

### 4.4 GET /api/report (핵심 엔드포인트)

**목적**: 지역의 N개월 집계 리포트를 한 번에 반환 (프론트 단순화)

```typescript
// src/app/api/report/route.ts

// 요청: GET /api/report?type=apartment&lawd=11680&months=6
// 응답:
interface ReportResponse {
  region: {
    lawd: string
    name: string
  }
  propertyType: PropertyType
  period: {
    months: number
    startYm: string       // "202507"
    endYm: string         // "202601"
  }
  trade: TradeSummary
  rent: RentSummary
  jeonseRate: JeonseRate
  monthly: MonthlyBreakdown[]
}

interface TradeSummary {
  medianPrice: number         // 중위 매매가 (만원)
  totalCount: number          // 총 거래건수
  priceRange: {
    min: number
    max: number
    q1: number                // 25% 분위
    q3: number                // 75% 분위
  }
  trend: 'up' | 'down' | 'flat'  // 기간 내 추세
  trendPercent: number            // 변동률 (%)
}

interface RentSummary {
  medianDeposit: number       // 전세 중위 보증금 (만원)
  medianMonthly: number       // 월세 중위 월세 (만원)
  totalCount: number
  jeonseCount: number         // 전세 건수
  monthlyCount: number        // 월세 건수
  depositRange: {
    min: number
    max: number
    q1: number
    q3: number
  }
}

interface JeonseRate {
  value: number               // 전세가율 (%) = 전세 중위 보증금 / 매매 중위가 × 100
  level: 'caution' | 'normal' | 'good'  // 주의/보통/양호
  description: string         // "전세가율 72.3% — 주의"
}

interface MonthlyBreakdown {
  ym: string                  // "202601"
  tradeCount: number
  tradeMedianPrice: number
  rentCount: number
  rentMedianDeposit: number
}

export async function GET(request: NextRequest) {
  const { type, lawd, months } = parseReportParams(request.nextUrl.searchParams)

  // 검증
  if (!isValidLawd(lawd) || !isValidMonths(months) || !isValidPropertyType(type)) {
    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })
  }

  // 최근 N개월 ym 목록 생성
  const ymList = generateYmList(months) // ['202601','202512',...,'202508']

  // MCP 병렬 호출 (월별 매매 + 전월세)
  const [tradesResults, rentsResults] = await Promise.all([
    Promise.all(ymList.map((ym) =>
      mcpClient.callTool(MCP_TOOL_MAP[type], { lawd_cd: lawd, deal_ymd: ym })
    )),
    Promise.all(ymList.map((ym) =>
      mcpClient.callTool(MCP_RENT_TOOL_MAP[type], { lawd_cd: lawd, deal_ymd: ym })
    )),
  ])

  // 정규화 + 집계
  const report = buildReport(tradesResults, rentsResults, { type, lawd, months, ymList })

  return NextResponse.json(report, {
    next: { tags: [`report:${type}:${lawd}:m${months}`] },
    headers: { 'Cache-Control': 'public, s-maxage=1800' },  // 30분
  })
}
```

### API 요약표

| 엔드포인트 | 용도 | 캐시 태그 | s-maxage |
|------------|------|-----------|----------|
| `GET /api/region-code` | 지역 검색 | 없음 (불변) | 86400 (24h) |
| `GET /api/trades` | 월별 매매 원본 | `trades:{type}:{lawd}:{ym}` | 3600 (1h) |
| `GET /api/rents` | 월별 전월세 원본 | `rents:{type}:{lawd}:{ym}` | 3600 (1h) |
| `GET /api/report` | N개월 집계 리포트 | `report:{type}:{lawd}:m{N}` | 1800 (30m) |

---

## 5. 컴포넌트 트리

### 전체 계층 구조

```
RootLayout (app/layout.tsx)
├── QueryProvider                        # TanStack QueryClient
├── KakaoMapProvider                     # 카카오맵 SDK 로드
│
└── MainPage (app/page.tsx)
    └── AppShell                         # flex 컨테이너 (h-screen)
        │
        ├── TopBar                       # 상단 바
        │   ├── RegionPill               # "서울 강남구" 배지 (motion: bounce-in)
        │   ├── PropertyTypeFilter       # 유형 칩 필터
        │   └── PeriodFilter             # 기간 선택
        │
        ├── KakaoMap (flex: 70%)         # 지도 영역
        │   ├── KakaoMapLoader           # SDK <Script> 관리
        │   └── PolygonLayer             # 시군구 폴리곤 오버레이
        │       ├── 각 폴리곤 hover 시   # mapStore.hoverRegionCode 업데이트
        │       └── 각 폴리곤 click 시   # selectionStore.selectRegion() 호출
        │
        └── AnimatePresence              # 패널 mount/unmount 애니메이션
            └── ReportPanel (flex: 30%)  # motion.div (slide-in from right)
                │
                ├── ReportTabs           # 탭 네비게이션
                │   ├── Tab "매매"       # layoutId 인디케이터 이동
                │   ├── Tab "전월세"
                │   └── Tab "요약"
                │
                ├── StatusDot            # 로딩/성공/실패 상태
                │
                └── TabContent           # activeTab에 따라 조건부 렌더
                    │
                    ├── TradeTab (activeTab === 'trade')
                    │   ├── Skeleton     # isLoading일 때
                    │   ├── ErrorFallback# isError일 때
                    │   ├── StatCard     # 중위 매매가
                    │   ├── StatCard     # 거래량
                    │   ├── StatCard     # 가격 범위 (접힘/펼침)
                    │   └── TrendChart   # 월별 트렌드
                    │
                    ├── RentTab (activeTab === 'rent')
                    │   ├── StatCard     # 중위 보증금
                    │   ├── StatCard     # 중위 월세
                    │   ├── StatCard     # 전세/월세 비율
                    │   └── TrendChart   # 월별 트렌드
                    │
                    └── SummaryTab (activeTab === 'summary')
                        ├── JeonseRateBadge  # 전세가율 배지 (주의/보통/양호)
                        ├── StatCard         # 핵심 지표 요약
                        └── TrendChart       # 매매 vs 전세 비교 차트
```

### 주요 컴포넌트 Props 인터페이스

```typescript
// ReportPanel
interface ReportPanelProps {
  // 데이터 없음: selectionStore에서 직접 구독
}

// StatCard
interface StatCardProps {
  title: string
  value: string | number
  unit?: string              // "만원", "건" 등
  change?: {
    value: number
    direction: 'up' | 'down' | 'flat'
  }
  expandable?: boolean       // 접힘/펼침 가능 여부
  children?: React.ReactNode // 펼침 시 상세 내용
}

// TrendChart
interface TrendChartProps {
  data: Array<{
    ym: string
    value: number
    label?: string
  }>
  yAxisLabel: string
  color?: string
}

// JeonseRateBadge
interface JeonseRateBadgeProps {
  rate: number
  level: 'caution' | 'normal' | 'good'
}
```

---

## 6. 타입 시스템

### 6.1 Region 타입

```typescript
// src/types/region.ts

/** 시군구/행정동 지역 정보 */
export interface Region {
  lawd: string                // 법정동 코드 ("11680")
  name: string                // 지역명 ("서울특별시 강남구")
  shortName: string           // 짧은 이름 ("강남구")
  level: RegionLevel
  center: Coordinates         // 중심 좌표 (지도 이동용)
  parentLawd?: string         // 상위 지역 코드
}

export type RegionLevel = 'sido' | 'sigungu' | 'dong'

export interface Coordinates {
  lat: number
  lng: number
}

/** 지역 검색 결과 */
export interface RegionSearchResult {
  lawd: string
  name: string
  level: RegionLevel
  candidates?: Array<{ lawd: string; name: string }>
}
```

### 6.2 Trade 타입

```typescript
// src/types/trade.ts
import type { PropertyType } from './filter'

/** 개별 매매 거래 항목 */
export interface TradeItem {
  aptName: string
  area: number               // 전용면적 (㎡)
  price: number              // 거래금액 (만원)
  floor: number
  dealDate: string           // "2026-01-15"
  jibun: string
  builtYear: number
}

/** 월별 매매 데이터 */
export interface TradeData {
  items: TradeItem[]
  meta: {
    lawd: string
    ym: string
    propertyType: PropertyType
    totalCount: number
    fetchedAt: string
  }
}

/** 매매 집계 요약 */
export interface TradeSummary {
  medianPrice: number
  totalCount: number
  priceRange: QuantileRange
  trend: TrendDirection
  trendPercent: number
}

export interface QuantileRange {
  min: number
  max: number
  q1: number
  q3: number
}

export type TrendDirection = 'up' | 'down' | 'flat'
```

### 6.3 Rent 타입

```typescript
// src/types/rent.ts
import type { PropertyType } from './filter'

export type RentType = 'jeonse' | 'monthly'

/** 개별 전월세 거래 항목 */
export interface RentItem {
  aptName: string
  area: number
  rentType: RentType
  deposit: number            // 보증금 (만원)
  monthlyRent: number        // 월세 (만원, 전세면 0)
  floor: number
  dealDate: string
  jibun: string
  builtYear: number
}

/** 월별 전월세 데이터 */
export interface RentData {
  items: RentItem[]
  meta: {
    lawd: string
    ym: string
    propertyType: PropertyType
    totalCount: number
    fetchedAt: string
  }
}

/** 전월세 집계 요약 */
export interface RentSummary {
  medianDeposit: number
  medianMonthly: number
  totalCount: number
  jeonseCount: number
  monthlyCount: number
  depositRange: QuantileRange
}
```

### 6.4 Report 타입

```typescript
// src/types/report.ts
import type { PropertyType } from './filter'
import type { TradeSummary } from './trade'
import type { RentSummary } from './rent'

/** 전세가율 정보 */
export interface JeonseRate {
  value: number              // 전세가율 (%)
  level: JeonseRateLevel
  description: string        // "전세가율 72.3% — 주의"
}

export type JeonseRateLevel = 'caution' | 'normal' | 'good'
// caution: 70% 이상 (깡통전세 위험)
// normal: 50~70%
// good: 50% 미만

/** 월별 요약 */
export interface MonthlyBreakdown {
  ym: string
  tradeCount: number
  tradeMedianPrice: number
  rentCount: number
  rentMedianDeposit: number
}

/** 리포트 전체 응답 */
export interface ReportSummary {
  region: {
    lawd: string
    name: string
  }
  propertyType: PropertyType
  period: {
    months: number
    startYm: string
    endYm: string
  }
  trade: TradeSummary
  rent: RentSummary
  jeonseRate: JeonseRate
  monthly: MonthlyBreakdown[]
}
```

### 6.5 Filter 타입

```typescript
// src/types/filter.ts

export type PropertyType = 'apartment' | 'officetel' | 'rowhouse'

export const PROPERTY_TYPE_LABEL: Record<PropertyType, string> = {
  apartment: '아파트',
  officetel: '오피스텔',
  rowhouse: '연립다세대',
}

export interface FilterState {
  propertyType: PropertyType
  months: number
  priceRange: NumericRange | null
  areaRange: NumericRange | null
}

export interface NumericRange {
  min: number
  max: number
}
```

### 6.6 Map 타입

```typescript
// src/types/map.ts
import type { Coordinates } from './region'

export interface MapBounds {
  sw: Coordinates
  ne: Coordinates
}

export interface MapViewState {
  center: Coordinates
  zoom: number
  bounds: MapBounds | null
}

/** GeoJSON 기반 폴리곤 데이터 */
export interface RegionPolygon {
  regionCode: string         // 법정동 코드
  regionName: string
  coordinates: Coordinates[] // 폴리곤 꼭짓점 배열
  center: Coordinates        // 폴리곤 중심점
}

/** 폴리곤 스타일 상태 */
export interface PolygonStyle {
  fillColor: string
  fillOpacity: number
  strokeColor: string
  strokeWidth: number
}

export const POLYGON_STYLES: Record<'default' | 'hover' | 'selected', PolygonStyle> = {
  default: {
    fillColor: '#3B82F6',
    fillOpacity: 0.1,
    strokeColor: '#3B82F6',
    strokeWidth: 1,
  },
  hover: {
    fillColor: '#3B82F6',
    fillOpacity: 0.3,
    strokeColor: '#2563EB',
    strokeWidth: 2,
  },
  selected: {
    fillColor: '#2563EB',
    fillOpacity: 0.4,
    strokeColor: '#1D4ED8',
    strokeWidth: 3,
  },
}
```

---

## 7. 캐싱 아키텍처

### 7.1 2계층 캐시 전략

```
요청 흐름:
  Browser → [L1: TanStack Query] → [L2: Next.js Data Cache] → MCP 서버

캐시 히트 시나리오:
  L1 히트: 네트워크 요청 없음, 즉시 렌더 (0ms)
  L1 미스 + L2 히트: Route Handler 진입하지만 MCP 호출 없음
  L1+L2 미스: MCP 서버 호출 후 양쪽 캐시 저장
```

### 7.2 서버 캐시 (Next.js Data Cache + Route Handler)

```typescript
// 캐시 태그 체계
type CacheTag =
  | `trades:${PropertyType}:${string}:${string}`   // trades:apartment:11680:202601
  | `rents:${PropertyType}:${string}:${string}`    // rents:apartment:11680:202601
  | `report:${PropertyType}:${string}:m${number}`  // report:apartment:11680:m6

// revalidate 정책
const CACHE_POLICY = {
  trades: {
    sMaxAge: 3600,      // 1시간 — 월별 실거래는 한 번 확정되면 변경 적음
    revalidate: 3600,
  },
  rents: {
    sMaxAge: 3600,      // 1시간 — 동일 근거
    revalidate: 3600,
  },
  report: {
    sMaxAge: 1800,      // 30분 — 집계 리포트는 하위 데이터 변경 가능성
    revalidate: 1800,
  },
  regionCode: {
    sMaxAge: 86400,     // 24시간 — 법정동 코드는 거의 불변
    revalidate: 86400,
  },
} as const

// 수동 재검증 (필요 시)
// import { revalidateTag } from 'next/cache'
// revalidateTag('trades:apartment:11680:202601')
```

### 7.3 클라이언트 캐시 (TanStack Query)

```typescript
// src/hooks/queries/queryKeys.ts

/**
 * Query Key Factory 패턴
 * 계층적 키 구조로 일괄 무효화 지원
 */
export const queryKeys = {
  report: {
    all: ['report'] as const,
    byRegion: (lawd: string) => ['report', lawd] as const,
    detail: (type: PropertyType, lawd: string, months: number) =>
      ['report', type, lawd, months] as const,
  },
  trades: {
    all: ['trades'] as const,
    byRegion: (lawd: string) => ['trades', lawd] as const,
    detail: (type: PropertyType, lawd: string, ym: string) =>
      ['trades', type, lawd, ym] as const,
  },
  rents: {
    all: ['rents'] as const,
    byRegion: (lawd: string) => ['rents', lawd] as const,
    detail: (type: PropertyType, lawd: string, ym: string) =>
      ['rents', type, lawd, ym] as const,
  },
  regionCode: {
    search: (q: string) => ['regionCode', q] as const,
  },
} as const
```

```typescript
// src/hooks/queries/useReport.ts
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useSelectionStore } from '@/stores/selectionStore'
import { useFilterStore } from '@/stores/filterStore'
import { queryKeys } from './queryKeys'
import { fetcher } from '@/lib/api/fetcher'
import type { ReportSummary } from '@/types/report'

export function useReport() {
  const selectedLawd = useSelectionStore((s) => s.selectedLawd)
  const propertyType = useFilterStore((s) => s.propertyType)
  const months = useFilterStore((s) => s.months)

  return useQuery<ReportSummary>({
    queryKey: queryKeys.report.detail(propertyType, selectedLawd!, months),
    queryFn: () =>
      fetcher(`/api/report?type=${propertyType}&lawd=${selectedLawd}&months=${months}`),
    enabled: !!selectedLawd,      // 지역 미선택 시 비활성화
    staleTime: 20 * 60 * 1000,    // 20분: 실거래 데이터 갱신 빈도 고려
    gcTime: 6 * 60 * 60 * 1000,   // 6시간: 같은 지역 재방문 시 캐시 재사용
    placeholderData: (prev) => prev, // 필터 변경 시 이전 데이터를 placeholder로 유지
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
  })
}
```

```typescript
// src/hooks/queries/useTrades.ts

export function useTrades(ym: string) {
  const selectedLawd = useSelectionStore((s) => s.selectedLawd)
  const propertyType = useFilterStore((s) => s.propertyType)

  return useQuery<TradeData>({
    queryKey: queryKeys.trades.detail(propertyType, selectedLawd!, ym),
    queryFn: () =>
      fetcher(`/api/trades?type=${propertyType}&lawd=${selectedLawd}&ym=${ym}`),
    enabled: !!selectedLawd,
    staleTime: 30 * 60 * 1000,    // 30분
    gcTime: 6 * 60 * 60 * 1000,   // 6시간
  })
}
```

### 7.4 프리패치 전략

```typescript
// src/hooks/usePrefetch.ts
import { useQueryClient } from '@tanstack/react-query'
import { useSelectionStore } from '@/stores/selectionStore'
import { useFilterStore } from '@/stores/filterStore'
import { queryKeys } from './queries/queryKeys'
import { fetcher } from '@/lib/api/fetcher'
import { useEffect } from 'react'

/**
 * 선택 지역이 변경되면 인접 데이터를 백그라운드 프리패치
 *
 * 프리패치 대상:
 * 1. report: 다른 propertyType (아파트 선택 시 → 오피스텔 프리패치)
 * 2. trades/rents: 인접 월 (현재 월 ±1)
 */
export function usePrefetch() {
  const queryClient = useQueryClient()
  const selectedLawd = useSelectionStore((s) => s.selectedLawd)
  const propertyType = useFilterStore((s) => s.propertyType)
  const months = useFilterStore((s) => s.months)

  useEffect(() => {
    if (!selectedLawd) return

    // 다른 유형 리포트 프리패치 (낮은 우선순위)
    const otherTypes = (['apartment', 'officetel'] as const).filter(
      (t) => t !== propertyType
    )

    otherTypes.forEach((type) => {
      queryClient.prefetchQuery({
        queryKey: queryKeys.report.detail(type, selectedLawd, months),
        queryFn: () =>
          fetcher(`/api/report?type=${type}&lawd=${selectedLawd}&months=${months}`),
        staleTime: 20 * 60 * 1000,
      })
    })
  }, [selectedLawd, propertyType, months, queryClient])
}
```

### 7.5 캐시 정책 요약표

| 데이터 | Query Key | staleTime | gcTime | 프리패치 |
|--------|-----------|-----------|--------|----------|
| 리포트 집계 | `['report', type, lawd, months]` | 20분 | 6시간 | 다른 propertyType |
| 월별 매매 | `['trades', type, lawd, ym]` | 30분 | 6시간 | 인접 월 (ym ± 1) |
| 월별 전월세 | `['rents', type, lawd, ym]` | 30분 | 6시간 | 인접 월 (ym ± 1) |
| 지역코드 검색 | `['regionCode', q]` | 24시간 | 7일 | 없음 |

### 7.6 캐시 무효화 시나리오

```
사용자 액션             → 무효화 범위
─────────────────────────────────────────────────
지역 변경 (클릭)        → 새 queryKey로 자동 fetch (기존 캐시 유지)
필터 변경 (유형)        → queryKey 변경 → 캐시 히트 or 새 fetch
수동 새로고침 버튼      → queryClient.invalidateQueries({ queryKey: queryKeys.report.byRegion(lawd) })
에러 후 재시도          → query.refetch() (동일 키 재요청)
```

---

## 8. 카카오맵 통합 패턴

### 설계 결정: Ref 기반 래퍼 컴포넌트

카카오맵 SDK는 DOM 직접 조작 라이브러리이므로, React의 선언적 모델과 충돌한다. 이를 해결하기 위해 **ref 기반 명령형 래퍼** 패턴을 사용한다.

```
선택한 패턴: Ref 기반 래퍼 (Imperative Wrapper)
────────────────────────────────────────────────
React 컴포넌트가 map instance를 ref로 보유하고,
Zustand 상태 변경 시 useEffect에서 map API를 명령형으로 호출.

장점: 카카오맵 API를 그대로 사용, 성능 제어 용이, 리렌더 최소화
단점: 선언적 패턴 아님, 동기화 코드 수동 관리 필요
대안: react-kakao-maps-sdk (선언적) — but 커스텀 폴리곤 제어에 제약
```

### 8.1 SDK 로드 (KakaoMapProvider)

```typescript
// src/providers/KakaoMapProvider.tsx
'use client'

import Script from 'next/script'
import { createContext, useContext, useState, useCallback } from 'react'

interface KakaoMapContextValue {
  isLoaded: boolean
}

const KakaoMapContext = createContext<KakaoMapContextValue>({ isLoaded: false })

export function KakaoMapProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false)

  const handleLoad = useCallback(() => {
    // kakao.maps.load()로 실제 API 로드 완료 대기
    window.kakao.maps.load(() => {
      setIsLoaded(true)
    })
  }, [])

  return (
    <KakaoMapContext.Provider value={{ isLoaded }}>
      <Script
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false&libraries=services`}
        strategy="afterInteractive"
        onLoad={handleLoad}
      />
      {children}
    </KakaoMapContext.Provider>
  )
}

export const useKakaoMapLoaded = () => useContext(KakaoMapContext)
```

### 8.2 맵 인스턴스 관리 (useKakaoMap)

```typescript
// src/components/map/useKakaoMap.ts
'use client'

import { useRef, useEffect, useCallback } from 'react'
import { useMapStore } from '@/stores/mapStore'
import { useKakaoMapLoaded } from '@/providers/KakaoMapProvider'

export function useKakaoMap(containerRef: React.RefObject<HTMLDivElement>) {
  const mapRef = useRef<kakao.maps.Map | null>(null)
  const { isLoaded } = useKakaoMapLoaded()
  const { center, zoom, setCenter, setZoom, setBounds } = useMapStore()

  // ── 초기화 ──
  useEffect(() => {
    if (!isLoaded || !containerRef.current || mapRef.current) return

    const options = {
      center: new kakao.maps.LatLng(center.lat, center.lng),
      level: zoom,
    }
    const map = new kakao.maps.Map(containerRef.current, options)
    mapRef.current = map

    // 지도 이벤트 → Zustand 동기화
    kakao.maps.event.addListener(map, 'center_changed', () => {
      const c = map.getCenter()
      setCenter(c.getLat(), c.getLng())
    })

    kakao.maps.event.addListener(map, 'zoom_changed', () => {
      setZoom(map.getLevel())
    })

    kakao.maps.event.addListener(map, 'bounds_changed', () => {
      const b = map.getBounds()
      setBounds(
        { lat: b.getSouthWest().getLat(), lng: b.getSouthWest().getLng() },
        { lat: b.getNorthEast().getLat(), lng: b.getNorthEast().getLng() }
      )
    })

    return () => {
      // 클린업: 이벤트 제거
      kakao.maps.event.removeListener(map, 'center_changed')
      kakao.maps.event.removeListener(map, 'zoom_changed')
      kakao.maps.event.removeListener(map, 'bounds_changed')
    }
  }, [isLoaded]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── 외부에서 지도 제어 ──
  const panTo = useCallback((lat: number, lng: number) => {
    if (!mapRef.current) return
    const position = new kakao.maps.LatLng(lat, lng)
    mapRef.current.panTo(position)
  }, [])

  const setLevel = useCallback((level: number) => {
    mapRef.current?.setLevel(level)
  }, [])

  return { mapRef, panTo, setLevel }
}
```

### 8.3 폴리곤 레이어 (PolygonLayer)

```typescript
// src/components/map/PolygonLayer.tsx
'use client'

import { useEffect, useRef } from 'react'
import { useMapStore } from '@/stores/mapStore'
import { useSelectionStore } from '@/stores/selectionStore'
import { useUIStore } from '@/stores/uiStore'
import { POLYGON_STYLES } from '@/types/map'
import type { RegionPolygon } from '@/types/map'

interface PolygonLayerProps {
  mapRef: React.RefObject<kakao.maps.Map | null>
  regions: RegionPolygon[]
}

export function PolygonLayer({ mapRef, regions }: PolygonLayerProps) {
  const polygonsRef = useRef<Map<string, kakao.maps.Polygon>>(new Map())
  const { setHoverRegion, hoverRegionCode } = useMapStore()
  const { selectRegion, selectedLawd } = useSelectionStore()
  const { openPanel } = useUIStore()

  // ── 폴리곤 생성/관리 ──
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    // 기존 폴리곤 제거
    polygonsRef.current.forEach((p) => p.setMap(null))
    polygonsRef.current.clear()

    regions.forEach((region) => {
      const path = region.coordinates.map(
        (c) => new kakao.maps.LatLng(c.lat, c.lng)
      )

      const polygon = new kakao.maps.Polygon({
        path,
        ...POLYGON_STYLES.default,
      })

      // hover 이벤트
      kakao.maps.event.addListener(polygon, 'mouseover', () => {
        setHoverRegion(region.regionCode)
        if (region.regionCode !== selectedLawd) {
          applyStyle(polygon, POLYGON_STYLES.hover)
        }
      })

      kakao.maps.event.addListener(polygon, 'mouseout', () => {
        setHoverRegion(null)
        if (region.regionCode !== selectedLawd) {
          applyStyle(polygon, POLYGON_STYLES.default)
        }
      })

      // 클릭 이벤트 → 지역 선택
      kakao.maps.event.addListener(polygon, 'click', () => {
        selectRegion(region.regionCode, region.regionName, region.regionCode)
        openPanel()

        // 이전 선택 폴리곤 스타일 복원
        polygonsRef.current.forEach((p, code) => {
          if (code !== region.regionCode) {
            applyStyle(p, POLYGON_STYLES.default)
          }
        })

        // 현재 폴리곤 선택 스타일
        applyStyle(polygon, POLYGON_STYLES.selected)

        // 선택 지역으로 지도 이동
        map.panTo(new kakao.maps.LatLng(region.center.lat, region.center.lng))
      })

      polygon.setMap(map)
      polygonsRef.current.set(region.regionCode, polygon)
    })

    return () => {
      polygonsRef.current.forEach((p) => p.setMap(null))
      polygonsRef.current.clear()
    }
  }, [mapRef.current, regions]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── 외부 선택 변경 시 스타일 동기화 ──
  useEffect(() => {
    polygonsRef.current.forEach((polygon, code) => {
      if (code === selectedLawd) {
        applyStyle(polygon, POLYGON_STYLES.selected)
      } else if (code === hoverRegionCode) {
        applyStyle(polygon, POLYGON_STYLES.hover)
      } else {
        applyStyle(polygon, POLYGON_STYLES.default)
      }
    })
  }, [selectedLawd, hoverRegionCode])

  return null // 렌더링 없음 — 순수 명령형 레이어
}

function applyStyle(polygon: kakao.maps.Polygon, style: typeof POLYGON_STYLES.default) {
  polygon.setOptions({
    fillColor: style.fillColor,
    fillOpacity: style.fillOpacity,
    strokeColor: style.strokeColor,
    strokeWeight: style.strokeWidth,
  })
}
```

### 8.4 통합 패턴 요약

```
┌─────────────────────────────────────────────────────┐
│ KakaoMapProvider (Script 로드, isLoaded 컨텍스트)     │
│                                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │ KakaoMap (ref 기반 래퍼)                        │  │
│  │                                                 │  │
│  │  containerRef ──▶ kakao.maps.Map instance       │  │
│  │  useKakaoMap() 훅: 초기화 + 이벤트 바인딩        │  │
│  │                                                 │  │
│  │  ┌──────────────────────────────────────────┐   │  │
│  │  │ PolygonLayer (명령형 오버레이)              │   │  │
│  │  │                                           │   │  │
│  │  │ mapRef → kakao.maps.Polygon 생성          │   │  │
│  │  │ regions[] → 각 지역별 폴리곤               │   │  │
│  │  │ hover → mapStore.setHoverRegion()         │   │  │
│  │  │ click → selectionStore.selectRegion()     │   │  │
│  │  │         + uiStore.openPanel()              │   │  │
│  │  │ 렌더: null (순수 side-effect)              │   │  │
│  │  └──────────────────────────────────────────┘   │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  Zustand (mapStore) ◀──── 지도 이벤트 (center, zoom) │
│  Zustand (selectionStore) ◀── 폴리곤 클릭             │
└─────────────────────────────────────────────────────┘

핵심 원칙:
  1. React는 DOM 컨테이너만 제공, 맵은 ref로 관리
  2. 카카오맵 이벤트 → Zustand (단방향)
  3. Zustand 상태 변경 → useEffect에서 맵 API 호출 (단방향)
  4. 양방향 동기화 루프 방지: 이벤트 핸들러에서 store 업데이트 시
     useEffect의 맵 API 호출이 다시 이벤트를 트리거하지 않도록
     "변경 소스" 플래그로 가드
```

---

## 9. MCP 클라이언트 설계

### 9.1 MCP HTTP 클라이언트

```typescript
// src/lib/mcp/client.ts

interface MCPToolCallParams {
  [key: string]: string | number | boolean
}

interface MCPResponse<T = unknown> {
  content: Array<{
    type: 'text'
    text: string  // JSON 문자열
  }>
}

class MCPClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.MCP_SERVER_URL!  // 서버 전용 환경변수
  }

  async callTool<T = unknown>(
    toolName: string,
    params: MCPToolCallParams
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}/call-tool`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: toolName,
        arguments: params,
      }),
      // Next.js fetch 확장: 캐시 태그
      next: {
        tags: [`mcp:${toolName}:${JSON.stringify(params)}`],
        revalidate: 3600,
      },
    })

    if (!response.ok) {
      throw new MCPError(
        `MCP tool "${toolName}" failed: ${response.status}`,
        toolName,
        response.status
      )
    }

    const data: MCPResponse<T> = await response.json()
    const text = data.content?.[0]?.text
    if (!text) {
      throw new MCPError(`MCP tool "${toolName}" returned empty content`, toolName)
    }

    return JSON.parse(text) as T
  }
}

export class MCPError extends Error {
  constructor(
    message: string,
    public readonly toolName: string,
    public readonly status?: number
  ) {
    super(message)
    this.name = 'MCPError'
  }
}

// 싱글턴 export
export const mcpClient = new MCPClient()
```

### 9.2 MCP 툴 매핑

```typescript
// src/lib/mcp/toolMap.ts
import type { PropertyType } from '@/types/filter'

/** 유형별 MCP 매매 툴 이름 매핑 */
export const MCP_TRADE_TOOL_MAP: Record<PropertyType, string> = {
  apartment: 'get_apartment_trades',
  officetel: 'get_officetel_trades',
  rowhouse: 'get_rowhouse_trades',
}

/** 유형별 MCP 전월세 툴 이름 매핑 */
export const MCP_RENT_TOOL_MAP: Record<PropertyType, string> = {
  apartment: 'get_apartment_rents',
  officetel: 'get_officetel_rents',
  rowhouse: 'get_rowhouse_rents',
}
```

### 9.3 응답 정규화

```typescript
// src/lib/mcp/normalizer.ts
import type { TradeItem } from '@/types/trade'
import type { RentItem } from '@/types/rent'

/**
 * MCP 원본 응답 → 앱 내부 타입 변환
 *
 * MCP 서버의 응답 필드명이 변경되어도
 * 이 normalizer만 수정하면 앱 전체에 영향 없음
 */
export function normalizeTrade(raw: Record<string, unknown>): TradeItem {
  return {
    aptName: String(raw['아파트'] ?? raw['aptName'] ?? ''),
    area: Number(raw['전용면적'] ?? raw['area'] ?? 0),
    price: parsePrice(raw['거래금액'] ?? raw['price']),
    floor: Number(raw['층'] ?? raw['floor'] ?? 0),
    dealDate: formatDealDate(raw['년'], raw['월'], raw['일']),
    jibun: String(raw['지번'] ?? raw['jibun'] ?? ''),
    builtYear: Number(raw['건축년도'] ?? raw['builtYear'] ?? 0),
  }
}

export function normalizeRent(raw: Record<string, unknown>): RentItem {
  return {
    aptName: String(raw['아파트'] ?? raw['aptName'] ?? ''),
    area: Number(raw['전용면적'] ?? raw['area'] ?? 0),
    rentType: raw['월세금액'] && Number(raw['월세금액']) > 0 ? 'monthly' : 'jeonse',
    deposit: parsePrice(raw['보증금액'] ?? raw['deposit']),
    monthlyRent: parsePrice(raw['월세금액'] ?? raw['monthlyRent']),
    floor: Number(raw['층'] ?? raw['floor'] ?? 0),
    dealDate: formatDealDate(raw['년'], raw['월'], raw['일']),
    jibun: String(raw['지번'] ?? raw['jibun'] ?? ''),
    builtYear: Number(raw['건축년도'] ?? raw['builtYear'] ?? 0),
  }
}

function parsePrice(val: unknown): number {
  if (typeof val === 'number') return val
  if (typeof val === 'string') return Number(val.replace(/,/g, '').trim()) || 0
  return 0
}

function formatDealDate(year: unknown, month: unknown, day: unknown): string {
  const y = String(year).padStart(4, '0')
  const m = String(month).padStart(2, '0')
  const d = String(day).padStart(2, '0')
  return `${y}-${m}-${d}`
}
```

---

## 10. 마이크로 인터랙션 설계

### Motion 적용 패턴

```typescript
// 1) 패널 슬라이드 인/아웃
// src/components/report/ReportPanel.tsx
<AnimatePresence mode="wait">
  {rightPanelOpen && (
    <motion.aside
      key="report-panel"
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="w-[30%] h-full border-l overflow-y-auto"
    >
      {/* 패널 내용 */}
    </motion.aside>
  )}
</AnimatePresence>

// 2) 탭 인디케이터 이동
// src/components/report/ReportTabs.tsx
{tabs.map((tab) => (
  <button key={tab.id} onClick={() => setActiveTab(tab.id)}>
    {tab.label}
    {activeTab === tab.id && (
      <motion.div
        layoutId="tab-indicator"
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
      />
    )}
  </button>
))}

// 3) 카드 접힘/펼침
// src/components/report/StatCard.tsx
<motion.div layout transition={{ type: 'spring', stiffness: 400, damping: 30 }}>
  <div>{/* 항상 보이는 요약 */}</div>
  <AnimatePresence>
    {expanded && (
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
</motion.div>

// 4) 지역 pill bounce-in
// src/components/layout/RegionPill.tsx
<AnimatePresence mode="wait">
  {selectedRegionName && (
    <motion.span
      key={selectedRegionName}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium"
    >
      {selectedRegionName}
    </motion.span>
  )}
</AnimatePresence>
```

---

## 11. 에러 처리 전략

### 계층별 에러 처리

```
Layer 1: MCP 클라이언트 (lib/mcp/client.ts)
  → MCPError throw (toolName, status 포함)
  → 재시도 없음 (Route Handler에서 판단)

Layer 2: Route Handler (app/api/*/route.ts)
  → MCP 에러 catch → 구조화된 에러 응답 반환
  → { error: string, code: 'MCP_UNAVAILABLE' | 'INVALID_PARAMS' | 'RATE_LIMITED' }
  → HTTP status: 502 (MCP 실패), 400 (잘못된 입력), 429 (요청 초과)

Layer 3: TanStack Query (hooks/queries/*.ts)
  → retry: 2, retryDelay: exponential backoff
  → isError 상태 → ErrorFallback 컴포넌트 표시
  → 이전 성공 데이터 있으면 stale 표시로 유지 (keepPreviousData)

Layer 4: 컴포넌트 (ErrorFallback.tsx)
  → "데이터를 불러올 수 없습니다" + 재시도 버튼
  → query.refetch() 호출
```

```typescript
// src/lib/api/fetcher.ts

export class APIError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export async function fetcher<T>(url: string): Promise<T> {
  const response = await fetch(url)

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new APIError(
      body.error ?? `Request failed: ${response.status}`,
      response.status,
      body.code
    )
  }

  return response.json()
}
```

---

## 12. 환경 변수

```bash
# .env.local

# 카카오맵 (클라이언트에서 사용 → NEXT_PUBLIC_ 접두어)
NEXT_PUBLIC_KAKAO_MAP_KEY=your_kakao_javascript_key

# MCP 서버 (서버에서만 사용 → NEXT_PUBLIC_ 없음)
MCP_SERVER_URL=http://localhost:3100

# 선택: 개발 환경
NODE_ENV=development
```

---

## 13. 주요 설계 결정 및 트레이드오프

| 결정 | 선택 | 대안 | 트레이드오프 |
|------|------|------|-------------|
| 맵 통합 | Ref 기반 명령형 래퍼 | react-kakao-maps-sdk (선언적) | 보일러플레이트 증가, but 폴리곤 스타일 제어 자유도 높음 |
| /api/report 집계 엔드포인트 | 서버에서 N개월 병렬 호출 후 집계 | 프론트에서 월별 개별 호출 후 클라이언트 집계 | 서버 부하 증가, but 클라이언트 로직 단순화 + 네트워크 왕복 감소 |
| Zustand store 분리 | 4개 store (map/selection/ui/filter) | 단일 store | 구독 세분화로 리렌더 최소화, but import 분산 |
| TanStack Query placeholderData | 이전 데이터 유지 | suspense 모드 | 탭/필터 전환 시 깜빡임 방지, but stale 데이터 표시 가능 |
| 폴리곤 데이터 | 정적 파일 (lib/geo/) | 서버에서 동적 로드 | 빌드 크기 증가, but 초기 로드 속도 보장 + API 호출 절감 |
| 캐시 태그 | `{domain}:{type}:{lawd}:{ym}` 형식 | 단순 URL 기반 | 세분화된 무효화 가능, but 태그 관리 복잡도 증가 |

---

## 14. 확장 포인트 (V1 대비)

```
현재 구조에서 V1 기능 추가 시 변경 범위:

청약 탭 추가:
  + app/api/subscription/route.ts     (새 Route Handler)
  + hooks/queries/useSubscription.ts  (새 Query 훅)
  + components/report/SubscriptionTab.tsx (새 탭 컴포넌트)
  + types/subscription.ts             (새 타입)
  ~ stores/uiStore.ts → ReportTab에 'subscription' 추가
  ~ components/report/ReportTabs.tsx → 탭 항목 추가
  영향 범위: 기존 코드 수정 최소 (uiStore 타입 확장 + 탭 배열 추가)

공매 탭 추가:
  동일 패턴. app/api/auction/route.ts + 관련 파일 추가.
  filterStore에 공매 전용 필터 (auctionStatus, bidPriceRange) 추가.

검색 기능 추가:
  + components/search/SearchBar.tsx
  ~ hooks/queries/useRegionCode.ts → 자동완성 쿼리 추가
  영향 범위: 독립 컴포넌트, TopBar에 삽입만 하면 됨
```
