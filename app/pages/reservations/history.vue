<template>
  <div class="profile-page">
    <div class="profile-container">
      <header class="page-header">
        <div>
          <span class="badge-label">{{ t("reservationHistoryPage.badge") }}</span>
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
            <button :class="{ 'view-toggle--active': viewMode === 'list' }" @click="viewMode = 'list'">
              {{ t("reservationHistoryPage.list") }}
            </button>
            <button :class="{ 'view-toggle--active': viewMode === 'calendar' }" @click="viewMode = 'calendar'">
              {{ t("reservationHistoryPage.calendar") }}
            </button>
          </div>
          <button class="btn-export" @click="exportToCSV" :disabled="reservations.length === 0">
            <span class="material-symbols-outlined">download</span>
            {{ t("reservationHistoryPage.exportCsv") }}
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
              <span>{{ t("reservationHistoryPage.thisMonth") }}</span>
              <strong>{{ reservations.length }}</strong>
            </article>
            <article class="summary-card">
              <span>{{ t("reservationHistoryPage.upcoming") }}</span>
              <strong>{{ upcomingCount }}</strong>
            </article>
            <article class="summary-card">
              <span>{{ t("reservationHistoryPage.completed") }}</span>
              <strong>{{ completedCount }}</strong>
            </article>
          </section>

          <div v-if="error" class="state-box state-box--error">
            <span class="material-symbols-outlined">error</span>
            <p>{{ error }}</p>
          </div>

          <div v-else-if="loading" class="state-box">
            <span class="material-symbols-outlined spin">progress_activity</span>
            <p>{{ t("reservationHistoryPage.loading") }}</p>
          </div>

          <div v-else-if="reservations.length === 0" class="state-box">
            <span class="material-symbols-outlined">calendar_month</span>
            <p v-if="statusFilter !== ''">
              {{ t("reservationHistoryPage.emptyFiltered") }}
            </p>
            <p v-else>
              {{ t("reservationHistoryPage.emptyMonth", { month: monthLabel }) }}
              <NuxtLink to="/hotels" class="empty-link">
                {{ t("reservationHistoryPage.exploreHotels") }}
              </NuxtLink>
            </p>
            <NuxtLink v-if="statusFilter !== ''" to="/reservations/history" class="empty-link">
              {{ t("reservationHistoryPage.clearFilters") }}
            </NuxtLink>
          </div>

          <ReservationCalendar
            v-else-if="viewMode === 'calendar'"
            :month="monthCursor"
            :entries="calendarEntries"
            :empty-label="t('reservationHistoryPage.noStay')"
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
                    <p class="booking-ref">
                      {{ t("myBookingsPage.reference", { code: reservation.confirmationCode }) }}
                    </p>
                    <h2>{{ hotelName(reservation.hotelId) }}</h2>
                    <p class="booking-city">{{ hotelCity(reservation.hotelId) }}</p>
                  </div>
                  <span class="status-pill" :class="statusClass(reservation.status)">
                    {{ formatStatus(reservation.status) }}
                  </span>
                </div>

                <div class="booking-meta">
                  <div>
                    <span>{{ t("reservationHistoryPage.checkIn") }}</span>
                    <strong>{{ formatDateLabel(reservation.checkInDate) }}</strong>
                  </div>
                  <div>
                    <span>{{ t("reservationHistoryPage.checkOut") }}</span>
                    <strong>{{ formatDateLabel(reservation.checkOutDate) }}</strong>
                  </div>
                  <div>
                    <span>{{ t("reservationHistoryPage.total") }}</span>
                    <strong>{{ formatCurrency(reservation.totalAmount) }}</strong>
                  </div>
                </div>

                <div class="booking-actions">
                  <button class="btn-ghost" @click="openDetails(reservation.id)">
                    {{ t("reservationHistoryPage.viewDetails") }}
                  </button>
                  <button
                    class="btn-cancel"
                    :title="cancelButtonTitle(reservation)"
                    :disabled="!canCancelReservation(reservation) || (cancelling && selectedReservationId === reservation.id)"
                    @click="openCancel(reservation.id)"
                  >
                    {{ t("reservationHistoryPage.cancelReservation") }}
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
              <h3>{{ t("reservationHistoryPage.bookingDetails") }}</h3>
              <p>{{ selectedPreview.bookingReference }}</p>
            </div>
            <button type="button" class="booking-close-btn" @click="closeDetails">
              <span class="material-symbols-outlined">close</span>
            </button>
          </header>

          <div class="booking-modal-content">
            <div class="booking-info-grid">
              <div class="booking-info-item">
                <span class="booking-info-label">{{ t("reservationHistoryPage.hotel") }}</span>
                <strong>{{ selectedPreview.hotelName }}</strong>
              </div>
              <div class="booking-info-item">
                <span class="booking-info-label">{{ t("reservationHistoryPage.room") }}</span>
                <strong>{{ selectedPreview.roomName }}</strong>
              </div>
              <div class="booking-info-item">
                <span class="booking-info-label">{{ t("reservationHistoryPage.stay") }}</span>
                <strong>
                  {{ formatDateLabel(selectedPreview.stay.checkIn) }} -
                  {{ formatDateLabel(selectedPreview.stay.checkOut) }}
                </strong>
              </div>
              <div class="booking-info-item">
                <span class="booking-info-label">{{ t("reservationHistoryPage.refund") }}</span>
                <strong>
                  {{ formatRefundType(selectedPreview.refund.type) }} -
                  {{ formatCurrency(selectedPreview.refund.amount) }}
                </strong>
              </div>
            </div>

            <article class="policy-card">
              <h4>{{ t("reservationHistoryPage.cancellationPolicy") }}</h4>
              <p>{{ selectedPreview.policy.description }}</p>
              <div class="policy-meta">
                <div>
                  <span>{{ t("reservationHistoryPage.deadline") }}</span>
                  <strong>{{ formatDateTimeLabel(selectedPreview.cancellationDeadline) }}</strong>
                </div>
                <div>
                  <span>{{ t("reservationHistoryPage.charge") }}</span>
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
              {{ t("reservationHistoryPage.cancelReservation") }}
            </button>
            <button type="button" class="btn-primary" @click="closeDetails">
              {{ t("reservationHistoryPage.close") }}
            </button>
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
              <h3>{{ t("reservationHistoryPage.cancelPromptTitle") }}</h3>
              <p>{{ t("reservationHistoryPage.cancelPromptDescription") }}</p>
            </div>
            <button type="button" class="booking-close-btn" @click="closeCancel">
              <span class="material-symbols-outlined">close</span>
            </button>
          </header>

          <div class="booking-modal-content">
            <div class="booking-info-grid">
              <div class="booking-info-item">
                <span class="booking-info-label">{{ t("reservationHistoryPage.bookingReference") }}</span>
                <strong>{{ selectedPreview.bookingReference }}</strong>
              </div>
              <div class="booking-info-item">
                <span class="booking-info-label">{{ t("reservationHistoryPage.hotel") }}</span>
                <strong>{{ selectedPreview.hotelName }}</strong>
              </div>
              <div class="booking-info-item">
                <span class="booking-info-label">{{ t("reservationHistoryPage.refund") }}</span>
                <strong>
                  {{ formatRefundType(selectedPreview.refund.type) }} -
                  {{ formatCurrency(selectedPreview.refund.amount) }}
                </strong>
              </div>
              <div class="booking-info-item">
                <span class="booking-info-label">{{ t("reservationHistoryPage.charge") }}</span>
                <strong>{{ formatCurrency(selectedPreview.refund.chargeAmount) }}</strong>
              </div>
            </div>

            <p v-if="cancelError" class="cancel-error">{{ cancelError }}</p>
          </div>

          <footer class="booking-modal-footer">
            <button type="button" class="btn-ghost" @click="closeCancel">
              {{ t("reservationHistoryPage.keepReservation") }}
            </button>
            <button type="button" class="btn-primary" :disabled="cancelling" @click="confirmCancellation">
              {{
                cancelling
                  ? t("reservationHistoryPage.cancelling")
                  : t("reservationHistoryPage.confirmCancellation")
              }}
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
              <h3>{{ t("reservationHistoryPage.reservationCancelled") }}</h3>
              <p>{{ successMessage }}</p>
            </div>
            <button type="button" class="booking-close-btn" @click="closeSuccess">
              <span class="material-symbols-outlined">close</span>
            </button>
          </header>

          <footer class="booking-modal-footer">
            <button type="button" class="btn-primary" @click="closeSuccess">
              {{ t("reservationHistoryPage.close") }}
            </button>
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
const route = useRoute()
const { t, formatDate, formatCurrency } = useAppI18n()

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

const statusOptions = computed(() => [
  { value: '', label: t('reservationHistoryPage.all') },
  { value: ReservationStatus.CONFIRMED, label: t('reservationHistoryPage.confirmed') },
  { value: ReservationStatus.PENDING, label: t('reservationHistoryPage.pending') },
  { value: ReservationStatus.COMPLETED, label: t('reservationHistoryPage.completed') },
  { value: ReservationStatus.CANCELLED, label: t('reservationHistoryPage.cancelled') },
])

const monthLabel = computed(() => {
  const [year, month] = monthCursor.value.split('-').map(Number)
  return formatDate(new Date(Date.UTC(year, month - 1, 1)), {
    month: 'long',
    year: 'numeric',
  })
})

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
  selectedReservationId.value == null
    ? null
    : cancellationPreviews.value[selectedReservationId.value] || null,
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

const statusLabels = computed(() => ({
  [ReservationStatus.CONFIRMED]: t('reservationHistoryPage.confirmed'),
  [ReservationStatus.PENDING]: t('reservationHistoryPage.pending'),
  [ReservationStatus.COMPLETED]: t('reservationHistoryPage.completed'),
  [ReservationStatus.CANCELLED]: t('reservationHistoryPage.cancelled'),
  [ReservationStatus.BLOCKED]: t('reservationHistoryPage.blocked'),
  [ReservationStatus.REFUSED]: t('reservationHistoryPage.refused'),
}))

function currentMonthKey() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

function normalizeMonthKey(value: unknown) {
  if (typeof value !== 'string') return null
  if (!/^\d{4}-\d{2}$/.test(value)) return null
  const [year, month] = value.split('-').map(Number)
  if (!Number.isFinite(year) || !Number.isFinite(month) || month < 1 || month > 12) {
    return null
  }
  return `${year}-${String(month).padStart(2, '0')}`
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
  return hotelFor(hotelId)?.name ?? t('reservationHistoryPage.hotelFallback', { id: hotelId })
}

function hotelCity(hotelId: number) {
  const hotel = hotelFor(hotelId)
  return hotel ? `${hotel.city}, ${hotel.country}` : t('reservationHistoryPage.unknownDestination')
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

function formatStatus(status: ReservationStatus) {
  return statusLabels.value[status] || status
}

function formatRefundType(type: 'FULL' | 'PARTIAL' | 'NONE') {
  if (type === 'FULL') return t('reservationHistoryPage.refundFull')
  if (type === 'PARTIAL') return t('reservationHistoryPage.refundPartial')
  return t('reservationHistoryPage.refundNone')
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

function canCancelReservation(reservation: Reservation) {
  return getCancellationBlockReason(reservation) === null
}

function cancelButtonTitle(reservation: Reservation) {
  return getCancellationBlockReason(reservation) ?? t('reservationHistoryPage.cancelActionTitle')
}

function getCancellationBlockReason(reservation: Reservation): string | null {
  const status = reservation.status

  if (status === ReservationStatus.CONFIRMED) {
    return t('reservationHistoryPage.confirmedCancellationBlocked')
  }
  if (status === ReservationStatus.COMPLETED) {
    return t('reservationHistoryPage.completedCancellationBlocked')
  }
  if (status === ReservationStatus.CANCELLED) {
    return t('reservationHistoryPage.cancelledCancellationBlocked')
  }
  if (status === ReservationStatus.BLOCKED) {
    return t('reservationHistoryPage.blockedCancellationBlocked')
  }
  if (status === ReservationStatus.REFUSED) {
    return t('reservationHistoryPage.refusedCancellationBlocked')
  }

  const preview = cancellationPreviews.value[reservation.id]
  if (!preview) {
    return t('reservationHistoryPage.loadingPolicy')
  }

  if (!preview.cancellationAllowed) {
    return preview.reason || t('reservationHistoryPage.cannotCancel')
  }

  return null
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
    error.value = cause.message || t('reservationHistoryPage.unableToLoadReservations')
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
  const target = reservations.value.find((reservation) => reservation.id === reservationId)
  if (!target) return

  const existingReason = getCancellationBlockReason(target)
  if (existingReason) {
    cancelError.value = existingReason
    showCancelModal.value = true
    return
  }

  const preview = await ensurePreview(reservationId)
  if (!preview) {
    cancelError.value = t('reservationHistoryPage.unableToLoadPolicy')
    showCancelModal.value = true
    return
  }

  if (!preview.cancellationAllowed) {
    cancelError.value = preview.reason || t('reservationHistoryPage.cannotCancel')
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

  const target = reservations.value.find(
    (reservation) => reservation.id === selectedReservationId.value,
  )
  if (!target) return

  const blockReason = getCancellationBlockReason(target)
  if (blockReason) {
    cancelError.value = blockReason
    return
  }

  cancelling.value = true
  cancelError.value = ''

  try {
    const confirmation = await reservationService.cancelBooking(selectedReservationId.value, accountId.value)
    successMessage.value = t('reservationHistoryPage.successMessage', {
      reference: confirmation.bookingReference,
      refundType: formatRefundType(confirmation.refund.type),
      amount: formatCurrency(confirmation.refund.amount),
    })
    showCancelModal.value = false
    showSuccessModal.value = true
    await loadReservations()
  } catch (cause: any) {
    cancelError.value = cause.message || t('reservationHistoryPage.unableToCancel')
  } finally {
    cancelling.value = false
  }
}

function exportToCSV() {
  if (!reservations.value.length) return

  const headers = [
    t('reservationHistoryPage.csvReference'),
    t('reservationHistoryPage.csvHotel'),
    t('reservationHistoryPage.csvCity'),
    t('reservationHistoryPage.csvCheckIn'),
    t('reservationHistoryPage.csvCheckOut'),
    t('reservationHistoryPage.csvStatus'),
    t('reservationHistoryPage.csvTotalAmount'),
  ]

  const rows = reservations.value.map((reservation) => [
    reservation.confirmationCode,
    hotelName(reservation.hotelId),
    hotelCity(reservation.hotelId),
    formatDateLabel(reservation.checkInDate),
    formatDateLabel(reservation.checkOutDate),
    formatStatus(reservation.status),
    reservation.totalAmount.toString(),
  ])

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n')

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
  const initialMonth = normalizeMonthKey(route.query.month)
  if (initialMonth) {
    monthCursor.value = initialMonth
  }
  await Promise.all([
    hotelService.getAll().then((data) => {
      hotels.value = data
    }),
    loadReservations(),
  ])
  initialized.value = true
})

onUnmounted(() => {
  if (!import.meta.client) return
  document.body.style.overflow = ''
})

useHead(() => ({
  title: t('reservationHistoryPage.metaTitle'),
  meta: [
    {
      name: 'description',
      content: t('reservationHistoryPage.metaDescription'),
    },
  ],
}))
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: var(--color-bg-soft);
}

.profile-container {
  width: min(1200px, calc(100% - 2rem));
  margin: 0 auto;
  padding: 24px 0 80px;
}

.page-header {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 14px;
}

.badge-label {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 999px;
  background: var(--color-primary-25);
  color: var(--color-primary-700);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  flex-wrap: wrap;
}

.month-nav,
.view-toggle,
.control-panel {
  border: 1px solid var(--color-border-soft);
  background: var(--color-surface);
}

.month-nav {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.3rem 0.45rem;
  border-radius: 999px;
}

.month-nav button,
.booking-close-btn {
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  border-radius: 10px;
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
}

.month-nav strong {
  min-width: 144px;
  color: var(--color-text-primary);
  font-size: 13px;
  font-weight: 700;
  text-align: center;
}

.view-toggle {
  display: inline-flex;
  padding: 0.25rem;
  border-radius: 999px;
}

.view-toggle button {
  padding: 0.55rem 0.95rem;
  border: none;
  border-radius: 999px;
  background: transparent;
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.view-toggle--active {
  background: var(--color-primary-600) !important;
  color: var(--color-white) !important;
}

.btn-export {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: var(--color-surface);
  color: var(--color-text-primary);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
}

.btn-export:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.profile-body {
  display: flex;
  align-items: flex-start;
  gap: 32px;
}

.profile-main {
  flex: 1;
  min-width: 0;
  display: grid;
  gap: 16px;
}

.control-panel {
  display: grid;
  gap: 0;
  box-shadow: none;
}

.status-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  padding: 0 32px;
  border-bottom: 1px solid var(--color-border-soft);
}

.filter-pill {
  position: relative;
  padding: 20px 0;
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.filter-pill:hover,
.filter-pill--active {
  color: var(--color-primary-600);
}

.filter-pill--active::after {
  content: '';
  position: absolute;
  inset-inline: 0;
  bottom: 0;
  height: 3px;
  border-radius: 3px 3px 0 0;
  background: var(--color-primary-600);
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.summary-card,
.state-box,
.booking-card,
.booking-modal-card,
.policy-card {
  border: 1px solid var(--color-border-soft);
  background: var(--color-surface);
}

.summary-card {
  padding: 14px 16px;
  border-radius: 16px;
}

.summary-card span {
  display: block;
  color: var(--color-text-secondary);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.summary-card strong {
  display: block;
  margin-top: 6px;
  color: var(--color-text-primary);
  font-size: 1.9rem;
}

.state-box {
  min-height: 220px;
  display: grid;
  place-content: center;
  gap: 10px;
  border-radius: 20px;
  color: var(--color-text-secondary);
  text-align: center;
}

.state-box--error,
.cancel-error {
  color: var(--color-danger-600);
}

.empty-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary-700);
  font-weight: 700;
  text-decoration: none;
}

.list-card {
  display: grid;
  gap: 14px;
}

.booking-card {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  overflow: hidden;
  border-radius: 16px;
  box-shadow: var(--shadow-sm);
}

.booking-card__media img,
.media-fallback {
  width: 100%;
  height: 100%;
  min-height: 190px;
  object-fit: cover;
}

.media-fallback {
  display: grid;
  place-content: center;
  background: var(--color-surface-secondary);
  color: var(--color-text-secondary);
}

.media-fallback .material-symbols-outlined {
  font-size: 36px;
}

.booking-card__body {
  display: grid;
  gap: 16px;
  padding: 20px;
}

.booking-card__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.booking-ref {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.booking-card__top h2 {
  margin: 8px 0 0;
  color: var(--color-text-primary);
  font-size: 1.15rem;
}

.booking-city {
  margin: 6px 0 0;
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 500;
}

.booking-meta {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  padding-top: 14px;
  border-top: 1px solid var(--color-border-soft);
}

.booking-meta span,
.booking-info-label,
.policy-meta span {
  display: block;
  color: var(--color-text-secondary);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.booking-meta strong,
.booking-info-item strong,
.policy-meta strong {
  display: block;
  margin-top: 4px;
  color: var(--color-text-primary);
  font-size: 0.95rem;
}

.booking-actions,
.booking-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
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

.btn-primary,
.btn-ghost,
.btn-cancel {
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  border: 1px solid transparent;
}

.btn-primary {
  background: var(--color-primary-600);
  color: var(--color-white);
}

.btn-ghost {
  background: var(--color-surface);
  color: var(--color-text-primary);
  border-color: var(--color-border-soft);
}

.btn-cancel {
  background: var(--color-surface);
  color: #b42318;
  border-color: rgb(220 38 38 / 0.2);
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
  border-radius: 18px;
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

.booking-info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  border: 1px solid var(--color-border-soft);
  border-radius: 12px;
  background: var(--color-surface-secondary);
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
  align-items: center;
  padding: 16px 20px 20px;
  border-top: 1px solid var(--color-border-soft);
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
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 980px) {
  .profile-body,
  .page-header,
  .booking-card {
    display: flex;
    flex-direction: column;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .profile-container {
    width: min(100% - 1.5rem, 1200px);
    padding: 28px 0 40px;
  }

  .status-pills {
    padding: 0 16px;
    gap: 18px;
    overflow-x: auto;
  }

  .booking-meta,
  .booking-info-grid,
  .policy-meta {
    grid-template-columns: 1fr;
  }

  .booking-actions,
  .booking-modal-footer {
    flex-direction: column-reverse;
    align-items: stretch;
  }
}
</style>
