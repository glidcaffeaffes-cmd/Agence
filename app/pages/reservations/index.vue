<template>
  <div class="min-h-screen bg-surface">
    <Head>
      <title>My Bookings — VoyageHub</title>
      <meta name="description" content="Manage your active reservations and upcoming stays with VoyageHub." />
    </Head>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Page Header -->
      <header class="mb-12">
        <h1 class="text-4xl font-bold text-on-surface tracking-tight">My Bookings</h1>
        <p class="text-on-surface-variant mt-2 text-lg max-w-2xl">Manage your upcoming journeys and review your travel history with ease.</p>
      </header>

      <!-- Dashboard Grid -->
      <div class="flex flex-col lg:flex-row gap-10">
        <!-- Sidebar -->
        <aside class="w-full lg:w-72 flex-shrink-0">
          <div class="sticky top-8 space-y-4">
             <!-- Quick Stats -->
             <div class="bg-white rounded-2xl p-6 border border-outline-variant/30 shadow-sm">
                <p class="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">Account Stats</p>
                <div class="space-y-4">
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-on-surface-variant">Active stays</span>
                    <span class="text-sm font-bold text-primary">{{ activeCount }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-on-surface-variant">Past trips</span>
                    <span class="text-sm font-bold text-on-surface">{{ pastCount }}</span>
                  </div>
                </div>
             </div>

             <!-- Navigation -->
             <nav class="bg-white rounded-2xl p-3 border border-outline-variant/30 shadow-sm space-y-1">
                <NuxtLink to="/reservations" class="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/5 text-primary font-bold">
                  <span class="material-symbols-outlined text-[20px]">calendar_today</span>
                  Active Bookings
                </NuxtLink>
                <NuxtLink to="/reservations/history" class="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container-low transition-colors font-medium">
                  <span class="material-symbols-outlined text-[20px]">history</span>
                  History
                </NuxtLink>
             </nav>
          </div>
        </aside>

        <!-- Main Listing -->
        <main class="flex-1">
          <div v-if="loading" class="flex flex-col items-center justify-center py-20 text-on-surface-variant">
            <span class="material-symbols-outlined animate-spin text-4xl text-primary mb-4">progress_activity</span>
            <p class="font-medium">Curating your bookings...</p>
          </div>

          <div v-else-if="reservations.length > 0" class="space-y-6">
            <div v-for="res in reservations" :key="res.id" 
                 class="group bg-white rounded-2xl border border-outline-variant/30 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col md:flex-row">
              
              <!-- Image Section -->
              <div class="w-full md:w-64 h-48 md:h-auto relative overflow-hidden bg-surface-container">
                <img :src="getHotel(res.hotelId)?.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'" 
                     class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div class="absolute top-4 left-4">
                  <span class="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm"
                        :class="res.status === 'Cancelled' ? 'text-error' : 'text-primary'">
                    {{ res.status }}
                  </span>
                </div>
              </div>

              <!-- Content Section -->
              <div class="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <div class="flex justify-between items-start mb-2">
                    <p class="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Ref: #RES-{{ String(res.id).padStart(4, '0') }}</p>
                    <p class="text-lg font-bold text-primary">€{{ res.totalAmount }}</p>
                  </div>
                  <h3 class="text-xl font-bold text-on-surface mb-1">{{ getHotel(res.hotelId)?.name || 'Luxury Stay' }}</h3>
                  <p class="text-sm text-on-surface-variant flex items-center gap-1" v-if="getHotel(res.hotelId)">
                    <span class="material-symbols-outlined text-[16px]">location_on</span>
                    {{ getHotel(res.hotelId).location.city }}, France
                  </p>
                </div>

                <div class="mt-6 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-outline-variant/10">
                  <div class="flex gap-8">
                    <div class="space-y-1">
                      <p class="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Check In</p>
                      <p class="text-sm font-semibold text-on-surface">{{ formatDate(res.checkIn) }}</p>
                    </div>
                    <div class="space-y-1">
                      <p class="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Check Out</p>
                      <p class="text-sm font-semibold text-on-surface">{{ formatDate(res.checkOut) }}</p>
                    </div>
                  </div>

                  <div class="flex items-center gap-2">
                    <button class="px-4 py-2 text-sm font-bold text-on-surface hover:bg-surface-container rounded-xl transition-colors">Details</button>
                    <button v-if="res.status === 'Confirmed' || res.status === 'Pending'" 
                            @click="handleCancel(res.id)"
                            class="px-4 py-2 text-sm font-bold text-error hover:bg-error/10 rounded-xl transition-colors">Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="bg-white rounded-3xl p-16 text-center border border-outline-variant/30 shadow-sm">
            <div class="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="material-symbols-outlined text-4xl text-outline">event_busy</span>
            </div>
            <h3 class="text-2xl font-bold text-on-surface mb-2">No active bookings</h3>
            <p class="text-on-surface-variant mb-8 max-w-sm mx-auto">Your upcoming travel schedule is empty. Time to discover your next extraordinary stay.</p>
            <NuxtLink to="/hotels" class="inline-flex items-center px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary-600 transition-all shadow-lg shadow-primary/20">
              Explore Collections
            </NuxtLink>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useReservations } from '~/composables/useReservations'
import { useAuth } from '~/composables/useAuth'
import { useHotels } from '~/composables/useHotels'

const { currentProfile } = useAuth()
const { reservations, fetchByAccount, updateStatus } = useReservations()
const { hotels, fetchAll: fetchAllHotels } = useHotels()

const loading = ref(true)

const activeCount = computed(() => reservations.value.filter(r => r.status === 'Confirmed' || r.status === 'Pending').length)
const pastCount = computed(() => reservations.value.filter(r => r.status === 'Completed').length)

onMounted(async () => {
  loading.value = true
  await fetchAllHotels()
  if (currentProfile.value) {
    await fetchByAccount(currentProfile.value.id)
  }
  loading.value = false
})

function getHotel(id: number) {
  return hotels.value.find(h => h.id === id)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

async function handleCancel(id: number) {
  if (confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
    await updateStatus(id, 'Cancelled')
  }
}
</script>

<style scoped>
.bg-surface {
  background-color: #f8fafc;
}
</style>
