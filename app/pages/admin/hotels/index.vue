<template>
  <div class="p-8 max-w-7xl mx-auto antialiased">
    <div class="flex justify-between items-end mb-8">
      <div>
        <h2 class="text-3xl font-bold text-[#015081] tracking-tight mb-1">{{ t("adminHotels.title") }}</h2>
        <p class="text-outline text-sm font-medium">{{ t("adminHotels.subtitle") }}</p>
      </div>
      <button
        @click="isModalOpen = true"
        class="bg-[#008F90] text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 hover:bg-[#007a7a] active:scale-95 transition-all shadow-sm"
      >
        <span class="material-symbols-outlined">add_circle</span>
        {{ t("adminHotels.addHotel") }}
      </button>
    </div>

    <div class="bg-white rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(1,80,129,0.06)]">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-surface-container-high/50 border-b border-surface-variant/30">
            <th class="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-widest">ID</th>
            <th class="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-widest">{{ t("adminHotels.name") }}</th>
            <th class="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-widest">{{ t("adminHotels.cityCountry") }}</th>
            <th class="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-widest">{{ t("adminHotels.stars") }}</th>
            <th class="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-widest">{{ t("adminHotels.status") }}</th>
            <th class="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-widest text-right">{{ t("adminHotels.actions") }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-surface-variant/20">
          <tr v-for="hotel in hotels" :key="hotel.id" class="hover:bg-surface-container-low/50 transition-colors group">
            <td class="px-6 py-4 text-sm text-outline font-mono">VH-{{ String(hotel.id).padStart(3, '0') }}</td>
            <td class="px-6 py-4 font-bold text-on-surface group-hover:text-primary transition-colors">{{ hotel.name }}</td>
            <td class="px-6 py-4 text-sm text-on-surface-variant">{{ hotel.city }}, {{ hotel.country }}</td>
            <td class="px-6 py-4">
              <div class="flex text-[#CDAF5D]">
                <span v-for="n in 5" :key="n" class="material-symbols-outlined text-sm" :style="n <= hotel.stars ? 'font-variation-settings: \'FILL\' 1;' : ''">star</span>
              </div>
            </td>
            <td class="px-6 py-4">
              <span v-if="hotel.active" class="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">{{ t("adminHotels.active") }}</span>
              <span v-else class="px-2.5 py-1 rounded-full bg-error-container text-error text-[10px] font-bold uppercase tracking-wider">{{ t("adminHotels.inactive") }}</span>
            </td>
            <td class="px-6 py-4 text-right space-x-1">
              <button @click="openEdit(hotel)" class="p-2 hover:bg-white rounded-lg text-secondary transition-all active:scale-90 shadow-sm border border-transparent hover:border-surface-variant/30">
                <span class="material-symbols-outlined text-lg">edit</span>
              </button>
              <button @click="handleDelete(hotel.id)" class="p-2 hover:bg-white rounded-lg text-error transition-all active:scale-90 shadow-sm border border-transparent hover:border-surface-variant/30">
                <span class="material-symbols-outlined text-lg">delete</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center bg-on-surface/40 backdrop-blur-sm px-4" @click.self="isModalOpen = false">
      <div class="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden">
        <div class="bg-[#015081] px-6 py-4 flex items-center justify-between">
          <h3 class="text-white font-bold tracking-tight">{{ t("adminHotels.addNewHotel") }}</h3>
          <button @click="isModalOpen = false" class="text-white/60 hover:text-white">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <div class="p-8 space-y-4">
          <p v-if="modalError" class="text-sm font-semibold text-error bg-error-container/30 border border-error/20 rounded-lg px-3 py-2">
            {{ modalError }}
          </p>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-[11px] font-bold text-outline uppercase">{{ t("adminHotels.name") }}</label>
              <input v-model="form.name" class="w-full px-3 py-2 border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" type="text">
            </div>
            <div class="space-y-1">
              <label class="text-[11px] font-bold text-outline uppercase">{{ t("adminHotels.stars") }}</label>
              <input v-model.number="form.stars" class="w-full px-3 py-2 border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" type="number" min="1" max="5">
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-[11px] font-bold text-outline uppercase">{{ t("adminHotels.address") }}</label>
              <input v-model="form.address" class="w-full px-3 py-2 border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" type="text">
            </div>
            <div class="space-y-1">
              <label class="text-[11px] font-bold text-outline uppercase">{{ t("adminHotels.city") }}</label>
              <input v-model="form.city" class="w-full px-3 py-2 border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" type="text">
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-[11px] font-bold text-outline uppercase">{{ t("adminHotels.country") }}</label>
              <input v-model="form.country" class="w-full px-3 py-2 border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" type="text">
            </div>
            <div class="space-y-1">
              <label class="text-[11px] font-bold text-outline uppercase">{{ t("adminHotels.agency") }}</label>
              <select
                v-model.number="form.agencyVoyageId"
                class="w-full px-3 py-2 border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none bg-white"
              >
                <option v-for="agency in agencies" :key="agency.id" :value="agency.id">
                  #{{ agency.id }} - {{ agency.nomAgence }}
                </option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-[11px] font-bold text-outline uppercase">{{ t("adminHotels.email") }}</label>
              <input v-model="form.email" class="w-full px-3 py-2 border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" type="email">
            </div>
            <div class="space-y-1">
              <label class="text-[11px] font-bold text-outline uppercase">{{ t("adminHotels.phone") }}</label>
              <input v-model="form.phone" class="w-full px-3 py-2 border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" type="text">
            </div>
          </div>
          <div class="space-y-1">
            <label class="text-[11px] font-bold text-outline uppercase">{{ t("adminHotels.description") }}</label>
            <textarea v-model="form.description" rows="3" class="w-full px-3 py-2 border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none resize-none"></textarea>
          </div>
          <div class="pt-4 flex gap-3">
            <button @click="isModalOpen = false" class="flex-1 py-2.5 rounded-lg font-bold text-outline hover:bg-surface-container-low transition-colors">{{ t("adminHotels.cancel") }}</button>
            <button @click="handleSave" class="flex-1 py-2.5 bg-[#008F90] text-white rounded-lg font-bold hover:bg-[#007a7a] transition-colors">{{ t("adminHotels.save") }}</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="editingHotel" class="fixed inset-0 z-[100] flex items-center justify-center bg-on-surface/40 backdrop-blur-sm px-4" @click.self="editingHotel = null">
      <div class="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
        <div class="bg-[#015081] px-6 py-4 flex items-center justify-between">
          <h3 class="text-white font-bold tracking-tight">{{ t("adminHotels.editHotel") }}</h3>
          <button @click="editingHotel = null" class="text-white/60 hover:text-white">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <div class="p-8 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-[11px] font-bold text-outline uppercase">{{ t("adminHotels.name") }}</label>
              <input v-model="editingHotel.name" class="w-full px-3 py-2 border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" type="text">
            </div>
            <div class="space-y-1">
              <label class="text-[11px] font-bold text-outline uppercase">{{ t("adminHotels.stars") }}</label>
              <input v-model.number="editingHotel.stars" class="w-full px-3 py-2 border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" type="number" min="1" max="5">
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-[11px] font-bold text-outline uppercase">{{ t("adminHotels.city") }}</label>
              <input v-model="editingHotel.city" class="w-full px-3 py-2 border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" type="text">
            </div>
            <div class="space-y-1">
              <label class="text-[11px] font-bold text-outline uppercase">{{ t("adminHotels.country") }}</label>
              <input v-model="editingHotel.country" class="w-full px-3 py-2 border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" type="text">
            </div>
          </div>
          <div class="pt-4 flex gap-3">
            <button @click="editingHotel = null" class="flex-1 py-2.5 rounded-lg font-bold text-outline hover:bg-surface-container-low transition-colors">{{ t("adminHotels.cancel") }}</button>
            <button @click="saveEdit" class="flex-1 py-2.5 bg-[#008F90] text-white rounded-lg font-bold hover:bg-[#007a7a] transition-colors">{{ t("adminHotels.save") }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Hotel } from '~/types/models'
import { HotelService } from "~/services/HotelService";

definePageMeta({ layout: 'admin' })

type AgencyOption = {
  id: number
  nomAgence: string
  actif: boolean
}

const service = new HotelService()
const { t } = useAppI18n()
const { data: hotelsData, refresh } = useAsyncData('admin-hotels', () => service.getAll())
const hotels = computed(() => hotelsData.value || [])
const { data: agenciesData } = useAsyncData('admin-agencies', async () => {
  const agencies = await $fetch<AgencyOption[]>('/api/agences-voyage')
  return (agencies || []).filter((agency) => agency.actif)
})
const agencies = computed(() => agenciesData.value || [])

const isModalOpen = ref(false)
const editingHotel = ref<Hotel | null>(null)
const modalError = ref('')
const form = ref<Omit<Hotel, 'id'>>({
  name: '',
  address: '',
  city: '',
  country: '',
  stars: 5,
  description: '',
  email: '',
  phone: '',
  active: true,
  partner: false,
  agencyVoyageId: 1,
  images: [],
  amenities: [],
})

function resetForm() {
  const defaultAgencyId = agencies.value[0]?.id ?? 1
  form.value = {
    name: '',
    address: '',
    city: '',
    country: '',
    stars: 5,
    description: '',
    email: '',
    phone: '',
    active: true,
    partner: false,
    agencyVoyageId: defaultAgencyId,
    images: [],
    amenities: [],
  }
}

function openEdit(hotel: Hotel) {
  editingHotel.value = { ...hotel }
}

async function handleSave() {
  modalError.value = ''
  if (!agencies.value.length) {
    modalError.value = t("adminHotels.noActiveAgency")
    return
  }

  try {
    await service.create(form.value)
    resetForm()
    isModalOpen.value = false
    await refresh()
  } catch (error: any) {
    modalError.value = error?.message || t("adminHotels.addError")
  }
}

async function saveEdit() {
  if (!editingHotel.value) return
  try {
    await service.update(editingHotel.value.id, editingHotel.value)
    editingHotel.value = null
    await refresh()
  } catch (error: any) {
    modalError.value = error?.message || t("adminHotels.editError")
  }
}

async function handleDelete(id: number) {
  if (!confirm(t("adminHotels.deleteConfirm"))) return
  try {
    await service.delete(id)
    await refresh()
  } catch (error: any) {
    modalError.value = error?.message || t("adminHotels.deleteError")
  }
}

watch(
  agencies,
  (items) => {
    if (!items.length) return
    if (!items.some((agency) => agency.id === form.value.agencyVoyageId)) {
      form.value.agencyVoyageId = items[0].id
    }
  },
  { immediate: true },
)
</script>
