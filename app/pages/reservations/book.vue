<template>
  <div class="min-h-[calc(100vh-80px)] bg-surface pb-24">
    <Head>
      <title>Book Your Stay — VoyageHub</title>
      <meta name="description" content="Complete your hotel reservation securely with VoyageHub." />
    </Head>

    <!-- Progress header -->
    <section class="bg-gradient-to-r from-primary to-primary-container text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542314831-c6a4d14d8373?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
      <div class="max-w-7xl mx-auto relative z-10">
        <NuxtLink :to="`/hotels/${route.query.hotelId || ''}`" class="inline-flex items-center gap-2 text-primary-fixed hover:text-white transition-colors mb-6 font-medium">
          <span class="material-symbols-outlined text-[20px]">arrow_back</span> Back to hotel
        </NuxtLink>
        <h1 class="text-3xl md:text-4xl font-bold tracking-tight mb-8">Complete Your Reservation</h1>
        
        <!-- Stepper -->
        <div class="flex items-center max-w-3xl">
          <template v-for="(step, i) in steps" :key="i">
            <!-- Step Circle -->
            <div class="flex flex-col items-center relative z-10">
              <div 
                class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 shadow-sm"
                :class="[
                  currentStep > i ? 'bg-primary-fixed text-primary' : 
                  currentStep === i ? 'bg-white text-primary ring-4 ring-primary-fixed/30' : 
                  'bg-white/20 text-white/70 border border-white/30'
                ]"
              >
                <span v-if="currentStep > i" class="material-symbols-outlined text-[20px]">check</span>
                <span v-else>{{ i + 1 }}</span>
              </div>
              <span 
                class="absolute -bottom-6 text-xs font-medium whitespace-nowrap transition-colors duration-300"
                :class="currentStep >= i ? 'text-white' : 'text-white/60'"
              >
                {{ step }}
              </span>
            </div>
            
            <!-- Step Line -->
            <div v-if="i < steps.length - 1" class="flex-1 h-1 mx-2 rounded-full transition-colors duration-300"
                 :class="currentStep > i ? 'bg-primary-fixed' : 'bg-white/20'">
            </div>
          </template>
        </div>
      </div>
    </section>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
      <div class="flex flex-col lg:flex-row gap-8 items-start">
        <!-- Left: Form -->
        <div class="flex-1 w-full">

          <!-- Step 1: Dates & Guests -->
          <transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 translate-x-4" enter-to-class="opacity-100 translate-x-0" leave-active-class="hidden" leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="currentStep === 0" class="bg-white rounded-2xl border border-outline-variant/40 shadow-sm p-6 sm:p-8">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <span class="material-symbols-outlined">calendar_month</span>
                </div>
                <h2 class="text-xl font-bold text-on-surface">Stay Details</h2>
              </div>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-on-surface" for="book-checkin">Check-in Date</label>
                  <input id="book-checkin" v-model="form.checkInDate" type="date" :min="today" required
                         class="w-full px-4 py-3 rounded-xl border border-outline-variant/60 bg-surface-container-lowest text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                </div>
                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-on-surface" for="book-checkout">Check-out Date</label>
                  <input id="book-checkout" v-model="form.checkOutDate" type="date" :min="form.checkInDate || today" required
                         class="w-full px-4 py-3 rounded-xl border border-outline-variant/60 bg-surface-container-lowest text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                </div>
              </div>
              
              <div class="space-y-2 mb-8">
                <label class="block text-sm font-semibold text-on-surface" for="book-roomtype">Room Type</label>
                <div class="relative">
                  <select id="book-roomtype" v-model="form.roomId" required
                          class="w-full px-4 py-3 rounded-xl border border-outline-variant/60 bg-surface-container-lowest text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none cursor-pointer">
                    <option value="" disabled>Select a room type</option>
                    <option v-for="room in rooms" :key="room.id" :value="room.id">
                      {{ room.type }} — {{ formatCurrency(room.pricePerNight) }} / night
                    </option>
                  </select>
                  <span class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                </div>
              </div>
              
              <div class="flex justify-end pt-4 border-t border-outline-variant/30">
                <button class="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-container hover:-translate-y-0.5 transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                        :disabled="!form.checkInDate || !form.checkOutDate || !form.roomId" 
                        @click="currentStep = 1">
                  Continue <span class="material-symbols-outlined text-[20px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </transition>

          <!-- Step 2: Guest Info -->
          <transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 translate-x-4" enter-to-class="opacity-100 translate-x-0" leave-active-class="hidden" leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="currentStep === 1" class="bg-white rounded-2xl border border-outline-variant/40 shadow-sm p-6 sm:p-8">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <span class="material-symbols-outlined">person</span>
                </div>
                <h2 class="text-xl font-bold text-on-surface">Guest Information</h2>
              </div>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-on-surface" for="book-fn">First Name</label>
                  <input id="book-fn" v-model="guestInfo.firstName" type="text" placeholder="Jean" required
                         class="w-full px-4 py-3 rounded-xl border border-outline-variant/60 bg-surface-container-lowest text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-on-surface-variant/50" />
                </div>
                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-on-surface" for="book-ln">Last Name</label>
                  <input id="book-ln" v-model="guestInfo.lastName" type="text" placeholder="Dupont" required
                         class="w-full px-4 py-3 rounded-xl border border-outline-variant/60 bg-surface-container-lowest text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-on-surface-variant/50" />
                </div>
              </div>
              
              <div class="space-y-2 mb-6">
                <label class="block text-sm font-semibold text-on-surface" for="book-email">Email Address</label>
                <input id="book-email" v-model="guestInfo.email" type="email" placeholder="jean.dupont@example.com" required
                       class="w-full px-4 py-3 rounded-xl border border-outline-variant/60 bg-surface-container-lowest text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-on-surface-variant/50" />
              </div>
              
              <div class="space-y-2 mb-6">
                <label class="block text-sm font-semibold text-on-surface" for="book-phone">Phone Number</label>
                <input id="book-phone" v-model="guestInfo.phone" type="tel" placeholder="+33 6 12 34 56 78"
                       class="w-full px-4 py-3 rounded-xl border border-outline-variant/60 bg-surface-container-lowest text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-on-surface-variant/50" />
              </div>
              
              <div class="space-y-2 mb-8">
                <label class="block text-sm font-semibold text-on-surface" for="book-requests">Special Requests <span class="text-on-surface-variant font-normal">(Optional)</span></label>
                <textarea id="book-requests" v-model="guestInfo.requests" rows="3" placeholder="Any special requests, dietary requirements, or notes for the hotel..."
                          class="w-full px-4 py-3 rounded-xl border border-outline-variant/60 bg-surface-container-lowest text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-on-surface-variant/50 resize-none"></textarea>
              </div>
              
              <div class="flex items-center justify-between pt-4 border-t border-outline-variant/30">
                <button class="flex items-center gap-2 px-6 py-3 text-on-surface-variant font-bold rounded-xl hover:bg-surface-container-low transition-colors"
                        @click="currentStep = 0">
                  <span class="material-symbols-outlined text-[20px]">arrow_back</span> Back
                </button>
                <button class="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-container hover:-translate-y-0.5 transition-all shadow-sm hover:shadow"
                        @click="currentStep = 2">
                  Continue <span class="material-symbols-outlined text-[20px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </transition>

          <!-- Step 3: Payment -->
          <transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 translate-x-4" enter-to-class="opacity-100 translate-x-0" leave-active-class="hidden" leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="currentStep === 2" class="bg-white rounded-2xl border border-outline-variant/40 shadow-sm p-6 sm:p-8">
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <span class="material-symbols-outlined">credit_card</span>
                  </div>
                  <h2 class="text-xl font-bold text-on-surface">Payment Details</h2>
                </div>
                <div class="flex gap-2 opacity-70">
                  <span class="material-symbols-outlined text-3xl">payments</span>
                </div>
              </div>
              
              <div class="space-y-6 mb-8">
                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-on-surface" for="book-card">Card Number</label>
                  <div class="relative">
                    <input id="book-card" v-model="payment.cardNumber" type="text" placeholder="•••• •••• •••• ••••" maxlength="19"
                           class="w-full pl-12 pr-4 py-3 rounded-xl border border-outline-variant/60 bg-surface-container-lowest text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-on-surface-variant/50 font-mono" />
                    <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">credit_card</span>
                  </div>
                </div>
                
                <div class="grid grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label class="block text-sm font-semibold text-on-surface" for="book-expiry">Expiry Date</label>
                    <input id="book-expiry" v-model="payment.expiry" type="text" placeholder="MM/YY" maxlength="5"
                           class="w-full px-4 py-3 rounded-xl border border-outline-variant/60 bg-surface-container-lowest text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-on-surface-variant/50 font-mono" />
                  </div>
                  <div class="space-y-2">
                    <label class="block text-sm font-semibold text-on-surface" for="book-cvv">CVV</label>
                    <input id="book-cvv" v-model="payment.cvv" type="text" placeholder="123" maxlength="4"
                           class="w-full px-4 py-3 rounded-xl border border-outline-variant/60 bg-surface-container-lowest text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-on-surface-variant/50 font-mono" />
                  </div>
                </div>
                
                <div class="flex items-center gap-2 p-3 bg-surface-container-lowest border border-outline-variant/40 rounded-xl text-sm text-on-surface-variant">
                  <span class="material-symbols-outlined text-primary text-[20px]">lock</span>
                  <span>Your payment information is secured by 256-bit SSL encryption.</span>
                </div>
              </div>
              
              <div class="flex items-center justify-between pt-4 border-t border-outline-variant/30">
                <button class="flex items-center gap-2 px-6 py-3 text-on-surface-variant font-bold rounded-xl hover:bg-surface-container-low transition-colors"
                        @click="currentStep = 1">
                  <span class="material-symbols-outlined text-[20px]">arrow_back</span> Back
                </button>
                <button class="flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-white font-bold rounded-xl hover:bg-[#C5A028] hover:-translate-y-0.5 transition-all shadow-sm hover:shadow disabled:opacity-70"
                        :disabled="loading" @click="handleSubmit">
                  <span v-if="loading" class="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                  <span v-if="!loading" class="material-symbols-outlined text-[20px]">lock</span>
                  <span>{{ loading ? 'Processing...' : `Pay ${formatCurrency(totalAmount)}` }}</span>
                </button>
              </div>
            </div>
          </transition>

          <!-- Step 4: Confirmation -->
          <transition enter-active-class="transition duration-500 ease-out" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100" leave-active-class="hidden" leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="currentStep === 3" class="bg-white rounded-2xl border border-outline-variant/40 shadow-sm p-8 md:p-12 text-center">
              <div class="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span class="material-symbols-outlined text-[40px] text-primary">check_circle</span>
              </div>
              <h2 class="text-3xl font-bold text-on-surface mb-2">Reservation Confirmed!</h2>
              <p class="text-on-surface-variant mb-8 max-w-md mx-auto">
                Thank you for choosing VoyageHub. Your booking has been successfully processed, and a confirmation email has been sent to you.
              </p>
              
              <div class="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-6 mb-8 inline-block mx-auto min-w-[280px]">
                <p class="text-sm font-semibold text-on-surface-variant mb-1 uppercase tracking-wider">Confirmation Code</p>
                <p class="text-3xl font-bold text-primary font-mono tracking-widest">{{ confirmationCode }}</p>
              </div>
              
              <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
                <NuxtLink to="/reservations" class="w-full sm:w-auto px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-container transition-colors">
                  View My Bookings
                </NuxtLink>
                <NuxtLink to="/hotels" class="w-full sm:w-auto px-8 py-3 border border-outline-variant/60 text-on-surface font-bold rounded-xl hover:border-primary hover:text-primary transition-colors">
                  Explore More Hotels
                </NuxtLink>
              </div>
            </div>
          </transition>
        </div>

        <!-- Right: Summary -->
        <aside class="w-full lg:w-96 shrink-0 sticky top-24">
          <div v-if="currentStep < 3" class="bg-white rounded-2xl border border-outline-variant/40 shadow-sm overflow-hidden">
            <div class="p-5 border-b border-outline-variant/30 bg-surface-container-lowest">
              <h3 class="text-lg font-bold text-on-surface">Booking Summary</h3>
            </div>
            
            <div class="p-6 space-y-6">
              <!-- Hotel Info -->
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined text-primary">apartment</span>
                </div>
                <div>
                  <p class="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Property</p>
                  <p class="text-base font-bold text-on-surface">{{ hotelName }}</p>
                </div>
              </div>
              
              <div class="h-px bg-outline-variant/30"></div>
              
              <!-- Dates -->
              <div class="space-y-4">
                <div class="flex justify-between items-center" v-if="form.checkInDate">
                  <span class="text-sm text-on-surface-variant font-medium">Check-in</span>
                  <span class="text-sm font-bold text-on-surface">{{ formatDate(form.checkInDate) }}</span>
                </div>
                <div class="flex justify-between items-center" v-if="form.checkOutDate">
                  <span class="text-sm text-on-surface-variant font-medium">Check-out</span>
                  <span class="text-sm font-bold text-on-surface">{{ formatDate(form.checkOutDate) }}</span>
                </div>
                <div class="flex justify-between items-center" v-if="nightCount > 0">
                  <span class="text-sm text-on-surface-variant font-medium">Duration</span>
                  <span class="text-sm font-bold text-on-surface">{{ nightCount }} Night{{ nightCount > 1 ? 's' : '' }}</span>
                </div>
              </div>
              
              <div class="h-px bg-outline-variant/30" v-if="selectedRoom"></div>
              
              <!-- Room details -->
              <div class="space-y-4" v-if="selectedRoom">
                <div class="flex justify-between items-center">
                  <span class="text-sm text-on-surface-variant font-medium">Room Type</span>
                  <span class="text-sm font-bold text-on-surface">{{ selectedRoom.type }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-on-surface-variant font-medium">Rate per night</span>
                  <span class="text-sm font-bold text-on-surface">{{ formatCurrency(selectedRoom.pricePerNight) }}</span>
                </div>
              </div>
            </div>
            
            <!-- Total -->
            <div class="p-6 bg-surface-container-lowest border-t border-outline-variant/30">
              <div class="flex justify-between items-end">
                <div>
                  <p class="text-sm font-medium text-on-surface-variant mb-1">Total Amount</p>
                  <p class="text-xs text-on-surface-variant/70">Includes taxes and fees</p>
                </div>
                <span class="text-2xl font-bold text-primary">{{ formatCurrency(totalAmount) }}</span>
              </div>
            </div>
          </div>
          
          <!-- Helper Box -->
          <div v-if="currentStep < 3" class="mt-6 bg-primary/5 rounded-2xl border border-primary/10 p-5 flex items-start gap-3">
            <span class="material-symbols-outlined text-primary shrink-0 mt-0.5">help</span>
            <div>
              <p class="text-sm font-bold text-on-surface mb-1">Need help?</p>
              <p class="text-sm text-on-surface-variant">Call our 24/7 concierge at <a href="tel:+33100000000" class="text-primary hover:underline">+33 1 00 00 00 00</a></p>
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
// Mock a hotel name since we don't have the hotel details fetcher mapped directly here 
// In a real scenario we'd fetch the hotel by ID
const hotelName = computed(() => {
  if (hotelId.value === 1) return 'Château de Montrésor'
  if (hotelId.value === 2) return 'Villa Lumina'
  return `Luxury Property #${hotelId.value}`
})

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
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
}
function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(n)
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
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

onMounted(() => fetchByHotel(hotelId.value))
</script>
