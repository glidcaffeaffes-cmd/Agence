<template>
  <div class="pt-8 px-8 pb-12 space-y-8 font-['Inter'] antialiased">
    <!-- ROW 1: KPI Cards -->
    <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- KPI 1 -->
      <div class="bg-surface-container-lowest p-6 rounded-xl shadow-sm border-l-4 border-primary flex flex-col justify-between h-32 relative overflow-hidden hover:-translate-y-1 hover:shadow-md transition-all cursor-pointer group">
        <div class="flex justify-between items-start">
          <span class="text-label-md font-semibold text-[#6B8CAE] uppercase tracking-wider text-[10px]">Total Réservations</span>
          <span class="material-symbols-outlined text-primary/30 group-hover:text-primary transition-colors">calendar_month</span>
        </div>
        <div>
          <h3 class="text-2xl font-bold text-secondary">{{ totalReservations }}</h3>
          <p class="text-[10px] text-teal-600 font-medium flex items-center gap-1 mt-1">
            <span class="material-symbols-outlined text-[12px]">trending_up</span> +12% vs last month
          </p>
        </div>
      </div>
      
      <!-- KPI 2 -->
      <div class="bg-surface-container-lowest p-6 rounded-xl shadow-sm border-l-4 border-secondary flex flex-col justify-between h-32 relative overflow-hidden hover:-translate-y-1 hover:shadow-md transition-all cursor-pointer group">
        <div class="flex justify-between items-start">
          <span class="text-label-md font-semibold text-[#6B8CAE] uppercase tracking-wider text-[10px]">Revenus</span>
          <span class="material-symbols-outlined text-secondary/30 group-hover:text-secondary transition-colors">payments</span>
        </div>
        <div>
          <h3 class="text-2xl font-bold text-secondary">{{ totalRevenue.toFixed(0) }} €</h3>
          <p class="text-[10px] text-teal-600 font-medium flex items-center gap-1 mt-1">
            <span class="material-symbols-outlined text-[12px]">trending_up</span> +8.4% vs last month
          </p>
        </div>
      </div>
      
      <!-- KPI 3 -->
      <div class="bg-surface-container-lowest p-6 rounded-xl shadow-sm border-l-4 border-[#CDAF5D] flex flex-col justify-between h-32 relative overflow-hidden hover:-translate-y-1 hover:shadow-md transition-all cursor-pointer group">
        <div class="flex justify-between items-start">
          <span class="text-label-md font-semibold text-[#6B8CAE] uppercase tracking-wider text-[10px]">Hôtels actifs</span>
          <span class="material-symbols-outlined text-tertiary/30 group-hover:text-tertiary transition-colors">apartment</span>
        </div>
        <div>
          <h3 class="text-2xl font-bold text-secondary">{{ activeHotels }}</h3>
          <p class="text-[10px] text-slate-500 font-medium flex items-center gap-1 mt-1">
            Stable since last week
          </p>
        </div>
      </div>
      
      <!-- KPI 4 -->
      <div class="bg-surface-container-lowest p-6 rounded-xl shadow-sm border-l-4 border-error flex flex-col justify-between h-32 relative overflow-hidden hover:-translate-y-1 hover:shadow-md transition-all cursor-pointer group">
        <div class="flex justify-between items-start">
          <span class="text-label-md font-semibold text-[#6B8CAE] uppercase tracking-wider text-[10px]">Taux d'occupation</span>
          <span class="material-symbols-outlined text-error/30 group-hover:text-error transition-colors">percent</span>
        </div>
        <div>
          <h3 class="text-2xl font-bold text-secondary">78.2%</h3>
          <p class="text-[10px] text-error font-medium flex items-center gap-1 mt-1">
            <span class="material-symbols-outlined text-[12px]">trending_down</span> -2.1% vs last month
          </p>
        </div>
      </div>
    </section>

    <!-- ROW 2: Charts -->
    <section class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Bar Chart: Reservations -->
      <div class="lg:col-span-2 bg-surface-container-lowest rounded-xl shadow-sm p-8">
        <div class="flex justify-between items-center mb-8">
          <div>
            <h4 class="text-xl font-bold text-[#015081]">Flux de Réservations</h4>
            <p class="text-sm text-slate-500">Performance hebdomadaire des ventes</p>
          </div>
          <div class="flex gap-2">
            <button class="px-3 py-1 text-xs font-bold bg-surface-container text-secondary rounded active:scale-95 transition-transform">7D</button>
            <button class="px-3 py-1 text-xs font-medium text-slate-500 hover:bg-slate-50 rounded active:scale-95 transition-transform">30D</button>
          </div>
        </div>
        <!-- Dynamic Chart -->
        <div class="h-64 flex items-end justify-between gap-4">
          <div v-for="(count, index) in reservationChart" :key="index" class="w-full bg-slate-100 rounded-t-lg relative group transition-all duration-300 cursor-pointer" :style="{ height: `${Math.max(10, (count / Math.max(...reservationChart)) * 100)}%` }" :class="count > 0 ? 'hover:bg-primary' : ''">
            <div class="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[10px] font-bold text-primary">{{ count }}</div>
          </div>
        </div>
        <div class="flex justify-between mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">
          <span>Lun</span><span>Mar</span><span>Mer</span><span>Jeu</span><span>Ven</span><span>Sam</span><span>Dim</span>
        </div>
      </div>
      
      <!-- Doughnut Chart -->
      <div class="bg-surface-container-lowest rounded-xl shadow-sm p-8 flex flex-col group cursor-default">
        <h4 class="text-xl font-bold text-[#015081] mb-2">Statut des Vols</h4>
        <p class="text-sm text-slate-500 mb-8">Répartition par catégorie</p>
        <div class="relative flex-1 flex items-center justify-center">
          <svg class="w-48 h-48 -rotate-90 group-hover:scale-105 transition-transform duration-500">
            <circle cx="96" cy="96" fill="transparent" r="70" stroke="#f1f5f9" stroke-width="24"></circle>
            <circle class="hover:stroke-[#008283] transition-colors" cx="96" cy="96" fill="transparent" r="70" stroke="#006768" stroke-dasharray="440" stroke-dashoffset="110" stroke-width="24"></circle>
            <circle class="hover:stroke-[#2d7bb8] transition-colors" cx="96" cy="96" fill="transparent" r="70" stroke="#236294" stroke-dasharray="440" stroke-dashoffset="330" stroke-width="24"></circle>
            <circle class="hover:stroke-[#e2c376] transition-colors" cx="96" cy="96" fill="transparent" r="70" stroke="#CDAF5D" stroke-dasharray="440" stroke-dashoffset="400" stroke-width="24"></circle>
          </svg>
          <div class="absolute inset-0 flex flex-col items-center justify-center">
            <span class="text-3xl font-black text-secondary group-hover:text-primary transition-colors">85%</span>
            <span class="text-[10px] font-bold text-slate-400 uppercase">Confirmé</span>
          </div>
        </div>
        <div class="mt-8 space-y-3">
          <div class="flex items-center justify-between text-xs hover:bg-slate-50 p-1 rounded transition-colors cursor-pointer">
            <div class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-primary"></span><span class="text-slate-600 font-medium">Confirmé</span></div>
            <span class="font-bold">75%</span>
          </div>
          <div class="flex items-center justify-between text-xs hover:bg-slate-50 p-1 rounded transition-colors cursor-pointer">
            <div class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-secondary"></span><span class="text-slate-600 font-medium">En attente</span></div>
            <span class="font-bold">15%</span>
          </div>
          <div class="flex items-center justify-between text-xs hover:bg-slate-50 p-1 rounded transition-colors cursor-pointer">
            <div class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-[#CDAF5D]"></span><span class="text-slate-600 font-medium">Annulé</span></div>
            <span class="font-bold">10%</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ROW 3: DataTable & Top Hotels -->
    <section class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Latest Reservations Table -->
      <div class="lg:col-span-2 bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
        <div class="px-8 py-6 flex justify-between items-center border-b border-slate-50">
          <h4 class="text-xl font-bold text-[#015081]">Dernières Réservations</h4>
          <NuxtLink to="/admin/reservations" class="text-primary text-xs font-bold hover:underline active:opacity-70 transition-opacity">Voir tout</NuxtLink>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-surface-container-low text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <th class="px-8 py-4">Client</th>
                <th class="px-8 py-4">Hôtel</th>
                <th class="px-8 py-4">Date</th>
                <th class="px-8 py-4">Statut</th>
                <th class="px-8 py-4">Montant</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr v-for="res in reservations.slice(0, 5)" :key="res.id" class="cursor-pointer hover:bg-blue-50/50 transition-colors">
                <td class="px-8 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-secondary-container/20 flex items-center justify-center font-bold text-secondary text-[10px]">
                      {{ `C${res.accountId}` }}
                    </div>
                    <span class="text-xs font-semibold text-on-surface">{{ `Client ${res.accountId}` }}</span>
                  </div>
                </td>
                <td class="px-8 py-4 text-xs text-slate-600">Hotel {{ res.hotelId }}</td>
                <td class="px-8 py-4 text-xs text-slate-600">{{ new Date(res.checkInDate).toLocaleDateString() }}</td>
                <td class="px-8 py-4">
                  <span v-if="res.status === 'CONFIRMED'" class="px-2 py-1 bg-teal-100 text-teal-700 rounded-full text-[9px] font-bold uppercase tracking-tighter">Confirmé</span>
                  <span v-else-if="res.status === 'PENDING'" class="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-[9px] font-bold uppercase tracking-tighter">En cours</span>
                  <span v-else class="px-2 py-1 bg-red-100 text-red-700 rounded-full text-[9px] font-bold uppercase tracking-tighter">{{ res.status }}</span>
                </td>
                <td class="px-8 py-4 text-xs font-bold text-secondary">{{ res.totalAmount }} €</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Top Ranked Hotels -->
      <div class="bg-surface-container-lowest rounded-xl shadow-sm p-8">
        <h4 class="text-xl font-bold text-[#015081] mb-6">Hôtels de Prestige</h4>
        <div class="space-y-6">
          <div v-for="(hotel, index) in topHotels" :key="hotel.id" class="flex items-center gap-4 hover:translate-x-1 transition-transform cursor-pointer group">
            <span :class="['text-lg font-black transition-colors', index === 0 ? 'text-[#CDAF5D]' : 'text-slate-200 group-hover:text-slate-400']">0{{ index + 1 }}</span>
            <img :src="hotel.images[0]" :alt="hotel.name" class="w-12 h-12 rounded-lg object-cover ring-0 group-hover:ring-2 ring-primary/30 transition-all"/>
            <div class="flex-1 min-w-0">
              <p class="text-xs font-bold text-on-surface group-hover:text-primary transition-colors truncate">{{ hotel.name }}</p>
              <p class="text-[10px] text-slate-500 truncate">{{ hotel.city }}, {{ hotel.country }}</p>
            </div>
            <div class="text-right">
              <p class="text-xs font-bold text-primary">{{ hotel.stars }}.0/5</p>
              <p class="text-[9px] text-slate-400">128 avis</p>
            </div>
          </div>
        </div>
        <button class="w-full mt-8 py-3 border border-slate-200 text-slate-500 font-bold text-[10px] uppercase tracking-widest rounded-lg hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 transition-all">
          Analyser le classement
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { ApiHotelRepository, ApiReservationRepository } from '~/repositories/api'
import { useStats } from '~/composables/useStats'

definePageMeta({
  layout: 'admin'
})

const hotelRepo = new ApiHotelRepository()
const reservationRepo = new ApiReservationRepository()
const { dashboardStats, fetchDashboard } = useStats()

const { data: hotelsData } = useAsyncData('dashboard-hotels', () => hotelRepo.getAll())
const { data: reservationsData } = useAsyncData('dashboard-reservations', () => reservationRepo.getAll())
const { data: chartData } = useAsyncData('reservation-chart', () => $fetch('/api/stats/chart/reservations'))

const hotels = computed(() => hotelsData.value || [])
const reservations = computed(() => reservationsData.value || [])
const reservationChart = computed(() => chartData.value || [0, 0, 0, 0, 0, 0, 0])

// Use stats from backend
const totalReservations = computed(() => dashboardStats.value?.totalReservations || 0)
const totalRevenue = computed(() => dashboardStats.value?.totalRevenue || 0)
const activeHotels = computed(() => dashboardStats.value?.totalHotels || 0)

// Get top 3 rated hotels
const topHotels = computed(() => {
  return [...hotels.value].sort((a, b) => b.stars - a.stars).slice(0, 3)
})

onMounted(async () => {
  await fetchDashboard()
})
</script>
