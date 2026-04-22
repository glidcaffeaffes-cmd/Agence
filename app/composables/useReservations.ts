import { ref } from 'vue'
import type { Reservation } from '~/types/models'
import type { ReservationStatus } from '~/types/enums'
import { ApiReservationRepository, ApiRoomRepository } from '~/repositories/api'
import { ReservationStatus as ReservationStatusEnum } from '~/types/enums'
import { useAuth } from '~/composables/useAuth'

const repo = new ApiReservationRepository()
const roomRepo = new ApiRoomRepository()

export function useReservations() {
  const reservations = ref<Reservation[]>([])
  const reservation = ref<Reservation | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll() {
    loading.value = true
    try { reservations.value = await repo.getAll() }
    catch (e: any) { error.value = e.message }
    finally { loading.value = false }
  }

  async function fetchByAccount(accountId: number) {
    loading.value = true
    try { reservations.value = await repo.getByAccount(accountId) }
    catch (e: any) { error.value = e.message }
    finally { loading.value = false }
  }

  async function fetchById(id: number) {
    loading.value = true
    try { reservation.value = await repo.getById(id) }
    catch (e: any) { error.value = e.message }
    finally { loading.value = false }
  }

  async function create(data: Omit<Reservation, 'id' | 'confirmationCode'> & { numberOfGuests?: number }) {
    loading.value = true
    try {
      const created = await repo.create(data)
      reservations.value.push(created)
      return created
    }
    catch (e: any) { error.value = e.message; return null }
    finally { loading.value = false }
  }

  async function updateStatus(id: number, status: ReservationStatus, reason?: string) {
    loading.value = true
    try {
      const updated = await repo.updateStatus(id, status, reason)
      const i = reservations.value.findIndex(r => r.id === id)
      if (i !== -1) reservations.value[i] = updated
      return updated
    }
    catch (e: any) { error.value = e.message; return null }
    finally { loading.value = false }
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

    const availableRooms = await roomRepo.getAvailable(
      data.hotelId,
      checkInDate.toISOString(),
      checkOutDate.toISOString(),
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
