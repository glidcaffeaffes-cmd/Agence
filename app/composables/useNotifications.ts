import { ref, computed } from 'vue'
import type { AppNotification } from '~/types/models'
import { MockNotificationRepository } from '~/repositories/mock'

const repo = new MockNotificationRepository()

export function useNotifications() {
  const notifications = ref<AppNotification[]>([])
  const loading = ref(false)

  const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

  async function fetchByAccount(accountId: number) {
    loading.value = true
    try { notifications.value = await repo.getByAccount(accountId) }
    finally { loading.value = false }
  }

  async function markAsRead(id: number) {
    await repo.markAsRead(id)
    const n = notifications.value.find(n => n.id === id)
    if (n) n.read = true
  }

  async function markAllAsRead(accountId: number) {
    await repo.markAllAsRead(accountId)
    notifications.value.forEach(n => n.read = true)
  }

  return { notifications, unreadCount, loading, fetchByAccount, markAsRead, markAllAsRead }
}
