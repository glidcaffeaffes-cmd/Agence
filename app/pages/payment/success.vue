<template>
  <div class="payment-result">
    <section class="card" v-if="loading">
      <h1>Payment Successful</h1>
      <p>Finalizing your reservation details...</p>
    </section>

    <section class="card" v-else-if="summary">
      <h1>Payment Successful</h1>
      <p>Your reservation has been confirmed successfully.</p>

      <div class="summary-grid">
        <div class="summary-item">
          <span>Booking reference</span>
          <strong>{{ summary.bookingReference }}</strong>
        </div>
        <div class="summary-item">
          <span>Hotel name</span>
          <strong>{{ summary.hotelName }}</strong>
        </div>
        <div class="summary-item">
          <span>Room name</span>
          <strong>{{ summary.roomName }}</strong>
        </div>
        <div class="summary-item">
          <span>Dates</span>
          <strong>{{ formatDate(summary.checkIn) }} - {{ formatDate(summary.checkOut) }}</strong>
        </div>
        <div class="summary-item summary-item--full">
          <span>Total paid</span>
          <strong>{{ formatCurrency(summary.totalPaid) }}</strong>
        </div>
      </div>

      <p class="redirect-text">Redirecting to My Bookings...</p>
    </section>

    <section class="card card--error" v-else>
      <h1>Payment Successful</h1>
      <p>{{ errorMessage || 'We are still confirming your payment. Please check your bookings shortly.' }}</p>
      <NuxtLink class="link" to="/my-bookings">Go to My Bookings</NuxtLink>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

import { onMounted, ref } from 'vue'
import type { CheckoutSessionSummary } from '~/types/interfaces'
import { useAuth } from '~/composables/useAuth'
import { useReservations } from '~/composables/useReservations'

const route = useRoute()
const { accountId } = useAuth()
const { getCheckoutSessionSummary } = useReservations()

const summary = ref<CheckoutSessionSummary | null>(null)
const loading = ref(true)
const errorMessage = ref('')

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

onMounted(async () => {
  const sessionId = typeof route.query.session_id === 'string' ? route.query.session_id : ''

  if (!sessionId) {
    errorMessage.value = 'Missing payment session details.'
    loading.value = false
    return
  }

  if (!accountId.value) {
    errorMessage.value = 'You must be signed in to view this payment result.'
    loading.value = false
    return
  }

  const data = await getCheckoutSessionSummary(sessionId, accountId.value)

  if (!data) {
    errorMessage.value = 'Unable to load payment details right now.'
    loading.value = false
    return
  }

  summary.value = data
  loading.value = false

  setTimeout(() => {
    navigateTo('/my-bookings')
  }, 3500)
})
</script>

<style scoped>
.payment-result {
  min-height: calc(100vh - 120px);
  display: grid;
  place-items: center;
  padding: 24px;
}

.card {
  width: min(680px, 100%);
  border-radius: 16px;
  border: 1px solid var(--color-border, #dbe5ec);
  background: var(--color-surface, #ffffff);
  padding: 28px;
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.08);
}

.card--error {
  border-color: #fed7aa;
  background: #fff7ed;
}

h1 {
  margin: 0 0 10px;
  color: var(--color-heading, #0f172a);
}

p {
  margin: 0;
  color: var(--color-text-soft, #475569);
}

.summary-grid {
  margin-top: 18px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.summary-item {
  border: 1px solid var(--color-border-soft, #e2e8f0);
  border-radius: 12px;
  padding: 12px;
  background: var(--color-surface-2, #f8fafc);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.summary-item span {
  color: var(--color-text-muted, #64748b);
  font-size: 0.82rem;
}

.summary-item strong {
  color: var(--color-heading, #0f172a);
  font-size: 0.96rem;
}

.summary-item--full {
  grid-column: 1 / -1;
}

.redirect-text {
  margin-top: 16px;
  font-weight: 600;
  color: var(--color-primary-700, #005051);
}

.link {
  margin-top: 16px;
  display: inline-block;
  text-decoration: none;
  background: var(--color-primary-600, #006768);
  color: #ffffff;
  padding: 10px 14px;
  border-radius: 10px;
  font-weight: 700;
}

@media (max-width: 640px) {
  .summary-grid {
    grid-template-columns: 1fr;
  }
}
</style>
