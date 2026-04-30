<template>
  <div class="booking-page">
    <section class="booking-card">
      <h1>{{ t("checkoutPage.title") }}</h1>
      <p class="subtitle">{{ t("checkoutPage.subtitle") }}</p>

      <div v-if="!selectedHotel" class="state state--warning">
        {{ t("checkoutPage.missingHotel") }}
      </div>

      <div v-else class="details-grid">
        <article class="detail-box">
          <h2>{{ selectedHotel.name }}</h2>
          <p>{{ selectedHotel.city }}, {{ selectedHotel.country }}</p>
          <p>{{ t("checkoutPage.starHotel", { count: selectedHotel.stars }) }}</p>
        </article>

        <article class="detail-box">
          <h3>{{ t("checkoutPage.stay") }}</h3>
          <p>{{ t("checkoutPage.checkIn") }}: {{ displayCheckIn }}</p>
          <p>{{ t("checkoutPage.checkOut") }}: {{ displayCheckOut }}</p>
          <p>{{ t("checkoutPage.nights") }}: {{ nights }}</p>
        </article>

        <article class="detail-box">
          <h3>{{ t("checkoutPage.guest") }}</h3>
          <p>{{ guestName }}</p>
          <p>{{ guestEmail }}</p>
          <p>{{ guestPhone }}</p>
        </article>

        <article class="detail-box">
          <h3>{{ t("checkoutPage.estimatedTotal") }}</h3>
          <p class="amount">{{ estimatedTotalLabel }}</p>
          <small>{{ t("checkoutPage.estimateNote") }}</small>
        </article>
      </div>

      <button
        class="pay-button"
        :disabled="!selectedHotel || isPaying"
        @click="payNow"
      >
        {{ isPaying ? t("checkoutPage.redirecting") : t("checkoutPage.payNow") }}
      </button>

      <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

import { computed, onMounted, ref, watch } from 'vue'
import { RoomService } from '~/services'
import { useAuth } from '~/composables/useAuth'
import { useHotels } from '~/composables/useHotels'
import { useReservations } from '~/composables/useReservations'

const roomService = new RoomService()
const { selectedHotel } = useHotels()
const { accountId, currentAccount, currentProfile } = useAuth()
const { createBooking, createCheckoutSession } = useReservations()
const { t, formatDate, formatCurrency } = useAppI18n()
const PAYMENT_RESULT_ACCESS_KEY = 'vh_payment_result_access'

const isPaying = ref(false)
const errorMessage = ref('')
const estimatedTotal = ref<number | null>(null)

const checkInDate = new Date()
checkInDate.setDate(checkInDate.getDate() + 7)
checkInDate.setHours(0, 0, 0, 0)

const checkOutDate = new Date(checkInDate)
checkOutDate.setDate(checkOutDate.getDate() + 3)

const checkInIso = computed(() => checkInDate.toISOString())
const checkOutIso = computed(() => checkOutDate.toISOString())

const nights = computed(() => {
  const diff = checkOutDate.getTime() - checkInDate.getTime()
  return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)))
})

const displayCheckIn = computed(() =>
  formatDate(checkInDate, { month: 'short', day: 'numeric', year: 'numeric' }),
)

const displayCheckOut = computed(() =>
  formatDate(checkOutDate, { month: 'short', day: 'numeric', year: 'numeric' }),
)

const guestName = computed(() => {
  const profile = currentProfile.value
  if (profile?.firstName || profile?.lastName) {
    return `${profile.firstName || ''} ${profile.lastName || ''}`.trim()
  }

  return currentAccount.value?.email.split('@')[0] || t('checkoutPage.guestFallback')
})

const guestEmail = computed(() => currentAccount.value?.email || t('checkoutPage.noEmail'))
const guestPhone = computed(() => currentProfile.value?.phone || t('checkoutPage.noPhone'))

const estimatedTotalLabel = computed(() => {
  if (estimatedTotal.value === null) {
    return t('checkoutPage.loadingAmount')
  }

  return formatCurrency(estimatedTotal.value, 'USD', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  })
})

async function refreshEstimate() {
  if (!selectedHotel.value) {
    estimatedTotal.value = null
    return
  }

  try {
    const rooms = await roomService.getAvailable(
      selectedHotel.value.id,
      checkInIso.value,
      checkOutIso.value,
    )
    const room = rooms[0]

    if (!room) {
      estimatedTotal.value = null
      return
    }

    const roomPrice = room.pricePerNight * nights.value
    const taxes = 5 * nights.value
    estimatedTotal.value = Number((roomPrice + taxes).toFixed(2))
  } catch {
    estimatedTotal.value = null
  }
}

async function payNow() {
  errorMessage.value = ''

  if (!selectedHotel.value) {
    errorMessage.value = t('checkoutPage.noHotelSelected')
    return
  }

  if (!accountId.value) {
    errorMessage.value = t('checkoutPage.signInRequired')
    return
  }

  isPaying.value = true

  try {
    const rooms = await roomService.getAvailable(
      selectedHotel.value.id,
      checkInIso.value,
      checkOutIso.value,
    )
    const room = rooms[0]

    if (!room) {
      throw new Error(t('checkoutPage.noAvailableRoom'))
    }

    const booking = await createBooking({
      hotelId: selectedHotel.value.id,
      roomId: room.id,
      checkIn: checkInIso.value,
      checkOut: checkOutIso.value,
      adults: 2,
      children: 0,
      fullName: guestName.value,
      email: guestEmail.value,
      phone: guestPhone.value,
      accountId: accountId.value,
    })

    if (!booking) {
      throw new Error(t('checkoutPage.bookingCreateFailed'))
    }

    const session = await createCheckoutSession({
      tripId: selectedHotel.value.id,
      userId: accountId.value,
      totalPrice: booking.pricing.total,
      bookingId: booking.bookingId,
    })

    if (!session?.url) {
      throw new Error(t('checkoutPage.stripeSessionFailed'))
    }

    if (typeof window !== 'undefined') {
      sessionStorage.setItem(PAYMENT_RESULT_ACCESS_KEY, '1')
      window.location.assign(session.url)
    }
  } catch (error: any) {
    errorMessage.value = error?.message || t('checkoutPage.paymentFailed')
  } finally {
    isPaying.value = false
  }
}

onMounted(refreshEstimate)
watch(selectedHotel, refreshEstimate)

useHead(() => ({
  title: t('checkoutPage.metaTitle'),
  meta: [
    {
      name: 'description',
      content: t('checkoutPage.metaDescription'),
    },
  ],
}))
</script>

<style scoped>
.booking-page {
  min-height: calc(100vh - 120px);
  padding: 40px 16px;
  background:
    radial-gradient(
      circle at top,
      color-mix(in srgb, var(--color-primary-50) 60%, transparent) 0%,
      transparent 48%
    ),
    linear-gradient(180deg, var(--color-bg-soft) 0%, var(--color-surface) 100%);
}

.booking-card {
  width: min(920px, 100%);
  margin: 0 auto;
  padding: 28px;
  border: 1px solid var(--color-border-soft);
  border-radius: 20px;
  background: var(--color-surface);
  box-shadow: var(--shadow-lg);
}

h1 {
  margin: 0;
  color: var(--color-text-primary);
  font-size: 2rem;
}

.subtitle {
  margin: 8px 0 18px;
  color: var(--color-text-secondary);
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.detail-box {
  padding: 14px;
  border: 1px solid var(--color-border-soft);
  border-radius: 14px;
  background: var(--color-surface-secondary);
}

.detail-box h2,
.detail-box h3 {
  margin: 0 0 8px;
  color: var(--color-text-primary);
}

.detail-box p,
.detail-box small {
  color: var(--color-text-secondary);
}

.detail-box p {
  margin: 0 0 6px;
}

.amount {
  color: var(--color-text-primary);
  font-size: 1.2rem;
  font-weight: 700;
}

.pay-button {
  width: 100%;
  margin-top: 20px;
  padding: 14px;
  border: none;
  border-radius: 12px;
  background: var(--color-text-primary);
  color: var(--color-white);
  font-weight: 700;
  cursor: pointer;
}

.pay-button:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.state {
  margin-bottom: 14px;
  padding: 14px;
  border-radius: 12px;
}

.state--warning {
  border: 1px solid var(--alert-warning-border);
  background: var(--alert-warning-bg);
  color: var(--alert-warning-text);
}

.error-text {
  margin-top: 10px;
  color: var(--color-danger-600);
  font-weight: 600;
}

@media (max-width: 768px) {
  .details-grid {
    grid-template-columns: 1fr;
  }
}
</style>
