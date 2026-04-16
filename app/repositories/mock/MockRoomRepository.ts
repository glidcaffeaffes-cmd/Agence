import type { IRoomRepository } from '~/types/interfaces'
import type { Room, RoomType } from '~/types/models'
import { mockRooms } from './data/rooms'
import { mockRoomTypes } from './data/roomTypes'

export class MockRoomRepository implements IRoomRepository {
  private rooms: Room[] = [...mockRooms]
  private roomTypes: RoomType[] = [...mockRoomTypes]

  async getByHotel(hotelId: number): Promise<Room[]> {
    return this.rooms.filter(r => r.hotelId === hotelId)
  }

  async getById(id: number): Promise<Room | null> {
    return this.rooms.find(r => r.id === id) ?? null
  }

  async getAvailable(hotelId: number, _checkIn: string, _checkOut: string): Promise<Room[]> {
    return this.rooms.filter(r => r.hotelId === hotelId && r.available)
  }

  async getRoomTypes(): Promise<RoomType[]> {
    return this.roomTypes
  }

  async create(room: Omit<Room, 'id'>): Promise<Room> {
    const newRoom: Room = { ...room, id: Date.now() }
    this.rooms.push(newRoom)
    return newRoom
  }

  async update(id: number, data: Partial<Room>): Promise<Room> {
    const index = this.rooms.findIndex(r => r.id === id)
    if (index === -1) throw new Error(`Room ${id} not found`)
    this.rooms[index] = { ...this.rooms[index], ...data }
    return this.rooms[index]
  }

  async delete(id: number): Promise<void> {
    this.rooms = this.rooms.filter(r => r.id !== id)
  }
}
