/**
 * Notification categories.
 * Maps to UML: TypeNotification
 */
export enum NotificationType {
  RESERVATION_CONFIRMATION = 'RESERVATION_CONFIRMATION',
  RESERVATION_CANCELLATION = 'RESERVATION_CANCELLATION',
  MODIFICATION_CONFIRMATION = 'MODIFICATION_CONFIRMATION',
  REMINDER = 'REMINDER',
  PROMOTION = 'PROMOTION',
  COMPLAINT = 'COMPLAINT',
}

export const NotificationTypeLabel: Record<NotificationType, string> = {
  [NotificationType.RESERVATION_CONFIRMATION]: 'Reservation Confirmed',
  [NotificationType.RESERVATION_CANCELLATION]: 'Reservation Cancelled',
  [NotificationType.MODIFICATION_CONFIRMATION]: 'Modification Confirmed',
  [NotificationType.REMINDER]: 'Reminder',
  [NotificationType.PROMOTION]: 'Promotion',
  [NotificationType.COMPLAINT]: 'Complaint Update',
}

export const NotificationTypeIcon: Record<NotificationType, string> = {
  [NotificationType.RESERVATION_CONFIRMATION]: 'pi pi-check-circle',
  [NotificationType.RESERVATION_CANCELLATION]: 'pi pi-times-circle',
  [NotificationType.MODIFICATION_CONFIRMATION]: 'pi pi-pencil',
  [NotificationType.REMINDER]: 'pi pi-bell',
  [NotificationType.PROMOTION]: 'pi pi-tag',
  [NotificationType.COMPLAINT]: 'pi pi-exclamation-triangle',
}
