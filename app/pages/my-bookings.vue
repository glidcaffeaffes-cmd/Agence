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
          </div>
        </article>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

import { computed, onMounted, ref } from 'vue'
import type { Reservation } from '~/types/models'
import { ReservationStatus } from '~/types/enums'
import { useAuth } from '~/composables/useAuth'
import { useReservations } from '~/composables/useReservations'
import { useHotels } from '~/composables/useHotels'

const { accountId } = useAuth()
const { fetchPaginated } = useReservations()
const { hotels, fetchAll: fetchHotels } = useHotels()

const bookings = ref<Reservation[]>([])
const loading = ref(true)
const errorMessage = ref('')

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
  } catch (error: any) {
    errorMessage.value = error?.message || 'Failed to load booking data.'
  } finally {
    loading.value = false
  }
}

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
}
</style>
