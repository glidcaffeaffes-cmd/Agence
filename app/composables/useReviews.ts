import { ref } from 'vue'
import type { Review } from '~/types/models'
import { ApiReviewRepository } from '~/repositories/api'

const repo = new ApiReviewRepository()

export function useReviews() {
  const reviews = ref<Review[]>([])
  const loading = ref(false)

  async function fetchByHotel(hotelId: number) {
    loading.value = true
    try { reviews.value = await repo.getByHotel(hotelId) }
    finally { loading.value = false }
  }

  async function fetchAll() {
    loading.value = true
    try { reviews.value = await repo.getAll() }
    finally { loading.value = false }
  }

  return { reviews, loading, fetchByHotel, fetchAll }
}
