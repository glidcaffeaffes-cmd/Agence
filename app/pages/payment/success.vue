<template>
  <div class="payment-result">
    <section class="card" v-if="loading">
      <h1>Finalizing Payment</h1>
      <p>We are preparing your reservation confirmation.</p>
    </section>

    <section class="card" v-else-if="summary">
      <header class="success-hero">
        <div class="success-icon-wrap" aria-hidden="true">
          <div class="success-icon-glow"></div>
          <div class="success-icon">
            <span class="material-symbols-outlined">check_circle</span>
          </div>
        </div>
        <h1>Thank You</h1>
        <p class="success-message">
          Your payment was successful and your reservation is confirmed.
        </p>
      </header>

      <div class="actions">
        <NuxtLink class="btn-primary" to="/my-bookings"
          >Go to My Bookings</NuxtLink
        >
      </div>
    </section>

    <section class="card card--error" v-else>
      <h1>Thank You</h1>
      <p>
        {{
          errorMessage ||
          "Payment was received, but we could not load the confirmation details right now."
        }}
      </p>
      <div class="actions">
        <NuxtLink class="btn-primary" to="/my-bookings"
          >Go to My Bookings</NuxtLink
        >
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "auth", hideFooter: true });

import { onMounted, ref } from "vue";
import { useAuth } from "~/composables/useAuth";
import { useReservations } from "~/composables/useReservations";

const route = useRoute();
const { accountId } = useAuth();
const { getCheckoutSessionSummary } = useReservations();
const PAYMENT_RESULT_ACCESS_KEY = "vh_payment_result_access";

const summary = ref<any | null>(null);
const loading = ref(true);
const errorMessage = ref("");

onMounted(async () => {
  const hasAccess =
    typeof window !== "undefined" &&
    sessionStorage.getItem(PAYMENT_RESULT_ACCESS_KEY) === "1";

  if (typeof window !== "undefined") {
    sessionStorage.removeItem(PAYMENT_RESULT_ACCESS_KEY);
  }

  if (!hasAccess) {
    await navigateTo("/");
    return;
  }

  const sessionId =
    typeof route.query.session_id === "string" ? route.query.session_id : "";

  if (!sessionId) {
    await navigateTo("/");
    return;
  }

  if (!accountId.value) {
    await navigateTo("/");
    return;
  }

  const data = await getCheckoutSessionSummary(sessionId, accountId.value);

  if (!data) {
    errorMessage.value = "Unable to load payment details right now.";
    loading.value = false;
    return;
  }

  summary.value = data;
  loading.value = false;
});
</script>

<style scoped>
.payment-result {
  min-height: calc(100vh - 180px);
  display: grid;
  place-items: center;
  padding: 32px 20px 40px;
}

.card {
  width: min(760px, 100%);
  border-radius: 22px;
  border: 1px solid var(--color-border, #dbe5ec);
  background: var(--color-surface, #ffffff);
  padding: 36px 32px 30px;
  box-shadow:
    0 16px 40px rgba(15, 23, 42, 0.08),
    0 6px 16px rgba(15, 23, 42, 0.04);
  position: relative;
  overflow: hidden;
}

.card--error {
  border-color: var(--color-border, #dbe5ec);
  background: var(--color-surface, #ffffff);
}

h1 {
  margin: 0 0 10px;
  color: var(--color-heading, #0f172a);
}

p {
  margin: 0;
  color: var(--color-text-soft, #475569);
}

.success-hero {
  text-align: center;
  margin-bottom: 0;
}

.success-icon-wrap {
  position: relative;
  width: 122px;
  height: 122px;
  margin: 0 auto 18px;
  display: grid;
  place-items: center;
}

.success-icon-glow {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  background: radial-gradient(
    circle at center,
    color-mix(in oklab, var(--color-success-700, #15803d) 18%, white) 0%,
    color-mix(in oklab, var(--color-success-700, #15803d) 6%, white) 58%,
    transparent 76%
  );
  animation: haloPulse 2.8s ease-in-out infinite;
}

.success-icon {
  position: relative;
  width: 96px;
  height: 96px;
  border-radius: 999px;
  background: linear-gradient(
    145deg,
    color-mix(in oklab, var(--color-success-700, #15803d) 82%, white),
    color-mix(in oklab, var(--color-success-600, #16a34a) 74%, white)
  );
  box-shadow:
    0 12px 24px
      color-mix(in oklab, var(--color-success-700, #15803d) 24%, transparent),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
  display: grid;
  place-items: center;
  animation:
    popIn 420ms cubic-bezier(0.2, 0.8, 0.2, 1),
    breathe 3.2s ease-in-out 480ms infinite;
}

.success-icon .material-symbols-outlined {
  color: #fff;
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
  margin-top: 24px;
  display: flex;
  justify-content: center;
}

.btn-primary {
  display: inline-block;
  text-decoration: none;
  background: linear-gradient(
    135deg,
    var(--color-primary-600, #006768),
    var(--color-primary-700, #005051)
  );
  color: #ffffff;
  padding: 13px 26px;
  border-radius: 14px;
  font-weight: 700;
  font-size: 1.02rem;
  box-shadow: 0 12px 24px rgba(0, 103, 104, 0.2);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 28px rgba(0, 103, 104, 0.24);
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
    border-radius: 999px;
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
