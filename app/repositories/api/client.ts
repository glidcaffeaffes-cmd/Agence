import type { ApiErrorDTO } from '~/types/dto'

type QueryValue = string | number | boolean | null | undefined
type QueryParams = Record<string, QueryValue>

function useResponseCache() {
  return useState<Record<string, any>>('api_response_cache', () => ({}))
}

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
  const cache = useResponseCache()
  const cached = cache.value[path] as T | undefined
  if (cached) {
    return Promise.resolve(cached)
  }

  const request = apiRequest<T>(path).then((data) => {
    cache.value[path] = data
    return data
  })

  return request
}

export function invalidateApiCache(...prefixes: string[]) {
  const cache = useResponseCache()
  if (prefixes.length === 0) {
    cache.value = {}
    return
  }

  for (const key of Object.keys(cache.value)) {
    if (prefixes.some((prefix) => key.startsWith(prefix))) {
      delete cache.value[key]
    }
  }
}
