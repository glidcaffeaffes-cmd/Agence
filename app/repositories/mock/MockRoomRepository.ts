import type { IRoomRepository } from '~/types/interfaces'
import type { Room, RoomType } from '~/types/models'
import { mockRooms } from './data/rooms'
import { mockRoomTypes } from './data/roomTypes'

export class MockRoomRepository implements IRoomRepository {
  private rooms: Room[] = [...mockRooms]
  private roomTypes: RoomType[] = [...mockRoomTypes]

  private enrichRoom(room: Room): Room {
    const type = this.roomTypes.find(t => t.id === room.roomTypeId)
    if (!type) return room
    return {
      ...room,
      type: type.label,
      description: type.description,
      amenities: type.amenities
    }
  }

  async getAll(): Promise<Room[]> {
    return this.rooms.map(r => this.enrichRoom(r))
  }

  async getByHotel(hotelId: number): Promise<Room[]> {
    return this.rooms.filter(r => r.hotelId === hotelId).map(r => this.enrichRoom(r))
  }

  async getById(id: number): Promise<Room | null> {
    const room = this.rooms.find(r => r.id === id)
    return room ? this.enrichRoom(room) : null
  }

  async getAvailable(hotelId: number, _checkIn: string, _checkOut: string): Promise<Room[]> {
    return this.rooms.filter(r => r.hotelId === hotelId && r.available).map(r => this.enrichRoom(r))
  }

  async getRoomTypes(): Promise<RoomType[]> {
    return this.roomTypes
  }

  async create(room: Omit<Room, 'id'>): Promise<Room> {
    const newRoom: Room = { ...room, id: Date.now() }
    this.rooms.push(newRoom)
    return this.enrichRoom(newRoom)
  }

  async update(id: number, data: Partial<Room>): Promise<Room> {
    const index = this.rooms.findIndex(r => r.id === id)
    if (index === -1) throw new Error(`Room ${id} not found`)
    this.rooms[index] = { ...this.rooms[index], ...data }
    return this.enrichRoom(this.rooms[index])
  }

  async delete(id: number): Promise<void> {
    this.rooms = this.rooms.filter(r => r.id !== id)
  }
}
