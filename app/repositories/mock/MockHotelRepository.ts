import type { IHotelRepository } from '~/types/interfaces'
import type { Hotel } from '~/types/models'
import { mockHotels } from './data/hotels'

/**
 * Mock implementation of IHotelRepository.
 * SOLID(L): Can be swapped with ApiHotelRepository without changes upstream.
 */
export class MockHotelRepository implements IHotelRepository {
  private hotels: Hotel[] = [...mockHotels]

  async getAll(): Promise<Hotel[]> {
    return this.hotels.filter(h => h.active)
  }

  async getById(id: number): Promise<Hotel | null> {
    return this.hotels.find(h => h.id === id) ?? null
  }

  async getByCity(city: string): Promise<Hotel[]> {
    return this.hotels.filter(h => h.city.toLowerCase() === city.toLowerCase() && h.active)
  }

  async search(query: string): Promise<Hotel[]> {
    const q = query.toLowerCase()
    return this.hotels.filter(h =>
      h.active && (
        h.name.toLowerCase().includes(q) ||
        h.city.toLowerCase().includes(q) ||
        h.country.toLowerCase().includes(q) ||
        h.description.toLowerCase().includes(q)
      )
    )
  }

  async getFeatured(): Promise<Hotel[]> {
    return this.hotels.filter(h => h.active && h.stars >= 5).slice(0, 3)
  }

  async create(hotel: Omit<Hotel, 'id'>): Promise<Hotel> {
    const newHotel: Hotel = { ...hotel, id: Date.now() }
    this.hotels.push(newHotel)
    return newHotel
  }

  async update(id: number, data: Partial<Hotel>): Promise<Hotel> {
    const index = this.hotels.findIndex(h => h.id === id)
    if (index === -1) throw new Error(`Hotel ${id} not found`)
    this.hotels[index] = { ...this.hotels[index], ...data }
    return this.hotels[index]
  }

  async delete(id: number): Promise<void> {
    this.hotels = this.hotels.filter(h => h.id !== id)
  }
}
