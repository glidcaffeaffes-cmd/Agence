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

function normalizeFetchOptions<T>(options?: Parameters<typeof $fetch<T>>[1]) {
  const normalized = { ...(options || {}) } as Record<string, any>
  delete normalized.toast

  // Some backend endpoints return 204/empty payloads for successful mutations.
  // Keep those as successful calls instead of throwing JSON parse errors.
  if (!normalized.parseResponse) {
    normalized.parseResponse = (text: string) => {
      const body = text?.trim?.() ?? ''
      if (!body) {
        return null
      }

      try {
        return JSON.parse(body)
      } catch {
        return body
      }
    }
  }

  return normalized as Parameters<typeof $fetch<T>>[1]
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

function mapOfferErrorMessage(path: string, method: ApiMethod, rawMessage: string, status?: number) {
  const isOfferPath = path.startsWith('/offres')
  if (!isOfferPath) return rawMessage

  const msg = (rawMessage || '').toLowerCase()

  if (status === 502 || status === 503 || status === 504) {
    return 'Cannot reach backend service. Ensure API server is running on port 3001, then retry.'
  }

  if (status === 404) {
    if (method === 'PATCH' || method === 'PUT') {
      return 'This offer no longer exists. Refresh the list and try again.'
    }
    if (method === 'DELETE') {
      return 'Offer already removed. Refresh the list.'
    }
    return 'Offer not found.'
  }

  if (status === 400) {
    if (msg.includes('overlap')) {
      return 'An active offer already exists for this hotel in the selected date range.'
    }
    if (msg.includes('datefin must be after datedebut')) {
      return 'End date must be after start date.'
    }
    if (msg.includes('datedebut is not a valid date') || msg.includes('datefin is not a valid date')) {
      return 'Invalid date format. Please select valid start and end dates.'
    }
    if (msg.includes('invalid hotelid') || msg.includes('hotel not found')) {
      return 'Selected hotel does not exist anymore. Refresh hotels and retry.'
    }
    if (msg.includes('inactive hotel')) {
      return 'Cannot create an offer for an inactive hotel.'
    }
    if (msg.includes('chambreids')) {
      return 'Some selected rooms are invalid for this hotel.'
    }
  }

  if (status === 401) {
    return 'Your session expired. Please sign in again.'
  }

  if (status && status >= 500) {
    return 'Server error while processing offer. Please retry in a few seconds.'
  }

  return rawMessage
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
    const data = await $fetch<T>(`${resolveBaseUrl()}${path}`, normalizeFetchOptions(options))

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
    const friendlyMessage = mapOfferErrorMessage(
      path,
      method,
      resolvedMessage,
      error?.statusCode || error?.status,
    )

    if (shouldToastError && import.meta.client) {
      const { error: showError } = useAppToast()
      showError(
        requestOptions?.toast?.errorMessage || friendlyMessage,
        requestOptions?.toast?.errorSummary || 'Action failed',
      )
    }

    throw new Error(friendlyMessage)
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
