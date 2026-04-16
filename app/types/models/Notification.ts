import type { NotificationType } from '../enums'

/**
 * System notification sent to users.
 * UML: Notification
 */
export interface AppNotification {
  id: number
  accountId: number
  message: string
  type: NotificationType
  sentDate: string
  read: boolean
}
