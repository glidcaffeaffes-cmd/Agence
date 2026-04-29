import type { IReservationRepository } from '~/types/interfaces'
import type {
  BookingCancellationConfirmation,
  BookingCancellationPreview,
  BookingConfirmation,
  BookingCreatePayload,
  CheckoutSessionResponse,
  CheckoutSessionSummary,
  CancelUnpaidBookingPayload,
  CreateCheckoutSessionPayload,
} from '~/types/interfaces'
import type { Reservation } from '~/types/models'
import { ReservationStatus } from '~/types/enums'
import { AdminRepositoryFactory } from '~/repositories/factory'

/**
 * ReservationService — Orchestrates booking business logic.
 */
export class ReservationService {
  private repo: IReservationRepository

  constructor(repo: IReservationRepository = AdminRepositoryFactory.reservation()) {
    this.repo = repo
  }

  /** All reservations (admin view) */
  async getAll(): Promise<Reservation[]> {
    return this.repo.getAll()
  }

  async fetchPaginated(
    options: import('~/types/interfaces/IReservationRepository').ReservationFetchOptions,
  ): Promise<
    import('~/types/interfaces/IHotelRepository').PaginatedResult<Reservation>
  > {
    return this.repo.fetchPaginated(options)
  }

  /** Single reservation by ID */
  async getById(id: number): Promise<Reservation> {
    const res = await this.repo.getById(id)
    if (!res) throw new Error(`Reservation ${id} not found`)
    return res
  }

  /** All reservations for a given user account */
  async getByAccount(accountId: number): Promise<Reservation[]> {
    return this.repo.getByAccount(accountId)
  }

  /** All reservations for a given hotel (admin) */
  async getByHotel(hotelId: number): Promise<Reservation[]> {
    return this.repo.getByHotel(hotelId)
  }

  /** Filter by status (admin) */
  async getByStatus(status: ReservationStatus): Promise<Reservation[]> {
    return this.repo.getByStatus(status)
  }

  /**
   * Book a room.
   * Business rule: checkOut must be after checkIn.
   */
  async book(data: Omit<Reservation, 'id' | 'confirmationCode'>): Promise<Reservation> {
    if (new Date(data.checkOutDate) <= new Date(data.checkInDate)) {
      throw new Error('Check-out date must be after check-in date')
    }
    if (data.numberOfNights < 1) {
      throw new Error('Minimum stay is 1 night')
    }
    return this.repo.create(data)
  }

  async createBooking(payload: BookingCreatePayload): Promise<BookingConfirmation> {
    return this.repo.createBooking(payload)
  }

  async getCancellationPreview(
    bookingId: number,
    accountId?: number,
  ): Promise<BookingCancellationPreview> {
    return this.repo.getCancellationPreview(bookingId, accountId)
  }

  async cancelBooking(
    bookingId: number,
    accountId?: number,
  ): Promise<BookingCancellationConfirmation> {
    return this.repo.cancelBooking(bookingId, accountId)
  }

  async createCheckoutSession(
    payload: CreateCheckoutSessionPayload,
  ): Promise<CheckoutSessionResponse> {
    return this.repo.createCheckoutSession(payload)
  }

  async cancelUnpaidBooking(
    payload: CancelUnpaidBookingPayload,
  ): Promise<{ removed: boolean }> {
    return this.repo.cancelUnpaidBooking(payload)
  }

  async getCheckoutSessionSummary(
    sessionId: string,
    userId: number,
  ): Promise<CheckoutSessionSummary> {
    return this.repo.getCheckoutSessionSummary(sessionId, userId)
  }

  /** Confirm a pending reservation (admin) */
  async confirm(id: number): Promise<Reservation> {
    return this.repo.updateStatus(id, ReservationStatus.CONFIRMED)
  }

  /** Cancel a reservation with optional reason */
  async cancel(id: number, reason?: string): Promise<Reservation> {
    return this.repo.updateStatus(id, ReservationStatus.CANCELLED, reason)
  }

  /** Refuse a reservation (admin) */
  async refuse(id: number, reason?: string): Promise<Reservation> {
    return this.repo.updateStatus(id, ReservationStatus.REFUSED, reason)
  }

  /** Mark as completed (admin / system) */
  async complete(id: number): Promise<Reservation> {
    return this.repo.updateStatus(id, ReservationStatus.COMPLETED)
  }

  /** Block a reservation (admin) */
  async block(id: number, reason: string): Promise<Reservation> {
    if (!reason.trim()) throw new Error('Block reason is required')
    return this.repo.updateStatus(id, ReservationStatus.BLOCKED, reason)
  }

  /** Delete a reservation record */
  async delete(id: number): Promise<void> {
    return this.repo.delete(id)
  }
}
