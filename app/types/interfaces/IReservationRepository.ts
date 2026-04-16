import type { Reservation } from '../models'
import type { ReservationStatus } from '../enums'

export interface IReservationRepository {
  getAll(): Promise<Reservation[]>
  getById(id: number): Promise<Reservation | null>
  getByAccount(accountId: number): Promise<Reservation[]>
  getByHotel(hotelId: number): Promise<Reservation[]>
  getByStatus(status: ReservationStatus): Promise<Reservation[]>
  create(reservation: Omit<Reservation, 'id' | 'confirmationCode'>): Promise<Reservation>
  updateStatus(id: number, status: ReservationStatus, reason?: string): Promise<Reservation>
  delete(id: number): Promise<void>
}
