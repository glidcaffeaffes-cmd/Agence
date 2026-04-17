import type { Room, RoomType } from '../models'

export interface IRoomRepository {
  getAll(): Promise<Room[]>
  getByHotel(hotelId: number): Promise<Room[]>
  getById(id: number): Promise<Room | null>
  getAvailable(hotelId: number, checkIn: string, checkOut: string): Promise<Room[]>
  getRoomTypes(): Promise<RoomType[]>
  create(room: Omit<Room, 'id'>): Promise<Room>
  update(id: number, data: Partial<Room>): Promise<Room>
  delete(id: number): Promise<void>
}
