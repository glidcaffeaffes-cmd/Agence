import type { INotificationRepository } from '~/types/interfaces'
import type { AppNotification } from '~/types/models'
import { mockNotifications } from './data/notifications'

export class MockNotificationRepository implements INotificationRepository {
  private notifications: AppNotification[] = [...mockNotifications]

  async getAll(): Promise<AppNotification[]> { return this.notifications }

  async getByAccount(accountId: number): Promise<AppNotification[]> {
    return this.notifications.filter(n => n.accountId === accountId)
  }

  async getUnread(accountId: number): Promise<AppNotification[]> {
    return this.notifications.filter(n => n.accountId === accountId && !n.read)
  }

  async markAsRead(id: number): Promise<void> {
    const n = this.notifications.find(n => n.id === id)
    if (n) n.read = true
  }

  async markAllAsRead(accountId: number): Promise<void> {
    this.notifications.filter(n => n.accountId === accountId).forEach(n => n.read = true)
  }

  async create(notification: Omit<AppNotification, 'id'>): Promise<AppNotification> {
    const newNotif: AppNotification = { ...notification, id: Date.now() }
    this.notifications.push(newNotif)
    return newNotif
  }
}
