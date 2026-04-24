import { ref } from 'vue'
import type { Hotel } from '~/types/models'
import type { HotelAvailabilityFilters } from '~/types/interfaces'
import { HotelService } from '~/services'
import { useAsyncAction } from '~/composables/useAsyncAction'

const service = new HotelService()

export function useHotels() {
  const hotels = ref<Hotel[]>([])
  const hotel = ref<Hotel | null>(null)
  const featured = ref<Hotel[]>([])
  const selectedHotel = ref<Hotel | null>(null)
  const { loading, error, execute } = useAsyncAction()

  async function fetchAll() {
    hotels.value = await execute(() => service.getAll(), [])
  }

  async function fetchById(id: number) {
    hotel.value = await execute(() => service.getById(id), null)
  }

  async function fetchFeatured() {
    featured.value = await execute(() => service.getFeatured(), [])
  }

  async function search(query: string) {
    hotels.value = await execute(() => service.search(query), [])
  }

  async function findAvailable(filters: HotelAvailabilityFilters) {
    return execute(() => service.searchAvailability(filters), [])
  }

  async function fetchAvailable(filters: HotelAvailabilityFilters) {
    hotels.value = await execute(() => service.searchAvailability(filters), [])
  }

  async function getById(id: number) {
    await fetchById(id)
    return hotel.value
  }

  return { hotels, hotel, featured, selectedHotel, loading, error, fetchAll, fetchById, getById, fetchFeatured, search, findAvailable, fetchAvailable }
}
