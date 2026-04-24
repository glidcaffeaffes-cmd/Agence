import { ref } from 'vue'
import type { Room, RoomType } from '~/types/models'
import { RoomService } from '~/services'
import { useAsyncAction } from '~/composables/useAsyncAction'

const service = new RoomService()

export function useRooms() {
  const rooms = ref<Room[]>([])
  const roomTypes = ref<RoomType[]>([])
  const { loading, error, execute } = useAsyncAction()

  async function fetchAll() {
    rooms.value = await execute(() => service.getAll(), [])
  }

  async function fetchByHotel(hotelId: number) {
    rooms.value = await execute(() => service.getByHotel(hotelId), [])
  }

  async function fetchAvailable(hotelId: number, checkIn: string, checkOut: string) {
    rooms.value = await execute(() => service.getAvailable(hotelId, checkIn, checkOut), [])
  }

  async function fetchRoomTypes() {
    roomTypes.value = await execute(() => service.getRoomTypes(), [])
  }

  return { rooms, roomTypes, loading, error, fetchAll, fetchByHotel, fetchAvailable, fetchRoomTypes }
}
