<template>
  <div class="p-8 max-w-7xl mx-auto antialiased">
    <Head>
      <title>Offres & Promotions — Admin</title>
    </Head>

    <!-- Header -->
    <div class="flex justify-between items-end mb-8">
      <div>
        <h2 class="text-3xl font-bold text-[#015081] tracking-tight mb-1">Offres & Promotions</h2>
        <p class="text-outline text-sm">Gérez les offres spéciales et remises saisonnières.</p>
      </div>
      <button @click="isModalOpen = true" class="bg-[#008F90] text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 hover:bg-[#007a7a] active:scale-95 transition-all shadow-sm">
        <span class="material-symbols-outlined">add_circle</span>
        Créer une offre
      </button>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(1,80,129,0.06)]">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-surface-container-high/50 border-b border-surface-variant/30 text-outline text-xs font-bold uppercase tracking-widest">
            <th class="px-6 py-4">ID</th>
            <th class="px-6 py-4">Titre</th>
            <th class="px-6 py-4">Hôtel</th>
            <th class="px-6 py-4">Remise</th>
            <th class="px-6 py-4">Période</th>
            <th class="px-6 py-4">Statut</th>
            <th class="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-surface-variant/20 text-sm">
          <tr v-if="loading"><td colspan="7" class="px-6 py-8 text-center text-outline">Chargement…</td></tr>
          <tr v-for="offer in offers" :key="offer.id" class="hover:bg-surface-container-low/50 transition-colors group">
            <td class="px-6 py-4 font-mono text-outline">#{{ offer.id }}</td>
            <td class="px-6 py-4 font-semibold text-on-surface">{{ offer.title }}</td>
            <td class="px-6 py-4 text-on-surface-variant">Hôtel #{{ offer.hotelId }}</td>
            <td class="px-6 py-4">
              <span class="px-2.5 py-1 rounded-full bg-[#CDAF5D]/10 text-[#735c10] text-xs font-bold">{{ offer.discountRate }}% OFF</span>
            </td>
            <td class="px-6 py-4 text-on-surface-variant">{{ formatDate(offer.startDate) }} → {{ formatDate(offer.endDate) }}</td>
            <td class="px-6 py-4">
              <span v-if="offer.active" class="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase">Active</span>
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

    <!-- Add Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center bg-on-surface/40 backdrop-blur-sm px-4" @click.self="isModalOpen = false">
      <div class="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
        <div class="bg-[#015081] px-6 py-4 flex items-center justify-between">
          <h3 class="text-white font-bold">Créer une offre</h3>
          <button @click="isModalOpen = false" class="text-white/60 hover:text-white"><span class="material-symbols-outlined">close</span></button>
        </div>
        <div class="p-6 space-y-4">
          <div class="space-y-1">
            <label class="text-[11px] font-bold text-outline uppercase">Titre</label>
            <input v-model="form.title" class="w-full px-3 py-2 border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="ex: Été 2025" type="text">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-[11px] font-bold text-outline uppercase">Remise (%)</label>
              <input v-model.number="form.discountRate" class="w-full px-3 py-2 border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" type="number" min="1" max="100">
            </div>
            <div class="space-y-1">
              <label class="text-[11px] font-bold text-outline uppercase">Hôtel ID</label>
              <input v-model.number="form.hotelId" class="w-full px-3 py-2 border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" type="number">
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-[11px] font-bold text-outline uppercase">Début</label>
              <input v-model="form.startDate" class="w-full px-3 py-2 border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" type="date">
            </div>
            <div class="space-y-1">
              <label class="text-[11px] font-bold text-outline uppercase">Fin</label>
              <input v-model="form.endDate" class="w-full px-3 py-2 border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" type="date">
            </div>
          </div>
          <div class="pt-2 flex gap-3">
            <button @click="isModalOpen = false" class="flex-1 py-2.5 rounded-lg font-bold text-outline hover:bg-surface-container-low transition-colors">Annuler</button>
            <button @click="handleSave" class="flex-1 py-2.5 bg-[#008F90] text-white rounded-lg font-bold hover:bg-[#007a7a] transition-colors">Enregistrer</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="editingOffer" class="fixed inset-0 z-[100] flex items-center justify-center bg-on-surface/40 backdrop-blur-sm px-4" @click.self="editingOffer = null">
      <div class="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
        <div class="bg-[#015081] px-6 py-4 flex items-center justify-between">
          <h3 class="text-white font-bold">Modifier l'offre</h3>
          <button @click="editingOffer = null" class="text-white/60 hover:text-white"><span class="material-symbols-outlined">close</span></button>
        </div>
        <div class="p-6 space-y-4">
          <div class="space-y-1">
            <label class="text-[11px] font-bold text-outline uppercase">Titre</label>
            <input v-model="editingOffer.title" class="w-full px-3 py-2 border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" type="text">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-[11px] font-bold text-outline uppercase">Remise (%)</label>
              <input v-model.number="editingOffer.discountRate" class="w-full px-3 py-2 border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" type="number" min="1" max="100">
            </div>
            <div class="space-y-1">
              <label class="text-[11px] font-bold text-outline uppercase">Active</label>
              <select v-model="editingOffer.active" class="w-full px-3 py-2 border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none">
                <option :value="true">Oui</option>
                <option :value="false">Non</option>
              </select>
            </div>
          </div>
          <div class="pt-2 flex gap-3">
            <button @click="editingOffer = null" class="flex-1 py-2.5 rounded-lg font-bold text-outline hover:bg-surface-container-low transition-colors">Annuler</button>
            <button @click="saveEdit" class="flex-1 py-2.5 bg-[#008F90] text-white rounded-lg font-bold hover:bg-[#007a7a] transition-colors">Enregistrer</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Offer } from '~/types/models'
import { OfferService } from '~/services'

definePageMeta({ layout: 'admin' })

const service = new OfferService()
const offers = ref<Offer[]>([])
const loading = ref(false)
const isModalOpen = ref(false)
const editingOffer = ref<Offer | null>(null)
const form = ref({ title: '', discountRate: 10, hotelId: 1, startDate: '', endDate: '', description: '' })

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

function openEdit(offer: Offer) { editingOffer.value = { ...offer } }

async function handleSave() {
  await service.create({ ...form.value, active: true, image: undefined })
  form.value = { title: '', discountRate: 10, hotelId: 1, startDate: '', endDate: '', description: '' }
  isModalOpen.value = false
  offers.value = await service.getAll()
}

async function saveEdit() {
  if (!editingOffer.value) return
  const updated = await service.update(editingOffer.value.id, editingOffer.value)
  const i = offers.value.findIndex(o => o.id === updated.id)
  if (i !== -1) offers.value[i] = updated
  editingOffer.value = null
}

async function handleDelete(id: number) {
  if (!confirm('Supprimer cette offre ?')) return
  await service.delete(id)
  offers.value = offers.value.filter(o => o.id !== id)
}

onMounted(async () => { loading.value = true; offers.value = await service.getAll(); loading.value = false })
</script>
