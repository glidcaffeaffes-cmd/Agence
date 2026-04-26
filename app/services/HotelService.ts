import type {
  IHotelRepository,
  HotelAvailabilityFilters,
  HotelAvailabilitySummary,
  HotelRoomAvailabilityRequest,
} from '~/types/interfaces'
import type { Hotel } from '~/types/models'
import { AdminRepositoryFactory } from '~/repositories/factory'

/**
 * HotelService — Business logic layer for hotel operations.
 * Sits between composables/stores and the repository.
 * Swap MockHotelRepository → ApiHotelRepository without touching callers.
 */
export class HotelService {
  private repo: IHotelRepository

  constructor(repo: IHotelRepository = AdminRepositoryFactory.hotel()) {
    this.repo = repo
  }

  /** Fetch all active hotels */
  async getAll(): Promise<Hotel[]> {
    return this.repo.getAll()
  }

  /** Fetch a single hotel by ID, throws if not found */
  async getById(id: number): Promise<Hotel> {
    const hotel = await this.repo.getById(id)
    if (!hotel) throw new Error(`Hotel with id ${id} not found`)
    return hotel
  }

  /** Fetch featured (5-star) hotels for homepage */
  async getFeatured(): Promise<Hotel[]> {
    return this.repo.getFeatured()
  }

  /** full-text search across name / city / country / description */
  async search(query: string): Promise<Hotel[]> {
    if (!query.trim()) return this.repo.getAll()
    return this.repo.search(query.trim())
  }

  /** Search hotels by availability and occupancy needs */
  async searchAvailability(filters: HotelAvailabilityFilters): Promise<Hotel[]> {
    return this.repo.searchAvailability(filters)
  }

  async checkAvailability(
    hotelId: number,
    payload: HotelRoomAvailabilityRequest,
  ): Promise<HotelAvailabilitySummary> {
    return this.repo.checkAvailability(hotelId, payload)
  }

  /** Filter hotels by city */
  async getByCity(city: string): Promise<Hotel[]> {
    return this.repo.getByCity(city)
  }

  /** Create a new hotel (admin) */
  async create(data: Omit<Hotel, 'id'>): Promise<Hotel> {
    if (!data.name?.trim()) throw new Error('Hotel name is required')
    if (!data.city?.trim()) throw new Error('Hotel city is required')
    return this.repo.create(data)
  }

  /** Update hotel fields (admin) */
  async update(id: number, data: Partial<Hotel>): Promise<Hotel> {
    return this.repo.update(id, data)
  }

  /** Soft-delete / deactivate a hotel (admin) */
  async delete(id: number): Promise<void> {
    return this.repo.delete(id)
  }
}
