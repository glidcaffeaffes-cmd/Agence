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

export interface IReservationRepository {
  getAll(): Promise<Reservation[]>
  getById(id: number): Promise<Reservation | null>
  getByAccount(accountId: number): Promise<Reservation[]>
  getByHotel(hotelId: number): Promise<Reservation[]>
  getByStatus(status: ReservationStatus): Promise<Reservation[]>
  create(reservation: Omit<Reservation, 'id' | 'confirmationCode'>): Promise<Reservation>
  createBooking(payload: BookingCreatePayload): Promise<BookingConfirmation>
  updateStatus(id: number, status: ReservationStatus, reason?: string): Promise<Reservation>
  delete(id: number): Promise<void>
}
