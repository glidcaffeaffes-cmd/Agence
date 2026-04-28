import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import { useAuthPrompt } from '~/composables/useAuthPrompt'
import { useAppToast } from '~/composables/useAppToast'

const STORAGE_PREFIX = 'voyagehub_wishlist'

function getStorageKey(accountId: number) {
  return `${STORAGE_PREFIX}_${accountId}`
}

function readStoredIds(accountId: number) {
  if (typeof window === 'undefined' || !accountId) {
    return []
  }

  try {
    const rawValue = window.localStorage.getItem(getStorageKey(accountId))
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

function writeStoredIds(accountId: number, hotelIds: number[]) {
  if (typeof window === 'undefined' || !accountId) {
    return
  }

  window.localStorage.setItem(getStorageKey(accountId), JSON.stringify(hotelIds))
}

export function useWishlist() {
  const route = useRoute()
  const { accountId, isAuthenticated } = useAuth()
  const { open } = useAuthPrompt()
  const { success: toastSuccess, info: toastInfo } = useAppToast()
  const hotelIds = useState<number[]>('wishlist_hotel_ids', () => [])

  function hydrate() {
    hotelIds.value = readStoredIds(accountId.value)
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
    return hotelIds.value.includes(hotelId)
  }

  function add(hotelId: number) {
    if (!requireAuth()) {
      return false
    }

    if (!hotelIds.value.includes(hotelId)) {
      hotelIds.value = [...hotelIds.value, hotelId]
      writeStoredIds(accountId.value, hotelIds.value)
      toastSuccess('Hotel saved to your wishlist.')
    }

    return true
  }

  function remove(hotelId: number) {
    if (!requireAuth()) {
      return false
    }

    const beforeLength = hotelIds.value.length
    hotelIds.value = hotelIds.value.filter((item) => item !== hotelId)
    writeStoredIds(accountId.value, hotelIds.value)
    if (hotelIds.value.length < beforeLength) {
      toastInfo('Hotel removed from your wishlist.')
    }
    return true
  }

  function toggle(hotelId: number) {
    if (!requireAuth()) {
      return false
    }

    return isWishlisted(hotelId) ? remove(hotelId) : add(hotelId)
  }

  watch(
    accountId,
    () => {
      hydrate()
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
