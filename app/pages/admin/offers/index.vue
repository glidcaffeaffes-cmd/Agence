<template>
  <div class="p-8 max-w-7xl mx-auto antialiased">
    <Head>
      <title>Offers & Promotions - Admin</title>
    </Head>

    <div class="flex justify-between items-end mb-8">
      <div>
        <h2 class="text-3xl font-bold text-[#015081] tracking-tight mb-1">Offers & Promotions</h2>
        <p class="text-outline text-sm">Create hotel promotions and manage seasonal discounts.</p>
      </div>
      <button
        @click="openCreate"
        class="bg-[#008F90] text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 hover:bg-[#007a7a] active:scale-95 transition-all shadow-sm"
      >
        <span class="material-symbols-outlined">add_circle</span>
        Create offer
      </button>
    </div>

    <div v-if="error" class="mb-4 rounded-lg border border-error/20 bg-error/5 px-4 py-3 text-sm text-error">
      {{ error }}
    </div>

    <div class="bg-white rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(1,80,129,0.06)]">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-surface-container-high/50 border-b border-surface-variant/30 text-outline text-xs font-bold uppercase tracking-widest">
            <th class="px-6 py-4">ID</th>
            <th class="px-6 py-4">Offer</th>
            <th class="px-6 py-4">Hotel</th>
            <th class="px-6 py-4">Discount</th>
            <th class="px-6 py-4">Period</th>
            <th class="px-6 py-4">Status</th>
            <th class="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-surface-variant/20 text-sm">
          <tr v-if="loading">
            <td colspan="7" class="px-6 py-8 text-center text-outline">Loading offers...</td>
          </tr>
          <tr v-else-if="offers.length === 0">
            <td colspan="7" class="px-6 py-8 text-center text-outline">No offers yet.</td>
          </tr>
          <tr v-for="offer in offers" v-else :key="offer.id" class="hover:bg-surface-container-low/50 transition-colors group">
            <td class="px-6 py-4 font-mono text-outline">#{{ offer.id }}</td>
            <td class="px-6 py-4">
              <p class="font-semibold text-on-surface">{{ offer.title }}</p>
              <p class="text-xs text-outline line-clamp-1">{{ offer.description || 'No description' }}</p>
            </td>
            <td class="px-6 py-4 text-on-surface-variant">{{ offer.hotelName || hotelName(offer.hotelId) }}</td>
            <td class="px-6 py-4">
              <span class="px-2.5 py-1 rounded-full bg-[#CDAF5D]/10 text-[#735c10] text-xs font-bold">
                {{ offer.discountRate }}% OFF
              </span>
            </td>
            <td class="px-6 py-4 text-on-surface-variant">{{ formatDate(offer.startDate) }} -> {{ formatDate(offer.endDate) }}</td>
            <td class="px-6 py-4">
              <span v-if="isLive(offer)" class="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase">Live</span>
              <span v-else-if="offer.active" class="px-2.5 py-1 rounded-full bg-[#CDAF5D]/10 text-[#735c10] text-[10px] font-bold uppercase">Scheduled</span>
              <span v-else class="px-2.5 py-1 rounded-full bg-surface-variant text-on-surface-variant text-[10px] font-bold uppercase">Inactive</span>
            </td>
            <td class="px-6 py-4 text-right space-x-1">
              <button @click="openEdit(offer)" class="p-2 hover:bg-white rounded-lg text-secondary transition-all active:scale-90 shadow-sm border border-transparent hover:border-surface-variant/30">
                <span class="material-symbols-outlined text-lg">edit</span>
              </button>
              <button @click="handleDelete(offer.id)" class="p-2 hover:bg-white rounded-lg text-error transition-all active:scale-90 shadow-sm border border-transparent hover:border-surface-variant/30">
                <span class="material-symbols-outlined text-lg">delete</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-on-surface/40 backdrop-blur-sm px-4" @click.self="closeModal">
      <div class="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
        <div class="bg-[#015081] px-6 py-4 flex items-center justify-between">
          <h3 class="text-white font-bold">{{ editingId ? 'Edit offer' : 'Create offer' }}</h3>
          <button @click="closeModal" class="text-white/60 hover:text-white">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <div class="p-6 space-y-4">
          <p v-if="modalError" class="text-sm font-semibold text-error bg-error-container/30 border border-error/20 rounded-lg px-3 py-2">
            {{ modalError }}
          </p>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-[11px] font-bold text-outline uppercase">Hotel</label>
              <select v-model.number="form.hotelId" class="w-full px-3 py-2 border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none bg-white">
                <option v-for="hotel in hotels" :key="hotel.id" :value="hotel.id">
                  {{ hotel.name }} - {{ hotel.city }}
                </option>
              </select>
            </div>
            <div class="space-y-1">
              <label class="text-[11px] font-bold text-outline uppercase">Discount (%)</label>
              <input v-model.number="form.discountRate" class="w-full px-3 py-2 border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" type="number" min="1" max="100">
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-[11px] font-bold text-outline uppercase">Title</label>
            <input v-model="form.title" class="w-full px-3 py-2 border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="Summer escape" type="text">
          </div>

          <div class="space-y-1">
            <label class="text-[11px] font-bold text-outline uppercase">Description</label>
            <textarea v-model="form.description" rows="3" class="w-full px-3 py-2 border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none resize-none"></textarea>
          </div>

          <div class="space-y-1">
            <label class="text-[11px] font-bold text-outline uppercase">Image URL</label>
            <input v-model="form.image" class="w-full px-3 py-2 border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" type="url">
          </div>

          <div class="grid grid-cols-3 gap-4">
            <div class="space-y-1">
              <label class="text-[11px] font-bold text-outline uppercase">Start</label>
              <input v-model="form.startDate" class="w-full px-3 py-2 border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" type="date">
            </div>
            <div class="space-y-1">
              <label class="text-[11px] font-bold text-outline uppercase">End</label>
              <input v-model="form.endDate" class="w-full px-3 py-2 border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" type="date">
            </div>
            <div class="space-y-1">
              <label class="text-[11px] font-bold text-outline uppercase">Status</label>
              <select v-model="form.active" class="w-full px-3 py-2 border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none bg-white">
                <option :value="true">Active</option>
                <option :value="false">Inactive</option>
              </select>
            </div>
          </div>

          <div class="pt-2 flex gap-3">
            <button @click="closeModal" class="flex-1 py-2.5 rounded-lg font-bold text-outline hover:bg-surface-container-low transition-colors">Cancel</button>
            <button @click="saveOffer" class="flex-1 py-2.5 bg-[#008F90] text-white rounded-lg font-bold hover:bg-[#007a7a] transition-colors">Save</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Hotel, Offer } from '~/types/models'
import { HotelService, OfferService } from '~/services'

definePageMeta({ layout: 'admin' })

type OfferForm = Omit<Offer, 'id' | 'hotelName'>

const offerService = new OfferService()
const hotelService = new HotelService()

const { data: offersData, pending: loading, refresh } = useAsyncData('admin-offers', () => offerService.getAll())
const { data: hotelsData } = useAsyncData('admin-offer-hotels', () => hotelService.getAll())

const offers = computed(() => offersData.value || [])
const hotels = computed(() => hotelsData.value || [])
const error = ref<string | null>(null)
const modalError = ref('')
const showModal = ref(false)
const editingId = ref<number | null>(null)
const form = ref<OfferForm>(emptyForm())

function emptyForm(): OfferForm {
  const today = new Date().toISOString().slice(0, 10)
  const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)

  return {
    hotelId: hotels.value[0]?.id ?? 1,
    title: '',
    description: '',
    discountRate: 10,
    startDate: today,
    endDate: nextWeek,
    active: true,
    image: '',
  }
}

function hotelName(id: number) {
  const hotel = hotels.value.find((item: Hotel) => item.id === id)
  return hotel ? hotel.name : `Hotel #${id}`
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

function toDateInput(value: string) {
  return new Date(value).toISOString().slice(0, 10)
}

function isLive(offer: Offer) {
  const now = Date.now()
  return offer.active && new Date(offer.startDate).getTime() <= now && new Date(offer.endDate).getTime() >= now
}

function openCreate() {
  editingId.value = null
  form.value = emptyForm()
  modalError.value = ''
  showModal.value = true
}

function openEdit(offer: Offer) {
  editingId.value = offer.id
  form.value = {
    hotelId: offer.hotelId,
    title: offer.title,
    description: offer.description,
    discountRate: offer.discountRate,
    startDate: toDateInput(offer.startDate),
    endDate: toDateInput(offer.endDate),
    active: offer.active,
    image: offer.image,
  }
  modalError.value = ''
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingId.value = null
}

function validateForm() {
  if (!form.value.title.trim()) return 'Title is required.'
  if (!form.value.hotelId) return 'Select a hotel.'
  if (form.value.discountRate < 1 || form.value.discountRate > 100) return 'Discount must be between 1 and 100.'
  if (new Date(form.value.endDate) <= new Date(form.value.startDate)) return 'End date must be after start date.'
  return ''
}

async function saveOffer() {
  modalError.value = validateForm()
  if (modalError.value) return

  try {
    error.value = null
    const payload = { ...form.value, image: form.value.image || undefined }
    if (editingId.value) {
      await offerService.update(editingId.value, payload)
    } else {
      await offerService.create(payload)
    }
    closeModal()
    await refresh()
  } catch (cause: any) {
    const message = cause?.message || 'Unable to save this offer.'
    modalError.value =
      message === 'An active offer already exists for this hotel in the selected date range.'
        ? ''
        : message
  }
}

async function handleDelete(id: number) {
  if (!confirm('Delete this offer?')) return
  try {
    error.value = null
    await offerService.delete(id)
    await refresh()
  } catch (cause: any) {
    error.value = cause?.message || 'Unable to delete this offer.'
  }
}

watch(
  hotels,
  (items) => {
    if (!items.length) return
    if (!items.some((hotel: Hotel) => hotel.id === form.value.hotelId)) {
      form.value.hotelId = items[0].id
    }
  },
  { immediate: true },
)
</script>
