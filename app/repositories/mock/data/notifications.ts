import type { AppNotification } from '~/types/models'
import { NotificationType } from '~/types/enums'

export const mockNotifications: AppNotification[] = [
  { id: 1, accountId: 1, message: 'Your reservation VH-2026-001 at Grand Azure Resort has been confirmed. Check-in: April 20, 2026.', type: NotificationType.RESERVATION_CONFIRMATION, sentDate: '2026-03-02', read: true },
  { id: 2, accountId: 2, message: 'Your reservation VH-2026-002 at Côte Royale Hotel is pending. We will confirm shortly.', type: NotificationType.RESERVATION_CONFIRMATION, sentDate: '2026-03-06', read: false },
  { id: 3, accountId: 2, message: 'Your reservation VH-2026-006 at Villa Méditerranée has been cancelled as requested.', type: NotificationType.RESERVATION_CANCELLATION, sentDate: '2026-01-12', read: true },
  { id: 4, accountId: 1, message: 'Reminder: Your check-in at Grand Azure Resort is in 5 days. Don\'t forget your confirmation code VH-2026-001.', type: NotificationType.REMINDER, sentDate: '2026-04-15', read: false },
  { id: 5, accountId: 3, message: 'Exclusive offer: Enjoy 25% off your next booking at Côte Royale Hotel. Book before June 30!', type: NotificationType.PROMOTION, sentDate: '2026-04-10', read: false },
  { id: 6, accountId: 1, message: 'Your complaint #1 regarding "Noisy room" has been resolved. A 15% discount has been applied.', type: NotificationType.COMPLAINT, sentDate: '2026-03-05', read: true },
  { id: 7, accountId: 4, message: 'Your reservation VH-2026-005 at Château de Lumière is pending confirmation.', type: NotificationType.RESERVATION_CONFIRMATION, sentDate: '2026-03-21', read: false },
  { id: 8, accountId: 3, message: 'Your reservation VH-2026-007 at Grand Azure Resort has been confirmed!', type: NotificationType.RESERVATION_CONFIRMATION, sentDate: '2026-03-26', read: true },
]
