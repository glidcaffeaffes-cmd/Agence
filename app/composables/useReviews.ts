import { ref } from 'vue'
import type { Review } from '~/types/models'
import { ReviewService } from '~/services'
import { useAsyncAction } from '~/composables/useAsyncAction'

const service = new ReviewService()

export function useReviews() {
  const reviews = ref<Review[]>([])
  const { loading, error, execute } = useAsyncAction()

  async function fetchByHotel(hotelId: number) {
    reviews.value = await execute(() => service.getByHotel(hotelId), [])
  }

  async function fetchAll() {
    reviews.value = await execute(() => service.getAll(), [])
  }

  async function submitReview(data: Omit<Review, 'id' | 'publicationDate'>) {
    const newReview = await execute(() => service.submit(data), null)
    if (newReview) {
      reviews.value.push(newReview)
    }
    return newReview
  }

  return { reviews, loading, error, fetchByHotel, fetchAll, submitReview }
}
