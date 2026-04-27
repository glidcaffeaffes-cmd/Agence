import type {
  IReservationRepository,
  BookingCancellationConfirmation,
  BookingCancellationPreview,
  BookingCreatePayload,
  BookingConfirmation,
  CheckoutSessionSummary,
  CheckoutSessionResponse,
  CreateCheckoutSessionPayload,
} from '~/types/interfaces'
import type { Reservation } from '~/types/models'
import type { ReservationStatus } from '~/types/enums'
import type { ReservationFetchOptions } from '~/types/interfaces/IReservationRepository'
import type { PaginatedResult } from '~/types/interfaces/IHotelRepository'
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

  async fetchPaginated(
    options: ReservationFetchOptions,
  ): Promise<PaginatedResult<Reservation>> {
    let items = [...this.reservations]

    if (options.accountId) {
      items = items.filter((reservation) => reservation.accountId === options.accountId)
    }

    if (options.hotelId) {
      items = items.filter((reservation) => reservation.hotelId === options.hotelId)
    }

    if (options.status) {
      items = items.filter((reservation) => reservation.status === options.status)
    }

    if (options.search?.trim()) {
      const needle = options.search.trim().toLowerCase()
      items = items.filter((reservation) =>
        reservation.confirmationCode.toLowerCase().includes(needle),
      )
    }

    const total = items.length
    const page = Math.max(1, options.page)
    const limit = Math.max(1, options.limit)
    const start = (page - 1) * limit
    const paged = items.slice(start, start + limit)

    return {
      items: paged,
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    }
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
    const paymentOption = payload.paymentOption === 'PAY_AT_HOTEL' ? 'PAY_AT_HOTEL' : 'PAY_NOW'
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
      status: paymentOption === 'PAY_AT_HOTEL' ? ReservationStatusEnum.CONFIRMED : ReservationStatusEnum.PENDING,
    }

    this.reservations.push(reservation)

    return {
      confirmed: paymentOption === 'PAY_AT_HOTEL',
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
      paymentOption,
    }
  }

  async getCancellationPreview(bookingId: number): Promise<BookingCancellationPreview> {
    const reservation = this.reservations.find((entry) => entry.id === bookingId)
    if (!reservation) {
      throw new Error('Booking not found')
    }

    const now = new Date()
    const checkIn = new Date(reservation.checkInDate)
    const deadline = new Date(checkIn.getTime() - 48 * 60 * 60 * 1000)
    const cancellationAllowed =
      ![ReservationStatusEnum.CANCELLED, ReservationStatusEnum.COMPLETED].includes(reservation.status) &&
      now.getTime() < checkIn.getTime()
    const fullRefund = now.getTime() <= deadline.getTime()
    const firstNightCharge = Math.min(reservation.totalAmount, reservation.totalAmount / Math.max(1, reservation.numberOfNights))
    const refundAmount = !cancellationAllowed ? 0 : fullRefund ? reservation.totalAmount : Math.max(0, reservation.totalAmount - firstNightCharge)

    return {
      bookingId: reservation.id,
      bookingReference: reservation.confirmationCode,
      hotelName: `Hotel #${reservation.hotelId}`,
      roomName: `Room #${reservation.roomId}`,
      stay: {
        checkIn: reservation.checkInDate,
        checkOut: reservation.checkOutDate,
        nights: reservation.numberOfNights,
      },
      cancellationAllowed,
      cancellationDeadline: deadline.toISOString(),
      policy: {
        label: `Free cancellation before ${deadline.toISOString()}`,
        description: 'After this date, the first night is charged.',
      },
      refund: {
        type: !cancellationAllowed ? 'NONE' : fullRefund ? 'FULL' : refundAmount > 0 ? 'PARTIAL' : 'NONE',
        amount: refundAmount,
        chargeAmount: reservation.totalAmount - refundAmount,
        totalPaid: reservation.totalAmount,
      },
      reason: cancellationAllowed ? null : 'Cancellation is no longer available for this booking.',
    }
  }

  async cancelBooking(bookingId: number): Promise<BookingCancellationConfirmation> {
    const preview = await this.getCancellationPreview(bookingId)
    if (!preview.cancellationAllowed) {
      throw new Error(preview.reason || 'This reservation cannot be cancelled')
    }

    const index = this.reservations.findIndex((entry) => entry.id === bookingId)
    if (index === -1) {
      throw new Error('Booking not found')
    }

    this.reservations[index] = {
      ...this.reservations[index],
      status: ReservationStatusEnum.CANCELLED,
      blockReason: `Cancelled on ${new Date().toISOString()}`,
    }

    return {
      cancelled: true,
      bookingId: preview.bookingId,
      bookingReference: preview.bookingReference,
      cancellationDate: new Date().toISOString(),
      hotelName: preview.hotelName,
      roomName: preview.roomName,
      stay: preview.stay,
      refund: preview.refund,
    }
  }

  async createCheckoutSession(
    payload: CreateCheckoutSessionPayload,
  ): Promise<CheckoutSessionResponse> {
    const reservation = this.reservations.find((entry) => entry.id === payload.bookingId)
    if (!reservation) {
      throw new Error('Booking not found')
    }

    if (reservation.accountId !== payload.userId) {
      throw new Error('Booking does not belong to this user')
    }

    return {
      sessionId: `cs_test_${payload.bookingId}`,
      url: `/payment/success?session_id=cs_test_${payload.bookingId}&booking_id=${payload.bookingId}`,
    }
  }

  async getCheckoutSessionSummary(
    sessionId: string,
    userId: number,
  ): Promise<CheckoutSessionSummary> {
    const bookingId = Number.parseInt(sessionId.replace('cs_test_', ''), 10)
    const reservation = this.reservations.find((entry) => entry.id === bookingId)

    if (!reservation) {
      throw new Error('Booking not found')
    }

    if (reservation.accountId !== userId) {
      throw new Error('Checkout session does not belong to this user')
    }

    const roomPrice = Math.max(0, reservation.totalAmount - reservation.numberOfNights * 5)
    const taxes = reservation.totalAmount - roomPrice

    return {
      sessionId,
      paymentStatus: 'paid',
      bookingStatus: reservation.status,
      bookingReference: reservation.confirmationCode,
      hotelName: `Hotel #${reservation.hotelId}`,
      roomName: `Room #${reservation.roomId}`,
      checkIn: reservation.checkInDate,
      checkOut: reservation.checkOutDate,
      nights: reservation.numberOfNights,
      guests: reservation.numberOfGuests,
      roomPrice,
      taxes,
      totalPaid: reservation.totalAmount,
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
