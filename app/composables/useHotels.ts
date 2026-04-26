import { ref } from 'vue'
import type { Hotel } from '~/types/models'
import type {
  HotelAvailabilityFilters,
  HotelAvailabilitySummary,
  HotelRoomAvailabilityRequest,
  HotelFetchOptions,
  PaginatedResult,
} from '~/types/interfaces'
import { HotelService } from '~/services'
import { useAsyncAction } from '~/composables/useAsyncAction'

const service = new HotelService()

export function useHotels() {
  const hotels = ref<Hotel[]>([])
  const hotel = ref<Hotel | null>(null)
  const featured = ref<Hotel[]>([])
  const selectedHotel = ref<Hotel | null>(null)
  const totalPages = ref(1)
  const currentPage = ref(1)
  const { loading, error, execute } = useAsyncAction()

  async function fetchAll() {
    hotels.value = await execute(() => service.getAll(), [])
  }

  async function fetchPaginated(options: HotelFetchOptions) {
    const res = await execute(() => service.fetchPaginated(options), null) as PaginatedResult<Hotel> | null
    if (res) {
      if (options.page === 1) {
        hotels.value = res.items
      } else {
        const existingIds = new Set(hotels.value.map((h) => h.id))
        const unique = res.items.filter((h) => !existingIds.has(h.id))
        hotels.value.push(...unique)
      }
      totalPages.value = res.totalPages
      currentPage.value = options.page
    }
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

  async function checkAvailability(
    hotelId: number,
    payload: HotelRoomAvailabilityRequest,
  ): Promise<HotelAvailabilitySummary> {
    return execute(() => service.checkAvailability(hotelId, payload), {
      available: false,
      nights: 0,
      basePrice: 0,
      cityTax: 0,
      total: 0,
      selectedPricePerNight: 0,
      rooms: [],
      guests: {
        adults: payload.adults,
        children: payload.children,
        total: payload.adults + payload.children,
      },
    })
  }

  async function getById(id: number) {
    await fetchById(id)
    return hotel.value
  }

  return {
    hotels,
    hotel,
    featured,
    selectedHotel,
    totalPages,
    currentPage,
    loading,
    error,
    fetchAll,
    fetchPaginated,
    fetchById,
    getById,
    fetchFeatured,
    search,
    findAvailable,
    fetchAvailable,
    checkAvailability,
  }
}
