<template>
  <div class="payment-result">
    <section class="card">
      <h1>Payment Failed</h1>
      <p>Your payment could not be completed.</p>
      <p>Please try again or use another payment method.</p>

      <button class="retry-btn" :disabled="retrying" @click="retryPayment">
        {{ retrying ? 'Retrying...' : 'Retry Payment' }}
      </button>

      <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

import { ref } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useReservations } from '~/composables/useReservations'

const route = useRoute()
const { accountId } = useAuth()
const { createCheckoutSession, fetchById, reservation, error } = useReservations()

const retrying = ref(false)
const errorMessage = ref('')

async function retryPayment() {
  errorMessage.value = ''

  const bookingId = Number.parseInt(String(route.query.booking_id || ''), 10)
  if (!Number.isFinite(bookingId) || bookingId <= 0) {
    errorMessage.value = 'We could not identify the booking to retry payment.'
    return
  }

  if (!accountId.value) {
    errorMessage.value = 'You must be signed in to retry payment.'
    return
  }

  retrying.value = true

  try {
    await fetchById(bookingId)

    if (!reservation.value) {
      throw new Error('Booking not found.')
    }

    const session = await createCheckoutSession({
      tripId: reservation.value.hotelId,
      userId: accountId.value,
      totalPrice: reservation.value.totalAmount,
      bookingId,
    })

    if (!session?.url) {
      throw new Error('Unable to initialize Stripe checkout.')
    }

    window.location.assign(session.url)
  } catch (err: any) {
    errorMessage.value = err?.message || error.value || 'Unable to retry payment. Please try again.'
  } finally {
    retrying.value = false
  }
}
</script>

<style scoped>
.payment-result {
  min-height: calc(100vh - 120px);
  display: grid;
  place-items: center;
  padding: 24px;
}

.card {
  width: min(560px, 100%);
  border-radius: 16px;
  border: 1px solid #fed7aa;
  background: #fff7ed;
  padding: 28px;
  text-align: center;
}

h1 {
  margin: 0 0 10px;
  color: #9a3412;
}

p {
  margin: 0;
  color: #7c2d12;
}

p + p {
  margin-top: 6px;
}

.retry-btn {
  margin-top: 20px;
  border: none;
  border-radius: 10px;
  background: #9a3412;
  color: #ffffff;
  font-weight: 700;
  padding: 11px 16px;
  cursor: pointer;
}

.retry-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.error-text {
  margin-top: 12px;
  color: #b91c1c;
  font-weight: 600;
}
</style>
