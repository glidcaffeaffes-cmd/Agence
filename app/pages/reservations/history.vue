<template>
  <div class="min-h-screen bg-surface">
    <Head>
      <title>Reservation History — VoyageHub</title>
      <meta name="description" content="View your complete reservation history and past stays with VoyageHub." />
    </Head>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Page Header -->
      <header class="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 class="text-4xl font-bold text-on-surface tracking-tight">Reservation History</h1>
          <p class="text-on-surface-variant mt-2 text-lg">A complete log of all your past bookings and stays.</p>
        </div>
        <NuxtLink to="/hotels" class="inline-flex items-center gap-2 px-5 py-2.5 bg-secondary-container text-on-secondary-container font-bold rounded-xl hover:bg-secondary hover:text-on-secondary transition-colors shadow-sm">
          <span class="material-symbols-outlined text-[20px]">calendar_month</span>
          Make a Booking
        </NuxtLink>
      </header>

      <div class="flex flex-col lg:flex-row gap-10">
        <!-- Sidebar Navigation (Consistent with Profile/Settings) -->
        <aside class="w-full lg:w-72 flex-shrink-0">
          <div class="bg-white rounded-2xl shadow-sm border border-outline-variant/40 overflow-hidden sticky top-8">
            <div class="p-6 border-b border-outline-variant/30 text-center">
              <div class="w-24 h-24 mx-auto rounded-full bg-surface-container-high border-4 border-white shadow-md overflow-hidden mb-4">
                <img :src="currentProfile?.photo || 'https://i.pravatar.cc/150'" alt="Avatar" class="w-full h-full object-cover" />
              </div>
              <h2 class="text-xl font-bold text-on-surface">{{ currentProfile?.firstName || 'Jean' }} {{ currentProfile?.lastName || 'Dupont' }}</h2>
              <p class="text-sm text-on-surface-variant mt-1">{{ currentProfile?.email || 'jean.dupont@example.com' }}</p>
              
              <div class="mt-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
                   :class="currentProfile?.role === 'Admin' ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'">
                {{ currentProfile?.role || 'Client' }}
              </div>
            </div>

            <!-- Nav Links -->
            <nav class="p-3 space-y-1">
              <NuxtLink to="/profile" class="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors font-medium">
                <span class="material-symbols-outlined text-[20px]">person</span>
                Personal Info
              </NuxtLink>
              <NuxtLink to="/reservations/history" class="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/5 text-primary font-semibold transition-colors">
                <span class="material-symbols-outlined text-[20px]">history</span>
                Reservation History
              </NuxtLink>
              <NuxtLink to="/settings" class="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors font-medium">
                <span class="material-symbols-outlined text-[20px]">settings</span>
                Settings & Security
              </NuxtLink>
            </nav>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 space-y-8">
          
          <!-- Filters -->
          <div class="bg-white rounded-2xl shadow-sm border border-outline-variant/40 p-6 flex flex-col md:flex-row gap-4 items-center">
            <!-- Search -->
            <div class="relative w-full md:w-64">
              <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline">search</span>
              <input v-model="search" type="text" placeholder="Search by hotel, code…" class="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant/60 rounded-xl text-on-surface text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none" />
            </div>

            <!-- Status Pills -->
            <div class="flex flex-wrap gap-2 flex-1">
              <button 
                v-for="s in statuses" :key="s.value"
                @click="statusFilter = s.value"
                class="px-4 py-1.5 rounded-full text-sm font-semibold transition-colors border"
                :class="statusFilter === s.value 
                  ? 'bg-primary text-white border-primary' 
                  : 'bg-white text-on-surface-variant border-outline-variant/60 hover:border-primary hover:text-primary'"
              >
                {{ s.label }}
              </button>
            </div>

            <!-- Year Select -->
            <div class="w-full md:w-auto relative">
              <select v-model="yearFilter" class="w-full appearance-none pl-4 pr-10 py-2.5 bg-surface-container-lowest border border-outline-variant/60 rounded-xl text-on-surface text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none cursor-pointer">
                <option value="">All years</option>
                <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
              </select>
              <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">expand_more</span>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="bg-white rounded-2xl shadow-sm border border-outline-variant/40 p-16 flex flex-col items-center justify-center text-on-surface-variant">
            <span class="material-symbols-outlined animate-spin text-4xl text-primary mb-4">progress_activity</span>
            <p class="font-medium">Loading your history…</p>
          </div>

          <!-- Empty State -->
          <div v-else-if="filtered.length === 0" class="bg-white rounded-2xl shadow-sm border border-outline-variant/40 p-16 flex flex-col items-center justify-center text-center">
            <span class="material-symbols-outlined text-6xl text-outline mb-4">receipt_long</span>
            <h3 class="text-xl font-bold text-on-surface mb-2">No reservations found</h3>
            <p class="text-on-surface-variant mb-6 max-w-sm">Try adjusting your filters or explore our luxury hotels to make your next booking.</p>
            <NuxtLink to="/hotels" class="px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-container shadow-sm hover:-translate-y-0.5 transition-all">
              Explore Hotels
            </NuxtLink>
          </div>

          <!-- Timeline List -->
          <div v-else class="space-y-8">
            <template v-for="(group, year) in grouped" :key="year">
              <!-- Year Divider -->
              <div class="flex items-center gap-4">
                <div class="h-px bg-outline-variant/40 flex-1"></div>
                <span class="text-sm font-bold text-on-surface-variant uppercase tracking-wider">{{ year }}</span>
                <div class="h-px bg-outline-variant/40 flex-1"></div>
              </div>

              <!-- Reservation Cards -->
              <div class="space-y-4">
                <div v-for="r in group" :key="r.id" class="bg-white rounded-2xl shadow-sm border border-outline-variant/40 overflow-hidden flex flex-col md:flex-row hover:shadow-md hover:-translate-y-0.5 transition-all group">
                  <!-- Status Accent Line -->
                  <div class="w-full md:w-1.5 h-1.5 md:h-auto" :class="accentColor(r.status)"></div>

                  <!-- Card Content -->
                  <div class="p-6 flex-1 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    
                    <div class="flex gap-6 items-start flex-1">
                      <!-- Hotel Image Thumbnail -->
                      <div v-if="getHotel(r.hotelId)" class="hidden sm:block w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden flex-shrink-0 bg-surface-container-high border border-outline-variant/40 shadow-sm">
                        <img :src="getHotel(r.hotelId)?.images[0]" :alt="getHotel(r.hotelId)?.name" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      </div>

                      <div class="space-y-4 flex-1">
                        <div class="flex items-start justify-between md:justify-start gap-4">
                          <div>
                            <p class="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">{{ r.confirmationCode }}</p>
                            <h3 class="text-lg font-bold text-on-surface line-clamp-1">{{ getHotel(r.hotelId)?.name || 'Hotel #' + r.hotelId }}</h3>
                            <p class="text-sm text-on-surface-variant flex items-center gap-1 mt-0.5">
                              <span class="material-symbols-outlined text-[14px]">location_on</span>
                              {{ getHotel(r.hotelId)?.city || 'Unknown City' }}, {{ getHotel(r.hotelId)?.country || 'Unknown Country' }}
                            </p>
                          </div>
                          <span class="md:hidden inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap" :class="badgeColor(r.status)">
                            <span class="material-symbols-outlined text-[14px]">{{ statusIcon(r.status) }}</span>
                            {{ r.status }}
                          </span>
                        </div>

                        <div class="flex flex-wrap gap-x-6 gap-y-2">
                          <div class="flex items-center gap-2 text-sm text-on-surface-variant">
                            <span class="material-symbols-outlined text-[18px] text-outline">login</span>
                            <span>Check-in: <strong class="text-on-surface">{{ formatDate(r.checkInDate) }}</strong></span>
                          </div>
                          <div class="flex items-center gap-2 text-sm text-on-surface-variant">
                            <span class="material-symbols-outlined text-[18px] text-outline">logout</span>
                            <span>Check-out: <strong class="text-on-surface">{{ formatDate(r.checkOutDate) }}</strong></span>
                          </div>
                          <div class="flex items-center gap-2 text-sm text-on-surface-variant">
                            <span class="material-symbols-outlined text-[18px] text-outline">dark_mode</span>
                            <span>{{ r.numberOfNights }} night{{ r.numberOfNights > 1 ? 's' : '' }}</span>
                          </div>
                          <div class="flex items-center gap-2 text-sm font-bold text-primary">
                            <span class="material-symbols-outlined text-[18px]">payments</span>
                            <span>{{ formatCurrency(r.totalAmount) }}</span>
                          </div>
                        </div>

                        <div v-if="r.blockReason" class="inline-flex items-center gap-2 mt-2 px-3 py-2 bg-error-container/30 text-error rounded-lg text-sm font-medium">
                          <span class="material-symbols-outlined text-[16px]">info</span>
                          {{ r.blockReason }}
                        </div>
                      </div>
                    </div>

                    <!-- Right Side Actions & Desktop Badge -->
                    <div class="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 md:border-l md:border-outline-variant/30 md:pl-6">
                      <span class="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap" :class="badgeColor(r.status)">
                        <span class="material-symbols-outlined text-[14px]">{{ statusIcon(r.status) }}</span>
                        {{ r.status }}
                      </span>
                      
                      <div class="flex gap-2">
                        <button v-if="['CONFIRMED', 'COMPLETED'].includes(r.status)" class="hidden md:inline-flex items-center justify-center w-10 h-10 border border-outline-variant/60 text-on-surface-variant rounded-lg hover:bg-surface-container hover:text-on-surface transition-colors" title="Download Receipt">
                          <span class="material-symbols-outlined text-[18px]">receipt</span>
                        </button>
                        <NuxtLink :to="`/hotels/${r.hotelId}`" class="inline-flex items-center gap-2 px-4 py-2 border border-outline-variant/60 text-primary font-bold rounded-lg hover:bg-primary hover:border-primary hover:text-white transition-colors whitespace-nowrap">
                          <span class="material-symbols-outlined text-[18px]">hotel</span>
                          View Hotel
                        </NuxtLink>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>

        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useReservations } from '~/composables/useReservations'
import { useHotels } from '~/composables/useHotels'

const { accountId, currentProfile } = useAuth()
const { reservations, loading: rLoading, fetchByAccount } = useReservations()
const { hotels, fetchAll: fetchHotels, loading: hLoading } = useHotels()

const search = ref('')
const statusFilter = ref('')
const yearFilter = ref('')

const loading = computed(() => rLoading.value || hLoading.value)

const statuses = [
  { value: '', label: 'All' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'PENDING', label: 'Pending' },
]

const years = computed(() => {
  const ys = new Set(reservations.value.map(r => r.checkInDate.substring(0, 4)))
  return [...ys].sort((a, b) => b.localeCompare(a))
})

function getHotel(id: number) {
  return hotels.value.find(h => h.id === id)
}

const filtered = computed(() =>
  reservations.value.filter(r => {
    const hotel = getHotel(r.hotelId)
    const matchSearch = !search.value ||
      r.confirmationCode.toLowerCase().includes(search.value.toLowerCase()) ||
      (hotel && hotel.name.toLowerCase().includes(search.value.toLowerCase())) ||
      String(r.hotelId).includes(search.value)
    const matchStatus = !statusFilter.value || r.status === statusFilter.value
    const matchYear = !yearFilter.value || r.checkInDate.startsWith(yearFilter.value)
    return matchSearch && matchStatus && matchYear
  })
)

const grouped = computed<Record<string, typeof filtered.value>>(() => {
  const result: Record<string, typeof filtered.value> = {}
  for (const r of [...filtered.value].sort((a, b) => b.checkInDate.localeCompare(a.checkInDate))) {
    const year = r.checkInDate.substring(0, 4)
    if (!result[year]) result[year] = []
    result[year].push(r)
  }
  return result
})

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n)
}

function statusIcon(s: string) {
  const map: Record<string, string> = {
    CONFIRMED: 'check_circle', CANCELLED: 'cancel',
    COMPLETED: 'task_alt', PENDING: 'schedule', BLOCKED: 'block',
  }
  return map[s] ?? 'help'
}

function accentColor(s: string) {
  const map: Record<string, string> = {
    CONFIRMED: 'bg-primary',
    COMPLETED: 'bg-secondary',
    CANCELLED: 'bg-error',
    PENDING: 'bg-accent',
    BLOCKED: 'bg-outline',
  }
  return map[s] ?? 'bg-outline-variant'
}

function badgeColor(s: string) {
  const map: Record<string, string> = {
    CONFIRMED: 'bg-primary/10 text-primary',
    COMPLETED: 'bg-secondary/10 text-secondary',
    CANCELLED: 'bg-error/10 text-error',
    PENDING: 'bg-accent/20 text-accent',
    BLOCKED: 'bg-outline/20 text-outline',
  }
  return map[s] ?? 'bg-outline-variant/20 text-on-surface-variant'
}

onMounted(async () => {
  await Promise.all([
    fetchByAccount(accountId.value || 1),
    fetchHotels()
  ])
})
</script>
