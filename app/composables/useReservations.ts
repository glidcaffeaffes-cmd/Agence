import { ref } from 'vue'
import type { Reservation } from '~/types/models'
import type { ReservationStatus } from '~/types/enums'
import { MockReservationRepository } from '~/repositories/mock'

const repo = new MockReservationRepository()

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

  async function create(data: Omit<Reservation, 'id' | 'confirmationCode'>) {
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

  return { reservations, reservation, loading, error, fetchAll, fetchByAccount, fetchById, create, updateStatus }
}
