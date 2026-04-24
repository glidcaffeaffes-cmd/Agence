import type { IHotelRepository, HotelAvailabilityFilters } from '~/types/interfaces'
import type { Hotel } from '~/types/models'
import { mockHotels } from './data/hotels'
import { mockRooms } from './data/rooms'
import { mockReservations } from './data/reservations'
import { ReservationStatus } from '~/types/enums'

/**
 * Mock implementation of IHotelRepository.
 * SOLID(L): Can be swapped with ApiHotelRepository without changes upstream.
 */
export class MockHotelRepository implements IHotelRepository {
  private hotels: Hotel[] = [...mockHotels]

  private parseDateInput(value: string) {
    const parsed = new Date(`${value}T00:00:00`)

    if (Number.isNaN(parsed.getTime())) {
      throw new Error(`Invalid date format: ${value}`)
    }

    return parsed
  }

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

  async searchAvailability(filters: HotelAvailabilityFilters): Promise<Hotel[]> {
    const roomsRequested = Math.max(1, filters.rooms ?? 1)
    const guests = Math.max(1, filters.guests ?? 1)
    const capacityPerRoom = Math.max(1, Math.ceil(guests / roomsRequested))
    const hasDates = Boolean(filters.checkIn && filters.checkOut)
    const start = hasDates ? this.parseDateInput(filters.checkIn as string) : null
    const end = hasDates ? this.parseDateInput(filters.checkOut as string) : null

    if (Boolean(filters.checkIn) !== Boolean(filters.checkOut)) {
      throw new Error('Check-in and check-out dates must be provided together')
    }

    return this.hotels.filter((hotel) => {
      if (!hotel.active) return false
      if (filters.city && hotel.city.toLowerCase() !== filters.city.toLowerCase()) return false

      const availableRooms = mockRooms.filter((room) => {
        if (room.hotelId !== hotel.id || !room.available || room.capacity < capacityPerRoom) return false
        if (!start || !end) return true

        const hasBlockingReservation = mockReservations.some((reservation) =>
          reservation.roomId === room.id &&
          ![ReservationStatus.CANCELLED, ReservationStatus.REFUSED].includes(reservation.status) &&
          new Date(reservation.checkInDate).getTime() < end.getTime() &&
          new Date(reservation.checkOutDate).getTime() > start.getTime()
        )

        return !hasBlockingReservation
      })

      return availableRooms.length >= roomsRequested
    })
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
