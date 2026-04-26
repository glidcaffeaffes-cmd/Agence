import type { Reservation } from '../models'
import type { ReservationStatus } from '../enums'

export interface BookingCreatePayload {
  hotelId: number
  roomId: number
  checkIn: string
  checkOut: string
  adults: number
  children: number
  fullName: string
  email: string
  phone: string
  specialRequests?: string
  accountId?: number
}

export interface BookingConfirmation {
  confirmed: boolean
  bookingReference: string
  bookingId: number
  hotelName: string
  roomName: string
  checkIn: string
  checkOut: string
  nights: number
  guests: {
    adults: number
    children: number
    total: number
  }
  pricing: {
    roomPrice: number
    taxes: number
    total: number
  }
  contact: {
    fullName: string
    email: string
    phone: string
    specialRequests: string | null
  }
}

export interface BookingCancellationPreview {
  bookingId: number
  bookingReference: string
  hotelName: string
  roomName: string
  stay: {
    checkIn: string
    checkOut: string
    nights: number
  }
  cancellationAllowed: boolean
  cancellationDeadline: string | null
  policy: {
    label: string
    description: string
  }
  refund: {
    type: 'FULL' | 'PARTIAL' | 'NONE'
    amount: number
    chargeAmount: number
    totalPaid: number
  }
  reason: string | null
}

export interface BookingCancellationConfirmation {
  cancelled: boolean
  bookingId: number
  bookingReference: string
  cancellationDate: string
  hotelName: string
  roomName: string
  stay: {
    checkIn: string
    checkOut: string
    nights: number
  }
  refund: {
    type: 'FULL' | 'PARTIAL' | 'NONE'
    amount: number
    chargeAmount: number
    totalPaid: number
  }
}

export interface IReservationRepository {
  getAll(): Promise<Reservation[]>
  getById(id: number): Promise<Reservation | null>
  getByAccount(accountId: number): Promise<Reservation[]>
  getByHotel(hotelId: number): Promise<Reservation[]>
  getByStatus(status: ReservationStatus): Promise<Reservation[]>
  create(reservation: Omit<Reservation, 'id' | 'confirmationCode'>): Promise<Reservation>
  createBooking(payload: BookingCreatePayload): Promise<BookingConfirmation>
  getCancellationPreview(bookingId: number): Promise<BookingCancellationPreview>
  cancelBooking(bookingId: number): Promise<BookingCancellationConfirmation>
  updateStatus(id: number, status: ReservationStatus, reason?: string): Promise<Reservation>
  delete(id: number): Promise<void>
}
