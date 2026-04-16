<template>
  <div class="p-8 pb-12 font-['Inter'] antialiased">
    <!-- Header Section -->
    <div class="flex justify-between items-end mb-8">
      <div>
        <h2 class="text-3xl font-bold tracking-tight text-[#015081] mb-1">Gestion des Réservations</h2>
        <p class="text-outline text-sm">Supervisez et gérez tous les flux de réservations en temps réel.</p>
      </div>
      <div class="flex gap-3">
        <button class="bg-surface-container-lowest border border-outline-variant/30 text-secondary px-4 py-2.5 rounded-lg font-semibold flex items-center gap-2 hover:bg-surface-container-low active:scale-95 transition-all">
          <span class="material-symbols-outlined text-[20px]">download</span>
          Exporter
        </button>
        <button class="bg-primary text-white px-6 py-2.5 rounded-lg font-semibold shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-2">
          <span class="material-symbols-outlined text-[20px]">add_circle</span>
          Nouvelle Réservation
        </button>
      </div>
    </div>

    <!-- Stats Mini-Row -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-surface-container-lowest p-5 rounded-xl shadow-[0_4px_20px_rgba(1,80,129,0.04)] flex items-center gap-4 border border-transparent hover:border-primary/10 transition-colors cursor-default">
        <div class="h-12 w-12 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary">
          <span class="material-symbols-outlined">all_inbox</span>
        </div>
        <div>
          <p class="text-outline text-xs font-semibold uppercase tracking-wider">Total</p>
          <p class="text-2xl font-bold text-on-surface">{{ reservations.length }}</p>
        </div>
      </div>
      <div class="bg-surface-container-lowest p-5 rounded-xl shadow-[0_4px_20px_rgba(1,80,129,0.04)] flex items-center gap-4 border border-transparent hover:border-[#008F90]/10 transition-colors cursor-default">
        <div class="h-12 w-12 rounded-lg bg-[#008F90]/10 flex items-center justify-center text-[#008F90]">
          <span class="material-symbols-outlined">check_circle</span>
        </div>
        <div>
          <p class="text-outline text-xs font-semibold uppercase tracking-wider text-[#008F90]">Confirmées</p>
          <p class="text-2xl font-bold text-on-surface">{{ confirmedCount }}</p>
        </div>
      </div>
      <div class="bg-surface-container-lowest p-5 rounded-xl shadow-[0_4px_20px_rgba(1,80,129,0.04)] flex items-center gap-4 border border-transparent hover:border-[#CDAF5D]/10 transition-colors cursor-default">
        <div class="h-12 w-12 rounded-lg bg-[#CDAF5D]/10 flex items-center justify-center text-[#735c10]">
          <span class="material-symbols-outlined">pending</span>
        </div>
        <div>
          <p class="text-outline text-xs font-semibold uppercase tracking-wider text-[#735c10]">En attente</p>
          <p class="text-2xl font-bold text-on-surface">{{ pendingCount }}</p>
        </div>
      </div>
      <div class="bg-surface-container-lowest p-5 rounded-xl shadow-[0_4px_20px_rgba(1,80,129,0.04)] flex items-center gap-4 border border-transparent hover:border-error/10 transition-colors cursor-default">
        <div class="h-12 w-12 rounded-lg bg-error/10 flex items-center justify-center text-error">
          <span class="material-symbols-outlined">block</span>
        </div>
        <div>
          <p class="text-outline text-xs font-semibold uppercase tracking-wider text-error">Bloquées</p>
          <p class="text-2xl font-bold text-on-surface">{{ blockedCount }}</p>
        </div>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="bg-surface-container-lowest p-4 rounded-xl mb-6 shadow-sm border border-outline-variant/10 flex flex-wrap items-center gap-4">
      <div class="flex-1 min-w-[200px]">
        <div class="relative group">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm group-focus-within:text-primary transition-colors">calendar_today</span>
          <input class="w-full pl-10 pr-4 py-2 border-outline-variant/30 border rounded-lg text-sm bg-surface-container-low/50 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none cursor-pointer" placeholder="Plage de dates" type="text" />
        </div>
      </div>
      <div class="relative min-w-[160px]">
        <select class="w-full pl-4 pr-10 py-2 border-outline-variant/30 border rounded-lg text-sm bg-surface-container-low/50 text-on-surface hover:bg-surface-container-low focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none cursor-pointer appearance-none">
          <option>Tous les hôtels</option>
          <option v-for="hotel in hotels" :key="hotel.id">{{ hotel.name }}</option>
        </select>
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-outline">
            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
        </div>
      </div>
      <div class="relative min-w-[160px]">
        <select class="w-full pl-4 pr-10 py-2 border-outline-variant/30 border rounded-lg text-sm bg-surface-container-low/50 text-on-surface hover:bg-surface-container-low focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none cursor-pointer appearance-none">
          <option>Statut: Tous</option>
          <option>Confirmée</option>
          <option>En attente</option>
          <option>Bloquée</option>
        </select>
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-outline">
            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
        </div>
      </div>
      <div class="h-10 w-[1px] bg-outline-variant/20"></div>
      <button class="p-2 text-outline hover:text-primary hover:bg-primary/5 rounded-lg transition-all" title="Filtres avancés">
        <span class="material-symbols-outlined">filter_list</span>
      </button>
      <button class="p-2 text-outline hover:text-primary hover:bg-primary/5 rounded-lg transition-all active:rotate-180 duration-500" title="Actualiser">
        <span class="material-symbols-outlined">refresh</span>
      </button>
    </div>

    <!-- DataTable Container -->
    <div class="bg-surface-container-lowest rounded-xl shadow-md overflow-hidden border border-outline-variant/10">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-surface-container-high/50 text-outline text-xs font-bold uppercase tracking-widest border-b border-outline-variant/10">
            <th class="px-6 py-4">Code</th>
            <th class="px-6 py-4">Client</th>
            <th class="px-6 py-4">Hôtel / Chambre</th>
            <th class="px-6 py-4">Dates</th>
            <th class="px-6 py-4 text-center">Nuits</th>
            <th class="px-6 py-4">Montant</th>
            <th class="px-6 py-4">Statut</th>
            <th class="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="text-sm divide-y divide-outline-variant/10">
          <tr v-for="res in reservations" :key="res.id" class="hover:bg-surface-container-low/40 transition-colors group">
            <td class="px-6 py-5 font-mono font-bold text-secondary">{{ res.confirmationCode || `#RES-${1000 + res.id}` }}</td>
            <td class="px-6 py-5">
              <div class="flex flex-col">
                <span class="font-bold text-on-surface">Client #{{ res.accountId }}</span>
                <span class="text-outline text-xs">client.{{ res.accountId }}@email.com</span>
              </div>
            </td>
            <td class="px-6 py-5">
              <div class="flex flex-col">
                <span class="font-semibold text-on-surface">{{ getHotelName(res.hotelId) }}</span>
                <span class="text-outline text-xs italic">Chambre #{{ res.roomId }}</span>
              </div>
            </td>
            <td class="px-6 py-5">
              <div class="flex flex-col">
                <span class="text-on-surface">{{ formatDate(res.checkInDate) }} &mdash; {{ formatDate(res.checkOutDate) }}</span>
                <span class="text-outline text-xs">{{ res.numberOfNights }} nuits</span>
              </div>
            </td>
            <td class="px-6 py-5 text-center font-semibold">{{ res.numberOfNights }}</td>
            <td class="px-6 py-5 font-bold text-[#008F90]">{{ res.totalAmount }}.00 €</td>
            <td class="px-6 py-5">
              <span v-if="res.status === 'CONFIRMED' || res.status === 'COMPLETED'" class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#008F90]/10 text-[#008F90] border border-[#008F90]/20 inline-block uppercase tracking-wider">CONFIRMÉE</span>
              <span v-else-if="res.status === 'PENDING'" class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#CDAF5D]/10 text-[#735c10] border border-[#CDAF5D]/20 inline-block uppercase tracking-wider">EN_ATTENTE</span>
              <span v-else-if="res.status === 'CANCELLED'" class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-surface-variant text-on-surface-variant border border-outline-variant/30 inline-block uppercase tracking-wider">ANNULÉE</span>
              <span v-else class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-error/10 text-error border border-error/20 inline-block uppercase tracking-wider">BLOQUÉE</span>
            </td>
            <td class="px-6 py-5 text-right">
              <div class="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button class="p-1.5 text-outline hover:text-[#008F90] hover:bg-[#008F90]/10 rounded-lg transition-all active:scale-90" title="Valider">
                  <span class="material-symbols-outlined text-[20px]">check</span>
                </button>
                <button class="p-1.5 text-outline hover:text-error hover:bg-error/10 rounded-lg transition-all active:scale-90" title="Bloquer">
                  <span class="material-symbols-outlined text-[20px]">block</span>
                </button>
                <button class="p-1.5 text-outline hover:text-secondary hover:bg-secondary/10 rounded-lg transition-all active:scale-90" title="Détails">
                  <span class="material-symbols-outlined text-[20px]">visibility</span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- Pagination Placeholder -->
      <div class="px-6 py-4 bg-surface-container-high/20 border-t border-outline-variant/10 flex items-center justify-between">
        <p class="text-xs text-outline">Affichage de <span class="font-bold text-on-surface">1-{{ reservations.length }}</span> sur <span class="font-bold text-on-surface">{{ reservations.length }}</span> réservations</p>
        <div class="flex items-center gap-2">
          <button class="p-1 rounded bg-surface-container text-outline opacity-50 cursor-not-allowed">
            <span class="material-symbols-outlined text-sm">chevron_left</span>
          </button>
          <button class="h-8 w-8 rounded bg-primary text-white text-xs font-bold hover:brightness-110 active:scale-90 transition-all">1</button>
          <button class="p-1 rounded bg-surface-container text-outline hover:bg-surface-container-highest transition-colors active:scale-90 opacity-50 cursor-not-allowed">
            <span class="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Contextual Quick Actions Bento -->
    <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="md:col-span-2 bg-gradient-to-br from-[#015081] to-[#236294] rounded-xl p-6 text-white flex justify-between items-center overflow-hidden relative group">
        <div class="relative z-10">
          <h4 class="text-xl font-bold mb-2">Alertes de disponibilité</h4>
          <p class="text-white/80 text-sm max-w-sm mb-4">3 établissements approchent de leur capacité maximale pour le prochain mois.</p>
          <button class="bg-[#CDAF5D] text-[#241a00] px-4 py-2 rounded-lg font-bold text-sm hover:brightness-110 active:scale-95 transition-all">Gérer l'inventaire</button>
        </div>
        <span class="material-symbols-outlined text-[120px] opacity-10 absolute -right-4 -bottom-4 rotate-12 group-hover:rotate-0 group-hover:opacity-20 transition-all duration-700">notifications_active</span>
      </div>
      <div class="bg-surface-container-lowest p-6 rounded-xl shadow-md border border-outline-variant/10">
        <h4 class="text-lg font-bold text-secondary mb-4">Raccourcis Admin</h4>
        <div class="space-y-1">
          <NuxtLink to="/admin/logs" class="flex items-center justify-between p-2.5 rounded-lg hover:bg-surface-container-low transition-all group">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">description</span>
              <span class="text-sm font-medium">Logs d'activité</span>
            </div>
            <span class="material-symbols-outlined text-outline group-hover:translate-x-1 transition-transform">chevron_right</span>
          </NuxtLink>
          <NuxtLink to="/admin/automations" class="flex items-center justify-between p-2.5 rounded-lg hover:bg-surface-container-low transition-all group">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">mail</span>
              <span class="text-sm font-medium">Relances automatiques</span>
            </div>
            <span class="material-symbols-outlined text-outline group-hover:translate-x-1 transition-transform">chevron_right</span>
          </NuxtLink>
          <NuxtLink to="/admin/refunds" class="flex items-center justify-between p-2.5 rounded-lg hover:bg-surface-container-low transition-all group">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">account_balance_wallet</span>
              <span class="text-sm font-medium">Remboursements</span>
            </div>
            <span class="material-symbols-outlined text-outline group-hover:translate-x-1 transition-transform">chevron_right</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { MockReservationRepository } from '~/repositories/mock/MockReservationRepository'
import { MockHotelRepository } from '~/repositories/mock/MockHotelRepository'

definePageMeta({
  layout: 'admin'
})

const reservationRepo = new MockReservationRepository()
const hotelRepo = new MockHotelRepository()

const { data: reservationsData } = useAsyncData('admin-reservations', () => reservationRepo.getAll())
const { data: hotelsData } = useAsyncData('admin-hotels', () => hotelRepo.getAll())

const reservations = computed(() => reservationsData.value || [])
const hotels = computed(() => hotelsData.value || [])

// Stats computed properties
const confirmedCount = computed(() => {
  return reservations.value.filter(r => r.status === 'CONFIRMED' || r.status === 'COMPLETED').length
})

const pendingCount = computed(() => {
  return reservations.value.filter(r => r.status === 'PENDING').length
})

const blockedCount = computed(() => {
  return reservations.value.filter(r => r.status === 'BLOCKED' || r.status === 'REFUSED').length
})

// Helper functions for UI
const getHotelName = (id: number) => {
  const h = hotels.value.find(h => h.id === id)
  return h ? h.name : `Hôtel inconnu #${id}`
}

const formatDate = (dateStr: string) => {
  try {
    const d = new Date(dateStr)
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`
  } catch (e) {
    return dateStr
  }
}
</script>
