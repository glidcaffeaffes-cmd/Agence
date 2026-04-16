import type { ReservationStatus } from '../enums'

/**
 * Reservation / booking entity.
 * UML: Reservation
 */
export interface Reservation {
  id: number
  accountId: number
  roomId: number
  hotelId: number
  reservationDate: string
  checkInDate: string
  checkOutDate: string
  numberOfNights: number
  totalAmount: number
  confirmationCode: string
  status: ReservationStatus
  blockReason?: string
}
