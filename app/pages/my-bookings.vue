<template>
  <div class="bookings-page">
    <Head>
      <title>My Bookings - VoyageHub</title>
      <meta
        name="description"
        content="View active and past bookings with live reservation data."
      />
    </Head>

    <div class="bookings-shell">
      <header class="bookings-header">
        <div>
          <h1>My Bookings</h1>
          <p>Track your reservations, stay dates, and booking statuses.</p>
        </div>
        <NuxtLink to="/reservations/history" class="history-link">
          Open detailed history
        </NuxtLink>
      </header>

      <section class="summary-grid">
        <article class="summary-card">
          <span>Total</span>
          <strong>{{ bookings.length }}</strong>
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

      <section class="list-card">
        <div v-if="loading" class="state-box">
          <span class="material-symbols-outlined spin">progress_activity</span>
          <p>Loading bookings...</p>
        </div>

        <div v-else-if="errorMessage" class="state-box state-box--error">
          <span class="material-symbols-outlined">error</span>
          <p>{{ errorMessage }}</p>
        </div>

        <div v-else-if="bookings.length === 0" class="state-box">
          <span class="material-symbols-outlined">luggage</span>
          <p>No bookings found for your account yet.</p>
        </div>

        <article
          v-for="booking in bookings"
          v-else
          :key="booking.id"
          class="booking-row"
        >
          <div class="booking-main">
            <h2>{{ getHotelName(booking.hotelId) }}</h2>
            <p class="booking-ref">Reference: {{ booking.confirmationCode }}</p>
            <p class="booking-dates">
              {{ formatDate(booking.checkInDate) }} - {{ formatDate(booking.checkOutDate) }}
            </p>
          </div>

          <div class="booking-side">
            <span class="status-pill" :class="statusClass(booking.status)">
              {{ formatStatus(booking.status) }}
            </span>
            <strong>{{ formatCurrency(booking.totalAmount) }}</strong>
            <button
              v-if="showCancelButton(booking.id)"
              type="button"
              class="btn-cancel"
              :disabled="cancelling && selectedBookingId === booking.id"
              @click="openCancelModal(booking.id)"
            >
              Cancel Reservation
            </button>
          </div>
        </article>
      </section>
    </div>

    <transition name="booking-modal">
      <div
        v-if="showCancelModal && selectedBooking && selectedPreview"
        class="booking-modal-overlay"
        @click="closeCancelModal"
      >
        <section class="booking-modal-card" @click.stop>
          <header class="booking-modal-header">
            <div>
              <h3>Cancel your reservation?</h3>
              <p>Reference: {{ selectedBooking.confirmationCode }}</p>
            </div>
            <button type="button" class="booking-close-btn" @click="closeCancelModal">
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

            <div class="policy-card">
              <h4>Cancellation policy</h4>
              <p>{{ selectedPreview.policy.description }}</p>
              <div class="policy-meta">
                <div>
                  <span>Deadline</span>
                  <strong>{{ formatDeadline(selectedPreview.cancellationDeadline) }}</strong>
                </div>
                <div>
                  <span>Charge</span>
                  <strong>{{ formatCurrency(selectedPreview.refund.chargeAmount) }}</strong>
                </div>
              </div>
            </div>

            <p v-if="cancelError" class="cancel-error">{{ cancelError }}</p>
          </div>

          <footer class="booking-modal-footer">
            <button type="button" class="btn-ghost" @click="closeCancelModal">
              Keep Reservation
            </button>
            <button
              type="button"
              class="btn-primary"
              :disabled="cancelling || !selectedPreview?.cancellationAllowed"
              @click="confirmCancellation"
            >
              {{ cancelling ? "Cancelling..." : "Confirm Cancellation" }}
            </button>
          </footer>
        </section>
      </div>
    </transition>

    <transition name="booking-modal">
      <div
        v-if="showCancelSuccess && cancelSuccessData"
        class="booking-modal-overlay"
        @click="closeCancelSuccess"
      >
        <section class="booking-modal-card booking-modal-card--compact" @click.stop>
          <header class="booking-modal-header">
            <div>
              <h3>Reservation Cancelled</h3>
              <p>Your reservation has been successfully cancelled.</p>
            </div>
            <button type="button" class="booking-close-btn" @click="closeCancelSuccess">
              <span class="material-symbols-outlined">close</span>
            </button>
          </header>

          <div class="booking-modal-content">
            <div class="booking-info-grid">
              <div class="booking-info-item">
                <span class="booking-info-label">Booking reference</span>
                <strong>{{ cancelSuccessData.bookingReference }}</strong>
              </div>
              <div class="booking-info-item">
                <span class="booking-info-label">Cancellation date</span>
                <strong>{{ formatDateTime(cancelSuccessData.cancellationDate) }}</strong>
              </div>
              <div class="booking-info-item">
                <span class="booking-info-label">Refund</span>
                <strong>{{ formatRefundType(cancelSuccessData.refund.type) }} - {{ formatCurrency(cancelSuccessData.refund.amount) }}</strong>
              </div>
              <div class="booking-info-item">
                <span class="booking-info-label">Charge</span>
                <strong>{{ formatCurrency(cancelSuccessData.refund.chargeAmount) }}</strong>
              </div>
            </div>
          </div>

          <footer class="booking-modal-footer">
            <button type="button" class="btn-primary" @click="closeCancelSuccess">
              Close
            </button>
          </footer>
        </section>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import type { Reservation } from '~/types/models'
import { ReservationStatus } from '~/types/enums'
import { useAuth } from '~/composables/useAuth'
import { useReservations } from '~/composables/useReservations'
import { useHotels } from '~/composables/useHotels'
import type {
  BookingCancellationConfirmation,
  BookingCancellationPreview,
} from '~/types/interfaces'

const { accountId } = useAuth()
const { fetchPaginated, getCancellationPreview, cancelBooking } = useReservations()
const { hotels, fetchAll: fetchHotels } = useHotels()

const bookings = ref<Reservation[]>([])
const loading = ref(true)
const errorMessage = ref('')
const cancellationPreviews = ref<Record<number, BookingCancellationPreview>>({})
const selectedBookingId = ref<number | null>(null)
const showCancelModal = ref(false)
const showCancelSuccess = ref(false)
const cancelling = ref(false)
const cancelError = ref('')
const cancelSuccessData = ref<BookingCancellationConfirmation | null>(null)

const upcomingCount = computed(() => {
  return bookings.value.filter(
    (item) =>
      item.status === ReservationStatus.PENDING ||
      item.status === ReservationStatus.CONFIRMED,
  ).length
})

const completedCount = computed(() => {
  return bookings.value.filter((item) => item.status === ReservationStatus.COMPLETED).length
})
const selectedBooking = computed(() =>
  selectedBookingId.value == null
    ? null
    : bookings.value.find((entry) => entry.id === selectedBookingId.value) || null,
)
const selectedPreview = computed(() =>
  selectedBookingId.value == null
    ? null
    : cancellationPreviews.value[selectedBookingId.value] || null,
)

function statusClass(status: ReservationStatus) {
  if (status === ReservationStatus.CONFIRMED) return 'status-pill--confirmed'
  if (status === ReservationStatus.PENDING) return 'status-pill--pending'
  if (status === ReservationStatus.COMPLETED) return 'status-pill--completed'
  if (status === ReservationStatus.CANCELLED) return 'status-pill--cancelled'
  if (status === ReservationStatus.BLOCKED || status === ReservationStatus.REFUSED) {
    return 'status-pill--blocked'
  }
  return ''
}

function formatStatus(status: ReservationStatus) {
  if (status === ReservationStatus.CONFIRMED) return 'Confirmed'
  if (status === ReservationStatus.PENDING) return 'Pending'
  if (status === ReservationStatus.COMPLETED) return 'Completed'
  if (status === ReservationStatus.CANCELLED) return 'Cancelled'
  if (status === ReservationStatus.BLOCKED) return 'Blocked'
  if (status === ReservationStatus.REFUSED) return 'Refused'
  return status
}

function formatDate(value: string) {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(parsed)
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value)
}

function getHotelName(hotelId: number) {
  return hotels.value.find((hotel) => hotel.id === hotelId)?.name ?? `Hotel #${hotelId}`
}

function showCancelButton(bookingId: number) {
  const preview = cancellationPreviews.value[bookingId]
  return Boolean(preview?.cancellationAllowed)
}

function formatDeadline(deadline: string | null) {
  if (!deadline) return 'Not available'
  return formatDateTime(deadline)
}

function formatDateTime(value: string) {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(parsed)
}

function formatRefundType(type: 'FULL' | 'PARTIAL' | 'NONE') {
  if (type === 'FULL') return 'Full refund'
  if (type === 'PARTIAL') return 'Partial refund'
  return 'No refund'
}

async function ensureCancellationPreview(bookingId: number) {
  if (cancellationPreviews.value[bookingId]) {
    return cancellationPreviews.value[bookingId]
  }

  const preview = await getCancellationPreview(bookingId, accountId.value || undefined)
  if (preview) {
    cancellationPreviews.value[bookingId] = preview
    return preview
  }

  return null
}

async function hydrateCancellationPreviews() {
  if (!accountId.value) {
    cancellationPreviews.value = {}
    return
  }

  const entries = await Promise.all(
    bookings.value.map(async (booking) => {
      const preview = await getCancellationPreview(booking.id, accountId.value || undefined)
      return preview ? [booking.id, preview] : null
    }),
  )

  const nextMap: Record<number, BookingCancellationPreview> = {}
  for (const entry of entries) {
    if (!entry) continue
    const [id, preview] = entry
    nextMap[id] = preview
  }
  cancellationPreviews.value = nextMap
}

async function openCancelModal(bookingId: number) {
  selectedBookingId.value = bookingId
  cancelError.value = ''
  const preview = await ensureCancellationPreview(bookingId)
  if (!preview) {
    cancelError.value = 'Unable to load cancellation policy.'
    showCancelModal.value = true
    return
  }
  if (!preview.cancellationAllowed) {
    cancelError.value = preview.reason || 'This reservation cannot be cancelled.'
  }
  showCancelModal.value = true
}

function closeCancelModal() {
  showCancelModal.value = false
  cancelError.value = ''
}

function closeCancelSuccess() {
  showCancelSuccess.value = false
}

async function confirmCancellation() {
  if (!selectedBookingId.value || !accountId.value) return
  cancelling.value = true
  cancelError.value = ''

  try {
    const confirmation = await cancelBooking(selectedBookingId.value, accountId.value)
    if (!confirmation) {
      cancelError.value = 'Unable to cancel this reservation.'
      return
    }

    cancelSuccessData.value = confirmation
    showCancelModal.value = false
    showCancelSuccess.value = true
    await loadBookings()
  } finally {
    cancelling.value = false
  }
}

async function loadBookings() {
  errorMessage.value = ''
  loading.value = true

  try {
    const response = await fetchPaginated({
      page: 1,
      limit: 100,
      accountId: accountId.value,
    })

    bookings.value = [...response.items].sort((a, b) =>
      b.reservationDate.localeCompare(a.reservationDate),
    )
    await hydrateCancellationPreviews()
  } catch (error: any) {
    errorMessage.value = error?.message || 'Failed to load booking data.'
  } finally {
    loading.value = false
  }
}

watch(
  () => showCancelModal.value || showCancelSuccess.value,
  (open) => {
    if (!import.meta.client) return
    document.body.style.overflow = open ? 'hidden' : ''
  },
)

onUnmounted(() => {
  if (!import.meta.client) return
  document.body.style.overflow = ''
})

onMounted(async () => {
  await Promise.all([fetchHotels(), loadBookings()])
})
</script>

<style scoped>
.bookings-page {
  background:
    radial-gradient(circle at top, color-mix(in srgb, var(--color-primary-50) 70%, white 30%) 0%, transparent 48%),
    linear-gradient(180deg, var(--color-gray-50) 0%, white 100%);
  min-height: calc(100vh - 140px);
}

.bookings-shell {
  max-width: 1120px;
  margin: 0 auto;
  padding: 40px 24px 56px;
}

.bookings-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.bookings-header h1 {
  margin: 0;
  color: var(--color-navy-500);
  font-size: clamp(2rem, 3vw, 2.45rem);
  font-weight: 800;
  letter-spacing: -0.02em;
}

.bookings-header p {
  margin: 8px 0 0;
  color: var(--color-gray-500);
  font-weight: 600;
}

.history-link {
  text-decoration: none;
  color: var(--color-primary-700);
  border: 1px solid color-mix(in srgb, var(--color-primary-200) 65%, white 35%);
  background: color-mix(in srgb, var(--color-primary-50) 56%, white 44%);
  border-radius: 12px;
  padding: 10px 14px;
  font-size: 0.9rem;
  font-weight: 700;
  white-space: nowrap;
}

.summary-grid {
  margin-top: 18px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.summary-card {
  background: white;
  border: 1px solid color-mix(in srgb, var(--color-gray-200) 72%, white 28%);
  border-radius: 14px;
  padding: 14px 16px;
}

.summary-card span {
  display: block;
  font-size: 0.8rem;
  color: var(--color-gray-500);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.summary-card strong {
  display: block;
  margin-top: 6px;
  color: var(--color-navy-500);
  font-size: 1.5rem;
  font-weight: 800;
}

.list-card {
  margin-top: 16px;
  background: white;
  border: 1px solid color-mix(in srgb, var(--color-gray-200) 74%, white 26%);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 16px 30px rgba(15, 23, 42, 0.06);
}

.state-box {
  min-height: 170px;
  display: grid;
  place-content: center;
  gap: 8px;
  text-align: center;
  color: var(--color-gray-500);
}

.state-box .material-symbols-outlined {
  font-size: 30px;
}

.state-box--error {
  color: #b42318;
}

.booking-row {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  padding: 18px 20px;
  border-bottom: 1px solid var(--color-gray-100);
}

.booking-row:last-child {
  border-bottom: 0;
}

.booking-main h2 {
  margin: 0;
  color: var(--color-navy-500);
  font-size: 1.02rem;
  font-weight: 800;
}

.booking-ref,
.booking-dates {
  margin: 6px 0 0;
  color: var(--color-gray-600);
  font-size: 0.92rem;
}

.booking-side {
  text-align: right;
  display: grid;
  gap: 8px;
  align-content: center;
}

.booking-side strong {
  color: var(--color-navy-500);
  font-size: 1rem;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.status-pill--confirmed {
  background: #ecfdf3;
  color: #027a48;
}

.status-pill--pending {
  background: #fffaeb;
  color: #b54708;
}

.status-pill--completed {
  background: #eff8ff;
  color: #175cd3;
}

.status-pill--cancelled {
  background: #f2f4f7;
  color: #344054;
}

.status-pill--blocked {
  background: #fef3f2;
  color: #b42318;
}

.btn-cancel {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(220, 38, 38, 0.2);
  color: #b42318;
  background: #fff;
  border-radius: 999px;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancel:hover {
  border-color: rgba(220, 38, 38, 0.4);
  background: rgba(220, 38, 38, 0.06);
}

.btn-cancel:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.booking-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1200;
  background: rgba(15, 23, 42, 0.35);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.booking-modal-card {
  width: min(760px, 100%);
  max-height: 90vh;
  overflow: auto;
  background: #fff;
  border: 1px solid var(--color-border-soft);
  border-radius: 18px;
  box-shadow: 0 24px 48px rgba(15, 23, 42, 0.18);
}

.booking-modal-card--compact {
  width: min(640px, 100%);
}

.booking-modal-header {
  padding: 18px 20px;
  border-bottom: 1px solid var(--color-border-soft);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.booking-modal-header h3 {
  margin: 0;
  font-size: 24px;
  color: var(--color-heading);
}

.booking-modal-header p {
  margin: 6px 0 0;
  color: var(--color-text-muted);
  font-size: 14px;
}

.booking-close-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid var(--color-border-soft);
  background: #fff;
  color: var(--color-text-muted);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.booking-modal-content {
  padding: 18px 20px;
  display: grid;
  gap: 14px;
}

.booking-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.booking-info-item {
  border: 1px solid var(--color-border-soft);
  border-radius: 12px;
  background: var(--color-surface);
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.booking-info-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
}

.booking-info-item strong {
  font-size: 14px;
  color: var(--color-heading);
}

.policy-card {
  border: 1px solid var(--color-border-soft);
  border-radius: 14px;
  background: color-mix(in srgb, var(--color-surface) 80%, white 20%);
  padding: 14px;
}

.policy-card h4 {
  margin: 0 0 8px;
  color: var(--color-heading);
  font-size: 18px;
}

.policy-card p {
  margin: 0;
  color: var(--color-text-secondary);
  line-height: 1.6;
  font-size: 14px;
}

.policy-meta {
  margin-top: 12px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.policy-meta span {
  display: block;
  font-size: 11px;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.policy-meta strong {
  color: var(--color-heading);
  font-size: 14px;
}

.booking-modal-footer {
  border-top: 1px solid var(--color-border-soft);
  padding: 16px 20px 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
}

.btn-primary,
.btn-ghost {
  border-radius: 12px;
  padding: 10px 14px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  border: 1px solid transparent;
}

.btn-primary {
  background: var(--color-primary-600);
  color: #fff;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-ghost {
  background: #fff;
  color: var(--color-text);
  border-color: var(--color-border-soft);
}

.cancel-error {
  margin: 0;
  color: #b42318;
  font-size: 13px;
  font-weight: 600;
}

.booking-modal-enter-active,
.booking-modal-leave-active {
  transition: opacity 0.2s ease;
}

.booking-modal-enter-active .booking-modal-card,
.booking-modal-leave-active .booking-modal-card {
  transition: transform 0.2s ease;
}

.booking-modal-enter-from,
.booking-modal-leave-to {
  opacity: 0;
}

.booking-modal-enter-from .booking-modal-card,
.booking-modal-leave-to .booking-modal-card {
  transform: translateY(14px);
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 900px) {
  .summary-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .bookings-shell {
    padding: 28px 16px 40px;
  }

  .bookings-header {
    flex-direction: column;
  }

  .history-link {
    width: 100%;
    text-align: center;
  }

  .list-card {
    border-radius: 16px;
  }

  .booking-row {
    padding: 14px 16px;
    flex-direction: column;
  }

  .booking-side {
    text-align: left;
  }

  .booking-info-grid,
  .policy-meta {
    grid-template-columns: 1fr;
  }

  .booking-modal-footer {
    flex-direction: column-reverse;
    align-items: stretch;
  }
}
</style>
