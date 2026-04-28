<template>
  <div class="booking-page">
    <Head>
      <title>Complete Booking - VoyageHub</title>
      <meta name="description" content="Review your booking and pay securely with Stripe." />
    </Head>

    <section class="booking-card">
      <h1>Complete your booking</h1>
      <p class="subtitle">Review details and continue to Stripe Checkout.</p>

      <div v-if="!selectedHotel" class="state state--warning">
        Please select a hotel before paying.
      </div>

      <div v-else class="details-grid">
        <article class="detail-box">
          <h2>{{ selectedHotel.name }}</h2>
          <p>{{ selectedHotel.city }}, {{ selectedHotel.country }}</p>
          <p>{{ selectedHotel.stars }}-star hotel</p>
        </article>

        <article class="detail-box">
          <h3>Stay</h3>
          <p>Check-in: {{ displayCheckIn }}</p>
          <p>Check-out: {{ displayCheckOut }}</p>
          <p>Nights: {{ nights }}</p>
        </article>

        <article class="detail-box">
          <h3>Guest</h3>
          <p>{{ guestName }}</p>
          <p>{{ guestEmail }}</p>
          <p>{{ guestPhone }}</p>
        </article>

        <article class="detail-box">
          <h3>Estimated total</h3>
          <p class="amount">{{ estimatedTotalLabel }}</p>
          <small>Final validation occurs on backend before Stripe session creation.</small>
        </article>
      </div>

      <button
        class="pay-button"
        :disabled="!selectedHotel || isPaying"
        @click="payNow"
      >
        {{ isPaying ? 'Redirecting to Stripe...' : 'Pay Now' }}
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
  checkInDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
)
const displayCheckOut = computed(() =>
  checkOutDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
)

const guestName = computed(() => {
  const profile = currentProfile.value
  if (profile?.firstName || profile?.lastName) {
    return `${profile.firstName || ''} ${profile.lastName || ''}`.trim()
  }

  return currentAccount.value?.email.split('@')[0] || 'VoyageHub Guest'
})

const guestEmail = computed(() => currentAccount.value?.email || 'No email available')
const guestPhone = computed(() => currentProfile.value?.phone || 'No phone provided')

const estimatedTotalLabel = computed(() => {
  if (estimatedTotal.value === null) {
    return 'Loading...'
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(estimatedTotal.value)
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
    errorMessage.value = 'No hotel selected.'
    return
  }

  if (!accountId.value) {
    errorMessage.value = 'You must be signed in to continue.'
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
      throw new Error('No available room found for this stay window.')
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
      throw new Error('Unable to create booking.')
    }

    const session = await createCheckoutSession({
      tripId: selectedHotel.value.id,
      userId: accountId.value,
      totalPrice: booking.pricing.total,
      bookingId: booking.bookingId,
    })

    if (!session?.url) {
      throw new Error('Unable to create Stripe checkout session.')
    }

    if (typeof window !== 'undefined') {
      sessionStorage.setItem(PAYMENT_RESULT_ACCESS_KEY, '1')
    }
    window.location.assign(session.url)
  } catch (error: any) {
    errorMessage.value = error?.message || 'Payment failed. Please try again.'
  } finally {
    isPaying.value = false
  }
}

onMounted(refreshEstimate)
watch(selectedHotel, refreshEstimate)
</script>

<style scoped>
.booking-page {
  min-height: calc(100vh - 120px);
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
  padding: 40px 16px;
}

.booking-card {
  max-width: 920px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.08);
  padding: 28px;
}

h1 {
  margin: 0;
  font-size: 2rem;
  color: #0f172a;
}

.subtitle {
  margin: 8px 0 18px;
  color: #475569;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.detail-box {
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 14px;
  background: #f8fafc;
}

.detail-box h2,
.detail-box h3 {
  margin: 0 0 8px;
  color: #0f172a;
}

.detail-box p {
  margin: 0 0 6px;
  color: #334155;
}

.amount {
  font-size: 1.2rem;
  font-weight: 700;
}

.pay-button {
  margin-top: 20px;
  width: 100%;
  border: none;
  border-radius: 12px;
  padding: 14px;
  background: #0f172a;
  color: #ffffff;
  font-weight: 700;
  cursor: pointer;
}

.pay-button:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.state {
  padding: 14px;
  border-radius: 12px;
  margin-bottom: 14px;
}

.state--warning {
  background: #fff7ed;
  border: 1px solid #fed7aa;
  color: #9a3412;
}

.error-text {
  margin-top: 10px;
  color: #b91c1c;
  font-weight: 600;
}

@media (max-width: 768px) {
  .details-grid {
    grid-template-columns: 1fr;
  }
}
</style>
