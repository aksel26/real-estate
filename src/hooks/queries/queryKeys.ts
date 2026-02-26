export const queryKeys = {
  report: {
    all: ['report'] as const,
    byRegion: (lawd: string) => ['report', lawd] as const,
    detail: (type: string, lawd: string, months: number) =>
      ['report', type, lawd, months] as const,
  },
  trades: {
    all: ['trades'] as const,
    byRegion: (lawd: string) => ['trades', lawd] as const,
    detail: (type: string, lawd: string, ym: string) =>
      ['trades', type, lawd, ym] as const,
  },
  rents: {
    all: ['rents'] as const,
    byRegion: (lawd: string) => ['rents', lawd] as const,
    detail: (type: string, lawd: string, ym: string) =>
      ['rents', type, lawd, ym] as const,
  },
  regionCode: {
    all: ['regionCode'] as const,
    search: (query: string) => ['regionCode', query] as const,
  },
}
