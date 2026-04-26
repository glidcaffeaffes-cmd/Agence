import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import type { AppNotification } from '~/types/models'
import { NotificationService } from '~/services'
import { useAsyncAction } from '~/composables/useAsyncAction'
import { useAuth } from '~/composables/useAuth'

const service = new NotificationService()
let pollTimer: ReturnType<typeof setInterval> | null = null

export function useNotifications() {
  const notifications = ref<AppNotification[]>([])
  const { loading, error, execute } = useAsyncAction()
  const { accountId } = useAuth()

  const sortedNotifications = computed(() =>
    [...notifications.value].sort(
      (a, b) => new Date(b.sentDate).getTime() - new Date(a.sentDate).getTime(),
    ),
  )

  const latestNotifications = computed(() => sortedNotifications.value.slice(0, 8))
  const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

  async function fetchByAccount(accountId: number) {
    notifications.value = await execute(() => service.getByAccount(accountId), [])
  }

  async function markAsRead(id: number) {
    await execute(() => service.markAsRead(id))
    const n = notifications.value.find(n => n.id === id)
    if (n) n.read = true
  }

  async function markAllAsRead(accountId: number) {
    await execute(() => service.markAllAsRead(accountId))
    notifications.value.forEach(n => n.read = true)
  }

  function startPolling() {
    if (typeof window === 'undefined') return
    if (pollTimer) return

    pollTimer = setInterval(async () => {
      if (!accountId.value) return
      await fetchByAccount(accountId.value)
    }, 20000)
  }

  function stopPolling() {
    if (!pollTimer) return
    clearInterval(pollTimer)
    pollTimer = null
  }

  function handleVisibilityOrFocus() {
    if (!accountId.value) return
    fetchByAccount(accountId.value)
  }

  watch(accountId, async (id) => {
    if (!id) {
      stopPolling()
      notifications.value = []
      return
    }

    await fetchByAccount(id)
    startPolling()
  }, { immediate: true })

  onMounted(() => {
    if (typeof window === 'undefined') return
    window.addEventListener('focus', handleVisibilityOrFocus)
    document.addEventListener('visibilitychange', handleVisibilityOrFocus)
  })

  onBeforeUnmount(() => {
    if (typeof window === 'undefined') return
    window.removeEventListener('focus', handleVisibilityOrFocus)
    document.removeEventListener('visibilitychange', handleVisibilityOrFocus)
    stopPolling()
  })

  return {
    notifications,
    latestNotifications,
    unreadCount,
    loading,
    error,
    fetchByAccount,
    markAsRead,
    markAllAsRead,
  }
}
