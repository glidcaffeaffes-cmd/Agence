import type { Hotel } from '../models'

/**
 * Contract for Hotel data access.
 * SOLID: Interface Segregation — separate read/write concerns.
 */
export interface IHotelRepository {
  getAll(): Promise<Hotel[]>
  getById(id: number): Promise<Hotel | null>
  getByCity(city: string): Promise<Hotel[]>
  search(query: string): Promise<Hotel[]>
  getFeatured(): Promise<Hotel[]>
  create(hotel: Omit<Hotel, 'id'>): Promise<Hotel>
  update(id: number, data: Partial<Hotel>): Promise<Hotel>
  delete(id: number): Promise<void>
}
