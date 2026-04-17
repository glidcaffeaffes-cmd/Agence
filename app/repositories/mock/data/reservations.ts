import type { Reservation } from '~/types/models'
import { ReservationStatus } from '~/types/enums'

export const mockReservations: Reservation[] = [
  { id: 1, accountId: 1, roomId: 2, hotelId: 1, reservationDate: '2026-03-01', checkInDate: '2026-04-20', checkOutDate: '2026-04-25', numberOfNights: 5, totalAmount: 1600, confirmationCode: 'VH-2026-001', status: ReservationStatus.CONFIRMED },
  { id: 2, accountId: 2, roomId: 10, hotelId: 3, reservationDate: '2026-03-05', checkInDate: '2026-05-10', checkOutDate: '2026-05-14', numberOfNights: 4, totalAmount: 1000, confirmationCode: 'VH-2026-002', status: ReservationStatus.PENDING },
  { id: 3, accountId: 3, roomId: 6, hotelId: 2, reservationDate: '2026-03-10', checkInDate: '2026-06-01', checkOutDate: '2026-06-04', numberOfNights: 3, totalAmount: 540, confirmationCode: 'VH-2026-003', status: ReservationStatus.CONFIRMED },
  { id: 4, accountId: 1, roomId: 15, hotelId: 4, reservationDate: '2026-02-15', checkInDate: '2026-03-01', checkOutDate: '2026-03-08', numberOfNights: 7, totalAmount: 1120, confirmationCode: 'VH-2026-004', status: ReservationStatus.COMPLETED },
  { id: 5, accountId: 4, roomId: 21, hotelId: 6, reservationDate: '2026-03-20', checkInDate: '2026-07-15', checkOutDate: '2026-07-20', numberOfNights: 5, totalAmount: 1400, confirmationCode: 'VH-2026-005', status: ReservationStatus.PENDING },
  { id: 6, accountId: 2, roomId: 18, hotelId: 5, reservationDate: '2026-01-10', checkInDate: '2026-02-05', checkOutDate: '2026-02-08', numberOfNights: 3, totalAmount: 420, confirmationCode: 'VH-2026-006', status: ReservationStatus.CANCELLED },
  { id: 7, accountId: 3, roomId: 4, hotelId: 1, reservationDate: '2026-03-25', checkInDate: '2026-08-01', checkOutDate: '2026-08-05', numberOfNights: 4, totalAmount: 3000, confirmationCode: 'VH-2026-007', status: ReservationStatus.CONFIRMED },
  { id: 8, accountId: 4, roomId: 12, hotelId: 3, reservationDate: '2026-02-20', checkInDate: '2026-03-15', checkOutDate: '2026-03-18', numberOfNights: 3, totalAmount: 1500, confirmationCode: 'VH-2026-008', status: ReservationStatus.REFUSED, blockReason: 'Invalid payment method' },
  { id: 9, accountId: 1, roomId: 22, hotelId: 6, reservationDate: '2026-04-01', checkInDate: '2026-09-10', checkOutDate: '2026-09-15', numberOfNights: 5, totalAmount: 2250, confirmationCode: 'VH-2026-009', status: ReservationStatus.BLOCKED, blockReason: 'Pending verification' },
  { id: 10, accountId: 2, roomId: 7, hotelId: 2, reservationDate: '2026-01-20', checkInDate: '2026-02-14', checkOutDate: '2026-02-17', numberOfNights: 3, totalAmount: 780, confirmationCode: 'VH-2026-010', status: ReservationStatus.COMPLETED },
]
