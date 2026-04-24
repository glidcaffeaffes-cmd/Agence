import { ref } from 'vue'
import type { Reservation } from '~/types/models'
import type { ReservationStatus } from '~/types/enums'
import { ReservationService, RoomService } from '~/services'
import { ReservationStatus as ReservationStatusEnum } from '~/types/enums'
import { useAuth } from '~/composables/useAuth'
import { useAsyncAction } from '~/composables/useAsyncAction'

const reservationService = new ReservationService()
const roomService = new RoomService()

export function useReservations() {
  const reservations = ref<Reservation[]>([])
  const reservation = ref<Reservation | null>(null)
  const { loading, error, execute } = useAsyncAction()

  async function fetchAll() {
    reservations.value = await execute(() => reservationService.getAll(), [])
  }

  async function fetchByAccount(accountId: number) {
    reservations.value = await execute(() => reservationService.getByAccount(accountId), [])
  }

  async function fetchById(id: number) {
    reservation.value = await execute(() => reservationService.getById(id), null)
  }

  async function create(data: Omit<Reservation, 'id' | 'confirmationCode'> & { numberOfGuests?: number }) {
    const created = await execute(() => reservationService.book(data), null)
    if (created) reservations.value.push(created)
    return created
  }

  async function updateStatus(id: number, status: ReservationStatus, reason?: string) {
    const action = () => reservationService.updateStatus(id, status, reason)
    const updated = await execute(action, null)
    if (updated) {
      const i = reservations.value.findIndex(r => r.id === id)
      if (i !== -1) reservations.value[i] = updated
    }
    return updated
  }

  async function finalizeReservation(data: { hotelId: number; checkIn: string; checkOut: string; guests: number }) {
    const { accountId } = useAuth()
    if (!accountId.value) {
      error.value = 'You must be signed in to finalize a reservation.'
      return null
    }

    const checkInDate = new Date(data.checkIn)
    const checkOutDate = new Date(data.checkOut)
    if (Number.isNaN(checkInDate.getTime()) || Number.isNaN(checkOutDate.getTime())) {
      error.value = 'Invalid reservation dates.'
      return null
    }

    const availableRooms = await execute(
      () => roomService.getAvailable(data.hotelId, checkInDate.toISOString(), checkOutDate.toISOString()),
      [],
    )
    const room = availableRooms[0]
    if (!room) {
      error.value = 'No available room was found for this hotel.'
      return null
    }

    const nights = Math.max(
      1,
      Math.round((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)),
    )

    return create({
      accountId: accountId.value,
      roomId: room.id,
      hotelId: data.hotelId,
      reservationDate: new Date().toISOString(),
      checkInDate: checkInDate.toISOString(),
      checkOutDate: checkOutDate.toISOString(),
      numberOfNights: nights,
      totalAmount: room.pricePerNight * nights,
      status: ReservationStatusEnum.PENDING as ReservationStatus,
      numberOfGuests: data.guests,
    })
  }

  return { reservations, reservation, loading, error, fetchAll, fetchByAccount, fetchById, create, updateStatus, finalizeReservation }
}
