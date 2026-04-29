<template>
  <div class="profile-page">
    <Head>
      <title>Reservation History - VoyageHub</title>
      <meta
        name="description"
        content="Review your bookings in a detailed list or month calendar view."
      />
    </Head>

    <div class="profile-container">
      <header class="page-header">
        <div>
          <span class="badge-label">Reservations</span>
        </div>
        <div class="header-actions">
          <div class="month-nav">
            <button type="button" @click="shiftMonth(-1)">
              <span class="material-symbols-outlined">chevron_left</span>
            </button>
            <strong>{{ monthLabel }}</strong>
            <button type="button" @click="shiftMonth(1)">
              <span class="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
          <div class="view-toggle">
            <button :class="{ 'view-toggle--active': viewMode === 'list' }" @click="viewMode = 'list'">List</button>
            <button :class="{ 'view-toggle--active': viewMode === 'calendar' }" @click="viewMode = 'calendar'">Calendar</button>
          </div>
          <button class="btn-export" @click="exportToCSV" :disabled="reservations.length === 0">
            <span class="material-symbols-outlined">download</span>
            Export CSV
          </button>
        </div>
      </header>

      <div class="profile-body">
        <ProfileSidebar />

        <main class="profile-main">
          <section class="control-panel">
            <div class="status-pills">
              <button
                v-for="option in statusOptions"
                :key="option.value"
                class="filter-pill"
                :class="{ 'filter-pill--active': statusFilter === option.value }"
                @click="statusFilter = option.value"
              >
                {{ option.label }}
              </button>
            </div>
          </section>

          <section class="summary-grid">
            <article class="summary-card">
              <span>This month</span>
              <strong>{{ reservations.length }}</strong>
            </article>
            <article class="summary-card">
              <span>Upcoming</span>
              <strong>{{ upcomingCount }}</strong>
            </article>
            <article class="summary-card">
              <span>Completed</span>
              <strong>{{ completedCount }}</strong>
            </article>
          </section>

          <div v-if="error" class="state-box state-box--error">
            <span class="material-symbols-outlined">error</span>
            <p>{{ error }}</p>
          </div>

          <div v-else-if="loading" class="state-box">
            <span class="material-symbols-outlined spin">progress_activity</span>
            <p>Loading your reservations...</p>
          </div>

          <div v-else-if="reservations.length === 0" class="state-box">
            <span class="material-symbols-outlined">calendar_month</span>
            <p v-if="statusFilter !== ''">No bookings match your filters. Try adjusting them.</p>
            <p v-else>No bookings for {{ monthLabel }}. <NuxtLink to="/hotels" class="empty-link">Explore hotels to book your first trip</NuxtLink></p>
            <NuxtLink v-if="statusFilter !== ''" to="/reservations/history" class="empty-link">Clear filters</NuxtLink>
          </div>

          <ReservationCalendar
            v-else-if="viewMode === 'calendar'"
            :month="monthCursor"
            :entries="calendarEntries"
            empty-label="No stay"
            @event-click="openDetails($event.id)"
            @prev-month="shiftMonth(-1)"
            @next-month="shiftMonth(1)"
          />

          <div v-else class="list-card">
            <article v-for="reservation in reservations" :key="reservation.id" class="booking-card">
              <div class="booking-card__media">
                <img
                  v-if="hotelFor(reservation.hotelId)?.images?.[0]"
                  :src="hotelFor(reservation.hotelId)?.images[0]"
                  :alt="hotelName(reservation.hotelId)"
                />
                <div v-else class="media-fallback">
                  <span class="material-symbols-outlined">hotel</span>
                </div>
              </div>

              <div class="booking-card__body">
                <div class="booking-card__top">
                  <div>
                    <p class="booking-ref">REF {{ reservation.confirmationCode }}</p>
                    <h2>{{ hotelName(reservation.hotelId) }}</h2>
                    <p class="booking-city">{{ hotelCity(reservation.hotelId) }}</p>
                  </div>
                  <span class="status-pill" :class="statusClass(reservation.status)">
                    {{ formatStatus(reservation.status) }}
                  </span>
                </div>

                <div class="booking-meta">
                  <div>
                    <span>Check-in</span>
                    <strong>{{ formatDate(reservation.checkInDate) }}</strong>
                  </div>
                  <div>
                    <span>Check-out</span>
                    <strong>{{ formatDate(reservation.checkOutDate) }}</strong>
                  </div>
                  <div>
                    <span>Total</span>
                    <strong>{{ formatCurrency(reservation.totalAmount) }}</strong>
                  </div>
                </div>

                <div class="booking-actions">
                  <button class="btn-ghost" @click="openDetails(reservation.id)">View details</button>
                  <button
                    v-if="showCancelButton(reservation.id)"
                    class="btn-cancel"
                    :disabled="cancelling && selectedReservationId === reservation.id"
                    @click="openCancel(reservation.id)"
                  >
                    Cancel reservation
                  </button>
                </div>
              </div>
            </article>
          </div>
        </main>
      </div>
    </div>

    <transition name="booking-modal">
      <div
        v-if="showDetailsModal && selectedReservation && selectedPreview"
        class="booking-modal-overlay"
        @click="closeDetails"
      >
        <section class="booking-modal-card" @click.stop>
          <header class="booking-modal-header">
            <div>
              <h3>Booking Details</h3>
              <p>{{ selectedPreview.bookingReference }}</p>
            </div>
            <button type="button" class="booking-close-btn" @click="closeDetails">
              <span class="material-symbols-outlined">close</span>
            </button>
          </header>

          <div class="booking-modal-content">
            <div class="booking-info-grid">
              <div class="booking-info-item">
                <span class="booking-info-label">Hotel</span>
                <strong>{{ selectedPreview.hotelName }}</strong>
              </div>
              <div class="booking-info-item">
                <span class="booking-info-label">Room</span>
                <strong>{{ selectedPreview.roomName }}</strong>
              </div>
              <div class="booking-info-item">
                <span class="booking-info-label">Stay</span>
                <strong>{{ formatDate(selectedPreview.stay.checkIn) }} - {{ formatDate(selectedPreview.stay.checkOut) }}</strong>
              </div>
              <div class="booking-info-item">
                <span class="booking-info-label">Refund</span>
                <strong>{{ formatRefundType(selectedPreview.refund.type) }} - {{ formatCurrency(selectedPreview.refund.amount) }}</strong>
              </div>
            </div>

            <article class="policy-card">
              <h4>Cancellation policy</h4>
              <p>{{ selectedPreview.policy.description }}</p>
              <div class="policy-meta">
                <div>
                  <span>Deadline</span>
                  <strong>{{ formatDateTime(selectedPreview.cancellationDeadline) }}</strong>
                </div>
                <div>
                  <span>Charge</span>
                  <strong>{{ formatCurrency(selectedPreview.refund.chargeAmount) }}</strong>
                </div>
              </div>
            </article>
          </div>

          <footer class="booking-modal-footer">
            <button
              v-if="selectedPreview.cancellationAllowed"
              type="button"
              class="btn-cancel"
              @click="openCancel(selectedReservation.id)"
            >
              Cancel reservation
            </button>
            <button type="button" class="btn-primary" @click="closeDetails">Close</button>
          </footer>
        </section>
      </div>
    </transition>

    <transition name="booking-modal">
      <div
        v-if="showCancelModal && selectedReservation && selectedPreview"
        class="booking-modal-overlay"
        @click="closeCancel"
      >
        <section class="booking-modal-card booking-modal-card--compact" @click.stop>
          <header class="booking-modal-header">
            <div>
              <h3>Cancel this reservation?</h3>
              <p>Your refund depends on the current cancellation policy.</p>
            </div>
            <button type="button" class="booking-close-btn" @click="closeCancel">
              <span class="material-symbols-outlined">close</span>
            </button>
          </header>

          <div class="booking-modal-content">
            <div class="booking-info-grid">
              <div class="booking-info-item">
                <span class="booking-info-label">Booking reference</span>
                <strong>{{ selectedPreview.bookingReference }}</strong>
              </div>
              <div class="booking-info-item">
                <span class="booking-info-label">Hotel</span>
                <strong>{{ selectedPreview.hotelName }}</strong>
              </div>
              <div class="booking-info-item">
                <span class="booking-info-label">Refund</span>
                <strong>{{ formatRefundType(selectedPreview.refund.type) }} - {{ formatCurrency(selectedPreview.refund.amount) }}</strong>
              </div>
              <div class="booking-info-item">
                <span class="booking-info-label">Charge</span>
                <strong>{{ formatCurrency(selectedPreview.refund.chargeAmount) }}</strong>
              </div>
            </div>

            <p v-if="cancelError" class="cancel-error">{{ cancelError }}</p>
          </div>

          <footer class="booking-modal-footer">
            <button type="button" class="btn-ghost" @click="closeCancel">Keep reservation</button>
            <button type="button" class="btn-primary" :disabled="cancelling" @click="confirmCancellation">
              {{ cancelling ? 'Cancelling...' : 'Confirm cancellation' }}
            </button>
          </footer>
        </section>
      </div>
    </transition>

    <transition name="booking-modal">
      <div
        v-if="showSuccessModal && successMessage"
        class="booking-modal-overlay"
        @click="closeSuccess"
      >
        <section class="booking-modal-card booking-modal-card--compact" @click.stop>
          <header class="booking-modal-header">
            <div>
              <h3>Reservation cancelled</h3>
              <p>{{ successMessage }}</p>
            </div>
            <button type="button" class="booking-close-btn" @click="closeSuccess">
              <span class="material-symbols-outlined">close</span>
            </button>
          </header>

          <footer class="booking-modal-footer">
            <button type="button" class="btn-primary" @click="closeSuccess">Close</button>
          </footer>
        </section>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import type { BookingCancellationPreview } from '~/types/interfaces'
import type { Hotel, Reservation } from '~/types/models'
import { ReservationStatus } from '~/types/enums'
import { useAuth } from '~/composables/useAuth'
import { HotelService } from '~/services/HotelService'
import { ReservationService } from '~/services/ReservationService'

definePageMeta({ middleware: 'auth' })

const { accountId } = useAuth()
const reservationService = new ReservationService()
const hotelService = new HotelService()

const reservations = ref<Reservation[]>([])
const hotels = ref<Hotel[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const viewMode = ref<'list' | 'calendar'>('list')
const statusFilter = ref<ReservationStatus | ''>('')
const monthCursor = ref(currentMonthKey())
const cancellationPreviews = ref<Record<number, BookingCancellationPreview>>({})
const selectedReservationId = ref<number | null>(null)
const showDetailsModal = ref(false)
const showCancelModal = ref(false)
const showSuccessModal = ref(false)
const successMessage = ref('')
const cancelling = ref(false)
const cancelError = ref('')
const initialized = ref(false)

const statusOptions = [
  { value: '', label: 'All' },
  { value: ReservationStatus.CONFIRMED, label: 'Confirmed' },
  { value: ReservationStatus.PENDING, label: 'Pending' },
  { value: ReservationStatus.COMPLETED, label: 'Completed' },
  { value: ReservationStatus.CANCELLED, label: 'Cancelled' },
]

const monthLabel = computed(() =>
  new Date(`${monthCursor.value}-01T00:00:00.000Z`).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  }),
)
const upcomingCount = computed(() =>
  reservations.value.filter((reservation) =>
    [ReservationStatus.PENDING, ReservationStatus.CONFIRMED].includes(reservation.status),
  ).length,
)
const completedCount = computed(() =>
  reservations.value.filter((reservation) => reservation.status === ReservationStatus.COMPLETED).length,
)
const selectedReservation = computed(() =>
  selectedReservationId.value == null
    ? null
    : reservations.value.find((reservation) => reservation.id === selectedReservationId.value) || null,
)
const selectedPreview = computed(() =>
  selectedReservationId.value == null ? null : cancellationPreviews.value[selectedReservationId.value] || null,
)
const calendarEntries = computed(() =>
  reservations.value.map((reservation) => ({
    id: reservation.id,
    title: hotelName(reservation.hotelId),
    subtitle: reservation.confirmationCode,
    start: reservation.checkInDate,
    end: reservation.checkOutDate,
    status: reservation.status,
    amountLabel: formatCurrency(reservation.totalAmount),
  })),
)

function currentMonthKey() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

function monthRange(key: string) {
  const [year, month] = key.split('-').map(Number)
  const start = new Date(Date.UTC(year, month - 1, 1))
  const end = new Date(Date.UTC(year, month, 1))
  return {
    start: start.toISOString(),
    end: end.toISOString(),
  }
}

function shiftMonth(offset: number) {
  const [year, month] = monthCursor.value.split('-').map(Number)
  const next = new Date(Date.UTC(year, month - 1 + offset, 1))
  monthCursor.value = `${next.getUTCFullYear()}-${String(next.getUTCMonth() + 1).padStart(2, '0')}`
}

function hotelFor(hotelId: number) {
  return hotels.value.find((hotel) => hotel.id === hotelId)
}

function hotelName(hotelId: number) {
  return hotelFor(hotelId)?.name ?? `Hotel #${hotelId}`
}

function hotelCity(hotelId: number) {
  const hotel = hotelFor(hotelId)
  return hotel ? `${hotel.city}, ${hotel.country}` : 'Unknown destination'
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

function formatDateTime(value: string | null) {
  if (!value) return 'Not available'
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

function formatCurrency(value: number) {
  return `${value} €`
}

function formatStatus(status: ReservationStatus) {
  return status.charAt(0) + status.slice(1).toLowerCase()
}

function formatRefundType(type: 'FULL' | 'PARTIAL' | 'NONE') {
  if (type === 'FULL') return 'Full refund'
  if (type === 'PARTIAL') return 'Partial refund'
  return 'No refund'
}

function statusClass(status: ReservationStatus) {
  switch (status) {
    case ReservationStatus.CONFIRMED:
      return 'status-pill--confirmed'
    case ReservationStatus.COMPLETED:
      return 'status-pill--completed'
    case ReservationStatus.PENDING:
      return 'status-pill--pending'
    case ReservationStatus.CANCELLED:
      return 'status-pill--cancelled'
    default:
      return 'status-pill--blocked'
  }
}

function showCancelButton(reservationId: number) {
  return Boolean(cancellationPreviews.value[reservationId]?.cancellationAllowed)
}

async function hydrateCancellationPreviews() {
  if (!accountId.value || reservations.value.length === 0) {
    cancellationPreviews.value = {}
    return
  }

  const entries = await Promise.all(
    reservations.value.map(async (reservation) => {
      try {
        const preview = await reservationService.getCancellationPreview(reservation.id, accountId.value)
        return [reservation.id, preview] as const
      } catch {
        return null
      }
    }),
  )

  const nextPreviews: Record<number, BookingCancellationPreview> = {}
  for (const entry of entries) {
    if (!entry) continue
    nextPreviews[entry[0]] = entry[1]
  }
  cancellationPreviews.value = nextPreviews
}

async function loadReservations() {
  if (!accountId.value) return

  loading.value = true
  error.value = null

  try {
    const range = monthRange(monthCursor.value)
    const [response, nextHotels] = await Promise.all([
      reservationService.fetchPaginated({
        page: 1,
        limit: 100,
        accountId: accountId.value,
        status: statusFilter.value || undefined,
        start: range.start,
        end: range.end,
      }),
      hotels.value.length ? Promise.resolve(hotels.value) : hotelService.getAll(),
    ])

    reservations.value = response.items
    hotels.value = nextHotels
    await hydrateCancellationPreviews()
  } catch (cause: any) {
    error.value = cause.message || 'Unable to load reservations.'
  } finally {
    loading.value = false
  }
}

async function ensurePreview(reservationId: number) {
  const existing = cancellationPreviews.value[reservationId]
  if (existing) return existing
  if (!accountId.value) return null

  try {
    const preview = await reservationService.getCancellationPreview(reservationId, accountId.value)
    cancellationPreviews.value = {
      ...cancellationPreviews.value,
      [reservationId]: preview,
    }
    return preview
  } catch {
    return null
  }
}

async function openDetails(reservationId: number) {
  selectedReservationId.value = reservationId
  cancelError.value = ''
  const preview = await ensurePreview(reservationId)
  if (!preview) return
  showDetailsModal.value = true
}

function closeDetails() {
  showDetailsModal.value = false
}

async function openCancel(reservationId: number) {
  selectedReservationId.value = reservationId
  cancelError.value = ''
  const preview = await ensurePreview(reservationId)
  if (!preview) {
    cancelError.value = 'Unable to load cancellation policy.'
    showCancelModal.value = true
    return
  }

  if (!preview.cancellationAllowed) {
    cancelError.value = preview.reason || 'This reservation cannot be cancelled.'
  }

  showDetailsModal.value = false
  showCancelModal.value = true
}

function closeCancel() {
  showCancelModal.value = false
  cancelError.value = ''
}

function closeSuccess() {
  showSuccessModal.value = false
  successMessage.value = ''
}

async function confirmCancellation() {
  if (!selectedReservationId.value || !accountId.value) return

  cancelling.value = true
  cancelError.value = ''

  try {
    const confirmation = await reservationService.cancelBooking(selectedReservationId.value, accountId.value)
    successMessage.value = `Booking ${confirmation.bookingReference} was cancelled. Refund: ${formatRefundType(confirmation.refund.type)} - ${formatCurrency(confirmation.refund.amount)}.`
    showCancelModal.value = false
    showSuccessModal.value = true
    await loadReservations()
  } catch (cause: any) {
    cancelError.value = cause.message || 'Unable to cancel this reservation.'
  } finally {
    cancelling.value = false
  }
}

function exportToCSV() {
  if (!reservations.value.length) return

  const headers = ['Reference', 'Hotel', 'City', 'Check-in', 'Check-out', 'Status', 'Total Amount']
  const rows = reservations.value.map(reservation => [
    reservation.confirmationCode,
    hotelName(reservation.hotelId),
    hotelCity(reservation.hotelId),
    formatDate(reservation.checkInDate),
    formatDate(reservation.checkOutDate),
    formatStatus(reservation.status),
    reservation.totalAmount.toString()
  ])

  const csvContent = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `reservations-${monthCursor.value}.csv`
  link.click()
}

watch(
  () => showDetailsModal.value || showCancelModal.value || showSuccessModal.value,
  (isOpen) => {
    if (!import.meta.client) return
    document.body.style.overflow = isOpen ? 'hidden' : ''
  },
)

watch([statusFilter, monthCursor, accountId], () => {
  if (!initialized.value || !accountId.value) return
  loadReservations()
})

onMounted(async () => {
  await Promise.all([hotelService.getAll().then((data) => { hotels.value = data }), loadReservations()])
  initialized.value = true
})

onUnmounted(() => {
  if (!import.meta.client) return
  document.body.style.overflow = ''
})
</script>

<style scoped>
.profile-page { min-height: 100vh; background: var(--color-bg-soft); }
.profile-container { max-width: 1200px; margin: 0 auto; padding: 24px 32px 80px; }
.page-header { display: flex; align-items: end; justify-content: space-between; gap: 20px; margin-bottom: 14px; }
.badge-label { display: inline-flex; align-items: center; padding: 4px 12px; border-radius: 999px; background: var(--color-primary-25); color: var(--color-primary-700); font-size: 11px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; }
.header-actions { display: flex; gap: 0.8rem; align-items: center; flex-wrap: wrap; }
.month-nav { display: inline-flex; align-items: center; gap: 0.55rem; background: #fff; border: 1px solid var(--color-border-soft); border-radius: 999px; padding: 0.3rem 0.45rem; }
.month-nav button, .booking-close-btn { width: 34px; height: 34px; border-radius: 10px; border: 1px solid transparent; background: transparent; color: var(--color-text-muted); display: inline-flex; align-items: center; justify-content: center; cursor: pointer; }
.month-nav strong { min-width: 144px; text-align: center; color: var(--color-heading); font-size: 13px; font-weight: 700; }
.view-toggle { display: inline-flex; padding: 0.25rem; background: #fff; border: 1px solid var(--color-border-soft); border-radius: 999px; }
.view-toggle button { border: none; background: transparent; color: var(--color-text-muted); padding: 0.55rem 0.95rem; border-radius: 999px; font-size: 13px; font-weight: 600; cursor: pointer; }
.view-toggle--active { background: var(--color-primary-600) !important; color: #fff !important; }
.btn-export { display: inline-flex; align-items: center; gap: 8px; border: 1px solid var(--color-border); background: #fff; color: var(--color-heading); border-radius: 12px; padding: 10px 14px; font-size: 13px; font-weight: 700; cursor: pointer; text-transform: uppercase; letter-spacing: 0.08em; }
.btn-export:hover { background: var(--color-bg-soft); }
.btn-export:disabled { opacity: 0.5; cursor: not-allowed; }
.profile-body { display: flex; gap: 32px; align-items: flex-start; }
.profile-main { flex: 1; min-width: 0; display: grid; gap: 16px; }
.control-panel { background: #fff; padding: 0 32px; border-radius: 0; border: 1px solid var(--color-border-soft); box-shadow: none; display: grid; gap: 0; }
.status-pills {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
  border-bottom: 1px solid var(--color-border-soft);
  padding: 0;
}
.filter-pill {
  border: none;
  background: transparent;
  color: var(--color-text-muted);
  border-radius: 0;
  padding: 20px 0;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  position: relative;
}
.filter-pill:hover {
  color: var(--color-primary-600);
}
.filter-pill--active {
  color: var(--color-primary-600);
}
.filter-pill--active::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 3px;
  border-radius: 3px 3px 0 0;
  background: var(--color-primary-600);
}
.summary-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
.summary-card { background: #fff; border: 1px solid var(--color-border-soft); border-radius: 16px; padding: 14px 16px; }
.summary-card span { display: block; font-size: 11px; color: var(--color-text-muted); font-weight: 800; text-transform: uppercase; letter-spacing: 0.12em; }
.summary-card strong { display: block; margin-top: 6px; color: var(--color-heading); font-size: 1.9rem; }
.state-box { min-height: 220px; display: grid; place-content: center; gap: 10px; text-align: center; border-radius: 20px; border: 1px solid var(--color-border-soft); background: #fff; color: var(--color-text-muted); }
.state-box--error { color: #b42318; }
.empty-link { display: inline-flex; justify-content: center; align-items: center; text-decoration: none; color: var(--color-primary-700); font-weight: 700; }
.list-card { display: grid; gap: 14px; }
.booking-card { animation: fadeInUp var(--duration-slow) var(--easing-entrance); animation-fill-mode: both; }
.booking-card:nth-child(1) { animation-delay: 0.1s; }
.booking-card:nth-child(2) { animation-delay: 0.2s; }
.booking-card:nth-child(3) { animation-delay: 0.3s; }
.booking-card:nth-child(4) { animation-delay: 0.4s; }
.booking-card:nth-child(5) { animation-delay: 0.5s; }
.booking-card { display: grid; grid-template-columns: 220px minmax(0, 1fr); background: #fff; border-radius: 16px; border: 1px solid var(--color-border-soft); overflow: hidden; box-shadow: 0 4px 16px rgba(15, 23, 42, 0.06); }
.booking-card__media img, .media-fallback { width: 100%; height: 100%; min-height: 190px; object-fit: cover; }
.media-fallback { display: grid; place-content: center; background: var(--color-bg-soft); color: var(--color-text-muted); }
.media-fallback .material-symbols-outlined { font-size: 36px; }
.booking-card__body { padding: 20px; display: grid; gap: 16px; }
.booking-card__top { display: flex; justify-content: space-between; gap: 16px; align-items: flex-start; }
.booking-ref { margin: 0; color: var(--color-text-muted); font-size: 0.74rem; font-weight: 800; letter-spacing: 0.08em; }
.booking-card__top h2 { margin: 8px 0 0; color: var(--color-heading); font-size: 1.15rem; }
.booking-city { margin: 6px 0 0; color: var(--color-text-muted); font-size: 13px; font-weight: 500; }
.booking-meta { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; padding-top: 14px; border-top: 1px solid var(--color-border-soft); }
.booking-meta span { display: block; color: var(--color-text-muted); font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; }
.booking-meta strong { display: block; margin-top: 4px; color: var(--color-heading); font-size: 0.95rem; }
.booking-actions { display: flex; justify-content: flex-end; gap: 10px; flex-wrap: wrap; }
.status-pill { display: inline-flex; align-items: center; justify-content: center; border-radius: 999px; padding: 4px 10px; font-size: 0.76rem; font-weight: 800; letter-spacing: 0.04em; text-transform: uppercase; }
.status-pill--confirmed { background: #ecfdf3; color: #027a48; }
.status-pill--pending { background: #fffaeb; color: #b54708; }
.status-pill--completed { background: #eff8ff; color: #175cd3; }
.status-pill--cancelled { background: #f2f4f7; color: #344054; }
.status-pill--blocked { background: #fef3f2; color: #b42318; }
.btn-primary, .btn-ghost, .btn-cancel { border-radius: 12px; padding: 10px 14px; font-size: 13px; font-weight: 700; cursor: pointer; border: 1px solid transparent; }
.btn-primary { background: var(--color-primary-600); color: #fff; }
.btn-ghost { background: #fff; color: var(--color-text); border-color: var(--color-border-soft); }
.btn-cancel { background: #fff; color: #b42318; border-color: rgba(220, 38, 38, 0.2); }
.btn-cancel:disabled, .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.booking-modal-overlay { position: fixed; inset: 0; z-index: 1200; background: rgba(15, 23, 42, 0.35); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; padding: 20px; }
.booking-modal-card { width: min(760px, 100%); max-height: 90vh; overflow: auto; background: #fff; border: 1px solid var(--color-border-soft); border-radius: 18px; box-shadow: 0 24px 48px rgba(15, 23, 42, 0.18); }
.booking-modal-card--compact { width: min(640px, 100%); }
.booking-modal-header { padding: 18px 20px; border-bottom: 1px solid var(--color-border-soft); display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
.booking-modal-header h3 { margin: 0; font-size: 24px; color: var(--color-heading); }
.booking-modal-header p { margin: 6px 0 0; color: var(--color-text-muted); font-size: 14px; }
.booking-modal-content { padding: 18px 20px; display: grid; gap: 14px; }
.booking-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.booking-info-item { border: 1px solid var(--color-border-soft); border-radius: 12px; background: var(--color-surface); padding: 12px; display: flex; flex-direction: column; gap: 4px; }
.booking-info-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text-muted); }
.booking-info-item strong { font-size: 14px; color: var(--color-heading); }
.policy-card { border: 1px solid var(--color-border-soft); border-radius: 14px; background: color-mix(in srgb, var(--color-surface) 80%, white 20%); padding: 14px; }
.policy-card h4 { margin: 0 0 8px; color: var(--color-heading); font-size: 18px; }
.policy-card p { margin: 0; color: var(--color-text-secondary); line-height: 1.6; font-size: 14px; }
.policy-meta { margin-top: 12px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.policy-meta span { display: block; font-size: 11px; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.04em; }
.policy-meta strong { color: var(--color-heading); font-size: 14px; }
.booking-modal-footer { border-top: 1px solid var(--color-border-soft); padding: 16px 20px 20px; display: flex; justify-content: flex-end; align-items: center; gap: 10px; }
.cancel-error { margin: 0; color: #b42318; font-size: 13px; font-weight: 600; }
.booking-modal-enter-active, .booking-modal-leave-active { transition: opacity 0.2s ease; }
.booking-modal-enter-active .booking-modal-card, .booking-modal-leave-active .booking-modal-card { transition: transform 0.2s ease; }
.booking-modal-enter-from, .booking-modal-leave-to { opacity: 0; }
.booking-modal-enter-from .booking-modal-card, .booking-modal-leave-to .booking-modal-card { transform: translateY(14px); }

.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
@media (max-width: 980px) {
  .profile-body, .page-header, .booking-card { flex-direction: column; display: flex; }
  .summary-grid { grid-template-columns: 1fr; }
}
@media (max-width: 768px) {
  .profile-container { padding: 28px 16px 40px; }
  .booking-meta, .booking-info-grid, .policy-meta { grid-template-columns: 1fr; }
  .booking-actions, .booking-modal-footer { flex-direction: column-reverse; align-items: stretch; }
}
</style>
