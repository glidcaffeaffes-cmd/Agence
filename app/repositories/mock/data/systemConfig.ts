import type { SystemConfig } from '~/types/models'

export const mockSystemConfig: SystemConfig[] = [
  { id: 1, key: 'site_name', value: 'VoyageHub', description: 'The name of the platform displayed across the application.' },
  { id: 2, key: 'default_currency', value: 'EUR', description: 'Default currency for all pricing and transactions.' },
  { id: 3, key: 'max_booking_advance_days', value: '365', description: 'Maximum number of days in advance a reservation can be made.' },
  { id: 4, key: 'cancellation_deadline_hours', value: '48', description: 'Minimum hours before check-in for free cancellation.' },
  { id: 5, key: 'commission_rate', value: '12', description: 'Agency commission rate (%) on each booking.' },
  { id: 6, key: 'support_email', value: 'support@voyagehub.com', description: 'Customer support email address.' },
  { id: 7, key: 'maintenance_mode', value: 'false', description: 'When true, the platform shows a maintenance page.' },
  { id: 8, key: 'max_guests_per_room', value: '6', description: 'Maximum number of guests allowed per room booking.' },
]
