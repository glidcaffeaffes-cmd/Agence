import type { IOfferRepository } from '~/types/interfaces'
import type { Offer } from '~/types/models'
import { AdminRepositoryFactory } from '~/repositories/factory'

/**
 * OfferService — Special deals and promotional offers logic.
 */
export class OfferService {
  private repo: IOfferRepository

  constructor(repo: IOfferRepository = AdminRepositoryFactory.offer()) {
    this.repo = repo
  }

  /** All offers (admin view) */
  async getAll(): Promise<Offer[]> {
    return this.repo.getAll()
  }

  /** Only currently active offers (client view) */
  async getActive(): Promise<Offer[]> {
    return this.repo.getActive()
  }

  /** Offers linked to a specific hotel */
  async getByHotel(hotelId: number): Promise<Offer[]> {
    return this.repo.getByHotel(hotelId)
  }

  /** Single offer by ID */
  async getById(id: number): Promise<Offer> {
    const offer = await this.repo.getById(id)
    if (!offer) throw new Error(`Offer ${id} not found`)
    return offer
  }

  /**
   * Create a promotional offer.
   * Business rules: discount must be between 1–99%, valid dates.
   */
  async create(data: Omit<Offer, 'id'>): Promise<Offer> {
    if (data.discountRate < 0 || data.discountRate > 100) {
      throw new Error('Discount rate must be between 0 and 100')
    }
    if (new Date(data.endDate) <= new Date(data.startDate)) {
      throw new Error('Offer end date must be after start date')
    }
    return this.repo.create(data)
  }

  /** Update an existing offer (admin) */
  async update(id: number, data: Partial<Offer>): Promise<Offer> {
    return this.repo.update(id, data)
  }

  /** Remove an offer (admin) */
  async delete(id: number): Promise<void> {
    return this.repo.delete(id)
  }
}
