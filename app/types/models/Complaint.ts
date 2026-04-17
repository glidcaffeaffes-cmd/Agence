import type { ComplaintStatus } from '../enums'

/**
 * Customer complaint / reclamation about a reservation.
 * UML: Reclamation
 */
export interface Complaint {
  id: number
  reservationId: number
  accountId: number
  subject: string
  description: string
  complaintDate: string
  resolutionDate?: string
  agencyResponse?: string
  status: ComplaintStatus
}
