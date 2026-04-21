import { ref } from 'vue'
import type { Room, RoomType } from '~/types/models'
import { ApiRoomRepository } from '~/repositories/api'
import { MockRoomRepository } from '~/repositories/mock'

const apiRepo = new ApiRoomRepository()
const mockRepo = new MockRoomRepository()

export function useRooms() {
  const rooms = ref<Room[]>([])
  const roomTypes = ref<RoomType[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      const apiRooms = await apiRepo.getAll()
      rooms.value = apiRooms.length > 0 ? apiRooms : await mockRepo.getAll()
    }
    catch (e: any) {
      try {
        rooms.value = await mockRepo.getAll()
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
      const apiRooms = await apiRepo.getByHotel(hotelId)
      rooms.value = apiRooms.length > 0 ? apiRooms : await mockRepo.getByHotel(hotelId)
    }
    catch (e: any) {
      try {
        rooms.value = await mockRepo.getByHotel(hotelId)
        error.value = null
      } catch {
        error.value = e.message
      }
    }
    finally { loading.value = false }
  }

  async function fetchAvailable(hotelId: number, checkIn: string, checkOut: string) {
    loading.value = true
    error.value = null
    try {
      const apiRooms = await apiRepo.getAvailable(hotelId, checkIn, checkOut)
      rooms.value = apiRooms.length > 0 ? apiRooms : await mockRepo.getAvailable(hotelId, checkIn, checkOut)
    }
    catch (e: any) {
      try {
        rooms.value = await mockRepo.getAvailable(hotelId, checkIn, checkOut)
        error.value = null
      } catch {
        error.value = e.message
      }
    }
    finally { loading.value = false }
  }

  async function fetchRoomTypes() {
    loading.value = true
    error.value = null
    try {
      const apiRoomTypes = await apiRepo.getRoomTypes()
      roomTypes.value = apiRoomTypes.length > 0 ? apiRoomTypes : await mockRepo.getRoomTypes()
    }
    catch (e: any) {
      try {
        roomTypes.value = await mockRepo.getRoomTypes()
        error.value = null
      } catch {
        error.value = e.message
      }
    }
    finally { loading.value = false }
  }

  return { rooms, roomTypes, loading, error, fetchAll, fetchByHotel, fetchAvailable, fetchRoomTypes }
}
