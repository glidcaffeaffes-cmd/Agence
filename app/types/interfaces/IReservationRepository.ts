import type { Reservation } from '../models'
import type { ReservationStatus } from '../enums'
import type { PaginatedResult } from './IHotelRepository'

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
  paymentOption?: 'PAY_NOW' | 'PAY_AT_HOTEL'
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
  paymentOption: 'PAY_NOW' | 'PAY_AT_HOTEL'
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

export interface CreateCheckoutSessionPayload {
  tripId: number
  userId: number
  totalPrice: number
  bookingId: number
}

export interface CheckoutSessionResponse {
  sessionId: string
  url: string
}

export interface CheckoutSessionSummary {
  sessionId: string
  paymentStatus: string
  bookingStatus: string
  bookingReference: string
  hotelName: string
  roomName: string
  checkIn: string
  checkOut: string
  nights: number
  guests: number
  roomPrice: number
  taxes: number
  totalPaid: number
}

export interface ReservationFetchOptions {
  page: number
  limit: number
  accountId?: number
  hotelId?: number
  status?: ReservationStatus
  search?: string
}

export interface IReservationRepository {
  getAll(): Promise<Reservation[]>
  fetchPaginated(
    options: ReservationFetchOptions,
  ): Promise<PaginatedResult<Reservation>>
  getById(id: number): Promise<Reservation | null>
  getByAccount(accountId: number): Promise<Reservation[]>
  getByHotel(hotelId: number): Promise<Reservation[]>
  getByStatus(status: ReservationStatus): Promise<Reservation[]>
  create(
    reservation: Omit<Reservation, 'id' | 'confirmationCode'>,
  ): Promise<Reservation>
  createBooking(payload: BookingCreatePayload): Promise<BookingConfirmation>
  getCancellationPreview(
    bookingId: number,
    accountId?: number,
  ): Promise<BookingCancellationPreview>
  cancelBooking(
    bookingId: number,
    accountId?: number,
  ): Promise<BookingCancellationConfirmation>
  createCheckoutSession(
    payload: CreateCheckoutSessionPayload,
  ): Promise<CheckoutSessionResponse>
  getCheckoutSessionSummary(
    sessionId: string,
    userId: number,
  ): Promise<CheckoutSessionSummary>
  updateStatus(
    id: number,
    status: ReservationStatus,
    reason?: string,
  ): Promise<Reservation>
  delete(id: number): Promise<void>
}
