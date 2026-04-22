import { ref } from 'vue'
import type { Offer } from '~/types/models'
import { ApiOfferRepository } from '~/repositories/api'

const apiRepo = new ApiOfferRepository()

export function useOffers() {
  const offers = ref<Offer[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchActive() {
    loading.value = true
    error.value = null
    try {
      offers.value = await apiRepo.getActive()
    } catch (e: any) {
      error.value = e.message
      offers.value = []
    } finally { loading.value = false }
  }

  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      offers.value = await apiRepo.getAll()
    } catch (e: any) {
      error.value = e.message
      offers.value = []
    } finally { loading.value = false }
  }

  async function fetchByHotel(hotelId: number) {
    loading.value = true
    error.value = null
    try {
      offers.value = await apiRepo.getByHotel(hotelId)
    } catch (e: any) {
      error.value = e.message
      offers.value = []
    } finally { loading.value = false }
  }

  return { offers, loading, error, fetchActive, fetchAll, fetchOffers: fetchAll, fetchByHotel }
}
