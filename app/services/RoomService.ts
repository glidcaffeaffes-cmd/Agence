import type { IRoomRepository } from '~/types/interfaces'
import type { Room, RoomType } from '~/types/models'
import { MockRoomRepository } from '~/repositories/mock'

/**
 * RoomService — Room catalogue and availability logic.
 */
export class RoomService {
  private repo: IRoomRepository

  constructor(repo: IRoomRepository = new MockRoomRepository()) {
    this.repo = repo
  }

  /** All rooms (admin) */
  async getAll(): Promise<Room[]> {
    return this.repo.getAll()
  }

  /** All rooms for a specific hotel */
  async getByHotel(hotelId: number): Promise<Room[]> {
    return this.repo.getByHotel(hotelId)
  }

  /** Single room by ID */
  async getById(id: number): Promise<Room> {
    const room = await this.repo.getById(id)
    if (!room) throw new Error(`Room ${id} not found`)
    return room
  }

  /**
   * Available rooms for given hotel and date range.
   * Business rule: dates must be valid and checkOut > checkIn.
   */
  async getAvailable(hotelId: number, checkIn: string, checkOut: string): Promise<Room[]> {
    if (!checkIn || !checkOut) throw new Error('Check-in and check-out dates are required')
    if (new Date(checkOut) <= new Date(checkIn)) {
      throw new Error('Check-out must be after check-in')
    }
    return this.repo.getAvailable(hotelId, checkIn, checkOut)
  }

  /** All room types / categories */
  async getRoomTypes(): Promise<RoomType[]> {
    return this.repo.getRoomTypes()
  }

  /** Create a new room (admin) */
  async create(data: Omit<Room, 'id'>): Promise<Room> {
    if (data.pricePerNight <= 0) throw new Error('Price per night must be positive')
    if (data.capacity < 1) throw new Error('Room capacity must be at least 1')
    return this.repo.create(data)
  }

  /** Update room details (admin) */
  async update(id: number, data: Partial<Room>): Promise<Room> {
    return this.repo.update(id, data)
  }

  /** Remove a room (admin) */
  async delete(id: number): Promise<void> {
    return this.repo.delete(id)
  }
}
