import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import { useAuthPrompt } from '~/composables/useAuthPrompt'
import { useAppToast } from '~/composables/useAppToast'
import { apiRequest } from '~/repositories/api/client'

const LEGACY_STORAGE_PREFIX = 'voyagehub_wishlist'
let wishlistHydrationPromise: Promise<void> | null = null

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

function writeLegacyStoredIds(accountId: number, ids: number[]) {
  if (typeof window === 'undefined' || accountId <= 0) {
    return
  }

  try {
    window.localStorage.setItem(getLegacyStorageKey(accountId), JSON.stringify(ids))
  } catch {
    // Ignore legacy-storage persistence failures.
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
  const { accountId, isAuthenticated, isVerified } = useAuth()
  const { open } = useAuthPrompt()
  const { success: toastSuccess, info: toastInfo, error: toastError } = useAppToast()
  const { t } = useAppI18n()
  const hotelIds = useState<number[]>('wishlist_hotel_ids', () => [])
  const watchInitialized = useState<boolean>('wishlist_watch_initialized', () => false)
  const hydratedAccountId = useState<number>('wishlist_hydrated_account_id', () => 0)

  async function hydrate(force = false) {
    if (!isAuthenticated.value || accountId.value <= 0) {
      hotelIds.value = []
      hydratedAccountId.value = 0
      wishlistHydrationPromise = null
      return
    }

    const currentAccountId = accountId.value
    if (!force && hydratedAccountId.value === currentAccountId) {
      return
    }

    if (wishlistHydrationPromise) {
      return wishlistHydrationPromise
    }

    wishlistHydrationPromise = (async () => {
    try {
      const response = await apiRequest<WishlistListResponse>(
        `/accounts/${currentAccountId}/wishlist`,
      )

      const serverIds = Array.isArray(response.hotelIds)
        ? response.hotelIds
            .map((item) => Number.parseInt(String(item), 10))
            .filter((item) => Number.isFinite(item) && item > 0)
        : []

      hotelIds.value = serverIds

      // One-time migration from legacy local storage to backend persistence.
      const legacyIds = readLegacyStoredIds(currentAccountId)
      const missingLegacyIds = legacyIds.filter((id) => !serverIds.includes(id))
      if (missingLegacyIds.length > 0) {
        await Promise.all(
          missingLegacyIds.map((id) =>
            apiRequest<WishlistMutationResponse>(
              `/accounts/${currentAccountId}/wishlist`,
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
          `/accounts/${currentAccountId}/wishlist`,
        )
        hotelIds.value = Array.isArray(refreshed.hotelIds)
          ? refreshed.hotelIds
              .map((item) => Number.parseInt(String(item), 10))
              .filter((item) => Number.isFinite(item) && item > 0)
          : []
      }

      clearLegacyStoredIds(currentAccountId)
      hydratedAccountId.value = currentAccountId
    } catch (cause: any) {
      // Keep UI stable if wishlist API is temporarily unavailable.
      // Fallback to local persistence when backend wishlist routes are missing.
      if (cause?.message?.includes('/wishlist')) {
        hotelIds.value = readLegacyStoredIds(currentAccountId)
        hydratedAccountId.value = currentAccountId
      } else {
        hotelIds.value = []
        hydratedAccountId.value = 0
      }
    } finally {
      wishlistHydrationPromise = null
    }
    })()

    return wishlistHydrationPromise
  }

  function requireAuth() {
    if (isAuthenticated.value) {
      if (!isVerified.value) {
        toastError(t('toast.verifyEmail'), t('toast.error'))
        return false
      }
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
        message: t('toast.signInRequired'),
      }
    }

    if (accountId.value <= 0) {
      const message = t('toast.wishlistClientOnly')
      toastError(message, t('toast.error'))
      return { success: false, action: 'blocked', message }
    }

    const normalizedId = toHotelId(hotelId)
    if (!normalizedId) {
      const message = t('toast.invalidHotelId')
      toastError(message, t('toast.error'))
      return { success: false, action: 'error', message }
    }

    if (hotelIds.value.includes(normalizedId)) {
      return {
        success: true,
        action: 'noop',
        message: t('toast.hotelAlreadySaved'),
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

      toastSuccess(t('toast.hotelSaved'), t('toast.success'))
      return {
        success: true,
        action: 'saved',
        message: t('toast.hotelSaved'),
      }
    } catch (cause: any) {
      if (cause?.message?.includes('/wishlist')) {
        hotelIds.value = [...hotelIds.value, normalizedId]
        writeLegacyStoredIds(accountId.value, hotelIds.value)
        toastSuccess(t('toast.hotelSaved'), t('toast.success'))
        return {
          success: true,
          action: 'saved',
          message: t('toast.hotelSaved'),
        }
      }

      const message = cause?.message || t('toast.wishlistUnavailable')
      toastError(message, t('toast.error'))
      return { success: false, action: 'error', message }
    }
  }

  async function remove(hotelId: number): Promise<WishlistResult> {
    if (!requireAuth()) {
      return {
        success: false,
        action: 'blocked',
        message: t('toast.signInRequired'),
      }
    }

    if (accountId.value <= 0) {
      const message = t('toast.wishlistClientOnly')
      toastError(message, t('toast.error'))
      return { success: false, action: 'blocked', message }
    }

    const normalizedId = toHotelId(hotelId)
    if (!normalizedId) {
      const message = t('toast.invalidHotelId')
      toastError(message, t('toast.error'))
      return { success: false, action: 'error', message }
    }

    if (!hotelIds.value.includes(normalizedId)) {
      return {
        success: true,
        action: 'noop',
        message: t('toast.hotelAlreadyRemoved'),
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

      toastInfo(t('toast.hotelRemoved'), t('toast.info'))
      return {
        success: true,
        action: 'removed',
        message: t('toast.hotelRemoved'),
      }
    } catch (cause: any) {
      if (cause?.message?.includes('/wishlist')) {
        hotelIds.value = hotelIds.value.filter((item) => item !== normalizedId)
        writeLegacyStoredIds(accountId.value, hotelIds.value)
        toastInfo(t('toast.hotelRemoved'), t('toast.info'))
        return {
          success: true,
          action: 'removed',
          message: t('toast.hotelRemoved'),
        }
      }

      const message = cause?.message || t('toast.wishlistUnavailable')
      toastError(message, t('toast.error'))
      return { success: false, action: 'error', message }
    }
  }

  async function toggle(hotelId: number): Promise<WishlistResult> {
    if (!requireAuth()) {
      return {
        success: false,
        action: 'blocked',
        message: t('toast.signInRequired'),
      }
    }

    return isWishlisted(hotelId) ? remove(hotelId) : add(hotelId)
  }

  if (!watchInitialized.value) {
    watchInitialized.value = true
    watch(
      accountId,
      () => {
        hydratedAccountId.value = 0
        void hydrate()
      },
      { immediate: true },
    )
  }

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
