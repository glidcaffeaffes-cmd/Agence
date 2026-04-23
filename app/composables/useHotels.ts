import { ref } from 'vue'
import type { Hotel } from '~/types/models'
import type { HotelAvailabilityFilters } from '~/types/interfaces'
import { ApiHotelRepository } from '~/repositories/api'

const apiRepo = new ApiHotelRepository()

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
      hotels.value = await apiRepo.getAll()
    } catch (e: any) {
      error.value = e.message
      hotels.value = []
    } finally { loading.value = false }
  }

  async function fetchById(id: number) {
    loading.value = true
    error.value = null
    try {
      hotel.value = await apiRepo.getById(id)
    } catch (e: any) {
      error.value = e.message
      hotel.value = null
    } finally { loading.value = false }
  }

  async function fetchFeatured() {
    loading.value = true
    error.value = null
    try {
      featured.value = await apiRepo.getFeatured()
    } catch (e: any) {
      error.value = e.message
      featured.value = []
    } finally { loading.value = false }
  }

  async function search(query: string) {
    loading.value = true
    error.value = null
    try {
      hotels.value = await apiRepo.search(query)
    } catch (e: any) {
      error.value = e.message
      hotels.value = []
    } finally { loading.value = false }
  }

  async function findAvailable(filters: HotelAvailabilityFilters) {
    loading.value = true
    error.value = null
    try {
      return await apiRepo.searchAvailability(filters)
    } catch (e: any) {
      error.value = e.message
      return []
    } finally { loading.value = false }
  }

  async function fetchAvailable(filters: HotelAvailabilityFilters) {
    loading.value = true
    error.value = null
    try {
      hotels.value = await apiRepo.searchAvailability(filters)
    } catch (e: any) {
      error.value = e.message
      hotels.value = []
    } finally { loading.value = false }
  }

  async function getById(id: number) {
    await fetchById(id)
    return hotel.value
  }

  return { hotels, hotel, featured, selectedHotel, loading, error, fetchAll, fetchById, getById, fetchFeatured, search, findAvailable, fetchAvailable }
}
