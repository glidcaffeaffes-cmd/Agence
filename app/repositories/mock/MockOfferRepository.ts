import type { IOfferRepository } from '~/types/interfaces'
import type { Offer } from '~/types/models'
import { mockOffers } from './data/offers'

export class MockOfferRepository implements IOfferRepository {
  private offers: Offer[] = [...mockOffers]

  async getAll(): Promise<Offer[]> { return this.offers }

  async getById(id: number): Promise<Offer | null> {
    return this.offers.find(o => o.id === id) ?? null
  }

  async getActive(): Promise<Offer[]> {
    return this.offers.filter(o => o.active)
  }

  async getByHotel(hotelId: number): Promise<Offer[]> {
    return this.offers.filter(o => o.hotelId === hotelId && o.active)
  }

  async create(offer: Omit<Offer, 'id'>): Promise<Offer> {
    const newOffer: Offer = { ...offer, id: Date.now() }
    this.offers.push(newOffer)
    return newOffer
  }

  async update(id: number, data: Partial<Offer>): Promise<Offer> {
    const index = this.offers.findIndex(o => o.id === id)
    if (index === -1) throw new Error(`Offer ${id} not found`)
    this.offers[index] = { ...this.offers[index], ...data }
    return this.offers[index]
  }

  async delete(id: number): Promise<void> {
    this.offers = this.offers.filter(o => o.id !== id)
  }
}
