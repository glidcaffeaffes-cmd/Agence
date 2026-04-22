import { ref } from 'vue'
import type { Room, RoomType } from '~/types/models'
import { ApiRoomRepository } from '~/repositories/api'

const apiRepo = new ApiRoomRepository()

export function useRooms() {
  const rooms = ref<Room[]>([])
  const roomTypes = ref<RoomType[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      rooms.value = await apiRepo.getAll()
    } catch (e: any) {
      error.value = e.message
      rooms.value = []
    } finally { loading.value = false }
  }

  async function fetchByHotel(hotelId: number) {
    loading.value = true
    error.value = null
    try {
      rooms.value = await apiRepo.getByHotel(hotelId)
    } catch (e: any) {
      error.value = e.message
      rooms.value = []
    } finally { loading.value = false }
  }

  async function fetchAvailable(hotelId: number, checkIn: string, checkOut: string) {
    loading.value = true
    error.value = null
    try {
      rooms.value = await apiRepo.getAvailable(hotelId, checkIn, checkOut)
    } catch (e: any) {
      error.value = e.message
      rooms.value = []
    } finally { loading.value = false }
  }

  async function fetchRoomTypes() {
    loading.value = true
    error.value = null
    try {
      roomTypes.value = await apiRepo.getRoomTypes()
    } catch (e: any) {
      error.value = e.message
      roomTypes.value = []
    } finally { loading.value = false }
  }

  return { rooms, roomTypes, loading, error, fetchAll, fetchByHotel, fetchAvailable, fetchRoomTypes }
}
