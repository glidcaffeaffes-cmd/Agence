import type { ApiErrorDTO } from '~/types/dto'

type QueryValue = string | number | boolean | null | undefined
type QueryParams = Record<string, QueryValue>

const responseCache = new Map<string, Promise<unknown>>()

function resolveBaseUrl() {
  return useRuntimeConfig().public.apiBase || '/api'
}

function resolveErrorMessage(error: unknown, fallback: string) {
  const data = (error as { data?: ApiErrorDTO }).data
  if (!data) {
    return (error as Error)?.message || fallback
  }

  if (Array.isArray(data.message)) {
    return data.message.join(', ')
  }

  return data.message || data.error || fallback
}

export function buildApiPath(path: string, query?: QueryParams) {
  if (!query) {
    return path
  }

  const params = new URLSearchParams()

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return
    }

    params.set(key, String(value))
  })

  const suffix = params.toString()
  return suffix ? `${path}?${suffix}` : path
}

export async function apiRequest<T>(path: string, options?: Parameters<typeof $fetch<T>>[1]) {
  try {
    return await $fetch<T>(`${resolveBaseUrl()}${path}`, options)
  } catch (error: any) {
    if (error?.status === 401) {
      const { logout } = useAuth()
      logout()
      navigateTo('/login')
    }

    throw new Error(resolveErrorMessage(error, `Request failed: ${path}`))
  }
}

export function apiGetCached<T>(path: string) {
  const cached = responseCache.get(path) as Promise<T> | undefined
  if (cached) {
    return cached
  }

  const request = apiRequest<T>(path).catch((error) => {
    responseCache.delete(path)
    throw error
  })

  responseCache.set(path, request)
  return request
}

export function invalidateApiCache(...prefixes: string[]) {
  if (prefixes.length === 0) {
    responseCache.clear()
    return
  }

  for (const key of responseCache.keys()) {
    if (prefixes.some((prefix) => key.startsWith(prefix))) {
      responseCache.delete(key)
    }
  }
}
