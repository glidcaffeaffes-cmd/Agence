import { ref } from 'vue'
import type { Offer } from '~/types/models'
import { OfferService } from '~/services'
import { useAsyncAction } from '~/composables/useAsyncAction'

const service = new OfferService()

export function useOffers() {
  const offers = ref<Offer[]>([])
  const { loading, error, execute } = useAsyncAction()

  async function fetchActive() {
    offers.value = await execute(() => service.getActive(), [])
  }

  async function fetchAll() {
    offers.value = await execute(() => service.getAll(), [])
  }

  async function fetchByHotel(hotelId: number) {
    offers.value = await execute(() => service.getByHotel(hotelId), [])
  }

  return { offers, loading, error, fetchActive, fetchAll, fetchOffers: fetchAll, fetchByHotel }
}
