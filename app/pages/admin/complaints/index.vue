<template>
  <div class="p-8 space-y-8 font-['Inter'] antialiased">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h2 class="text-3xl font-bold text-[#015081] tracking-tight">Gestion des Réclamations</h2>
        <p class="text-sm text-slate-500 mt-1">Supervisez et résolvez les demandes d'assistance client.</p>
      </div>
      <div class="flex items-center space-x-3">
        <button class="bg-[#008F90] text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center space-x-2 shadow-sm hover:brightness-105 transition-all">
          <span class="material-symbols-outlined text-lg">export_notes</span>
          <span>Exporter CSV</span>
        </button>
      </div>
    </div>

    <!-- Dashboard Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-surface-container-lowest p-6 rounded-xl shadow-sm border-l-4 border-error">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-xs font-bold uppercase tracking-wider text-slate-400">Ouvertes</p>
            <h3 class="text-2xl font-bold mt-1">{{ complaints.filter(c => c.status === 'OUVERTE').length }}</h3>
          </div>
          <span class="material-symbols-outlined text-error opacity-20 text-4xl">priority_high</span>
        </div>
      </div>
      <div class="bg-surface-container-lowest p-6 rounded-xl shadow-sm border-l-4 border-[#CDAF5D]">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-xs font-bold uppercase tracking-wider text-slate-400">En cours</p>
            <h3 class="text-2xl font-bold mt-1">{{ complaints.filter(c => c.status === 'EN_COURS').length }}</h3>
          </div>
          <span class="material-symbols-outlined text-[#CDAF5D] opacity-20 text-4xl">pending</span>
        </div>
      </div>
      <div class="bg-surface-container-lowest p-6 rounded-xl shadow-sm border-l-4 border-[#008F90]">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-xs font-bold uppercase tracking-wider text-slate-400">Résolues</p>
            <h3 class="text-2xl font-bold mt-1">{{ complaints.filter(c => c.status === 'RESOLUE').length }}</h3>
          </div>
          <span class="material-symbols-outlined text-[#008F90] opacity-20 text-4xl">check_circle</span>
        </div>
      </div>
      <div class="bg-surface-container-lowest p-6 rounded-xl shadow-sm border-l-4 border-slate-400">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-xs font-bold uppercase tracking-wider text-slate-400">Temps Moyen</p>
            <h3 class="text-2xl font-bold mt-1">4h 12m</h3>
          </div>
          <span class="material-symbols-outlined text-slate-400 opacity-20 text-4xl">timer</span>
        </div>
      </div>
    </div>

    <!-- Table Container -->
    <div class="bg-surface-container-low rounded-2xl p-1 shadow-sm overflow-hidden">
      <!-- Tabs -->
      <div class="bg-surface-container-highest/50 px-6 pt-4 flex space-x-8 border-b border-outline-variant/10">
        <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
                :class="[
                  activeTab === tab.id ? 'text-[#006768] font-bold border-b-2 border-[#006768]' : 'text-slate-500 font-medium hover:text-[#006768]',
                  'pb-4 text-sm transition-all flex items-center'
                ]">
          {{ tab.label }}
          <span v-if="tab.count !== undefined" :class="[tab.color, 'ml-2 px-2 py-0.5 text-white text-[10px] rounded-full']">{{ tab.count }}</span>
        </button>
      </div>

      <!-- DataTable -->
      <div class="overflow-x-auto bg-surface-container-lowest">
        <table class="w-full text-left border-collapse">
          <thead class="bg-surface-container-high/30">
            <tr>
              <th class="px-6 py-4 text-xs font-bold uppercase text-on-surface-variant tracking-widest">ID</th>
              <th class="px-6 py-4 text-xs font-bold uppercase text-on-surface-variant tracking-widest">Client</th>
              <th class="px-6 py-4 text-xs font-bold uppercase text-on-surface-variant tracking-widest">Sujet</th>
              <th class="px-6 py-4 text-xs font-bold uppercase text-on-surface-variant tracking-widest">Date Ouverture</th>
              <th class="px-6 py-4 text-xs font-bold uppercase text-on-surface-variant tracking-widest">Statut</th>
              <th class="px-6 py-4 text-xs font-bold uppercase text-on-surface-variant tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="comp in filteredComplaints" :key="comp.id" @click="openComplaint(comp)" class="hover:bg-surface-container-low transition-colors group cursor-pointer">
              <td class="px-6 py-4 text-sm font-mono font-semibold text-secondary">{{ comp.id }}</td>
              <td class="px-6 py-4">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs" :class="comp.avatarStyle">{{ comp.initials }}</div>
                  <span class="text-sm font-medium">{{ comp.client }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">{{ comp.subject }}</td>
              <td class="px-6 py-4 text-sm text-slate-500">{{ comp.date }}</td>
              <td class="px-6 py-4">
                <span :class="comp.statusStyle" class="px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-tighter">{{ comp.status }}</span>
              </td>
              <td class="px-6 py-4 text-right space-x-4">
                <button v-if="comp.status !== 'RESOLUE' && comp.status !== 'FERMEE'" class="text-[#008F90] font-bold text-sm hover:underline" @click.stop="handleAction('traiter', comp.id)">Traiter</button>
                <button v-else class="text-slate-400 font-bold text-sm cursor-not-allowed opacity-50" disabled>Traité</button>
                <button class="text-slate-400 hover:text-secondary text-sm" @click.stop="openComplaint(comp)">Voir</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="bg-surface-container-high/30 px-6 py-4 flex items-center justify-between">
        <p class="text-xs text-on-surface-variant">Affichage de 1 à {{ filteredComplaints.length }} sur {{ complaints.length }} réclamations</p>
        <div class="flex items-center space-x-2">
          <button class="p-1 rounded hover:bg-surface-container transition-colors disabled:opacity-30" disabled>
            <span class="material-symbols-outlined text-lg">chevron_left</span>
          </button>
          <button class="w-8 h-8 rounded bg-primary text-white text-xs font-bold">1</button>
          <button class="p-1 rounded hover:bg-surface-container transition-colors opacity-30 cursor-not-allowed">
            <span class="material-symbols-outlined text-lg">chevron_right</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Insights & Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Chart Placeholder -->
      <div class="lg:col-span-2 bg-surface-container-lowest rounded-2xl p-8 shadow-sm">
        <div class="flex justify-between items-center mb-6">
          <h4 class="font-bold text-secondary flex items-center">
            <span class="material-symbols-outlined mr-2 text-[#CDAF5D]">trending_up</span>
            Volume de Réclamations (Hebdomadaire)
          </h4>
          <select class="text-xs border-none bg-surface-container-low rounded-lg py-1 px-3 focus:ring-0">
            <option>Derniers 30 jours</option>
            <option>Derniers 90 jours</option>
          </select>
        </div>
        <div class="h-48 w-full flex items-end justify-between space-x-2 px-2">
          <div class="w-full bg-primary/20 rounded-t h-[25%] transition-all hover:h-[30%]"></div>
          <div class="w-full bg-primary/20 rounded-t h-[50%] transition-all hover:h-[55%]"></div>
          <div class="w-full bg-primary/40 rounded-t h-[33%] transition-all hover:h-[38%]"></div>
          <div class="w-full bg-primary/60 rounded-t h-[75%] transition-all hover:h-[80%]"></div>
          <div class="w-full bg-primary/80 rounded-t h-[100%] transition-all hover:h-[95%]"></div>
          <div class="w-full bg-primary rounded-t h-[66%] transition-all hover:h-[71%]"></div>
          <div class="w-full bg-primary/50 rounded-t h-[50%] transition-all hover:h-[55%]"></div>
        </div>
        <div class="flex justify-between mt-4 px-2">
          <span class="text-[10px] text-slate-400 font-bold uppercase">Lun</span>
          <span class="text-[10px] text-slate-400 font-bold uppercase">Mar</span>
          <span class="text-[10px] text-slate-400 font-bold uppercase">Mer</span>
          <span class="text-[10px] text-slate-400 font-bold uppercase">Jeu</span>
          <span class="text-[10px] text-slate-400 font-bold uppercase">Ven</span>
          <span class="text-[10px] text-slate-400 font-bold uppercase">Sam</span>
          <span class="text-[10px] text-slate-400 font-bold uppercase">Dim</span>
        </div>
      </div>

      <!-- Activity Feed -->
      <div class="bg-[#015081] rounded-2xl p-8 text-white shadow-xl relative overflow-hidden flex flex-col">
        <div class="relative z-10">
          <h4 class="font-bold text-[#CDAF5D] mb-6 flex items-center">
            <span class="material-symbols-outlined mr-2">history</span>
            Activité Récente
          </h4>
          <div class="space-y-6 relative">
            <div class="absolute left-1 top-2 bottom-4 w-0.5 bg-white/20"></div>
            <div class="flex space-x-6 relative pl-1">
              <div class="w-2 h-2 rounded-full bg-white mt-1.5 shrink-0 z-10 border border-[#015081]"></div>
              <div>
                <p class="text-[10px] text-slate-300 font-medium uppercase tracking-tight">Il y a 10 min</p>
                <p class="text-sm font-medium mt-0.5">Marc a ouvert <span class="text-[#CDAF5D]">#REC-4921</span></p>
              </div>
            </div>
            <div class="flex space-x-6 relative pl-1">
              <div class="w-2 h-2 rounded-full bg-[#CDAF5D] mt-1.5 shrink-0 z-10 border border-[#015081]"></div>
              <div>
                <p class="text-[10px] text-slate-300 font-medium uppercase tracking-tight">Il y a 2h</p>
                <p class="text-sm font-medium mt-0.5">Sophie traite <span class="text-[#CDAF5D]">#REC-4899</span></p>
              </div>
            </div>
            <div class="flex space-x-6 relative pl-1">
              <div class="w-2 h-2 rounded-full bg-[#008F90] mt-1.5 shrink-0 z-10 border border-[#015081]"></div>
              <div>
                <p class="text-[10px] text-slate-300 font-medium uppercase tracking-tight">Il y a 5h</p>
                <p class="text-sm font-medium mt-0.5"><span class="text-[#CDAF5D]">#REC-4880</span> résolue par le système</p>
              </div>
            </div>
          </div>
          <button class="mt-10 w-full py-3 bg-white/5 border border-white/20 rounded-lg text-xs font-bold hover:bg-white/10 transition-all uppercase tracking-widest active:scale-95">
            Historique complet
          </button>
        </div>
        <div class="absolute -right-10 -bottom-10 opacity-5">
          <span class="material-symbols-outlined text-[120px]">architecture</span>
        </div>
      </div>
    </div>

    <!-- Modal Detail View -->
    <div v-if="selectedComplaint" class="fixed inset-0 z-[100]">
      <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="closeModal"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-[modalScale_0.2s_ease-out]">
        <div class="bg-[#015081] p-6 flex justify-between items-center text-white">
          <div>
            <h3 class="text-lg font-bold">{{ selectedComplaint.id }}</h3>
            <p class="text-xs text-white/70">Détails de la réclamation</p>
          </div>
          <button class="text-white/60 hover:text-white" @click="closeModal">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <div class="p-8 space-y-6">
          <div class="grid grid-cols-2 gap-8">
            <div>
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Client</label>
              <p class="text-sm font-bold mt-1 flex items-center">
                <span class="w-6 h-6 rounded-full mr-2 flex items-center justify-center text-[10px] font-bold" :class="selectedComplaint.avatarStyle">{{ selectedComplaint.initials }}</span>
                {{ selectedComplaint.client }}
              </p>
            </div>
            <div>
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</label>
              <p class="text-sm font-medium mt-1">{{ selectedComplaint.date }}</p>
            </div>
          </div>
          <div>
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sujet</label>
            <p class="text-base font-semibold mt-1">{{ selectedComplaint.subject }}</p>
          </div>
          <div class="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Description du problème</label>
            <p class="text-sm text-slate-600 leading-relaxed italic">
              "{{ selectedComplaint.description }}"
            </p>
          </div>
          <div class="flex space-x-4 pt-4">
            <button v-if="selectedComplaint.status !== 'RESOLUE' && selectedComplaint.status !== 'FERMEE'" class="flex-1 bg-[#008F90] text-white py-3 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all" @click="handleAction('success', 'traitement initié')">Prendre en charge</button>
            <button class="flex-1 border border-slate-200 text-slate-600 py-3 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all" @click="closeModal">Fermer</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

definePageMeta({
  layout: 'admin'
})

// Mock Database for Complaints
type Complaint = {
  id: string
  client: string
  initials: string
  avatarStyle: string
  subject: string
  date: string
  status: 'OUVERTE' | 'EN_COURS' | 'RESOLUE' | 'FERMEE'
  statusStyle: string
  description: string
}

const complaints = ref<Complaint[]>([
  {
    id: '#REC-4921',
    client: 'Jean Michel',
    initials: 'JM',
    avatarStyle: 'bg-[#3A90CF]/20 text-[#3A90CF]',
    subject: 'Erreur lors de la validation du paiement...',
    date: '12 Oct 2023, 14:30',
    status: 'OUVERTE',
    statusStyle: 'bg-error/10 text-error',
    description: "Bonjour, je rencontre un problème persistant lors de l'étape de validation de mon panier. Un message d'erreur s'affiche après avoir saisi mes coordonnées bancaires, m'empêchant de finaliser mon achat. Merci de votre aide rapide."
  },
  {
    id: '#REC-4899',
    client: 'Sarah Dupont',
    initials: 'SD',
    avatarStyle: 'bg-primary/20 text-primary',
    subject: 'Retard de livraison sur la réservation #991',
    date: '11 Oct 2023, 09:15',
    status: 'EN_COURS',
    statusStyle: 'bg-[#CDAF5D]/10 text-[#735c10]',
    description: "La réservation n'a pas été confirmée dans les délais. Veuillez m'aider."
  },
  {
    id: '#REC-4880',
    client: 'André Leclerc',
    initials: 'AL',
    avatarStyle: 'bg-[#236294]/20 text-[#236294]',
    subject: 'Accès impossible au portail client',
    date: '10 Oct 2023, 16:45',
    status: 'RESOLUE',
    statusStyle: 'bg-primary/10 text-primary',
    description: "J'ai oublié le mode de passe et le reset ne marche pas."
  },
  {
    id: '#REC-4852',
    client: 'Benoit Vasseur',
    initials: 'BV',
    avatarStyle: 'bg-slate-200 text-slate-500',
    subject: "Demande d'information catalogue 2024",
    date: '08 Oct 2023, 11:20',
    status: 'FERMEE',
    statusStyle: 'bg-slate-100 text-slate-500',
    description: "Je souhaite le catalogue de toutes vos destinations d'ici 2024."
  }
])

const activeTab = ref('all')
const tabs = [
  { id: 'all', label: 'Toutes' },
  { id: 'opened', label: 'Ouvertes', count: complaints.value.filter(c => c.status === 'OUVERTE').length, color: 'bg-error' },
  { id: 'pending', label: 'En cours', count: complaints.value.filter(c => c.status === 'EN_COURS').length, color: 'bg-[#CDAF5D]' },
  { id: 'resolved', label: 'Résolues', count: complaints.value.filter(c => c.status === 'RESOLUE').length, color: 'bg-[#008F90]' },
  { id: 'closed', label: 'Fermées' },
]

const filteredComplaints = computed(() => {
  if (activeTab.value === 'opened') return complaints.value.filter(c => c.status === 'OUVERTE')
  if (activeTab.value === 'pending') return complaints.value.filter(c => c.status === 'EN_COURS')
  if (activeTab.value === 'resolved') return complaints.value.filter(c => c.status === 'RESOLUE')
  if (activeTab.value === 'closed') return complaints.value.filter(c => c.status === 'FERMEE')
  return complaints.value
})

const selectedComplaint = ref<Complaint | null>(null)

const openComplaint = (comp: Complaint) => {
  selectedComplaint.value = comp
}

const closeModal = () => {
  selectedComplaint.value = null
}

const handleAction = (type: string, id: string) => {
  if (type === 'traiter') {
    alert("Initialisation du traitement pour la réclamation " + id)
  } else {
    alert("Action effectuée : " + id)
    closeModal()
  }
}
</script>

<style scoped>
@keyframes modalScale {
  from { opacity: 0; transform: translate(-50%, -50%) scale(0.95); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}
.animate-\[modalScale_0\.2s_ease-out\] {
  animation: modalScale 0.2s ease-out forwards;
}
</style>
