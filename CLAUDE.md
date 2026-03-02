# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

지도 기반 부동산 동네 리포트 앱 (MVP). 카카오맵에서 서울 시군구를 클릭하면 최근 N개월 매매/전월세 요약 리포트를 우측 패널에 표시한다. 데이터는 MCP 서버(real-estate-mcp)에서 공공데이터 API를 통해 조회하며, Next.js Route Handlers가 BFF로 중계한다.

## Commands

```bash
pnpm dev          # 개발 서버 (localhost:3000)
pnpm build        # 프로덕션 빌드
pnpm lint         # ESLint (next/core-web-vitals)
pnpm format       # Prettier 포맷 적용
pnpm format:check # Prettier 체크만
```

테스트 프레임워크는 아직 설정되지 않았다.

## Tech Stack

- **Framework**: Next.js 14 (App Router), React 18, TypeScript (strict)
- **Styling**: Tailwind CSS v3
- **State**: Zustand v5 (클라이언트 UI/지도 상태) + TanStack Query v5 (서버 데이터 캐시)
- **Animation**: Motion (Framer Motion) — 패널 슬라이드, 탭 인디케이터, 카드 접힘
- **Charts**: Recharts
- **Validation**: Zod v4 (Route Handler 입력 검증)
- **Map**: 카카오맵 SDK (ref 기반 명령형 래퍼 패턴)
- **Package Manager**: pnpm
- **Prettier**: single quotes, trailing commas, 100 printWidth (`.prettierrc`)

## Architecture

### Data Flow (핵심)

```
사용자 액션 → Zustand store 업데이트 → TanStack Query key 변경 → /api/* Route Handler → MCP 클라이언트 → MCP 서버/Mock
```

- 프론트엔드는 MCP를 직접 호출하지 않는다. 반드시 Next.js Route Handlers(BFF)를 거친다.
- Zustand는 queryKey 재료 + UI/지도 상태만 관리. **서버 데이터를 Zustand에 넣지 않는다.**
- TanStack Query가 모든 서버 데이터의 캐시/동기화/로딩/에러 상태를 담당한다.

### MCP Client (`src/lib/mcp/`)

- `MCP_MODE=mock` (기본): 실제 MCP 서버 없이 mock 데이터로 개발 가능
- `MCP_MODE=live`: `MCP_SERVER_URL`로 실제 MCP 서버에 HTTP 요청
- 재시도: exponential backoff, 최대 3회, 5xx/timeout만 재시도
- 에러 계층: `MCPError` → `MCPTimeoutError` / `MCPConnectionError` / `MCPResponseError`
- MCP 원본 응답(한글 필드명)은 `normalizer.ts`에서 앱 내부 타입으로 변환

### API Routes (`src/app/api/`)

| Endpoint | Purpose | Cache |
|---|---|---|
| `GET /api/report?type=&lawd=&months=` | N개월 집계 리포트 (메인) | s-maxage=1800 |
| `GET /api/trades?type=&lawd=&ym=` | 월별 매매 원본 | s-maxage=3600 |
| `GET /api/rents?type=&lawd=&ym=` | 월별 전월세 원본 | s-maxage=3600 |
| `GET /api/region-code?q=` | 지역 검색 | max-age=86400 |

모든 Route Handler는 Zod 스키마(`src/lib/api/validation.ts`)로 입력 검증 후 구조화된 `ApiResponse<T>` / `ApiError` 형태로 응답한다.

### Zustand Stores (`src/stores/`) — 5개 독립 슬라이스

- `mapStore`: 지도 center/zoom/bounds, hoverRegionCode
- `selectionStore`: 선택된 지역 (lawd, regionName)
- `uiStore`: 패널 open/close, activeTab (`overview`/`lease`/`trade`), sheetSnap (모바일 바텀시트), selectedAptName (단지 드릴다운), rankSortKey/rankSortDir (랭킹 정렬)
- `filterStore`: propertyType, months, priceRange, areaRange, areaBand (면적대 필터)
- `toastStore`: 토스트 알림 큐 (최대 3개, 5초 자동 제거)

모든 store는 `devtools` 미들웨어 적용 (개발 환경에서만 활성).

### TanStack Query Hooks (`src/hooks/queries/`)

- Query Key Factory 패턴: `queryKeys.report.detail(type, lawd, months)`
- 공유 옵션: `queryOptions.ts` (staleTime, gcTime)
- API endpoint 빌더: `src/lib/api/endpoints.ts`
- 클라이언트 fetch 래퍼: `src/lib/api/client.ts` (`fetchApi<T>`)

### Data Composition Hooks (`src/hooks/`)

쿼리 훅 위에 데이터 가공 훅이 계층적으로 구성된다:

```
useMultiMonthRents/Trades (useQueries로 N개월 병렬 fetch)
  → useAptRanking / useTradeRanking (면적대 필터 + 단지별 그룹핑 + 정렬)
    → useAptMarkers (랭킹 → 지오코딩 → 지도 마커)
```

- `useMultiMonth*`: `useQueries`로 N개월 데이터를 병렬 요청, 전체 아이템 배열로 flat
- `use*Ranking`: `useMemo`로 면적대 필터링 → 단지 그룹핑 → 정렬 (순수 계산, 추가 fetch 없음)
- `useAptMarkers`: 랭킹 결과를 카카오 지오코딩 API로 좌표 변환하여 마커 생성

유틸 함수는 `src/lib/utils/ranking.ts` (필터/그룹/정렬), `src/lib/utils/geocode.ts` (배치 지오코딩)에 분리.

### 카카오맵 통합 (`src/components/map/`)

ref 기반 명령형 래퍼 패턴을 사용한다:
- `KakaoMapLoader`: SDK Script 로드 + isLoaded 컨텍스트
- `KakaoMap`: div 컨테이너 제공, `useKakaoMap` 훅으로 map 인스턴스 초기화
- `PolygonLayer`: 시군구 폴리곤 오버레이 (순수 side-effect 컴포넌트, `return null`)
- `MarkerLayer`: 단지 랭킹 마커 오버레이 (순수 side-effect 컴포넌트, `return null`)
- 카카오맵 이벤트 → Zustand 단방향, Zustand → useEffect에서 맵 API 호출 단방향

### Component Patterns

- barrel export: 각 디렉토리에 `index.ts`로 re-export
- `'use client'` 지시자: 상호작용이 있는 컴포넌트에만 사용
- ErrorBoundary: 메인 페이지와 패널에 각각 감싸서 에러 격리
- 로딩: Skeleton 컴포넌트 패턴 (`TradeLoadingSkeleton`, `RentLoadingSkeleton`, `LeaseLoadingSkeleton`)
- 패널 탭: `TabContent`에서 `activeTab`에 따라 `OverviewTab` / `LeasePanel` / `TradeTab` 조건부 렌더링
- 반응형: `useMediaQuery` / `useIsDesktop` 훅으로 데스크톱/모바일 분기, 모바일은 바텀시트(`sheetSnap: peek/half/full`)

## Environment Variables

```bash
# .env.local (see .env.local.example)
NEXT_PUBLIC_KAKAO_MAP_KEY=  # 카카오맵 JS 키 (클라이언트 노출)
MCP_SERVER_URL=             # MCP 서버 URL (서버 전용)
MCP_MODE=mock               # mock | live
```

## Conventions

- Path alias: `@/*` → `./src/*`
- 한국어 주석/변수명은 도메인 용어에만 사용 (법정동코드, 전세가율 등)
- 타입은 `src/types/`에 도메인별 분리, barrel export로 `@/types`에서 임포트
- 상수는 `src/constants/`에 도메인별 분리
- 유틸리티 함수는 `src/lib/utils/`에 기능별 분리 (calc, date, format, geo, geocode, ranking, region, summary, export)
- Zustand store 액션에는 devtools용 action name 문자열을 항상 전달 (예: `'filter/setPropertyType'`)
