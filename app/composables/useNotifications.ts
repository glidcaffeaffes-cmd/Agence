import { ref, computed, watch } from 'vue'
import type { AppNotification } from '~/types/models'
import { NotificationService } from '~/services'
import { useAsyncAction } from '~/composables/useAsyncAction'
import { useAuth } from '~/composables/useAuth'

const service = new NotificationService()

export function useNotifications() {
  const notifications = ref<AppNotification[]>([])
  const { loading, error, execute } = useAsyncAction()
  const { accountId } = useAuth()

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

  watch(accountId, async (id) => {
    if (!id) {
      notifications.value = []
      return
    }

    await fetchByAccount(id)
  }, { immediate: true })

  return { notifications, unreadCount, loading, error, fetchByAccount, markAsRead, markAllAsRead }
}
