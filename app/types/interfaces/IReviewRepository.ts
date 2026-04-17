import type { Review } from '../models'

export interface IReviewRepository {
  getAll(): Promise<Review[]>
  getByHotel(hotelId: number): Promise<Review[]>
  getByAccount(accountId: number): Promise<Review[]>
  create(review: Omit<Review, 'id' | 'publicationDate'>): Promise<Review>
  update(id: number, data: Partial<Review>): Promise<Review>
  delete(id: number): Promise<void>
}
