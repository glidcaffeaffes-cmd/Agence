<template>
  <div class="p-8 max-w-7xl mx-auto font-['Inter'] antialiased">
    <!-- Header -->
    <div class="flex justify-between items-end mb-8">
      <div>
        <h2 class="text-3xl font-bold text-[#015081] tracking-tight mb-1">Gestion des Hôtels</h2>
        <p class="text-outline text-sm font-medium">Gérez votre inventaire hôtelier.</p>
      </div>
      <button
        @click="isModalOpen = true"
        class="bg-[#008F90] text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 hover:bg-[#007a7a] active:scale-95 transition-all shadow-sm"
      >
        <span class="material-symbols-outlined">add_circle</span>
        Ajouter un hôtel
      </button>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(1,80,129,0.06)]">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-surface-container-high/50 border-b border-surface-variant/30">
            <th class="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-widest">ID</th>
            <th class="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-widest">Nom</th>
            <th class="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-widest">Ville / Pays</th>
            <th class="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-widest">Étoiles</th>
            <th class="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-widest">Statut</th>
            <th class="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-widest text-right">Actions</th>
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
              <span v-if="hotel.active" class="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">Actif</span>
              <span v-else class="px-2.5 py-1 rounded-full bg-error-container text-error text-[10px] font-bold uppercase tracking-wider">Inactif</span>
            </td>
            <td class="px-6 py-4 text-right space-x-1">
              <button @click="openEdit(hotel)" class="p-2 hover:bg-white rounded-lg text-secondary transition-all active:scale-90 shadow-sm border border-transparent hover:border-surface-variant/30">
                <span class="material-symbols-outlined text-lg">edit</span>
              </button>
              <button @click="handleDelete(hotel.id)" class="p-2 hover:bg-white rounded-lg text-error transition-all active:scale-90 shadow-sm border border-transparent hover:border-surface-variant/30">
                <span class="material-symbols-outlined text-lg">delete</span>
              </button>
              <button @click="handleView(hotel.id)" class="p-2 hover:bg-white rounded-lg text-primary transition-all active:scale-90 shadow-sm border border-transparent hover:border-surface-variant/30">
                <span class="material-symbols-outlined text-lg">visibility</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center bg-on-surface/40 backdrop-blur-sm px-4" @click.self="isModalOpen = false">
      <div class="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
        <div class="bg-[#015081] px-6 py-4 flex items-center justify-between">
          <h3 class="text-white font-bold tracking-tight">Ajouter un Nouvel Hôtel</h3>
          <button @click="isModalOpen = false" class="text-white/60 hover:text-white">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <div class="p-8 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-[11px] font-bold text-outline uppercase">Nom de l'hôtel</label>
              <input v-model="form.name" class="w-full px-3 py-2 border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="ex: Palace de la Mer" type="text">
            </div>
            <div class="space-y-1">
              <label class="text-[11px] font-bold text-outline uppercase">Étoiles</label>
              <select v-model="form.stars" class="w-full px-3 py-2 border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none">
                <option :value="5">5 Étoiles</option>
                <option :value="4">4 Étoiles</option>
                <option :value="3">3 Étoiles</option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-[11px] font-bold text-outline uppercase">Ville</label>
              <input v-model="form.city" class="w-full px-3 py-2 border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="Paris" type="text">
            </div>
            <div class="space-y-1">
              <label class="text-[11px] font-bold text-outline uppercase">Pays</label>
              <input v-model="form.country" class="w-full px-3 py-2 border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="France" type="text">
            </div>
          </div>
          <div class="pt-4 flex gap-3">
            <button @click="isModalOpen = false" class="flex-1 py-2.5 rounded-lg font-bold text-outline hover:bg-surface-container-low transition-colors">Annuler</button>
            <button @click="handleSave" class="flex-1 py-2.5 bg-[#008F90] text-white rounded-lg font-bold hover:bg-[#007a7a] transition-colors">Enregistrer</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="editingHotel" class="fixed inset-0 z-[100] flex items-center justify-center bg-on-surface/40 backdrop-blur-sm px-4" @click.self="editingHotel = null">
      <div class="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
        <div class="bg-[#015081] px-6 py-4 flex items-center justify-between">
          <h3 class="text-white font-bold tracking-tight">Modifier l'Hôtel</h3>
          <button @click="editingHotel = null" class="text-white/60 hover:text-white">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <div class="p-8 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-[11px] font-bold text-outline uppercase">Nom</label>
              <input v-model="editingHotel.name" class="w-full px-3 py-2 border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" type="text">
            </div>
            <div class="space-y-1">
              <label class="text-[11px] font-bold text-outline uppercase">Étoiles</label>
              <select v-model="editingHotel.stars" class="w-full px-3 py-2 border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none">
                <option :value="5">5</option><option :value="4">4</option><option :value="3">3</option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-[11px] font-bold text-outline uppercase">Ville</label>
              <input v-model="editingHotel.city" class="w-full px-3 py-2 border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" type="text">
            </div>
            <div class="space-y-1">
              <label class="text-[11px] font-bold text-outline uppercase">Pays</label>
              <input v-model="editingHotel.country" class="w-full px-3 py-2 border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" type="text">
            </div>
          </div>
          <div class="pt-4 flex gap-3">
            <button @click="editingHotel = null" class="flex-1 py-2.5 rounded-lg font-bold text-outline hover:bg-surface-container-low transition-colors">Annuler</button>
            <button @click="saveEdit" class="flex-1 py-2.5 bg-[#008F90] text-white rounded-lg font-bold hover:bg-[#007a7a] transition-colors">Enregistrer</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Hotel } from '~/types/models'
import { HotelService } from '~/services'

definePageMeta({ layout: 'admin' })

const service = new HotelService()
const { data: hotelsData, refresh } = useAsyncData('admin-hotels', () => service.getAll())
const hotels = computed(() => hotelsData.value || [])

const isModalOpen = ref(false)
const editingHotel = ref<Hotel | null>(null)
const form = ref({ name: '', city: '', country: '', stars: 5 })

function openEdit(hotel: Hotel) { editingHotel.value = { ...hotel } }

async function handleSave() {
  if (!form.value.name.trim()) return
  await service.create({ ...form.value, address: '', description: '', email: '', phone: '', active: true, images: [], amenities: [] })
  form.value = { name: '', city: '', country: '', stars: 5 }
  isModalOpen.value = false
  await refresh()
}

async function saveEdit() {
  if (!editingHotel.value) return
  await service.update(editingHotel.value.id, editingHotel.value)
  editingHotel.value = null
  await refresh()
}

async function handleDelete(id: number) {
  if (!confirm('Supprimer cet hôtel ?')) return
  await service.delete(id)
  await refresh()
}

function handleView(id: number) {
  navigateTo(`/admin/hotels/${id}`)
}
</script>
