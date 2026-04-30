<template>
  <div class="payment-result">
    <section class="card" v-if="loading">
      <h1>{{ t("paymentResult.loadingTitle") }}</h1>
      <p>{{ t("paymentResult.loadingDescription") }}</p>
    </section>

    <section class="card" v-else-if="summary">
      <header class="success-hero">
        <div class="success-icon-wrap" aria-hidden="true">
          <div class="success-icon-glow"></div>
          <div class="success-icon">
            <span class="material-symbols-outlined">check_circle</span>
          </div>
        </div>
        <h1>{{ t("paymentResult.successTitle") }}</h1>
        <p class="success-message">
          {{ t("paymentResult.successDescription") }}
        </p>
      </header>

      <div class="actions">
        <NuxtLink class="btn-primary" to="/my-bookings">
          {{ t("paymentResult.goToBookings") }}
        </NuxtLink>
      </div>
    </section>

    <section class="card card--error" v-else>
      <h1>{{ t("paymentResult.successTitle") }}</h1>
      <p>{{ errorMessage || t("paymentResult.fallbackDescription") }}</p>
      <div class="actions">
        <NuxtLink class="btn-primary" to="/my-bookings">
          {{ t("paymentResult.goToBookings") }}
        </NuxtLink>
      </div>
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
const { getCheckoutSessionSummary } = useReservations()
const { t } = useAppI18n()
const PAYMENT_RESULT_ACCESS_KEY = 'vh_payment_result_access'

const summary = ref<any | null>(null)
const loading = ref(true)
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

  const sessionId =
    typeof route.query.session_id === 'string' ? route.query.session_id : ''

  if (!sessionId || !accountId.value) {
    await navigateTo('/')
    return
  }

  const data = await getCheckoutSessionSummary(sessionId, accountId.value)

  if (!data) {
    errorMessage.value = t('paymentResult.unableToLoad')
    loading.value = false
    return
  }

  summary.value = data
  loading.value = false
})
</script>

<style scoped>
.payment-result {
  min-height: calc(100vh - 180px);
  display: grid;
  place-items: center;
  padding: 32px 20px 40px;
}

.card {
  position: relative;
  overflow: hidden;
  width: min(760px, 100%);
  padding: 36px 32px 30px;
  border: 1px solid var(--color-border);
  border-radius: 22px;
  background: var(--color-surface);
  box-shadow: var(--shadow-lg);
}

.card--error {
  background: var(--color-surface);
}

h1 {
  margin: 0 0 10px;
  color: var(--color-text-primary);
}

p {
  margin: 0;
  color: var(--color-text-secondary);
}

.success-hero {
  margin-bottom: 0;
  text-align: center;
}

.success-icon-wrap {
  position: relative;
  display: grid;
  place-items: center;
  width: 122px;
  height: 122px;
  margin: 0 auto 18px;
}

.success-icon-glow {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  background: radial-gradient(
    circle at center,
    color-mix(in oklab, var(--color-success-700) 18%, white) 0%,
    color-mix(in oklab, var(--color-success-700) 6%, transparent) 58%,
    transparent 76%
  );
  animation: haloPulse 2.8s ease-in-out infinite;
}

.success-icon {
  position: relative;
  display: grid;
  place-items: center;
  width: 96px;
  height: 96px;
  border-radius: 999px;
  background: linear-gradient(
    145deg,
    color-mix(in oklab, var(--color-success-700) 82%, white),
    color-mix(in oklab, var(--color-success-600) 74%, white)
  );
  box-shadow:
    0 12px 24px color-mix(in oklab, var(--color-success-700) 24%, transparent),
    inset 0 1px 0 rgb(255 255 255 / 0.5);
  animation:
    popIn 420ms cubic-bezier(0.2, 0.8, 0.2, 1),
    breathe 3.2s ease-in-out 480ms infinite;
}

.success-icon .material-symbols-outlined {
  color: var(--color-white);
  font-size: 56px;
  font-variation-settings:
    "FILL" 1,
    "wght" 700,
    "GRAD" 0,
    "opsz" 24;
}

.success-hero h1 {
  margin-bottom: 10px;
  font-size: clamp(2.1rem, 5vw, 3.1rem);
  line-height: 0.98;
  letter-spacing: -0.04em;
}

.success-message {
  max-width: 660px;
  margin: 0 auto;
  font-size: clamp(1.08rem, 2.2vw, 1.22rem);
  line-height: 1.65;
}

.actions {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

.btn-primary {
  display: inline-block;
  padding: 13px 26px;
  border-radius: 14px;
  background: linear-gradient(
    135deg,
    var(--color-primary-600),
    var(--color-primary-700)
  );
  color: var(--color-white);
  font-size: 1.02rem;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 12px 24px rgb(0 103 104 / 0.2);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 28px rgb(0 103 104 / 0.24);
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
    padding: 18px 14px 28px;
  }

  .card {
    padding: 28px 18px 24px;
    border-radius: 20px;
  }

  .success-icon-wrap {
    width: 104px;
    height: 104px;
    margin-bottom: 14px;
  }

  .success-icon {
    width: 84px;
    height: 84px;
  }

  .success-icon .material-symbols-outlined {
    font-size: 50px;
  }

  .btn-primary {
    width: 100%;
    text-align: center;
  }
}
</style>
