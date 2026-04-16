import { ref } from 'vue'
import type { Hotel } from '~/types/models'
import { MockHotelRepository } from '~/repositories/mock'

const repo = new MockHotelRepository()

export function useHotels() {
  const hotels = ref<Hotel[]>([])
  const hotel = ref<Hotel | null>(null)
  const featured = ref<Hotel[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll() {
    loading.value = true
    error.value = null
    try { hotels.value = await repo.getAll() }
    catch (e: any) { error.value = e.message }
    finally { loading.value = false }
  }

  async function fetchById(id: number) {
    loading.value = true
    error.value = null
    try { hotel.value = await repo.getById(id) }
    catch (e: any) { error.value = e.message }
    finally { loading.value = false }
  }

  async function fetchFeatured() {
    loading.value = true
    try { featured.value = await repo.getFeatured() }
    catch (e: any) { error.value = e.message }
    finally { loading.value = false }
  }

  async function search(query: string) {
    loading.value = true
    try { hotels.value = await repo.search(query) }
    catch (e: any) { error.value = e.message }
    finally { loading.value = false }
  }

  return { hotels, hotel, featured, loading, error, fetchAll, fetchById, fetchFeatured, search }
}
