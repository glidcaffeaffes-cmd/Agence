<template>
  <div class="p-8 pb-32 font-['Inter'] antialiased">
    <!-- Page Header -->
    <div class="flex justify-between items-end mb-8">
      <div>
        <h2 class="text-3xl font-bold text-[#015081] tracking-tight headline-md mb-1">Hôtels Partenaires</h2>
        <p class="text-outline-variant text-sm">Gérez vos relations hôtelières et les performances du réseau VoyageHub.</p>
      </div>
      <button class="bg-[#CDAF5D] text-[#241a00] font-bold py-3 px-6 rounded-lg flex items-center gap-2 shadow-sm hover:brightness-105 active:scale-95 transition-all text-sm">
        <span class="material-symbols-outlined">add</span>
        Ajouter un partenaire
      </button>
    </div>

    <!-- Content Grid -->
    <div class="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-8">
      <div v-for="hotel in hotels" :key="hotel.id" class="partner-card-hover bg-surface-container-lowest rounded-xl overflow-hidden flex flex-col group border border-surface-variant/20 hover:-translate-y-2 hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1)] transition-all duration-300">
        <div class="relative h-48 overflow-hidden" :class="{'opacity-80': !hotel.active}">
          <img :alt="hotel.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" :src="hotel.images[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800'"/>
          <div :class="[hotel.active ? 'bg-[#CDAF5D]' : 'bg-surface-variant text-on-surface-variant']" class="absolute top-4 left-4 text-white text-[10px] font-bold px-2 py-1 rounded tracking-widest uppercase">
            {{ hotel.active ? 'Partenaire' : 'Suspendu' }}
          </div>
          <div class="absolute top-4 right-4 bg-white/90 backdrop-blur p-1.5 rounded-lg flex items-center cursor-pointer select-none">
            <span class="text-xs font-bold mr-1" :class="hotel.active ? 'text-primary' : 'text-outline-variant'">{{ hotel.active ? 'Actif' : 'Inactif' }}</span>
            <div class="status-toggle w-2 h-2 rounded-full transition-colors" :class="hotel.active ? 'bg-emerald-500' : 'bg-outline-variant'"></div>
          </div>
        </div>
        <div class="p-6 flex-1">
          <div class="flex justify-between items-start mb-2">
            <h3 class="text-xl font-bold text-secondary">{{ hotel.name }}</h3>
            <div class="flex text-[#CDAF5D]">
              <span v-for="n in hotel.stars" :key="n" class="material-symbols-outlined text-sm" style="font-variation-settings: 'FILL' 1;">star</span>
            </div>
          </div>
          <div class="flex items-center text-outline-variant text-sm gap-1 mb-4">
            <span class="material-symbols-outlined text-base">location_on</span>
            {{ hotel.city }}, {{ hotel.country }}
          </div>
          <div class="space-y-4">
            <div class="flex justify-between text-xs font-medium">
              <span class="text-outline">SIRET: {{ 200 + hotel.id }} 004 887 00012</span>
              <span class="text-outline">124 Chambres</span>
            </div>
            <div>
              <div class="flex justify-between items-center mb-1.5">
                <span class="text-xs font-bold text-secondary">Taux d'occupation</span>
                <span class="text-xs font-bold" :class="hotel.active ? 'text-primary' : 'text-outline'">{{ hotel.active ? Math.floor(Math.random() * 40 + 50) : 0 }}%</span>
              </div>
              <div class="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                <div :class="hotel.active ? 'bg-primary' : 'bg-outline-variant'" class="h-full rounded-full" :style="{ width: (hotel.active ? Math.floor(Math.random() * 40 + 50) : 0) + '%' }"></div>
              </div>
            </div>
            <p class="text-[11px] italic text-outline-variant">Partenaire depuis le {{ new Date(2022, hotel.id, 15).toLocaleDateString() }}</p>
          </div>
        </div>
        <div class="p-4 bg-surface-container-low flex justify-between gap-2 border-t border-surface-variant/20">
          <button class="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-secondary hover:bg-secondary/10 rounded-lg transition-colors active:scale-95">
            <span class="material-symbols-outlined text-base">edit</span> Modifier
          </button>
          <NuxtLink :to="`/hotels/${hotel.id}`" target="_blank" class="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-primary hover:bg-primary/10 rounded-lg transition-colors active:scale-95">
            <span class="material-symbols-outlined text-base">visibility</span> Voir hôtel
          </NuxtLink>
          <button class="w-10 h-10 flex items-center justify-center text-error hover:bg-error/10 rounded-lg transition-colors active:scale-95" title="Retirer partenariat">
            <span class="material-symbols-outlined">delete</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Strip Footer -->
    <footer class="fixed bottom-0 right-0 left-64 bg-white/90 backdrop-blur-xl border-t border-outline-variant/20 px-8 py-6 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
      <div class="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-8">
        <div class="flex gap-12">
          <div class="flex flex-col">
            <span class="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Total Partenaires</span>
            <div class="flex items-baseline gap-2">
              <span class="text-3xl font-extrabold text-[#015081]">{{ hotels.length }}</span>
              <span class="text-xs text-emerald-600 font-bold flex items-center gap-0.5 bg-emerald-50 px-1.5 py-0.5 rounded">
                <span class="material-symbols-outlined text-xs">trending_up</span> +5
              </span>
            </div>
          </div>
          <div class="flex flex-col">
            <span class="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Chambres Gérées</span>
            <div class="flex items-baseline gap-2">
              <span class="text-3xl font-extrabold text-[#015081]">8,420</span>
            </div>
          </div>
          <div class="flex flex-col">
            <span class="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Revenus Partenaires</span>
            <div class="flex items-baseline gap-2">
              <span class="text-3xl font-extrabold text-primary">€1.42M</span>
              <span class="text-xs text-emerald-600 font-bold flex items-center gap-0.5 bg-emerald-50 px-1.5 py-0.5 rounded">
                <span class="material-symbols-outlined text-xs">trending_up</span> +12%
              </span>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <button class="text-sm font-bold text-secondary py-2.5 px-5 border-2 border-secondary/20 rounded-lg hover:bg-secondary/5 transition-all active:scale-95">
            Exporter Rapport PDF
          </button>
          <NuxtLink to="/admin" class="bg-primary text-white font-bold py-2.5 px-8 rounded-lg shadow-lg shadow-primary/20 hover:brightness-110 transition-all active:scale-95 block">
            Dashboard Global
          </NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { MockHotelRepository } from '~/repositories/mock/MockHotelRepository'

definePageMeta({
  layout: 'admin'
})

const hotelRepo = new MockHotelRepository()
const { data: hotelsData } = useAsyncData('admin-partners', () => hotelRepo.getAll())

const hotels = computed(() => hotelsData.value || [])
</script>
