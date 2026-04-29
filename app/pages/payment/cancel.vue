<template>
  <div class="payment-result">
    <section class="card">
      <header class="status-hero">
        <div class="status-icon-wrap" aria-hidden="true">
          <div class="status-icon-glow"></div>
          <div class="status-icon">
            <span class="material-symbols-outlined">error</span>
          </div>
        </div>
        <h1>Payment Failed</h1>
        <p class="status-message">
          Your payment could not be completed. Please retry payment or check your bookings.
        </p>
      </header>

      <div class="actions">
        <NuxtLink class="btn-primary" to="/my-bookings">Go to My Bookings</NuxtLink>
      </div>

      <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth', hideFooter: true })

import { onMounted, ref } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useReservations } from '~/composables/useReservations'

const route = useRoute()
const { accountId } = useAuth()
const { cancelUnpaidBooking } = useReservations()
const PAYMENT_RESULT_ACCESS_KEY = 'vh_payment_result_access'

const errorMessage = ref('')

onMounted(async () => {
  const hasAccess =
    typeof window !== 'undefined' &&
    sessionStorage.getItem(PAYMENT_RESULT_ACCESS_KEY) === '1'

  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(PAYMENT_RESULT_ACCESS_KEY)
  }

  if (!hasAccess) {
    await navigateTo('/')
    return
  }

  const bookingId = Number.parseInt(String(route.query.booking_id || ''), 10)
  if (!Number.isFinite(bookingId) || bookingId <= 0) {
    errorMessage.value = 'We could not identify the booking that failed payment.'
    return
  }

  if (!accountId.value) {
    errorMessage.value = 'You must be signed in to complete payment cleanup.'
    return
  }

  try {
    await cancelUnpaidBooking({
      bookingId,
      userId: accountId.value,
    })
  } catch (err: any) {
    errorMessage.value = err?.message || 'Unable to clean up the failed payment booking.'
  }
})
</script>

<style scoped>
.payment-result {
  min-height: calc(100vh - 180px);
  display: grid;
  place-items: center;
  padding: 28px 20px 34px;
  background:
    radial-gradient(circle at 50% -20%, #fff6f4 0%, #f8fafc 54%, #f5f7fb 100%);
}

.card {
  width: min(680px, 100%);
  border-radius: 20px;
  border: 1px solid #f1d9d2;
  background: #ffffff;
  padding: 30px 28px 24px;
  box-shadow:
    0 16px 36px rgba(15, 23, 42, 0.08),
    0 4px 10px rgba(15, 23, 42, 0.04);
}

h1 {
  margin: 0 0 8px;
  color: #0f172a;
  font-size: clamp(1.9rem, 4vw, 2.5rem);
  line-height: 1.02;
  letter-spacing: -0.03em;
}

p {
  margin: 0;
  color: #475569;
}

.status-hero {
  text-align: center;
}

.status-icon-wrap {
  position: relative;
  width: 98px;
  height: 98px;
  margin: 0 auto 14px;
  display: grid;
  place-items: center;
}

.status-icon-glow {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  background: radial-gradient(
    circle at center,
    rgba(220, 38, 38, 0.24) 0%,
    rgba(220, 38, 38, 0.12) 56%,
    transparent 76%
  );
  animation: haloPulse 2.8s ease-in-out infinite;
}

.status-icon {
  width: 78px;
  height: 78px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: linear-gradient(
    145deg,
    #b91c1c,
    #ef4444
  );
  box-shadow:
    0 12px 22px rgba(185, 28, 28, 0.26),
    inset 0 1px 0 rgba(255, 255, 255, 0.35);
  animation:
    popIn 420ms cubic-bezier(0.2, 0.8, 0.2, 1),
    breathe 3.2s ease-in-out 480ms infinite;
}

.status-icon .material-symbols-outlined {
  color: #ffffff;
  font-size: 42px;
  font-variation-settings:
    "FILL" 1,
    "wght" 700,
    "GRAD" 0,
    "opsz" 24;
}

.status-message {
  max-width: 560px;
  margin: 0 auto;
  font-size: clamp(1rem, 2vw, 1.1rem);
  line-height: 1.58;
}

.actions {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary {
  border: none;
  border-radius: 12px;
  padding: 12px 22px;
  font-weight: 700;
  font-size: 1rem;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-primary {
  background: #0f172a;
  color: #ffffff;
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.18);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 26px rgba(15, 23, 42, 0.24);
}

.btn-secondary {
  background: #fff7f5;
  border: 1px solid #f3d1c8;
  color: #9a3412;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease;
}

.btn-secondary:hover:not(:disabled) {
  background: #ffece6;
  border-color: #efb9a8;
}

.btn-secondary:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.error-text {
  margin-top: 12px;
  text-align: center;
  color: #b91c1c;
  font-weight: 600;
  font-size: 0.95rem;
}

@keyframes popIn {
  0% {
    transform: scale(0.86);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes breathe {
  0%,
  100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-4px) scale(1.02);
  }
}

@keyframes haloPulse {
  0% {
    transform: scale(0.95);
    opacity: 0.5;
  }
  50% {
    transform: scale(1);
    opacity: 0.78;
  }
  100% {
    transform: scale(0.95);
    opacity: 0.5;
  }
}

@media (max-width: 640px) {
  .payment-result {
    padding: 16px 14px 24px;
  }

  .card {
    padding: 24px 16px 20px;
    border-radius: 16px;
  }

  .status-icon-wrap {
    width: 90px;
    height: 90px;
    margin-bottom: 12px;
  }

  .status-icon {
    width: 72px;
    height: 72px;
  }

  .status-icon .material-symbols-outlined {
    font-size: 38px;
  }

  .actions {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
}
</style>
