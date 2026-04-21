import { ref } from 'vue'
import type { Hotel } from '~/types/models'
import { ApiHotelRepository } from '~/repositories/api'
import { MockHotelRepository } from '~/repositories/mock'

const apiRepo = new ApiHotelRepository()
const mockRepo = new MockHotelRepository()

export function useHotels() {
  const hotels = ref<Hotel[]>([])
  const hotel = ref<Hotel | null>(null)
  const featured = ref<Hotel[]>([])
  const selectedHotel = ref<Hotel | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      const apiHotels = await apiRepo.getAll()
      hotels.value = apiHotels.length > 0 ? apiHotels : await mockRepo.getAll()
    }
    catch (e: any) {
      try {
        hotels.value = await mockRepo.getAll()
        error.value = null
      } catch {
        error.value = e.message
      }
    }
    finally { loading.value = false }
  }

  async function fetchById(id: number) {
    loading.value = true
    error.value = null
    try {
      const apiHotel = await apiRepo.getById(id)
      hotel.value = apiHotel ?? await mockRepo.getById(id)
    }
    catch (e: any) {
      try {
        hotel.value = await mockRepo.getById(id)
        error.value = null
      } catch {
        error.value = e.message
      }
    }
    finally { loading.value = false }
  }

  async function fetchFeatured() {
    loading.value = true
    try {
      const apiFeatured = await apiRepo.getFeatured()
      featured.value = apiFeatured.length > 0 ? apiFeatured : await mockRepo.getFeatured()
    }
    catch (e: any) {
      try {
        featured.value = await mockRepo.getFeatured()
        error.value = null
      } catch {
        error.value = e.message
      }
    }
    finally { loading.value = false }
  }

  async function search(query: string) {
    loading.value = true
    try {
      const apiHotels = await apiRepo.search(query)
      hotels.value = apiHotels.length > 0 ? apiHotels : await mockRepo.search(query)
    }
    catch (e: any) {
      try {
        hotels.value = await mockRepo.search(query)
        error.value = null
      } catch {
        error.value = e.message
      }
    }
    finally { loading.value = false }
  }

  async function getById(id: number) {
    await fetchById(id)
    return hotel.value
  }

  return { hotels, hotel, featured, selectedHotel, loading, error, fetchAll, fetchById, getById, fetchFeatured, search }
}
