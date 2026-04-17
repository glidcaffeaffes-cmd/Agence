import { ref } from 'vue'
import type { Offer } from '~/types/models'
import { MockOfferRepository } from '~/repositories/mock'

const repo = new MockOfferRepository()

export function useOffers() {
  const offers = ref<Offer[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchActive() {
    loading.value = true
    try { offers.value = await repo.getActive() }
    catch (e: any) { error.value = e.message }
    finally { loading.value = false }
  }

  async function fetchAll() {
    loading.value = true
    try { offers.value = await repo.getAll() }
    catch (e: any) { error.value = e.message }
    finally { loading.value = false }
  }

  async function fetchByHotel(hotelId: number) {
    loading.value = true
    try { offers.value = await repo.getByHotel(hotelId) }
    catch (e: any) { error.value = e.message }
    finally { loading.value = false }
  }

  return { offers, loading, error, fetchActive, fetchAll, fetchOffers: fetchAll, fetchByHotel }
}
