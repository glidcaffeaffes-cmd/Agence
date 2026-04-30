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
        <h1>{{ t("paymentResult.failedTitle") }}</h1>
        <p class="status-message">
          {{ t("paymentResult.failedDescription") }}
        </p>
      </header>

      <div class="actions">
        <NuxtLink class="btn-primary" to="/my-bookings">
          {{ t("paymentResult.goToBookings") }}
        </NuxtLink>
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
const { t } = useAppI18n()
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
    errorMessage.value = t('paymentResult.failedBookingMissing')
    return
  }

  if (!accountId.value) {
    errorMessage.value = t('paymentResult.failedSignInRequired')
    return
  }

  try {
    await cancelUnpaidBooking({
      bookingId,
      userId: accountId.value,
    })
  } catch (err: any) {
    errorMessage.value =
      err?.message || t('paymentResult.failedCleanupError')
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
    radial-gradient(
      circle at 50% -20%,
      color-mix(in srgb, var(--color-danger-50) 80%, transparent) 0%,
      var(--color-bg-soft) 54%,
      var(--color-surface) 100%
    );
}

.card {
  width: min(680px, 100%);
  padding: 30px 28px 24px;
  border: 1px solid color-mix(in srgb, var(--color-danger-200) 45%, var(--color-border));
  border-radius: 20px;
  background: var(--color-surface);
  box-shadow: var(--shadow-lg);
}

h1 {
  margin: 0 0 8px;
  color: var(--color-text-primary);
  font-size: clamp(1.9rem, 4vw, 2.5rem);
  line-height: 1.02;
  letter-spacing: -0.03em;
}

p {
  margin: 0;
  color: var(--color-text-secondary);
}

.status-hero {
  text-align: center;
}

.status-icon-wrap {
  position: relative;
  display: grid;
  place-items: center;
  width: 98px;
  height: 98px;
  margin: 0 auto 14px;
}

.status-icon-glow {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  background: radial-gradient(
    circle at center,
    rgb(220 38 38 / 0.24) 0%,
    rgb(220 38 38 / 0.12) 56%,
    transparent 76%
  );
  animation: haloPulse 2.8s ease-in-out infinite;
}

.status-icon {
  display: grid;
  place-items: center;
  width: 78px;
  height: 78px;
  border-radius: 999px;
  background: linear-gradient(145deg, #b91c1c, #ef4444);
  box-shadow:
    0 12px 22px rgb(185 28 28 / 0.26),
    inset 0 1px 0 rgb(255 255 255 / 0.35);
  animation:
    popIn 420ms cubic-bezier(0.2, 0.8, 0.2, 1),
    breathe 3.2s ease-in-out 480ms infinite;
}

.status-icon .material-symbols-outlined {
  color: var(--color-white);
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
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 20px;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 22px;
  border-radius: 12px;
  background: var(--color-text-primary);
  color: var(--color-white);
  font-size: 1rem;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 10px 22px rgb(15 23 42 / 0.18);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 26px rgb(15 23 42 / 0.24);
}

.error-text {
  margin-top: 12px;
  color: var(--color-danger-700);
  font-size: 0.95rem;
  font-weight: 600;
  text-align: center;
}

@keyframes popIn {
  0% {
    opacity: 0;
    transform: scale(0.86);
  }

  100% {
    opacity: 1;
    transform: scale(1);
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
    opacity: 0.5;
    transform: scale(0.95);
  }

  50% {
    opacity: 0.78;
    transform: scale(1);
  }

  100% {
    opacity: 0.5;
    transform: scale(0.95);
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

  .btn-primary {
    width: 100%;
  }
}
</style>
