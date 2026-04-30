<template>
  <div class="p-8 antialiased">
    <!-- Page Header -->
    <div class="flex justify-between items-end mb-8">
      <div>
        <h2 class="text-3xl font-bold text-[#015081] tracking-tight headline-md mb-1">{{ t("adminPartners.title") }}</h2>
        <p class="text-outline-variant text-sm">{{ t("adminPartners.subtitle") }}</p>
      </div>
      <button class="bg-[#CDAF5D] text-[#241a00] font-bold py-3 px-6 rounded-lg flex items-center gap-2 shadow-sm hover:brightness-105 active:scale-95 transition-all text-sm">
        <span class="material-symbols-outlined">add</span>
        {{ t("adminPartners.addPartner") }}
      </button>
    </div>

    <!-- Content Grid -->
    <div class="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-8">
      <div v-for="hotel in hotels" :key="hotel.id" class="partner-card-hover bg-surface-container-lowest rounded-xl overflow-hidden flex flex-col group border border-surface-variant/20 hover:-translate-y-2 hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1)] transition-all duration-300">
        <div class="relative h-48 overflow-hidden" :class="{'opacity-80': !hotel.active}">
          <img :alt="hotel.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" :src="hotel.images[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800'"/>

          <div class="absolute top-4 right-4 bg-white/90 backdrop-blur p-1.5 rounded-lg flex items-center cursor-pointer select-none">
            <span class="text-xs font-bold mr-1" :class="hotel.active ? 'text-primary' : 'text-outline-variant'">{{ hotel.active ? t("adminPartners.active") : t("adminPartners.inactive") }}</span>
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
              <span class="text-outline">{{ t("adminPartners.roomsStatic", { count: 124 }) }}</span>
            </div>
            <div>
              <div class="flex justify-between items-center mb-1.5">
                <span class="text-xs font-bold text-secondary">{{ t("adminPartners.occupancyRate") }}</span>
                <span class="text-xs font-bold" :class="hotel.active ? 'text-primary' : 'text-outline'">{{ hotel.active ? Math.floor(Math.random() * 40 + 50) : 0 }}%</span>
              </div>
              <div class="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                <div :class="hotel.active ? 'bg-primary' : 'bg-outline-variant'" class="h-full rounded-full" :style="{ width: (hotel.active ? Math.floor(Math.random() * 40 + 50) : 0) + '%' }"></div>
              </div>
            </div>
            <p class="text-[11px] italic text-outline-variant">{{ t("adminPartners.partnerSince") }} {{ new Date(2022, hotel.id, 15).toLocaleDateString() }}</p>
          </div>
        </div>
        <div class="p-4 bg-surface-container-low flex justify-between gap-2 border-t border-surface-variant/20">
          <button class="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-secondary hover:bg-secondary/10 rounded-lg transition-colors active:scale-95">
            <span class="material-symbols-outlined text-base">edit</span> {{ t("adminPartners.edit") }}
          </button>
          <NuxtLink :to="`/hotels/${hotel.id}`" target="_blank" class="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-primary hover:bg-primary/10 rounded-lg transition-colors active:scale-95">
            <span class="material-symbols-outlined text-base">visibility</span> {{ t("adminPartners.viewHotel") }}
          </NuxtLink>
          <button class="w-10 h-10 flex items-center justify-center text-error hover:bg-error/10 rounded-lg transition-colors active:scale-95" :title="t('adminPartners.removePartnership')">
            <span class="material-symbols-outlined">delete</span>
          </button>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { HotelService } from "~/services/HotelService";

definePageMeta({
  layout: 'admin'
})

const hotelService = new HotelService()
const { t } = useAppI18n()
const { data: hotelsData } = useAsyncData('admin-partners', () => hotelService.getAll())

const hotels = computed(() => hotelsData.value || [])
</script>
