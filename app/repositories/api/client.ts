import type { ApiErrorDTO } from '~/types/dto'

type QueryValue = string | number | boolean | null | undefined
type QueryParams = Record<string, QueryValue>
type ApiMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

interface ApiToastOptions {
  successMessage?: string
  errorMessage?: string
  successSummary?: string
  errorSummary?: string
  silentSuccess?: boolean
  silentError?: boolean
}

type ApiRequestOptions<T> = Parameters<typeof $fetch<T>>[1] & {
  toast?: ApiToastOptions
}

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

function normalizeMethod(method?: string): ApiMethod {
  const normalized = (method || 'GET').toUpperCase()
  if (normalized === 'POST' || normalized === 'PATCH' || normalized === 'PUT' || normalized === 'DELETE') {
    return normalized
  }

  return 'GET'
}

function isMutationMethod(method: ApiMethod) {
  return method !== 'GET'
}

function toSingularLabel(label: string) {
  if (label.endsWith('ies')) return `${label.slice(0, -3)}y`
  if (label.endsWith('s')) return label.slice(0, -1)
  return label
}

function prettifyResourceName(path: string) {
  const clean = path.split('?')[0]
  const segments = clean.split('/').filter(Boolean)
  const first = segments[0] || 'item'
  const token = first.replace(/[-_]/g, ' ').toLowerCase().trim()
  const singular = toSingularLabel(token)
  return singular.charAt(0).toUpperCase() + singular.slice(1)
}

function inferMutationMessage(path: string, method: ApiMethod) {
  const entity = prettifyResourceName(path)
  if (method === 'POST') return `${entity} saved successfully`
  if (method === 'PATCH' || method === 'PUT') return `${entity} updated successfully`
  return `${entity} deleted successfully`
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
  const requestOptions = options as ApiRequestOptions<T> | undefined
  const method = normalizeMethod(requestOptions?.method as string | undefined)
  const shouldToastSuccess = isMutationMethod(method) && !requestOptions?.toast?.silentSuccess
  const shouldToastError = isMutationMethod(method) && !requestOptions?.toast?.silentError

  try {
    const data = await $fetch<T>(`${resolveBaseUrl()}${path}`, options)

    if (shouldToastSuccess && import.meta.client) {
      const { success } = useAppToast()
      success(
        requestOptions?.toast?.successMessage || inferMutationMessage(path, method),
        requestOptions?.toast?.successSummary || 'Success',
      )
    }

    return data
  } catch (error: any) {
    if (error?.status === 401) {
      const { logout } = useAuth()
      logout()
      navigateTo('/login')
    }

    const resolvedMessage = resolveErrorMessage(error, `Request failed: ${path}`)

    if (shouldToastError && import.meta.client) {
      const { error: showError } = useAppToast()
      showError(
        requestOptions?.toast?.errorMessage || resolvedMessage,
        requestOptions?.toast?.errorSummary || 'Action failed',
      )
    }

    throw new Error(resolvedMessage)
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
