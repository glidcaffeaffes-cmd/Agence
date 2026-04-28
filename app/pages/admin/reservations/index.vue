<template>
  <div>
    <Head>
      <title>Reservations - VoyageHub Admin</title>
      <meta
        name="description"
        content="Review reservations in a table or calendar view across the selected month."
      />
    </Head>

    <div class="admin-page">
      <div class="page-header">
        <div>
          <p class="page-eyebrow">Operations</p>
          <h1 class="page-title">Reservations</h1>
          <p class="page-desc">Track the current month as a table for action-taking or as a large calendar for occupancy awareness.</p>
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
            <button :class="{ 'view-toggle--active': viewMode === 'table' }" @click="viewMode = 'table'">Table</button>
            <button :class="{ 'view-toggle--active': viewMode === 'calendar' }" @click="viewMode = 'calendar'">Calendar</button>
          </div>
        </div>
      </div>

      <div class="toolbar">
        <label class="search-field">
          <span class="material-symbols-outlined">search</span>
          <input v-model="search" type="text" placeholder="Search confirmation code, hotel, or city" />
        </label>

        <select v-model="statusFilter">
          <option value="">All statuses</option>
          <option v-for="option in statusOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>

      <div class="summary-grid">
        <article class="summary-card">
          <span>Reservations</span>
          <strong>{{ reservations.length }}</strong>
        </article>
        <article class="summary-card">
          <span>Confirmed</span>
          <strong>{{ confirmedCount }}</strong>
        </article>
        <article class="summary-card">
          <span>Revenue</span>
          <strong>{{ revenueLabel }}</strong>
        </article>
      </div>

      <div v-if="error" class="alert-error">
        <span class="material-symbols-outlined">error</span>
        {{ error }}
      </div>

      <div v-if="loading" class="state-card">
        <span class="material-symbols-outlined spin">progress_activity</span>
        <p>Loading reservations...</p>
      </div>

      <div v-else-if="reservations.length === 0" class="state-card">
        <span class="material-symbols-outlined">calendar_month</span>
        <p>No reservations match the current filters for {{ monthLabel }}.</p>
      </div>

      <template v-else>
        <ReservationCalendar
          v-if="viewMode === 'calendar'"
          :month="monthCursor"
          :entries="calendarEntries"
          empty-label="No arrivals"
          :admin="true"
          @event-click="handleCalendarClick"
        />

        <div v-else class="table-card">
          <table class="data-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Hotel</th>
                <th>Stay</th>
                <th>Guest</th>
                <th>Total</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="reservation in reservations" :key="reservation.id">
                <td class="mono">{{ reservation.confirmationCode }}</td>
                <td>
                  <strong>{{ hotelName(reservation.hotelId) }}</strong>
                  <small>{{ hotelCity(reservation.hotelId) }}</small>
                </td>
                <td>{{ formatDate(reservation.checkInDate) }} - {{ formatDate(reservation.checkOutDate) }}</td>
                <td>Client #{{ reservation.accountId }}</td>
                <td>{{ formatCurrency(reservation.totalAmount) }}</td>
                <td>
                  <span class="status-pill" :class="statusClass(reservation.status)">
                    {{ formatStatus(reservation.status) }}
                  </span>
                </td>
                <td class="actions">
                  <button @click="confirmReservation(reservation.id)" title="Confirm">
                    <span class="material-symbols-outlined">check</span>
                  </button>
                  <button @click="cancelReservation(reservation.id)" title="Cancel">
                    <span class="material-symbols-outlined">block</span>
                  </button>
                  <button @click="deleteReservation(reservation.id)" title="Delete">
                    <span class="material-symbols-outlined">delete</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <!-- Reservation Details Modal -->
      <transition name="modal">
        <div v-if="showDetailsModal && selectedReservation" class="modal-overlay" @click="closeDetails">
          <div class="modal-content" @click.stop>
            <div class="modal-header">
              <h3>Reservation Details</h3>
              <button @click="closeDetails" class="close-btn">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="detail-label">Confirmation Code</span>
                  <strong>{{ selectedReservation.confirmationCode }}</strong>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Hotel</span>
                  <strong>{{ hotelName(selectedReservation.hotelId) }}</strong>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Location</span>
                  <strong>{{ hotelCity(selectedReservation.hotelId) }}</strong>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Check-in</span>
                  <strong>{{ formatDate(selectedReservation.checkInDate) }}</strong>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Check-out</span>
                  <strong>{{ formatDate(selectedReservation.checkOutDate) }}</strong>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Total Amount</span>
                  <strong>{{ formatCurrency(selectedReservation.totalAmount) }}</strong>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Status</span>
                  <span class="status-pill" :class="statusClass(selectedReservation.status)">
                    {{ formatStatus(selectedReservation.status) }}
                  </span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">User</span>
                  <strong>{{ userName(selectedReservation) }}</strong>
                </div>
                <div class="detail-item" v-if="selectedReservation.paymentStatus">
                  <span class="detail-label">Payment Status</span>
                  <strong>{{ selectedReservation.paymentStatus }}</strong>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button @click="confirmReservation(selectedReservation.id)" class="btn-confirm" v-if="selectedReservation.status === 'PENDING'">
                Confirm
              </button>
              <button @click="cancelReservation(selectedReservation.id)" class="btn-cancel">
                Cancel
              </button>
              <button @click="deleteReservation(selectedReservation.id)" class="btn-delete">
                Delete
              </button>
              <button @click="closeDetails" class="btn-close">
                Close
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { Hotel, Reservation } from '~/types/models'
import { ReservationStatus } from '~/types/enums'
import { HotelService } from '~/services/HotelService'
import { ReservationService } from '~/services/ReservationService'

definePageMeta({ layout: 'admin' })

const reservationService = new ReservationService()
const hotelService = new HotelService()

const reservations = ref<Reservation[]>([])
const hotels = ref<Hotel[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const viewMode = ref<'table' | 'calendar'>('calendar')
const search = ref('')
const statusFilter = ref<ReservationStatus | ''>('')
const monthCursor = ref(currentMonthKey())
const showDetailsModal = ref(false)
const selectedReservation = ref<Reservation | null>(null)

const statusOptions = [
  { value: ReservationStatus.CONFIRMED, label: 'Confirmed' },
  { value: ReservationStatus.PENDING, label: 'Pending' },
  { value: ReservationStatus.COMPLETED, label: 'Completed' },
  { value: ReservationStatus.CANCELLED, label: 'Cancelled' },
  { value: ReservationStatus.BLOCKED, label: 'Blocked' },
  { value: ReservationStatus.REFUSED, label: 'Refused' },
]

const confirmedCount = computed(() =>
  reservations.value.filter((reservation) => reservation.status === ReservationStatus.CONFIRMED).length,
)
const revenueLabel = computed(() =>
  formatCurrency(reservations.value.reduce((sum, reservation) => sum + reservation.totalAmount, 0)),
)
const monthLabel = computed(() =>
  new Date(`${monthCursor.value}-01T00:00:00.000Z`).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  }),
)

const calendarEntries = computed(() =>
  reservations.value.map((reservation) => ({
    id: reservation.id,
    title: hotelName(reservation.hotelId),
    subtitle: `Client #${reservation.accountId} - ${reservation.confirmationCode}`,
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

function hotelName(hotelId: number) {
  return hotels.value.find((hotel) => hotel.id === hotelId)?.name ?? `Hotel #${hotelId}`
}

function hotelCity(hotelId: number) {
  const hotel = hotels.value.find((item) => item.id === hotelId)
  return hotel ? `${hotel.city}, ${hotel.country}` : 'Unknown location'
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(value))
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(value))
}

function userName(reservation: any) {
  const profile = reservation.account?.profile
  if (profile?.firstName || profile?.lastName) {
    return `${profile.firstName || ''} ${profile.lastName || ''}`.trim()
  }
  return `User #${reservation.accountId}`
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatStatus(status: ReservationStatus) {
  return status.charAt(0) + status.slice(1).toLowerCase()
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

async function loadReservations() {
  loading.value = true
  error.value = null

  try {
    const range = monthRange(monthCursor.value)
    const [response, nextHotels] = await Promise.all([
      reservationService.fetchPaginated({
        page: 1,
        limit: 200,
        search: search.value.trim() || undefined,
        status: statusFilter.value || undefined,
        start: range.start,
        end: range.end,
      }),
      hotels.value.length ? Promise.resolve(hotels.value) : hotelService.getAll(),
    ])

    reservations.value = response.items
    hotels.value = nextHotels
  } catch (cause: any) {
    error.value = cause.message || 'Unable to load reservations.'
  } finally {
    loading.value = false
  }
}

async function confirmReservation(id: number) {
  await reservationService.confirm(id)
  await loadReservations()
}

async function cancelReservation(id: number) {
  await reservationService.cancel(id)
  await loadReservations()
}

async function deleteReservation(id: number) {
  if (!window.confirm('Delete this reservation?')) return
  await reservationService.delete(id)
  await loadReservations()
}

watch([search, statusFilter, monthCursor], () => {
  loadReservations()
})

function handleCalendarClick(entry: any) {
  selectedReservation.value = reservations.value.find(r => r.id === entry.id) || null
  showDetailsModal.value = true
}

function closeDetails() {
  showDetailsModal.value = false
  selectedReservation.value = null
}

onMounted(loadReservations)
</script>

<style scoped>
.admin-page { padding: 2.5rem; }
.page-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 1.5rem; margin-bottom: 1.2rem; flex-wrap: wrap; }
.page-eyebrow { font-size: 0.6875rem; text-transform: uppercase; letter-spacing: 0.08em; color: #6d7979; font-weight: 600; margin: 0; }
.page-title { font-size: 1.625rem; font-weight: 700; color: #015081; margin: 0.25rem 0; }
.page-desc { font-size: 0.875rem; color: #3d4949; margin: 0; max-width: 64ch; }
.header-actions { display: flex; gap: 0.8rem; align-items: center; flex-wrap: wrap; }
.month-nav { display: inline-flex; align-items: center; gap: 0.55rem; background: #fff; border: 1px solid #d8e3eb; border-radius: 999px; padding: 0.3rem 0.45rem; }
.month-nav button, .actions button { width: 34px; height: 34px; border-radius: 10px; border: none; background: transparent; color: #3d4949; cursor: pointer; }
.month-nav strong { min-width: 144px; text-align: center; color: #015081; font-size: 0.88rem; }
.view-toggle { display: inline-flex; padding: 0.25rem; background: #fff; border: 1px solid #d8e3eb; border-radius: 999px; }
.view-toggle button { border: none; background: transparent; color: #3d4949; padding: 0.55rem 0.95rem; border-radius: 999px; font-size: 0.84rem; font-weight: 700; cursor: pointer; }
.view-toggle--active { background: #006768 !important; color: #fff !important; }
.toolbar { display: grid; grid-template-columns: minmax(0, 1fr) 220px; gap: 0.8rem; margin-bottom: 1rem; }
.search-field { position: relative; }
.search-field .material-symbols-outlined { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #6d7979; }
.search-field input, .toolbar select { width: 100%; border: 1px solid #bcc9c8; border-radius: 0.85rem; padding: 0.78rem 0.9rem; font-size: 0.88rem; outline: none; background: #fff; }
.search-field input { padding-left: 46px; }
.search-field input:focus, .toolbar select:focus { border-color: #008F90; box-shadow: 0 0 0 2px rgba(0,143,144,0.12); }
.summary-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.8rem; margin-bottom: 1rem; }
.summary-card { background: #fff; border: 1px solid #e1e9f0; border-radius: 0.875rem; padding: 1rem 1.1rem; box-shadow: 0 1px 4px rgba(1,80,129,0.06); }
.summary-card span { display: block; color: #6d7979; font-size: 0.72rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; }
.summary-card strong { display: block; margin-top: 0.45rem; color: #015081; font-size: 1.4rem; }
.alert-error, .state-card { display: flex; align-items: center; justify-content: center; gap: 0.6rem; min-height: 180px; background: #fff; border: 1px solid #e1e9f0; border-radius: 0.875rem; box-shadow: 0 1px 4px rgba(1,80,129,0.06); color: #3d4949; }
.alert-error { min-height: auto; justify-content: flex-start; padding: 0.9rem 1rem; color: #ba1a1a; margin-bottom: 1rem; background: #fdecea; border-color: transparent; }
.table-card { background: #fff; border: 1px solid #e1e9f0; border-radius: 0.875rem; overflow: hidden; box-shadow: 0 1px 4px rgba(1,80,129,0.06); }
.data-table { width: 100%; border-collapse: collapse; }
.data-table th { text-align: left; padding: 0.9rem 1rem; font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #6d7979; background: #f5faff; }
.data-table td { padding: 1rem; border-top: 1px solid #edf2f7; font-size: 0.88rem; color: #151d22; vertical-align: top; }
.data-table td small { display: block; margin-top: 0.25rem; color: #6d7979; }
.mono { font-family: var(--font-family-mono); font-weight: 700; color: #015081; }
.status-pill { display: inline-flex; align-items: center; justify-content: center; border-radius: 999px; padding: 0.32rem 0.65rem; font-size: 0.72rem; font-weight: 800; }
.status-pill--confirmed { background: #ecfdf3; color: #027a48; }
.status-pill--completed { background: #eff8ff; color: #175cd3; }
.status-pill--pending { background: #fffaeb; color: #b54708; }
.status-pill--cancelled { background: #f2f4f7; color: #344054; }
.status-pill--blocked { background: #fef3f2; color: #b42318; }
.actions { display: flex; gap: 0.35rem; justify-content: flex-end; }
.actions button:hover, .month-nav button:hover { background: #edf5fc; color: #006768; }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #ddd;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.modal-body {
  padding: 20px;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

@media (max-width: 600px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
}

.detail-item {
  display: flex;
  flex-direction: column;
}

.detail-label {
  font-size: 0.8rem;
  color: #666;
  text-transform: uppercase;
  margin-bottom: 5px;
}

.detail-item strong {
  font-size: 1rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 20px;
  border-top: 1px solid #ddd;
}

.btn-confirm, .btn-cancel, .btn-delete, .btn-close {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn-confirm {
  background: #28a745;
  color: white;
}

.btn-cancel {
  background: #ffc107;
  color: black;
}

.btn-delete {
  background: #dc3545;
  color: white;
}

.btn-close {
  background: #6c757d;
  color: white;
}

.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content, .modal-leave-active .modal-content {
  transition: transform 0.3s;
}

.modal-enter-from .modal-content, .modal-leave-to .modal-content {
  transform: scale(0.9);
}
@media (max-width: 980px) {
  .toolbar, .summary-grid { grid-template-columns: 1fr; }
  .month-nav strong { min-width: 110px; }
  .table-card { overflow-x: auto; }
}
</style>
