import { ref } from 'vue'
import type { Room, RoomType } from '~/types/models'
import { ApiRoomRepository } from '~/repositories/api'

const repo = new ApiRoomRepository()

export function useRooms() {
  const rooms = ref<Room[]>([])
  const roomTypes = ref<RoomType[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll() {
    loading.value = true
    try { rooms.value = await repo.getAll() }
    catch (e: any) { error.value = e.message }
    finally { loading.value = false }
  }

  async function fetchByHotel(hotelId: number) {
    loading.value = true
    try { rooms.value = await repo.getByHotel(hotelId) }
    catch (e: any) { error.value = e.message }
    finally { loading.value = false }
  }

  async function fetchAvailable(hotelId: number, checkIn: string, checkOut: string) {
    loading.value = true
    try { rooms.value = await repo.getAvailable(hotelId, checkIn, checkOut) }
    catch (e: any) { error.value = e.message }
    finally { loading.value = false }
  }

  async function fetchRoomTypes() {
    loading.value = true
    try { roomTypes.value = await repo.getRoomTypes() }
    catch (e: any) { error.value = e.message }
    finally { loading.value = false }
  }

  return { rooms, roomTypes, loading, error, fetchAll, fetchByHotel, fetchAvailable, fetchRoomTypes }
}
