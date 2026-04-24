<template>
  <div class="p-8 max-w-7xl mx-auto antialiased">
    <!-- Header -->
    <div class="flex justify-between items-end mb-8">
      <div>
        <h2 class="text-3xl font-bold text-[#015081] tracking-tight mb-1">Gestion des Réservations</h2>
        <p class="text-outline text-sm">Supervisez et gérez tous les flux de réservations.</p>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(1,80,129,0.06)]">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-surface-container-high/50 border-b border-surface-variant/30 text-outline text-xs font-bold uppercase tracking-widest">
            <th class="px-6 py-4">Code</th>
            <th class="px-6 py-4">Client</th>
            <th class="px-6 py-4">Hôtel / Chambre</th>
            <th class="px-6 py-4">Dates</th>
            <th class="px-6 py-4">Montant</th>
            <th class="px-6 py-4">Statut</th>
            <th class="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="text-sm divide-y divide-surface-variant/20">
          <tr v-for="res in reservations" :key="res.id" class="hover:bg-surface-container-low/40 transition-colors group">
            <td class="px-6 py-5 font-mono font-bold text-secondary">{{ res.confirmationCode }}</td>
            <td class="px-6 py-5 font-medium">Client #{{ res.accountId }}</td>
            <td class="px-6 py-5">
              <div class="flex flex-col">
                <span class="font-semibold">{{ getHotelName(res.hotelId) }}</span>
                <span class="text-outline text-xs">Chambre #{{ res.roomId }}</span>
              </div>
            </td>
            <td class="px-6 py-5 text-on-surface-variant">
              {{ formatDate(res.checkInDate) }} — {{ formatDate(res.checkOutDate) }}
            </td>
            <td class="px-6 py-5 font-bold text-[#008F90]">{{ res.totalAmount }} €</td>
            <td class="px-6 py-5">
              <span v-if="res.status === 'CONFIRMED' || res.status === 'COMPLETED'" class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-primary/10 text-primary uppercase tracking-wider">Confirmée</span>
              <span v-else-if="res.status === 'PENDING'" class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#CDAF5D]/10 text-[#735c10] uppercase tracking-wider">En attente</span>
              <span v-else-if="res.status === 'CANCELLED'" class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-surface-variant text-on-surface-variant uppercase tracking-wider">Annulée</span>
              <span v-else class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-error/10 text-error uppercase tracking-wider">Bloquée</span>
            </td>
            <td class="px-6 py-5 text-right space-x-1">
              <button @click="handleConfirm(res.id)" title="Confirmer" class="p-2 hover:bg-white rounded-lg text-primary transition-all active:scale-90 shadow-sm border border-transparent hover:border-surface-variant/30">
                <span class="material-symbols-outlined text-lg">check</span>
              </button>
              <button @click="handleCancel(res.id)" title="Annuler" class="p-2 hover:bg-white rounded-lg text-error transition-all active:scale-90 shadow-sm border border-transparent hover:border-surface-variant/30">
                <span class="material-symbols-outlined text-lg">block</span>
              </button>
              <button @click="handleDelete(res.id)" title="Supprimer" class="p-2 hover:bg-white rounded-lg text-outline transition-all active:scale-90 shadow-sm border border-transparent hover:border-surface-variant/30">
                <span class="material-symbols-outlined text-lg">delete</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ReservationService } from '~/services'
import { HotelService } from '~/services'

definePageMeta({ layout: 'admin' })

const reservationService = new ReservationService()
const hotelService = new HotelService()

const { data: reservationsData, refresh } = useAsyncData('admin-reservations', () => reservationService.getAll())
const { data: hotelsData } = useAsyncData('admin-hotels-r', () => hotelService.getAll())

const reservations = computed(() => reservationsData.value || [])
const hotels = computed(() => hotelsData.value || [])

function getHotelName(id: number) {
  return hotels.value.find(h => h.id === id)?.name ?? `Hôtel #${id}`
}

function formatDate(d: string) {
  try { return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }) }
  catch { return d }
}

async function handleConfirm(id: number) {
  await reservationService.confirm(id)
  await refresh()
}

async function handleCancel(id: number) {
  await reservationService.cancel(id)
  await refresh()
}

async function handleDelete(id: number) {
  if (!confirm('Supprimer cette réservation ?')) return
  await reservationService.delete(id)
  await refresh()
}
</script>
