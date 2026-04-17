import type { IReviewRepository } from '~/types/interfaces'
import type { Review } from '~/types/models'
import { mockReviews } from './data/reviews'

export class MockReviewRepository implements IReviewRepository {
  private reviews: Review[] = [...mockReviews]

  async getAll(): Promise<Review[]> { return this.reviews.filter(r => r.visible) }

  async getByHotel(hotelId: number): Promise<Review[]> {
    return this.reviews.filter(r => r.hotelId === hotelId && r.visible)
  }

  async getByAccount(accountId: number): Promise<Review[]> {
    return this.reviews.filter(r => r.accountId === accountId)
  }

  async create(review: Omit<Review, 'id' | 'publicationDate'>): Promise<Review> {
    const newReview: Review = { ...review, id: Date.now(), publicationDate: new Date().toISOString().split('T')[0] }
    this.reviews.push(newReview)
    return newReview
  }

  async update(id: number, data: Partial<Review>): Promise<Review> {
    const index = this.reviews.findIndex(r => r.id === id)
    if (index === -1) throw new Error(`Review ${id} not found`)
    this.reviews[index] = { ...this.reviews[index], ...data }
    return this.reviews[index]
  }

  async delete(id: number): Promise<void> {
    this.reviews = this.reviews.filter(r => r.id !== id)
  }
}
