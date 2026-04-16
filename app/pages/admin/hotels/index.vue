<template>
  <div class="p-8 max-w-7xl mx-auto font-['Inter'] antialiased">
    <!-- Header Section -->
    <div class="flex justify-between items-end mb-8">
      <div>
        <h2 class="text-3xl font-bold text-[#015081] tracking-tight mb-2">Gestion des Hôtels</h2>
        <p class="text-outline text-sm font-medium">Gérez votre inventaire immobilier et vos partenariats hôteliers.</p>
      </div>
      <button 
        @click="toggleModal"
        class="bg-[#008F90] text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 hover:bg-[#007a7a] active:scale-95 transition-all shadow-sm"
      >
        <span class="material-symbols-outlined">add_circle</span>
        Ajouter un hôtel
      </button>
    </div>

    <!-- Filters Bar -->
    <div class="bg-surface-container-lowest p-4 rounded-xl shadow-[0_4px_20px_rgba(1,80,129,0.04)] mb-6 flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-2 bg-surface-container-low p-1 rounded-lg" id="filter-chips">
        <button 
          v-for="filter in ['Tous', 'Actifs', 'Partenaires']" 
          :key="filter"
          @click="activeFilter = filter"
          :class="[
            'filter-chip px-5 py-1.5 text-xs font-bold rounded-md transition-colors',
            activeFilter === filter 
              ? 'bg-white text-primary shadow-sm' 
              : 'text-outline hover:text-on-surface'
          ]"
        >
          {{ filter }}
        </button>
      </div>
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2 text-xs font-semibold text-outline px-3 py-2 border border-outline-variant/30 rounded-lg cursor-pointer hover:bg-surface-container-low transition-colors">
          <span class="material-symbols-outlined text-sm">filter_list</span>
          Filtres Avancés
        </div>
        <div class="flex items-center gap-2 text-xs font-semibold text-outline px-3 py-2 border border-outline-variant/30 rounded-lg cursor-pointer hover:bg-surface-container-low transition-colors">
          <span class="material-symbols-outlined text-sm">download</span>
          Exporter CSV
        </div>
      </div>
    </div>

    <!-- DataTable Section -->
    <div class="bg-white rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(1,80,129,0.06)]">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-surface-container-high/50 border-b border-surface-variant/30">
            <th class="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-widest">ID</th>
            <th class="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-widest">Nom</th>
            <th class="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-widest">Ville/Pays</th>
            <th class="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-widest">Étoiles</th>
            <th class="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-widest">Chambres</th>
            <th class="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-widest">Occupation</th>
            <th class="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-widest">Statut</th>
            <th class="px-6 py-4 text-[11px] font-bold text-outline uppercase tracking-widest text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-surface-variant/20">
          <tr v-for="hotel in hotels" :key="hotel.id" class="group hover:bg-surface-container-low/50 transition-colors">
            <td class="px-6 py-4 text-sm text-outline font-mono">VH-{{ String(hotel.id).padStart(3, '0') }}</td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <span class="font-bold text-on-surface group-hover:text-primary transition-colors">{{ hotel.name }}</span>
                <span v-if="hotel.id % 2 !== 0" class="px-2 py-0.5 bg-tertiary-fixed text-on-tertiary-fixed-variant text-[10px] font-bold rounded uppercase">Partenaire</span>
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-on-surface-variant">{{ hotel.city }}, {{ hotel.country }}</td>
            <td class="px-6 py-4">
              <div class="flex text-[#CDAF5D]">
                <span v-for="n in 5" :key="n" class="material-symbols-outlined text-sm" :style="n <= hotel.stars ? 'font-variation-settings: \'FILL\' 1;' : ''">star</span>
              </div>
            </td>
            <td class="px-6 py-4 text-sm font-medium">{{ Math.floor(Math.random() * 200 + 50) }}</td>
            <td class="px-6 py-4">
              <div class="w-32">
                <div class="flex justify-between text-[10px] font-bold mb-1">
                  <span>{{ Math.floor(Math.random() * 40 + 40) }}%</span>
                </div>
                <div class="w-full bg-surface-container-high rounded-full h-1.5">
                  <div class="bg-[#008F90] h-1.5 rounded-full" :style="`width: ${Math.floor(Math.random() * 40 + 40)}%`"></div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <span v-if="hotel.active" class="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">Actif</span>
              <span v-else class="px-2.5 py-1 rounded-full bg-error-container text-error text-[10px] font-bold uppercase tracking-wider">Inactif</span>
            </td>
            <td class="px-6 py-4 text-right space-x-2">
              <button @click="handleEdit(`VH-${hotel.id}`)" class="p-2 hover:bg-white rounded-lg text-secondary transition-all active:scale-90 shadow-sm border border-transparent hover:border-surface-variant/30"><span class="material-symbols-outlined text-lg">edit</span></button>
              <button class="p-2 hover:bg-white rounded-lg text-error transition-all active:scale-90 shadow-sm border border-transparent hover:border-surface-variant/30"><span class="material-symbols-outlined text-lg">delete</span></button>
              <button @click="handleView(`VH-${hotel.id}`)" class="p-2 hover:bg-white rounded-lg text-primary transition-all active:scale-90 shadow-sm border border-transparent hover:border-surface-variant/30"><span class="material-symbols-outlined text-lg">visibility</span></button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- Pagination Footer -->
      <div class="bg-surface-container-low/30 px-6 py-4 flex items-center justify-between">
        <p class="text-xs text-outline font-medium">Affichage de 1-{{ hotels.length }} sur 124 hôtels</p>
        <div class="flex items-center gap-2">
          <button class="p-2 hover:bg-white rounded-lg disabled:opacity-30 transition-colors" disabled>
            <span class="material-symbols-outlined">chevron_left</span>
          </button>
          <button class="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-lg text-xs font-bold">1</button>
          <button class="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg text-xs font-bold text-outline transition-colors">2</button>
          <button class="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg text-xs font-bold text-outline transition-colors">3</button>
          <button class="p-2 hover:bg-white rounded-lg transition-colors">
            <span class="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Dashboard Quick Insights Bento -->
    <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-xl shadow-[0_4px_20px_rgba(1,80,129,0.06)] border-l-4 border-primary hover:translate-y-[-4px] transition-transform duration-300">
        <div class="flex items-center justify-between mb-4">
          <span class="text-xs font-bold text-outline uppercase tracking-wider">Taux d'occupation global</span>
          <span class="material-symbols-outlined text-primary">analytics</span>
        </div>
        <h3 class="text-2xl font-bold text-on-surface">74.2%</h3>
        <p class="text-[10px] text-primary font-bold mt-1 flex items-center gap-1">
          <span class="material-symbols-outlined text-[12px]">trending_up</span> +5.2% vs mois dernier
        </p>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-[0_4px_20px_rgba(1,80,129,0.06)] border-l-4 border-secondary hover:translate-y-[-4px] transition-transform duration-300">
        <div class="flex items-center justify-between mb-4">
          <span class="text-xs font-bold text-outline uppercase tracking-wider">Nouveaux Partenaires</span>
          <span class="material-symbols-outlined text-secondary">handshake</span>
        </div>
        <h3 class="text-2xl font-bold text-on-surface">12</h3>
        <p class="text-[10px] text-outline font-bold mt-1">3 en attente de validation</p>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-[0_4px_20px_rgba(1,80,129,0.06)] border-l-4 border-tertiary hover:translate-y-[-4px] transition-transform duration-300">
        <div class="flex items-center justify-between mb-4">
          <span class="text-xs font-bold text-outline uppercase tracking-wider">Revenu moyen / nuit</span>
          <span class="material-symbols-outlined text-tertiary">payments</span>
        </div>
        <h3 class="text-2xl font-bold text-on-surface">184 €</h3>
        <p class="text-[10px] text-error font-bold mt-1 flex items-center gap-1">
          <span class="material-symbols-outlined text-[12px]">trending_down</span> -1.8% vs saison haute
        </p>
      </div>
    </div>

    <!-- Simulation Modal -->
    <div 
      v-if="isModalOpen" 
      class="fixed inset-0 z-[100] flex items-center justify-center bg-on-surface/40 backdrop-blur-sm px-4" 
      id="hotel-modal"
      @click.self="toggleModal"
    >
      <div class="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
        <div class="bg-[#015081] px-6 py-4 flex items-center justify-between">
          <h3 class="text-white font-bold tracking-tight">Ajouter un Nouvel Hôtel</h3>
          <button @click="toggleModal" class="text-white/60 hover:text-white transition-colors">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div class="p-8 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-[11px] font-bold text-outline uppercase">Nom de l'hôtel</label>
              <input class="w-full px-3 py-2 border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="ex: Palace de la Mer" type="text">
            </div>
            <div class="space-y-1">
              <label class="text-[11px] font-bold text-outline uppercase">Catégorie</label>
              <select class="w-full px-3 py-2 border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none">
                <option>5 Étoiles</option>
                <option>4 Étoiles</option>
                <option>3 Étoiles</option>
              </select>
            </div>
          </div>
          
          <div class="space-y-1">
            <label class="text-[11px] font-bold text-outline uppercase">Localisation</label>
            <input class="w-full px-3 py-2 border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="Ville, Pays" type="text">
          </div>
          
          <div class="pt-4 flex gap-3">
            <button @click="toggleModal" class="flex-1 py-2.5 rounded-lg font-bold text-outline hover:bg-surface-container-low transition-colors">Annuler</button>
            <button @click="handleSave" class="flex-1 py-2.5 bg-[#008F90] text-white rounded-lg font-bold hover:bg-[#007a7a] transition-colors">Enregistrer</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { MockHotelRepository } from '~/repositories/mock/MockHotelRepository'

definePageMeta({
  layout: 'admin'
})

const hotelRepo = new MockHotelRepository()
// Fetch from mock repository
const { data: hotelsData } = useAsyncData('admin-hotels', () => hotelRepo.getAll())
const hotels = computed(() => hotelsData.value || [])

const activeFilter = ref('Tous')
const isModalOpen = ref(false)

const toggleModal = () => {
  isModalOpen.value = !isModalOpen.value
}

const handleSave = () => {
  alert('Simulated: Nouvel hôtel ajouté avec succès!')
  toggleModal()
}

const handleEdit = (id: string) => {
  alert(`Simulated: Modification de l'hôtel ${id}`)
}

const handleView = (id: string) => {
  alert(`Simulated: Affichage des détails de l'hôtel ${id}`)
}
</script>
