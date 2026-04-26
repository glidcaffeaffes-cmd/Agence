import type {
  IReservationRepository,
  BookingCreatePayload,
  BookingConfirmation,
} from '~/types/interfaces'
import type { Reservation } from '~/types/models'
import type { ReservationStatus } from '~/types/enums'
import { mockReservations } from './data/reservations'
import { ReservationStatus as ReservationStatusEnum } from '~/types/enums'

export class MockReservationRepository implements IReservationRepository {
  private reservations: Reservation[] = [...mockReservations]

  async getAll(): Promise<Reservation[]> {
    return this.reservations
  }

  async getById(id: number): Promise<Reservation | null> {
    return this.reservations.find(r => r.id === id) ?? null
  }

  async getByAccount(accountId: number): Promise<Reservation[]> {
    return this.reservations.filter(r => r.accountId === accountId)
  }

  async getByHotel(hotelId: number): Promise<Reservation[]> {
    return this.reservations.filter(r => r.hotelId === hotelId)
  }

  async getByStatus(status: ReservationStatus): Promise<Reservation[]> {
    return this.reservations.filter(r => r.status === status)
  }

  async create(reservation: Omit<Reservation, 'id' | 'confirmationCode'>): Promise<Reservation> {
    const newReservation: Reservation = {
      ...reservation,
      id: Date.now(),
      confirmationCode: `VH-${new Date().getFullYear()}-${String(this.reservations.length + 1).padStart(3, '0')}`,
    }
    this.reservations.push(newReservation)
    return newReservation
  }

  async createBooking(payload: BookingCreatePayload): Promise<BookingConfirmation> {
    const checkIn = new Date(payload.checkIn)
    const checkOut = new Date(payload.checkOut)
    const nights = Math.max(1, Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)))
    const overlap = this.reservations.some((reservation) =>
      reservation.roomId === payload.roomId &&
      ![ReservationStatusEnum.CANCELLED, ReservationStatusEnum.REFUSED].includes(reservation.status) &&
      new Date(reservation.checkInDate).getTime() < checkOut.getTime() &&
      new Date(reservation.checkOutDate).getTime() > checkIn.getTime(),
    )

    if (overlap) {
      throw new Error('This room is no longer available')
    }

    const roomPricePerNight = 120
    const roomPrice = roomPricePerNight * nights
    const taxes = nights * 5
    const total = roomPrice + taxes
    const confirmationCode = `VH-${new Date().getFullYear()}-${String(this.reservations.length + 1).padStart(3, '0')}`

    const reservation: Reservation = {
      id: Date.now(),
      accountId: payload.accountId ?? 1,
      roomId: payload.roomId,
      hotelId: payload.hotelId,
      reservationDate: new Date().toISOString(),
      checkInDate: payload.checkIn,
      checkOutDate: payload.checkOut,
      numberOfNights: nights,
      totalAmount: total,
      confirmationCode,
      status: ReservationStatusEnum.CONFIRMED,
    }

    this.reservations.push(reservation)

    return {
      confirmed: true,
      bookingReference: confirmationCode,
      bookingId: reservation.id,
      hotelName: 'Selected Hotel',
      roomName: 'Selected Room',
      checkIn: payload.checkIn,
      checkOut: payload.checkOut,
      nights,
      guests: {
        adults: payload.adults,
        children: payload.children,
        total: payload.adults + payload.children,
      },
      pricing: {
        roomPrice,
        taxes,
        total,
      },
      contact: {
        fullName: payload.fullName,
        email: payload.email,
        phone: payload.phone,
        specialRequests: payload.specialRequests ?? null,
      },
    }
  }

  async updateStatus(id: number, status: ReservationStatus, reason?: string): Promise<Reservation> {
    const index = this.reservations.findIndex(r => r.id === id)
    if (index === -1) throw new Error(`Reservation ${id} not found`)
    this.reservations[index] = {
      ...this.reservations[index],
      status,
      ...(reason ? { blockReason: reason } : {}),
    }
    return this.reservations[index]
  }

  async delete(id: number): Promise<void> {
    this.reservations = this.reservations.filter(r => r.id !== id)
  }
}
