<template>
  <div>
    <Head>
      <title>Book Your Stay — VoyageHub</title>
      <meta name="description" content="Complete your hotel reservation securely with VoyageHub." />
    </Head>

    <!-- Progress header -->
    <section class="booking-hero">
      <div class="hero-inner">
        <NuxtLink :to="`/hotels/${route.query.hotelId || ''}`" class="back-link">
          <span class="material-symbols-outlined">arrow_back</span> Back to hotel
        </NuxtLink>
        <h1 class="hero-title">Complete Your Reservation</h1>
        <div class="steps">
          <div v-for="(step, i) in steps" :key="i" :class="['step', { 'step--active': currentStep === i, 'step--done': currentStep > i }]">
            <span class="step-num">{{ currentStep > i ? '✓' : i + 1 }}</span>
            <span class="step-label">{{ step }}</span>
          </div>
        </div>
      </div>
    </section>

    <div class="booking-body">
      <div class="booking-grid">
        <!-- Left: Form -->
        <div class="form-side">

          <!-- Step 1: Dates & Guests -->
          <div v-if="currentStep === 0" class="form-card">
            <h2 class="form-card-title">
              <span class="material-symbols-outlined">calendar_month</span> Stay Details
            </h2>
            <div class="field-row">
              <div class="field-group">
                <label class="field-label" for="book-checkin">Check-in date</label>
                <input id="book-checkin" v-model="form.checkInDate" class="field-input" type="date" :min="today" required />
              </div>
              <div class="field-group">
                <label class="field-label" for="book-checkout">Check-out date</label>
                <input id="book-checkout" v-model="form.checkOutDate" class="field-input" type="date" :min="form.checkInDate || today" required />
              </div>
            </div>
            <div class="field-group">
              <label class="field-label" for="book-roomtype">Room type</label>
              <select id="book-roomtype" v-model="form.roomId" class="field-input" required>
                <option value="">Select a room type</option>
                <option v-for="room in rooms" :key="room.id" :value="room.id">
                  {{ room.type }} — {{ formatCurrency(room.pricePerNight) }}/night
                </option>
              </select>
            </div>
            <button class="step-btn" :disabled="!form.checkInDate || !form.checkOutDate || !form.roomId" @click="currentStep = 1">
              Continue <span class="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>

          <!-- Step 2: Guest Info -->
          <div v-if="currentStep === 1" class="form-card">
            <h2 class="form-card-title">
              <span class="material-symbols-outlined">person</span> Guest Information
            </h2>
            <div class="field-row">
              <div class="field-group">
                <label class="field-label" for="book-fn">First name</label>
                <input id="book-fn" v-model="guestInfo.firstName" class="field-input" type="text" placeholder="Jean" required />
              </div>
              <div class="field-group">
                <label class="field-label" for="book-ln">Last name</label>
                <input id="book-ln" v-model="guestInfo.lastName" class="field-input" type="text" placeholder="Dupont" required />
              </div>
            </div>
            <div class="field-group">
              <label class="field-label" for="book-email">Email</label>
              <input id="book-email" v-model="guestInfo.email" class="field-input" type="email" placeholder="jean@email.com" required />
            </div>
            <div class="field-group">
              <label class="field-label" for="book-phone">Phone</label>
              <input id="book-phone" v-model="guestInfo.phone" class="field-input" type="tel" placeholder="+33 6 00 00 00 00" />
            </div>
            <div class="field-group">
              <label class="field-label" for="book-requests">Special requests</label>
              <textarea id="book-requests" v-model="guestInfo.requests" class="field-input field-textarea" placeholder="Any special requests or notes for the hotel…"></textarea>
            </div>
            <div class="step-row">
              <button class="step-btn step-btn--ghost" @click="currentStep = 0">
                <span class="material-symbols-outlined">arrow_back</span> Back
              </button>
              <button class="step-btn" @click="currentStep = 2">
                Continue <span class="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>

          <!-- Step 3: Payment (mock) -->
          <div v-if="currentStep === 2" class="form-card">
            <h2 class="form-card-title">
              <span class="material-symbols-outlined">credit_card</span> Payment Details
            </h2>
            <div class="field-group">
              <label class="field-label" for="book-card">Card number</label>
              <input id="book-card" v-model="payment.cardNumber" class="field-input" type="text" placeholder="•••• •••• •••• ••••" maxlength="19" />
            </div>
            <div class="field-row">
              <div class="field-group">
                <label class="field-label" for="book-expiry">Expiry date</label>
                <input id="book-expiry" v-model="payment.expiry" class="field-input" type="text" placeholder="MM/YY" maxlength="5" />
              </div>
              <div class="field-group">
                <label class="field-label" for="book-cvv">CVV</label>
                <input id="book-cvv" v-model="payment.cvv" class="field-input" type="text" placeholder="•••" maxlength="3" />
              </div>
            </div>
            <div class="secure-badge">
              <span class="material-symbols-outlined">lock</span>
              Secured by 256-bit SSL encryption
            </div>
            <div class="step-row">
              <button class="step-btn step-btn--ghost" @click="currentStep = 1">
                <span class="material-symbols-outlined">arrow_back</span> Back
              </button>
              <button id="book-confirm-btn" class="step-btn step-btn--gold" :disabled="loading" @click="handleSubmit">
                <span v-if="loading" class="material-symbols-outlined spin">progress_activity</span>
                <span v-else>Confirm Booking</span>
              </button>
            </div>
          </div>

          <!-- Step 4: Confirmation -->
          <div v-if="currentStep === 3" class="confirm-card">
            <span class="material-symbols-outlined confirm-icon">check_circle</span>
            <h2 class="confirm-title">Reservation Confirmed!</h2>
            <p class="confirm-subtitle">Your booking is confirmed. A summary has been sent to your email.</p>
            <div class="confirm-code">
              <span>Confirmation Code</span>
              <strong>{{ confirmationCode }}</strong>
            </div>
            <div class="confirm-actions">
              <NuxtLink to="/reservations" class="step-btn">View My Bookings</NuxtLink>
              <NuxtLink to="/hotels" class="step-btn step-btn--ghost">Explore More Hotels</NuxtLink>
            </div>
          </div>
        </div>

        <!-- Right: Summary -->
        <aside class="summary-side">
          <div class="summary-card" v-if="currentStep < 3">
            <h3 class="summary-title">Booking Summary</h3>
            <div class="summary-hotel">
              <span class="material-symbols-outlined">hotel</span>
              <div>
                <p class="summary-label">Hotel</p>
                <p class="summary-value">{{ hotelName }}</p>
              </div>
            </div>
            <div v-if="form.checkInDate" class="summary-row">
              <span>Check-in</span><strong>{{ formatDate(form.checkInDate) }}</strong>
            </div>
            <div v-if="form.checkOutDate" class="summary-row">
              <span>Check-out</span><strong>{{ formatDate(form.checkOutDate) }}</strong>
            </div>
            <div v-if="nightCount > 0" class="summary-row">
              <span>Nights</span><strong>{{ nightCount }}</strong>
            </div>
            <div v-if="selectedRoom" class="summary-row">
              <span>Room</span><strong>{{ selectedRoom.type }}</strong>
            </div>
            <div class="summary-divider"></div>
            <div class="summary-total">
              <span>Total</span>
              <strong>{{ formatCurrency(totalAmount) }}</strong>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useReservations } from '~/composables/useReservations'
import { useRooms } from '~/composables/useRooms'
import { useAuth } from '~/composables/useAuth'

const route = useRoute()
const router = useRouter()
const { create, loading } = useReservations()
const { rooms, fetchByHotel } = useRooms()
const { accountId } = useAuth()

const currentStep = ref(0)
const confirmationCode = ref('')
const steps = ['Stay Details', 'Guest Info', 'Payment', 'Confirmation']

const today = new Date().toISOString().split('T')[0]

const form = ref({ checkInDate: '', checkOutDate: '', roomId: '' as string | number })
const guestInfo = ref({ firstName: '', lastName: '', email: '', phone: '', requests: '' })
const payment = ref({ cardNumber: '', expiry: '', cvv: '' })

const hotelId = computed(() => Number(route.query.hotelId) || 1)
const hotelName = computed(() => `Hotel #${hotelId.value}`)

const selectedRoom = computed(() => rooms.value.find(r => r.id === Number(form.value.roomId)) || null)

const nightCount = computed(() => {
  if (!form.value.checkInDate || !form.value.checkOutDate) return 0
  const diff = new Date(form.value.checkOutDate).getTime() - new Date(form.value.checkInDate).getTime()
  return Math.max(0, Math.ceil(diff / 86400000))
})

const totalAmount = computed(() => {
  if (!selectedRoom.value || nightCount.value === 0) return 0
  return selectedRoom.value.pricePerNight * nightCount.value
})

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}
function formatCurrency(n: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n)
}

async function handleSubmit() {
  const result = await create({
    accountId: accountId.value || 1,
    roomId: Number(form.value.roomId),
    hotelId: hotelId.value,
    reservationDate: today,
    checkInDate: form.value.checkInDate,
    checkOutDate: form.value.checkOutDate,
    numberOfNights: nightCount.value,
    totalAmount: totalAmount.value,
    status: 'PENDING' as any,
  })
  if (result) {
    confirmationCode.value = result.confirmationCode
    currentStep.value = 3
  }
}

onMounted(() => fetchByHotel(hotelId.value))
</script>

<style scoped>
.booking-hero {
  background: linear-gradient(135deg, #015081 0%, #006768 100%);
  padding: 2.5rem 2rem 2rem;
}
.hero-inner { max-width: 1100px; margin: 0 auto; }
.back-link {
  display: inline-flex; align-items: center; gap: 0.375rem;
  color: rgba(255,255,255,0.7); font-size: 0.8125rem; font-weight: 600;
  text-decoration: none; margin-bottom: 1rem; transition: color 0.15s;
}
.back-link:hover { color: #fff; }
.back-link .material-symbols-outlined { font-size: 1rem; }
.hero-title { font-size: 1.75rem; font-weight: 700; color: #fff; margin: 0 0 1.5rem; letter-spacing: -0.02em; }

.steps { display: flex; align-items: center; gap: 0; }
.step {
  display: flex; align-items: center; gap: 0.5rem;
  color: rgba(255,255,255,0.5); font-size: 0.8125rem; font-weight: 600;
  padding-right: 2rem; position: relative;
}
.step:not(:last-child)::after {
  content: ''; position: absolute; right: 0.75rem;
  width: 1rem; height: 1px; background: rgba(255,255,255,0.3);
}
.step--active { color: #CDAF5D; }
.step--done { color: rgba(255,255,255,0.8); }
.step-num {
  width: 1.5rem; height: 1.5rem; border-radius: 50%;
  background: rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center;
  font-size: 0.75rem; font-weight: 700;
}
.step--active .step-num { background: #CDAF5D; color: #015081; }
.step--done .step-num { background: #006768; }

.booking-body { max-width: 1100px; margin: 0 auto; padding: 2.5rem 2rem; }
.booking-grid { display: grid; grid-template-columns: 1fr 340px; gap: 2rem; align-items: start; }
@media (max-width: 768px) { .booking-grid { grid-template-columns: 1fr; } }

.form-card, .summary-card {
  background: #fff; border-radius: 0.875rem;
  box-shadow: 0 1px 4px rgba(1,80,129,0.06), 0 4px 16px rgba(1,80,129,0.04);
  padding: 1.75rem;
}
.form-card-title {
  display: flex; align-items: center; gap: 0.5rem;
  font-size: 1.0625rem; font-weight: 700; color: #015081; margin: 0 0 1.5rem;
}
.form-card-title .material-symbols-outlined { font-size: 1.25rem; color: #006768; }

.field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }
.field-group { display: flex; flex-direction: column; gap: 0.375rem; margin-bottom: 1rem; }
.field-label { font-size: 0.8125rem; font-weight: 600; color: #151d22; }
.field-input {
  padding: 0.625rem 0.875rem; border: 1px solid #bcc9c8; border-radius: 0.5rem;
  font-size: 0.875rem; color: #151d22; background: #fff; outline: none;
  transition: border-color 0.15s, box-shadow 0.15s; font-family: 'Inter', sans-serif;
  width: 100%;
}
.field-input:focus { border-color: #008F90; box-shadow: 0 0 0 2px rgba(0,143,144,0.15); }
.field-textarea { min-height: 100px; resize: vertical; }

.secure-badge {
  display: flex; align-items: center; gap: 0.5rem;
  background: #e0f2f1; color: #006768;
  padding: 0.5rem 0.875rem; border-radius: 0.5rem;
  font-size: 0.8125rem; font-weight: 600; margin: 0.5rem 0 1.25rem;
}
.secure-badge .material-symbols-outlined { font-size: 1rem; }

.step-row { display: flex; justify-content: space-between; gap: 1rem; margin-top: 0.5rem; }
.step-btn {
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.6875rem 1.375rem;
  background: linear-gradient(135deg, #006768 0%, #008283 100%);
  color: #fff; font-weight: 700; font-size: 0.875rem;
  border: none; border-radius: 0.5rem; cursor: pointer;
  text-decoration: none; transition: opacity 0.15s, transform 0.15s;
  font-family: 'Inter', sans-serif;
}
.step-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
.step-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.step-btn--ghost {
  background: transparent; border: 1.5px solid #bcc9c8; color: #006768;
}
.step-btn--ghost:hover { background: #edf5fc; }
.step-btn--gold { background: linear-gradient(135deg, #CDAF5D 0%, #b89a48 100%); color: #015081; }
@keyframes spin { to { transform: rotate(360deg); } }
.spin { animation: spin 0.8s linear infinite; }

/* Summary */
.summary-title { font-size: 1rem; font-weight: 700; color: #015081; margin: 0 0 1.25rem; }
.summary-hotel {
  display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem;
  padding-bottom: 1.25rem; border-bottom: 1px solid #e1e9f0;
}
.summary-hotel .material-symbols-outlined { font-size: 2rem; color: #6d7979; }
.summary-label { font-size: 0.6875rem; color: #6d7979; font-weight: 600; text-transform: uppercase; margin: 0; }
.summary-value { font-size: 0.9375rem; font-weight: 700; color: #151d22; margin: 0.125rem 0 0; }
.summary-row {
  display: flex; justify-content: space-between; align-items: center;
  font-size: 0.875rem; color: #3d4949; margin-bottom: 0.625rem;
}
.summary-row strong { color: #151d22; }
.summary-divider { height: 1px; background: #e1e9f0; margin: 1rem 0; }
.summary-total {
  display: flex; justify-content: space-between; align-items: center;
  font-size: 1.0625rem; font-weight: 700; color: #015081;
}

/* Confirmation */
.confirm-card {
  background: #fff; border-radius: 0.875rem;
  box-shadow: 0 1px 4px rgba(1,80,129,0.06), 0 4px 16px rgba(1,80,129,0.04);
  padding: 3rem 2rem; text-align: center;
}
.confirm-icon { font-size: 4rem; color: #006768; display: block; margin-bottom: 1rem; font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
.confirm-title { font-size: 1.5rem; font-weight: 700; color: #151d22; margin: 0 0 0.5rem; }
.confirm-subtitle { font-size: 0.9375rem; color: #6d7979; margin: 0 0 2rem; }
.confirm-code {
  display: inline-flex; flex-direction: column; gap: 0.25rem;
  background: #edf5fc; border-radius: 0.75rem; padding: 1rem 2rem; margin-bottom: 2rem;
}
.confirm-code span { font-size: 0.75rem; color: #6d7979; font-weight: 600; text-transform: uppercase; }
.confirm-code strong { font-size: 1.5rem; color: #015081; letter-spacing: 0.08em; font-family: monospace; }
.confirm-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
</style>
