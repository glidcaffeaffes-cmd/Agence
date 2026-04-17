<template>
  <div class="min-h-screen bg-[#f8fafc] font-sans pb-20">
    <Head>
      <title>Secure Booking — VoyageHub</title>
      <meta name="description" content="Finalize your luxury hotel reservation." />
    </Head>

    <!-- Immersive Progress Hero -->
    <div class="bg-neutral-900 pt-32 pb-48 text-white relative overflow-hidden">
      <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 grayscale"></div>
      <div class="absolute inset-0 bg-gradient-to-b from-neutral-900/50 to-neutral-900"></div>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
          <span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
          Secure Reservation Process
        </div>
        <h1 class="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none mb-12">
          {{ currentStep === 3 ? 'Confirmed' : 'Coordination' }}
        </h1>
        
        <!-- Premium Stepper -->
        <div class="flex items-center justify-center gap-4 max-w-md mx-auto">
          <div v-for="step in 3" :key="step" class="flex items-center">
            <div 
              class="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-700"
              :class="currentStep >= step - 1 ? 'bg-white border-white text-neutral-900' : 'border-white/20 text-white/40'"
            >
              <span class="text-xs font-black">{{ step }}</span>
            </div>
            <div v-if="step < 3" class="w-16 h-0.5" :class="currentStep >= step ? 'bg-white' : 'bg-white/10'"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-20">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Main Form Column -->
        <div class="flex-1">
          <!-- Step 1: Selection (Already Done by HotelCard selection, showing Summary) -->
          <div v-if="currentStep === 0" class="bg-white rounded-[32px] shadow-2xl shadow-neutral-200/50 p-8 md:p-12 border border-neutral-100 overflow-hidden relative">
            <div class="flex items-center gap-4 mb-10">
              <div class="w-12 h-12 rounded-2xl bg-neutral-900 text-white flex items-center justify-center">
                <span class="material-symbols-outlined text-[28px]">calendar_today</span>
              </div>
              <div>
                <h2 class="text-2xl font-black text-neutral-900 tracking-tight uppercase">Reservation Window</h2>
                <p class="text-sm text-neutral-500 font-medium">Verify your selected property and temporal window.</p>
              </div>
            </div>

            <div class="space-y-12">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div class="space-y-3">
                  <label class="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Check-In</label>
                  <div class="p-6 bg-neutral-50 rounded-2xl border border-transparent hover:border-neutral-200 transition-all font-bold text-neutral-900 uppercase tracking-tight text-xl">
                    {{ checkIn }}
                  </div>
                </div>
                <div class="space-y-3">
                  <label class="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Check-Out</label>
                  <div class="p-6 bg-neutral-50 rounded-2xl border border-transparent hover:border-neutral-200 transition-all font-bold text-neutral-900 uppercase tracking-tight text-xl">
                    {{ checkOut }}
                  </div>
                </div>
              </div>

              <div class="pt-8 border-t border-neutral-50 flex justify-end">
                <button @click="currentStep = 1" class="group flex items-center gap-3 px-12 py-5 bg-neutral-900 text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-neutral-800 transition-all shadow-xl shadow-neutral-900/10 active:scale-95">
                  Confirm Dates <span class="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Step 2: Guest Info -->
          <div v-else-if="currentStep === 1" class="bg-white rounded-[32px] shadow-2xl shadow-neutral-200/50 p-8 md:p-12 border border-neutral-100">
            <div class="flex items-center gap-4 mb-10">
              <div class="w-12 h-12 rounded-2xl bg-neutral-900 text-white flex items-center justify-center">
                <span class="material-symbols-outlined text-[28px]">group</span>
              </div>
              <div>
                <h2 class="text-2xl font-black text-neutral-900 tracking-tight uppercase">Guest Identity</h2>
                <p class="text-sm text-neutral-500 font-medium">Specify the principals for this reservation.</p>
              </div>
            </div>

            <div class="space-y-8">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="space-y-3">
                  <label class="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Lead Traveler</label>
                  <input type="text" value="Jean Dupont" class="w-full px-6 py-5 bg-neutral-50 border-none rounded-2xl text-neutral-900 font-bold focus:ring-2 focus:ring-neutral-900/5 focus:bg-white transition-all outline-none" />
                </div>
                <div class="space-y-3">
                  <label class="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Occupancy</label>
                  <select class="w-full px-6 py-5 bg-neutral-50 border-none rounded-2xl text-neutral-900 font-bold focus:ring-2 focus:ring-neutral-900/5 focus:bg-white transition-all outline-none appearance-none">
                    <option>2 Adults, 1 Minor</option>
                  </select>
                </div>
              </div>

              <div class="pt-10 border-t border-neutral-50 flex justify-between items-center">
                <button @click="currentStep = 0" class="text-xs font-black text-neutral-400 uppercase tracking-widest hover:text-neutral-900 transition-colors">Previous</button>
                <button @click="currentStep = 2" class="group flex items-center gap-3 px-12 py-5 bg-neutral-900 text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-neutral-800 transition-all shadow-xl shadow-neutral-900/10 active:scale-95">
                  Secure Identity <span class="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Step 3: Payment -->
          <div v-else-if="currentStep === 2" class="bg-white rounded-[32px] shadow-2xl shadow-neutral-200/50 p-8 md:p-12 border border-neutral-100">
             <div class="flex items-center gap-4 mb-10">
              <div class="w-12 h-12 rounded-2xl bg-neutral-900 text-white flex items-center justify-center">
                <span class="material-symbols-outlined text-[28px]">payments</span>
              </div>
              <div>
                <h2 class="text-2xl font-black text-neutral-900 tracking-tight uppercase">Capital Transfer</h2>
                <p class="text-sm text-neutral-500 font-medium">Finalize reservation using our encrypted gateway.</p>
              </div>
            </div>

            <div class="space-y-10">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="md:col-span-2 space-y-3">
                  <label class="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Card Instrument</label>
                  <div class="relative group">
                    <input type="text" placeholder="•••• •••• •••• ••••" class="w-full px-6 py-5 bg-neutral-50 border-none rounded-2xl text-neutral-900 font-bold focus:ring-2 focus:ring-neutral-900/5 focus:bg-white transition-all outline-none" />
                    <span class="material-symbols-outlined absolute right-6 top-1/2 -translate-y-1/2 text-neutral-300">credit_card</span>
                  </div>
                </div>
                <div class="space-y-3">
                  <label class="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Expiry</label>
                  <input type="text" placeholder="MM / YY" class="w-full px-6 py-5 bg-neutral-50 border-none rounded-2xl text-neutral-900 font-bold focus:ring-2 focus:ring-neutral-900/5 focus:bg-white transition-all outline-none" />
                </div>
                <div class="space-y-3">
                  <label class="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Protocol</label>
                  <input type="text" placeholder="CVV" class="w-full px-6 py-5 bg-neutral-50 border-none rounded-2xl text-neutral-900 font-bold focus:ring-2 focus:ring-neutral-900/5 focus:bg-white transition-all outline-none" />
                </div>
              </div>

              <div class="pt-10 border-t border-neutral-50 flex justify-between items-center">
                <button @click="currentStep = 1" class="text-xs font-black text-neutral-400 uppercase tracking-widest hover:text-neutral-900 transition-colors">Back</button>
                <button @click="finalizeBooking" class="group flex items-center gap-3 px-12 py-5 bg-neutral-900 text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-neutral-800 transition-all shadow-xl shadow-neutral-900/10 active:scale-95">
                  Authorize Payment <span class="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">lock</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Step 4: Success -->
          <div v-else class="bg-white rounded-[32px] shadow-2xl shadow-neutral-200/50 p-16 text-center border border-neutral-100 overflow-hidden relative">
            <div class="absolute inset-x-0 top-0 h-2 bg-neutral-900"></div>
            <div class="w-24 h-24 rounded-[32px] bg-neutral-50 flex items-center justify-center text-neutral-900 mx-auto mb-10 shadow-inner">
              <span class="material-symbols-outlined text-[48px] animate-bounce">verified</span>
            </div>
            <h2 class="text-4xl font-black text-neutral-900 uppercase tracking-tight mb-4">Reservation Executed</h2>
            <p class="text-neutral-500 mb-12 max-w-md mx-auto font-medium">
              Your architectural placement has been confirmed. A full ledger of this coordination has been transmitted to your secure inbox.
            </p>
            
            <div class="bg-neutral-900 text-white rounded-[24px] p-10 mb-12 inline-block mx-auto min-w-[320px] shadow-2xl relative overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              <p class="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mb-4 relative z-10">Verification Protocol</p>
              <p class="text-4xl font-black tracking-[0.2em] relative z-10">{{ confirmationCode }}</p>
            </div>
            
            <div class="flex flex-col sm:flex-row items-center justify-center gap-6">
              <NuxtLink to="/reservations" class="w-full sm:w-auto px-10 py-5 bg-neutral-900 text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-neutral-800 transition-all active:scale-95">
                Audit Bookings
              </NuxtLink>
              <NuxtLink to="/" class="w-full sm:w-auto px-10 py-5 border-2 border-neutral-900 text-neutral-900 text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-neutral-900 hover:text-white transition-all active:scale-95">
                Terminal
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Sidebar Summary: Concierge Receipt -->
        <aside class="w-full lg:w-96">
          <div class="bg-neutral-900 text-white rounded-[32px] p-8 md:p-10 sticky top-8 shadow-2xl shadow-neutral-900/20 overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
            <div class="relative z-10">
              <h3 class="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mb-8 border-b border-white/10 pb-4">Order Reconciliation</h3>
              
              <div class="flex gap-4 mb-8">
                <div class="w-20 h-20 rounded-2xl overflow-hidden bg-white/10 flex-shrink-0">
                  <img :src="selectedHotel?.image" class="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                </div>
                <div>
                  <h4 class="font-black text-lg uppercase tracking-tight leading-none mb-1">{{ selectedHotel?.name }}</h4>
                  <p class="text-xs text-white/50 font-medium">{{ selectedHotel?.location }}</p>
                  <div class="flex items-center gap-1 mt-2 text-primary-400">
                    <span class="material-symbols-outlined text-[14px] fill-current">star</span>
                    <span class="text-[10px] font-black uppercase">{{ selectedHotel?.rating }} Authority</span>
                  </div>
                </div>
              </div>

              <div class="space-y-6 border-y border-white/10 py-8 mb-8">
                <div class="flex justify-between text-xs font-medium">
                  <span class="text-white/40 uppercase tracking-widest">Base Rate</span>
                  <span class="font-black tracking-tight">${{ selectedHotel?.price }} / Cycle</span>
                </div>
                <div class="flex justify-between text-xs font-medium">
                  <span class="text-white/40 uppercase tracking-widest">Temporal Fee</span>
                  <span class="font-black tracking-tight">$45.00</span>
                </div>
                <div class="flex justify-between text-xs font-medium">
                  <span class="text-white/40 uppercase tracking-widest">Concierge Levy</span>
                  <span class="font-black tracking-tight text-primary-400">-$20.00</span>
                </div>
              </div>

              <div class="flex justify-between items-end">
                <span class="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Total Value</span>
                <span class="text-4xl font-black tracking-tighter">${{ (selectedHotel?.price || 0) + 25 }}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useReservations } from '~/composables/useReservations'
import { useHotels } from '~/composables/useHotels'

const { finalizeReservation } = useReservations()
const { selectedHotel } = useHotels()

const currentStep = ref(0)
const confirmationCode = ref('')

const checkIn = 'Oct 24, 2026'
const checkOut = 'Oct 28, 2026'

async function finalizeBooking() {
  confirmationCode.value = 'VH-' + Math.random().toString(36).substr(2, 6).toUpperCase()
  await finalizeReservation({
    hotelId: selectedHotel.value?.id || 1,
    checkIn,
    checkOut,
    guests: 2
  })
  currentStep.value = 3
}
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
