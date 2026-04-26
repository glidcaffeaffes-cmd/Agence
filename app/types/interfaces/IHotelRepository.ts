import type { Hotel } from '../models'

export interface HotelAvailabilityFilters {
  city?: string | null
  checkIn?: string
  checkOut?: string
  guests?: number
  rooms?: number
}

export interface HotelRoomAvailabilityRequest {
  checkIn: string
  checkOut: string
  adults: number
  children: number
}

export interface HotelAvailableRoomOption {
  id: number
  hotelId: number
  title: string
  maxGuests: number
  bedType: string
  roomSize: number
  pricePerNight: number
  image: string
}

export interface HotelAvailabilitySummary {
  available: boolean
  nights: number
  basePrice: number
  cityTax: number
  total: number
  selectedPricePerNight: number
  rooms: HotelAvailableRoomOption[]
  guests: {
    adults: number
    children: number
    total: number
  }
}

/**
 * Contract for Hotel data access.
 * SOLID: Interface Segregation — separate read/write concerns.
 */
export interface IHotelRepository {
  getAll(): Promise<Hotel[]>
  getById(id: number): Promise<Hotel | null>
  getByCity(city: string): Promise<Hotel[]>
  search(query: string): Promise<Hotel[]>
  searchAvailability(filters: HotelAvailabilityFilters): Promise<Hotel[]>
  checkAvailability(
    hotelId: number,
    payload: HotelRoomAvailabilityRequest,
  ): Promise<HotelAvailabilitySummary>
  getFeatured(): Promise<Hotel[]>
  create(hotel: Omit<Hotel, 'id'>): Promise<Hotel>
  update(id: number, data: Partial<Hotel>): Promise<Hotel>
  delete(id: number): Promise<void>
}
