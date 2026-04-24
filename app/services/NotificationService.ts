import type { INotificationRepository } from '~/types/interfaces'
import type { AppNotification } from '~/types/models'
import { AdminRepositoryFactory } from '~/repositories/factory'

/**
 * NotificationService — In-app notification management.
 */
export class NotificationService {
  private repo: INotificationRepository

  constructor(repo: INotificationRepository = AdminRepositoryFactory.notification()) {
    this.repo = repo
  }

  /** All notifications (admin/system view) */
  async getAll(): Promise<AppNotification[]> {
    return this.repo.getAll()
  }

  /** Notifications for a specific account */
  async getByAccount(accountId: number): Promise<AppNotification[]> {
    return this.repo.getByAccount(accountId)
  }

  /** Unread notifications count & list for a user */
  async getUnread(accountId: number): Promise<AppNotification[]> {
    return this.repo.getUnread(accountId)
  }

  /** Mark a single notification as read */
  async markAsRead(id: number): Promise<void> {
    return this.repo.markAsRead(id)
  }

  /** Mark all notifications of a user as read */
  async markAllAsRead(accountId: number): Promise<void> {
    return this.repo.markAllAsRead(accountId)
  }

  /** Create a system or user notification */
  async create(data: Omit<AppNotification, 'id'>): Promise<AppNotification> {
    if (!data.message?.trim()) throw new Error('Notification message cannot be empty')
    return this.repo.create(data)
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id)
  }
}
