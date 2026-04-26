<template>
  <div class="contact-page">
    <Head>
      <title>Contact Support - VoyageHub</title>
      <meta
        name="description"
        content="Contact VoyageHub support with your booking reference."
      />
    </Head>

    <div class="contact-shell">
      <header class="contact-header">
        <h1>Contact Support</h1>
        <p>
          Submit a booking-related support request and our team will follow up.
        </p>
      </header>

      <section class="contact-grid">
        <article class="contact-info">
          <h2>Support Channels</h2>
          <ul>
            <li>
              <span class="material-symbols-outlined">mail</span>
              support@voyagehub.com
            </li>
            <li>
              <span class="material-symbols-outlined">call</span>
              +33 1 84 00 00 00
            </li>
            <li>
              <span class="material-symbols-outlined">schedule</span>
              Mon-Fri, 09:00-18:00
            </li>
          </ul>
          <p class="contact-note">
            For faster handling, submit your request with the correct booking
            reference below.
          </p>
        </article>

        <article class="contact-form-card">
          <form class="contact-form" @submit.prevent="submitTicket">
            <label>
              <span>Booking</span>
              <select v-model.number="reservationId" required>
                <option :value="0" disabled>Select a booking</option>
                <option
                  v-for="reservation in reservations"
                  :key="reservation.id"
                  :value="reservation.id"
                >
                  {{ formatReservationLabel(reservation) }}
                </option>
              </select>
            </label>

            <label>
              <span>Subject</span>
              <input
                v-model.trim="subject"
                type="text"
                placeholder="Short summary of your issue"
                maxlength="120"
                required
              />
            </label>

            <label>
              <span>Message</span>
              <textarea
                v-model.trim="message"
                rows="6"
                placeholder="Please provide detailed information so we can help quickly."
                minlength="20"
                required
              />
            </label>

            <button type="submit" :disabled="submitting || loading">
              {{ submitting ? 'Submitting...' : 'Send Request' }}
            </button>
          </form>

          <p v-if="successMessage" class="status-text status-text--success">
            {{ successMessage }}
          </p>
          <p v-if="errorMessage" class="status-text status-text--error">
            {{ errorMessage }}
          </p>
          <p
            v-if="!loading && reservations.length === 0"
            class="status-text status-text--info"
          >
            No bookings found. You can still browse available stays from
            <NuxtLink to="/hotels">Hotels</NuxtLink>.
          </p>
        </article>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

import { onMounted, ref } from 'vue'
import type { Reservation } from '~/types/models'
import { useAuth } from '~/composables/useAuth'
import { useReservations } from '~/composables/useReservations'

const { accountId } = useAuth()
const { fetchPaginated } = useReservations()

const loading = ref(true)
const submitting = ref(false)
const reservations = ref<Reservation[]>([])

const reservationId = ref(0)
const subject = ref('')
const message = ref('')

const successMessage = ref('')
const errorMessage = ref('')

function formatDate(value: string) {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(parsed)
}

function formatStatus(value: string) {
  const normalized = value.toLowerCase()
  if (normalized === 'confirmee' || normalized === 'confirmed') return 'Confirmed'
  if (normalized === 'en_attente' || normalized === 'pending') return 'Pending'
  if (normalized === 'annulee' || normalized === 'cancelled') return 'Cancelled'
  if (normalized === 'terminee' || normalized === 'completed') return 'Completed'
  if (normalized === 'refusee' || normalized === 'refused') return 'Refused'
  if (normalized === 'bloquee' || normalized === 'blocked') return 'Blocked'
  return 'Booked'
}

function formatReservationLabel(reservation: Reservation) {
  const checkIn = formatDate(reservation.checkInDate)
  const checkOut = formatDate(reservation.checkOutDate)
  const status = formatStatus(String(reservation.status || ''))
  const amount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(reservation.totalAmount || 0)
  return `${checkIn} to ${checkOut} - ${status} - ${amount}`
}

async function loadReservations() {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await fetchPaginated({
      page: 1,
      limit: 100,
      accountId: accountId.value,
    })
    reservations.value = response.items
    if (reservations.value.length > 0) {
      reservationId.value = reservations.value[0].id
    }
  } catch (error: any) {
    errorMessage.value = error?.message || 'Unable to load your bookings.'
  } finally {
    loading.value = false
  }
}

async function submitTicket() {
  successMessage.value = ''
  errorMessage.value = ''

  if (!reservationId.value) {
    errorMessage.value = 'Please select a booking.'
    return
  }

  if (!subject.value) {
    errorMessage.value = 'Please add a subject.'
    return
  }

  if (message.value.length < 20) {
    errorMessage.value = 'Message must be at least 20 characters.'
    return
  }

  submitting.value = true
  try {
    const response = await $fetch<{ ticketId: number }>('/api/support/contact', {
      method: 'POST',
      body: {
        accountId: accountId.value,
        reservationId: reservationId.value,
        subject: subject.value,
        message: message.value,
      },
    })

    successMessage.value = `Support request sent successfully. Ticket #${response.ticketId}.`
    message.value = ''
    subject.value = ''
  } catch (error: any) {
    errorMessage.value =
      error?.data?.message ||
      error?.message ||
      'Unable to submit your support request.'
  } finally {
    submitting.value = false
  }
}

onMounted(loadReservations)
</script>

<style scoped>
.contact-page {
  background:
    radial-gradient(circle at top, color-mix(in srgb, var(--color-primary-50) 70%, white 30%) 0%, transparent 50%),
    linear-gradient(180deg, var(--color-gray-50) 0%, white 100%);
  min-height: calc(100vh - 140px);
}

.contact-shell {
  max-width: 1120px;
  margin: 0 auto;
  padding: 40px 24px 56px;
}

.contact-header h1 {
  margin: 0;
  color: var(--color-navy-500);
  font-size: clamp(2rem, 3vw, 2.45rem);
  font-weight: 800;
  letter-spacing: -0.02em;
}

.contact-header p {
  margin: 8px 0 0;
  color: var(--color-gray-500);
  font-weight: 600;
}

.contact-grid {
  margin-top: 18px;
  display: grid;
  grid-template-columns: 0.95fr 1.35fr;
  gap: 14px;
}

.contact-info,
.contact-form-card {
  background: white;
  border: 1px solid color-mix(in srgb, var(--color-gray-200) 74%, white 26%);
  border-radius: 20px;
  padding: 22px;
  box-shadow: 0 16px 30px rgba(15, 23, 42, 0.06);
}

.contact-info h2 {
  margin: 0;
  color: var(--color-navy-500);
  font-size: 1.15rem;
  font-weight: 800;
}

.contact-info ul {
  margin: 14px 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 10px;
}

.contact-info li {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--color-gray-600);
  font-weight: 600;
}

.contact-note {
  margin: 16px 0 0;
  color: var(--color-gray-500);
  line-height: 1.6;
  font-size: 0.92rem;
}

.contact-form {
  display: grid;
  gap: 12px;
}

.contact-form label {
  display: grid;
  gap: 6px;
}

.contact-form label > span {
  color: var(--color-navy-500);
  font-weight: 700;
  font-size: 0.86rem;
}

.contact-form input,
.contact-form textarea,
.contact-form select {
  border: 1px solid color-mix(in srgb, var(--color-gray-200) 74%, white 26%);
  border-radius: 12px;
  background: white;
  color: var(--color-gray-700);
  font: inherit;
  padding: 11px 12px;
  outline: none;
}

.contact-form input:focus,
.contact-form textarea:focus,
.contact-form select:focus {
  border-color: color-mix(in srgb, var(--color-primary-300) 72%, white 28%);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary-100) 62%, transparent 38%);
}

.contact-form button {
  border: 0;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--color-primary-600), var(--color-primary-500));
  color: white;
  padding: 11px 14px;
  font-size: 0.92rem;
  font-weight: 800;
  cursor: pointer;
}

.contact-form button:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.status-text {
  margin: 12px 0 0;
  font-size: 0.9rem;
  font-weight: 600;
}

.status-text--success {
  color: #027a48;
}

.status-text--error {
  color: #b42318;
}

.status-text--info {
  color: var(--color-gray-500);
}

.status-text :deep(a) {
  color: var(--color-primary-600);
  text-decoration: none;
  font-weight: 700;
}

.status-text :deep(a:hover) {
  text-decoration: underline;
}

@media (max-width: 900px) {
  .contact-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .contact-shell {
    padding: 28px 16px 40px;
  }

  .contact-info,
  .contact-form-card {
    border-radius: 16px;
    padding: 18px;
  }
}
</style>
