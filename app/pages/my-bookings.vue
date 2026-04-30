<template>
  <div class="bookings-page">
    <div class="bookings-shell">
      <header class="bookings-header">
        <div>
          <h1>{{ t("myBookingsPage.title") }}</h1>
          <p>{{ t("myBookingsPage.subtitle") }}</p>
        </div>
        <NuxtLink to="/reservations/history" class="history-link">
          {{ t("myBookingsPage.openHistory") }}
        </NuxtLink>
      </header>

      <section class="summary-grid">
        <article class="summary-card">
          <span>{{ t("myBookingsPage.total") }}</span>
          <strong>{{ bookings.length }}</strong>
        </article>
        <article class="summary-card">
          <span>{{ t("myBookingsPage.upcoming") }}</span>
          <strong>{{ upcomingCount }}</strong>
        </article>
        <article class="summary-card">
          <span>{{ t("myBookingsPage.completed") }}</span>
          <strong>{{ completedCount }}</strong>
        </article>
      </section>

      <section class="list-card">
        <div v-if="loading" class="state-box">
          <span class="material-symbols-outlined spin">progress_activity</span>
          <p>{{ t("myBookingsPage.loading") }}</p>
        </div>

        <div v-else-if="errorMessage" class="state-box state-box--error">
          <span class="material-symbols-outlined">error</span>
          <p>{{ errorMessage }}</p>
        </div>

        <div v-else-if="bookings.length === 0" class="state-box">
          <span class="material-symbols-outlined">luggage</span>
          <p>{{ t("myBookingsPage.empty") }}</p>
        </div>

        <article
          v-for="booking in bookings"
          v-else
          :key="booking.id"
          class="booking-row"
        >
          <div class="booking-main">
            <h2>{{ getHotelName(booking.hotelId) }}</h2>
            <p class="booking-ref">
              {{ t("myBookingsPage.reference", { code: booking.confirmationCode }) }}
            </p>
            <p class="booking-dates">
              {{ formatDateLabel(booking.checkInDate) }} - {{ formatDateLabel(booking.checkOutDate) }}
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
              {{ t("myBookingsPage.cancelReservation") }}
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
              <h3>{{ t("myBookingsPage.cancelTitle") }}</h3>
              <p>{{ t("myBookingsPage.reference", { code: selectedBooking.confirmationCode }) }}</p>
            </div>
            <button type="button" class="booking-close-btn" @click="closeCancelModal">
              <span class="material-symbols-outlined">close</span>
            </button>
          </header>

          <div class="booking-modal-content">
            <div class="booking-info-grid">
              <div class="booking-info-item">
                <span class="booking-info-label">{{ t("myBookingsPage.hotel") }}</span>
                <strong>{{ selectedPreview.hotelName }}</strong>
              </div>
              <div class="booking-info-item">
                <span class="booking-info-label">{{ t("myBookingsPage.room") }}</span>
                <strong>{{ selectedPreview.roomName }}</strong>
              </div>
              <div class="booking-info-item">
                <span class="booking-info-label">{{ t("myBookingsPage.stay") }}</span>
                <strong>
                  {{ formatDateLabel(selectedPreview.stay.checkIn) }} -
                  {{ formatDateLabel(selectedPreview.stay.checkOut) }}
                </strong>
              </div>
              <div class="booking-info-item">
                <span class="booking-info-label">{{ t("myBookingsPage.refund") }}</span>
                <strong>
                  {{ formatRefundType(selectedPreview.refund.type) }} -
                  {{ formatCurrency(selectedPreview.refund.amount) }}
                </strong>
              </div>
            </div>

            <div class="policy-card">
              <h4>{{ t("myBookingsPage.cancellationPolicy") }}</h4>
              <p>{{ selectedPreview.policy.description }}</p>
              <div class="policy-meta">
                <div>
                  <span>{{ t("myBookingsPage.deadline") }}</span>
                  <strong>{{ formatDateTimeLabel(selectedPreview.cancellationDeadline) }}</strong>
                </div>
                <div>
                  <span>{{ t("myBookingsPage.charge") }}</span>
                  <strong>{{ formatCurrency(selectedPreview.refund.chargeAmount) }}</strong>
                </div>
              </div>
            </div>

            <p v-if="cancelError" class="cancel-error">{{ cancelError }}</p>
          </div>

          <footer class="booking-modal-footer">
            <button type="button" class="btn-ghost" @click="closeCancelModal">
              {{ t("myBookingsPage.keepReservation") }}
            </button>
            <button
              type="button"
              class="btn-primary"
              :disabled="cancelling || !selectedPreview?.cancellationAllowed"
              @click="confirmCancellation"
            >
              {{
                cancelling
                  ? t("myBookingsPage.cancelling")
                  : t("myBookingsPage.confirmCancellation")
              }}
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
              <h3>{{ t("myBookingsPage.reservationCancelled") }}</h3>
              <p>{{ t("myBookingsPage.reservationCancelledDescription") }}</p>
            </div>
            <button type="button" class="booking-close-btn" @click="closeCancelSuccess">
              <span class="material-symbols-outlined">close</span>
            </button>
          </header>

          <div class="booking-modal-content">
            <div class="booking-info-grid">
              <div class="booking-info-item">
                <span class="booking-info-label">{{ t("myBookingsPage.bookingReference") }}</span>
                <strong>{{ cancelSuccessData.bookingReference }}</strong>
              </div>
              <div class="booking-info-item">
                <span class="booking-info-label">{{ t("myBookingsPage.cancellationDate") }}</span>
                <strong>{{ formatDateTimeLabel(cancelSuccessData.cancellationDate) }}</strong>
              </div>
              <div class="booking-info-item">
                <span class="booking-info-label">{{ t("myBookingsPage.refund") }}</span>
                <strong>
                  {{ formatRefundType(cancelSuccessData.refund.type) }} -
                  {{ formatCurrency(cancelSuccessData.refund.amount) }}
                </strong>
              </div>
              <div class="booking-info-item">
                <span class="booking-info-label">{{ t("myBookingsPage.charge") }}</span>
                <strong>{{ formatCurrency(cancelSuccessData.refund.chargeAmount) }}</strong>
              </div>
            </div>
          </div>

          <footer class="booking-modal-footer">
            <button type="button" class="btn-primary" @click="closeCancelSuccess">
              {{ t("myBookingsPage.close") }}
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
const { t, formatDate, formatCurrency } = useAppI18n()

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

const statusLabels = computed(() => ({
  [ReservationStatus.CONFIRMED]: t('reservationHistoryPage.confirmed'),
  [ReservationStatus.PENDING]: t('reservationHistoryPage.pending'),
  [ReservationStatus.COMPLETED]: t('myBookingsPage.completed'),
  [ReservationStatus.CANCELLED]: t('reservationHistoryPage.cancelled'),
  [ReservationStatus.BLOCKED]: t('reservationHistoryPage.blocked'),
  [ReservationStatus.REFUSED]: t('reservationHistoryPage.refused'),
}))

const upcomingCount = computed(() =>
  bookings.value.filter(
    (item) =>
      item.status === ReservationStatus.PENDING ||
      item.status === ReservationStatus.CONFIRMED,
  ).length,
)

const completedCount = computed(() =>
  bookings.value.filter((item) => item.status === ReservationStatus.COMPLETED).length,
)

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
  return statusLabels.value[status] || status
}

function formatDateLabel(value: string) {
  return formatDate(value, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatDateTimeLabel(value: string | null) {
  if (!value) return t('reservationHistoryPage.unavailable')
  return formatDate(value, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatRefundType(type: 'FULL' | 'PARTIAL' | 'NONE') {
  if (type === 'FULL') return t('myBookingsPage.refundFull')
  if (type === 'PARTIAL') return t('myBookingsPage.refundPartial')
  return t('myBookingsPage.refundNone')
}

function getHotelName(hotelId: number) {
  return hotels.value.find((hotel) => hotel.id === hotelId)?.name ??
    t('reservationHistoryPage.hotelFallback', { id: hotelId })
}

function showCancelButton(bookingId: number) {
  return Boolean(cancellationPreviews.value[bookingId]?.cancellationAllowed)
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
    cancelError.value = t('myBookingsPage.unableToLoadCancellationPolicy')
    showCancelModal.value = true
    return
  }

  if (!preview.cancellationAllowed) {
    cancelError.value = preview.reason || t('reservationHistoryPage.cannotCancel')
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
      cancelError.value = t('myBookingsPage.failedToCancelReservation')
      return
    }

    cancelSuccessData.value = confirmation
    showCancelModal.value = false
    showCancelSuccess.value = true
    await loadBookings()
  } catch (error: any) {
    cancelError.value =
      error?.message || t('myBookingsPage.failedToCancelReservation')
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
    errorMessage.value =
      error?.message || t('myBookingsPage.failedToLoadBookings')
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

useHead(() => ({
  title: t('myBookingsPage.metaTitle'),
  meta: [
    {
      name: 'description',
      content: t('myBookingsPage.metaDescription'),
    },
  ],
}))
</script>

<style scoped>
.bookings-page {
  min-height: calc(100vh - 140px);
  background:
    radial-gradient(
      circle at top,
      color-mix(in srgb, var(--color-primary-50) 70%, transparent) 0%,
      transparent 48%
    ),
    linear-gradient(180deg, var(--color-bg-soft) 0%, var(--color-surface) 100%);
}

.bookings-shell {
  width: min(1120px, calc(100% - 2rem));
  margin: 0 auto;
  padding: 40px 0 56px;
}

.bookings-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.bookings-header h1 {
  margin: 0;
  color: var(--color-text-primary);
  font-size: clamp(2rem, 3vw, 2.45rem);
  font-weight: 800;
  letter-spacing: -0.02em;
}

.bookings-header p {
  margin: 8px 0 0;
  color: var(--color-text-secondary);
  font-weight: 600;
}

.history-link {
  padding: 10px 14px;
  border: 1px solid color-mix(in srgb, var(--color-primary-300) 28%, transparent);
  border-radius: 12px;
  background: color-mix(in srgb, var(--color-primary-50) 45%, var(--color-surface));
  color: var(--color-primary-700);
  font-size: 0.9rem;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 18px;
}

.summary-card,
.list-card {
  border: 1px solid var(--color-border-soft);
  background: var(--color-surface);
}

.summary-card {
  padding: 14px 16px;
  border-radius: 14px;
}

.summary-card span {
  display: block;
  color: var(--color-text-secondary);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.summary-card strong {
  display: block;
  margin-top: 6px;
  color: var(--color-text-primary);
  font-size: 1.5rem;
  font-weight: 800;
}

.list-card {
  margin-top: 16px;
  overflow: hidden;
  border-radius: 20px;
  box-shadow: var(--shadow-md);
}

.state-box {
  min-height: 170px;
  display: grid;
  place-content: center;
  gap: 8px;
  text-align: center;
  color: var(--color-text-secondary);
}

.state-box .material-symbols-outlined {
  font-size: 30px;
}

.state-box--error,
.cancel-error {
  color: var(--color-danger-600);
}

.booking-row {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  padding: 18px 20px;
  border-bottom: 1px solid var(--color-border-soft);
}

.booking-row:last-child {
  border-bottom: 0;
}

.booking-main h2 {
  margin: 0;
  color: var(--color-text-primary);
  font-size: 1.02rem;
  font-weight: 800;
}

.booking-ref,
.booking-dates {
  margin: 6px 0 0;
  color: var(--color-text-secondary);
  font-size: 0.92rem;
}

.booking-side {
  display: grid;
  align-content: center;
  gap: 8px;
  text-align: end;
}

.booking-side strong {
  color: var(--color-text-primary);
  font-size: 1rem;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 10px;
  border-radius: 999px;
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

.btn-cancel,
.btn-primary,
.btn-ghost {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.btn-cancel {
  padding: 8px 12px;
  border: 1px solid rgb(220 38 38 / 0.2);
  background: var(--color-surface);
  color: #b42318;
}

.btn-cancel:hover {
  background: rgb(220 38 38 / 0.06);
  border-color: rgb(220 38 38 / 0.4);
}

.btn-cancel:disabled,
.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.booking-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgb(15 23 42 / 0.35);
  backdrop-filter: blur(6px);
}

.booking-modal-card {
  width: min(760px, 100%);
  max-height: 90vh;
  overflow: auto;
  border: 1px solid var(--color-border-soft);
  border-radius: 18px;
  background: var(--color-surface);
  box-shadow: var(--shadow-xl);
}

.booking-modal-card--compact {
  width: min(640px, 100%);
}

.booking-modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 18px 20px;
  border-bottom: 1px solid var(--color-border-soft);
}

.booking-modal-header h3 {
  margin: 0;
  color: var(--color-text-primary);
  font-size: 24px;
}

.booking-modal-header p {
  margin: 6px 0 0;
  color: var(--color-text-secondary);
  font-size: 14px;
}

.booking-close-btn {
  width: 36px;
  height: 36px;
  border: 1px solid var(--color-border-soft);
  border-radius: 10px;
  background: var(--color-surface);
  color: var(--color-text-secondary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.booking-modal-content {
  display: grid;
  gap: 14px;
  padding: 18px 20px;
}

.booking-info-grid,
.policy-meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.booking-info-item,
.policy-card {
  border: 1px solid var(--color-border-soft);
}

.booking-info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  border-radius: 12px;
  background: var(--color-surface-secondary);
}

.booking-info-label,
.policy-meta span {
  color: var(--color-text-secondary);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.booking-info-item strong,
.policy-meta strong {
  color: var(--color-text-primary);
  font-size: 14px;
}

.policy-card {
  padding: 14px;
  border-radius: 14px;
  background: color-mix(in srgb, var(--color-surface-secondary) 78%, var(--color-surface));
}

.policy-card h4 {
  margin: 0 0 8px;
  color: var(--color-text-primary);
  font-size: 18px;
}

.policy-card p {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 14px;
  line-height: 1.6;
}

.policy-meta {
  margin-top: 12px;
  gap: 10px;
}

.booking-modal-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  padding: 16px 20px 20px;
  border-top: 1px solid var(--color-border-soft);
}

.btn-primary {
  padding: 10px 14px;
  border: 1px solid transparent;
  background: var(--color-primary-600);
  color: var(--color-white);
}

.btn-ghost {
  padding: 10px 14px;
  border: 1px solid var(--color-border-soft);
  background: var(--color-surface);
  color: var(--color-text-primary);
}

.cancel-error {
  margin: 0;
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
    width: min(100% - 1.5rem, 1120px);
    padding: 28px 0 40px;
  }

  .bookings-header,
  .booking-row {
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
  }

  .booking-side {
    text-align: start;
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
