import { ref } from 'vue'
import type { Offer } from '~/types/models'
import { ApiOfferRepository } from '~/repositories/api'
import { MockOfferRepository } from '~/repositories/mock'

const apiRepo = new ApiOfferRepository()
const mockRepo = new MockOfferRepository()

export function useOffers() {
  const offers = ref<Offer[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchActive() {
    loading.value = true
    error.value = null
    try {
      const apiOffers = await apiRepo.getActive()
      offers.value = apiOffers.length > 0 ? apiOffers : await mockRepo.getActive()
    }
    catch (e: any) {
      try {
        offers.value = await mockRepo.getActive()
        error.value = null
      } catch {
        error.value = e.message
      }
    }
    finally { loading.value = false }
  }

  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      const apiOffers = await apiRepo.getAll()
      offers.value = apiOffers.length > 0 ? apiOffers : await mockRepo.getAll()
    }
    catch (e: any) {
      try {
        offers.value = await mockRepo.getAll()
        error.value = null
      } catch {
        error.value = e.message
      }
    }
    finally { loading.value = false }
  }

  async function fetchByHotel(hotelId: number) {
    loading.value = true
    error.value = null
    try {
      const apiOffers = await apiRepo.getByHotel(hotelId)
      offers.value = apiOffers.length > 0 ? apiOffers : await mockRepo.getByHotel(hotelId)
    }
    catch (e: any) {
      try {
        offers.value = await mockRepo.getByHotel(hotelId)
        error.value = null
      } catch {
        error.value = e.message
      }
    }
    finally { loading.value = false }
  }

  return { offers, loading, error, fetchActive, fetchAll, fetchOffers: fetchAll, fetchByHotel }
}
