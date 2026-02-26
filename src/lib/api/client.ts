import type { ApiError } from '@/types'

export async function fetchApi<T>(url: string): Promise<T> {
  const response = await fetch(url)

  if (!response.ok) {
    let errorBody: ApiError
    try {
      errorBody = await response.json()
    } catch {
      errorBody = { error: response.statusText, status: response.status }
    }
    throw errorBody
  }

  return response.json() as Promise<T>
}
