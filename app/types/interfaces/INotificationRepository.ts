import type { AppNotification } from '../models'

export interface INotificationRepository {
  getAll(): Promise<AppNotification[]>
  getByAccount(accountId: number): Promise<AppNotification[]>
  getUnread(accountId: number): Promise<AppNotification[]>
  markAsRead(id: number): Promise<void>
  markAllAsRead(accountId: number): Promise<void>
  create(notification: Omit<AppNotification, 'id'>): Promise<AppNotification>
}
