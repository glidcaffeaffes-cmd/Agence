import type { Offer } from '../models'

export interface IOfferRepository {
  getAll(): Promise<Offer[]>
  getById(id: number): Promise<Offer | null>
  getActive(): Promise<Offer[]>
  getByHotel(hotelId: number): Promise<Offer[]>
  create(offer: Omit<Offer, 'id'>): Promise<Offer>
  update(id: number, data: Partial<Offer>): Promise<Offer>
  delete(id: number): Promise<void>
}
