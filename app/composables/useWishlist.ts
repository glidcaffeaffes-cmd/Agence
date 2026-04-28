import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import { useAuthPrompt } from '~/composables/useAuthPrompt'
import { useAppToast } from '~/composables/useAppToast'
import { apiRequest } from '~/repositories/api/client'

const LEGACY_STORAGE_PREFIX = 'voyagehub_wishlist'

interface WishlistListResponse {
  accountId: number
  hotelIds: number[]
}

interface WishlistMutationResponse {
  success: boolean
  accountId: number
  hotelId: number
  hotelIds: number[]
}

function getLegacyStorageKey(accountId: number) {
  return `${LEGACY_STORAGE_PREFIX}_${accountId}`
}

function readLegacyStoredIds(accountId: number) {
  if (typeof window === 'undefined' || accountId <= 0) {
    return []
  }

  try {
    const rawValue = window.localStorage.getItem(getLegacyStorageKey(accountId))
    if (!rawValue) {
      return []
    }

    const parsedValue = JSON.parse(rawValue)
    if (!Array.isArray(parsedValue)) {
      return []
    }

    return parsedValue
      .map((item) => Number.parseInt(String(item), 10))
      .filter((item) => Number.isFinite(item) && item > 0)
  } catch {
    return []
  }
}

function clearLegacyStoredIds(accountId: number) {
  if (typeof window === 'undefined' || accountId <= 0) {
    return
  }

  try {
    window.localStorage.removeItem(getLegacyStorageKey(accountId))
  } catch {
    // Ignore legacy-storage cleanup failures.
  }
}

type WishlistAction = 'saved' | 'removed' | 'noop' | 'blocked' | 'error'

interface WishlistResult {
  success: boolean
  action: WishlistAction
  message: string
}

function toHotelId(value: number) {
  const parsed = Number.parseInt(String(value), 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0
}

export function useWishlist() {
  const route = useRoute()
  const { accountId, isAuthenticated } = useAuth()
  const { open } = useAuthPrompt()
  const { success: toastSuccess, info: toastInfo, error: toastError } = useAppToast()
  const hotelIds = useState<number[]>('wishlist_hotel_ids', () => [])

  async function hydrate() {
    if (!isAuthenticated.value || accountId.value <= 0) {
      hotelIds.value = []
      return
    }

    try {
      const response = await apiRequest<WishlistListResponse>(
        `/accounts/${accountId.value}/wishlist`,
      )

      const serverIds = Array.isArray(response.hotelIds)
        ? response.hotelIds
            .map((item) => Number.parseInt(String(item), 10))
            .filter((item) => Number.isFinite(item) && item > 0)
        : []

      hotelIds.value = serverIds

      // One-time migration from legacy local storage to backend persistence.
      const legacyIds = readLegacyStoredIds(accountId.value)
      const missingLegacyIds = legacyIds.filter((id) => !serverIds.includes(id))
      if (missingLegacyIds.length > 0) {
        await Promise.all(
          missingLegacyIds.map((id) =>
            apiRequest<WishlistMutationResponse>(
              `/accounts/${accountId.value}/wishlist`,
              {
                method: 'POST',
                body: { hotelId: id },
                toast: {
                  silentSuccess: true,
                  silentError: true,
                },
              },
            ).catch(() => null),
          ),
        )

        const refreshed = await apiRequest<WishlistListResponse>(
          `/accounts/${accountId.value}/wishlist`,
        )
        hotelIds.value = Array.isArray(refreshed.hotelIds)
          ? refreshed.hotelIds
              .map((item) => Number.parseInt(String(item), 10))
              .filter((item) => Number.isFinite(item) && item > 0)
          : []
      }

      clearLegacyStoredIds(accountId.value)
    } catch {
      // Keep UI stable if wishlist API is temporarily unavailable.
      hotelIds.value = []
    }
  }

  function requireAuth() {
    if (isAuthenticated.value) {
      return true
    }

    open({
      redirectTo: route.fullPath,
    })
    return false
  }

  function isWishlisted(hotelId: number) {
    const normalizedId = toHotelId(hotelId)
    return normalizedId > 0 && hotelIds.value.includes(normalizedId)
  }

  async function add(hotelId: number): Promise<WishlistResult> {
    if (!requireAuth()) {
      return {
        success: false,
        action: 'blocked',
        message: 'Sign in required.',
      }
    }

    if (accountId.value <= 0) {
      const message = 'Wishlist is only available for client accounts.'
      toastError(message)
      return { success: false, action: 'blocked', message }
    }

    const normalizedId = toHotelId(hotelId)
    if (!normalizedId) {
      const message = 'Invalid hotel id.'
      toastError(message)
      return { success: false, action: 'error', message }
    }

    if (hotelIds.value.includes(normalizedId)) {
      return {
        success: true,
        action: 'noop',
        message: 'Hotel already in wishlist.',
      }
    }

    try {
      const response = await apiRequest<WishlistMutationResponse>(
        `/accounts/${accountId.value}/wishlist`,
        {
          method: 'POST',
          body: { hotelId: normalizedId },
          toast: {
            silentSuccess: true,
            silentError: true,
          },
        },
      )

      hotelIds.value = Array.isArray(response.hotelIds)
        ? response.hotelIds
            .map((item) => Number.parseInt(String(item), 10))
            .filter((item) => Number.isFinite(item) && item > 0)
        : [...hotelIds.value, normalizedId]

      toastSuccess('Hotel saved to your wishlist.')
      return {
        success: true,
        action: 'saved',
        message: 'Hotel saved to your wishlist.',
      }
    } catch (cause: any) {
      const message = cause?.message || 'Unable to save wishlist. Please try again.'
      toastError(message)
      return { success: false, action: 'error', message }
    }
  }

  async function remove(hotelId: number): Promise<WishlistResult> {
    if (!requireAuth()) {
      return {
        success: false,
        action: 'blocked',
        message: 'Sign in required.',
      }
    }

    if (accountId.value <= 0) {
      const message = 'Wishlist is only available for client accounts.'
      toastError(message)
      return { success: false, action: 'blocked', message }
    }

    const normalizedId = toHotelId(hotelId)
    if (!normalizedId) {
      const message = 'Invalid hotel id.'
      toastError(message)
      return { success: false, action: 'error', message }
    }

    if (!hotelIds.value.includes(normalizedId)) {
      return {
        success: true,
        action: 'noop',
        message: 'Hotel already removed from wishlist.',
      }
    }

    try {
      const response = await apiRequest<WishlistMutationResponse>(
        `/accounts/${accountId.value}/wishlist/${normalizedId}`,
        {
          method: 'DELETE',
          toast: {
            silentSuccess: true,
            silentError: true,
          },
        },
      )

      hotelIds.value = Array.isArray(response.hotelIds)
        ? response.hotelIds
            .map((item) => Number.parseInt(String(item), 10))
            .filter((item) => Number.isFinite(item) && item > 0)
        : hotelIds.value.filter((item) => item !== normalizedId)

      toastInfo('Hotel removed from your wishlist.')
      return {
        success: true,
        action: 'removed',
        message: 'Hotel removed from your wishlist.',
      }
    } catch (cause: any) {
      const message = cause?.message || 'Unable to update wishlist. Please try again.'
      toastError(message)
      return { success: false, action: 'error', message }
    }
  }

  async function toggle(hotelId: number): Promise<WishlistResult> {
    if (!requireAuth()) {
      return {
        success: false,
        action: 'blocked',
        message: 'Sign in required.',
      }
    }

    return isWishlisted(hotelId) ? remove(hotelId) : add(hotelId)
  }

  watch(
    accountId,
    () => {
      void hydrate()
    },
    { immediate: true },
  )

  return {
    hotelIds,
    count: computed(() => hotelIds.value.length),
    hydrate,
    isWishlisted,
    add,
    remove,
    toggle,
  }
}
