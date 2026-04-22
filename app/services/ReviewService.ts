import type { IReviewRepository } from '~/types/interfaces'
import type { Review } from '~/types/models'
import { ApiReviewRepository } from '~/repositories/api'

/**
 * ReviewService — Hotel review / rating logic.
 */
export class ReviewService {
  private repo: IReviewRepository

  constructor(repo: IReviewRepository = new ApiReviewRepository()) {
    this.repo = repo
  }

  /** All reviews (admin) */
  async getAll(): Promise<Review[]> {
    return this.repo.getAll()
  }

  /** Reviews for a specific hotel */
  async getByHotel(hotelId: number): Promise<Review[]> {
    return this.repo.getByHotel(hotelId)
  }

  /** Reviews written by a specific user */
  async getByAccount(accountId: number): Promise<Review[]> {
    return this.repo.getByAccount(accountId)
  }

  /**
   * Compute the average rating for a hotel.
   */
  async getAverageRating(hotelId: number): Promise<number> {
    const reviews = await this.repo.getByHotel(hotelId)
    if (reviews.length === 0) return 0
    const total = reviews.reduce((sum, r) => sum + r.rating, 0)
    return Math.round((total / reviews.length) * 10) / 10
  }

  /**
   * Submit a new review.
   * Business rules: rating 1–5, comment required.
   */
  async submit(data: Omit<Review, 'id' | 'publicationDate'>): Promise<Review> {
    if (data.rating < 1 || data.rating > 5) {
      throw new Error('Rating must be between 1 and 5')
    }
    if (!data.comment?.trim()) {
      throw new Error('Review comment is required')
    }
    return this.repo.create(data)
  }

  /** Update an existing review */
  async update(id: number, data: Partial<Review>): Promise<Review> {
    if (data.rating !== undefined && (data.rating < 1 || data.rating > 5)) {
      throw new Error('Rating must be between 1 and 5')
    }
    return this.repo.update(id, data)
  }

  /** Delete a review (admin / owner) */
  async delete(id: number): Promise<void> {
    return this.repo.delete(id)
  }
}
