import type { IReservationRepository } from '~/types/interfaces'
import type { Reservation } from '~/types/models'
import type { ReservationStatus } from '~/types/enums'
import { mockReservations } from './data/reservations'

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
