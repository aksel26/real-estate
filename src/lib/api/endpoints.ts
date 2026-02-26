export const endpoints = {
  regionCode: (query: string) => `/api/region-code?q=${encodeURIComponent(query)}`,
  trades: (type: string, lawd: string, ym: string) =>
    `/api/trades?type=${type}&lawd=${lawd}&ym=${ym}`,
  rents: (type: string, lawd: string, ym: string) =>
    `/api/rents?type=${type}&lawd=${lawd}&ym=${ym}`,
  report: (type: string, lawd: string, months: number) =>
    `/api/report?type=${type}&lawd=${lawd}&months=${months}`,
}
