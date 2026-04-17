<template>
  <div class="p-8 max-w-7xl mx-auto font-['Inter'] antialiased">
    <!-- Header -->
    <div class="flex justify-between items-end mb-8">
      <div>
        <h2 class="text-3xl font-bold text-[#015081] tracking-tight mb-1">Gestion des Réclamations</h2>
        <p class="text-outline text-sm">Supervisez et résolvez les demandes d'assistance client.</p>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(1,80,129,0.06)]">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-surface-container-high/50 border-b border-surface-variant/30 text-outline text-xs font-bold uppercase tracking-widest">
            <th class="px-6 py-4">ID</th>
            <th class="px-6 py-4">Client</th>
            <th class="px-6 py-4">Sujet</th>
            <th class="px-6 py-4">Date</th>
            <th class="px-6 py-4">Statut</th>
            <th class="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-surface-variant/20 text-sm">
          <tr v-if="loading"><td colspan="6" class="px-6 py-8 text-center text-outline">Chargement…</td></tr>
          <tr v-for="comp in complaints" :key="comp.id" class="hover:bg-surface-container-low/50 transition-colors group">
            <td class="px-6 py-4 font-mono text-secondary font-semibold">#{{ comp.id }}</td>
            <td class="px-6 py-4 font-medium">Client #{{ comp.accountId }}</td>
            <td class="px-6 py-4 text-on-surface-variant max-w-xs truncate">{{ comp.subject }}</td>
            <td class="px-6 py-4 text-on-surface-variant">{{ comp.complaintDate }}</td>
            <td class="px-6 py-4">
              <span v-if="comp.status === 'OPEN'"      class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-error/10 text-error uppercase">Ouverte</span>
              <span v-else-if="comp.status === 'IN_PROGRESS'" class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#CDAF5D]/10 text-[#735c10] uppercase">En cours</span>
              <span v-else-if="comp.status === 'RESOLVED'"   class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-primary/10 text-primary uppercase">Résolue</span>
              <span v-else class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-surface-variant text-on-surface-variant uppercase">Fermée</span>
            </td>
            <td class="px-6 py-4 text-right space-x-1">
              <button @click="openResolve(comp)" title="Traiter" class="p-2 hover:bg-white rounded-lg text-primary transition-all active:scale-90 shadow-sm border border-transparent hover:border-surface-variant/30">
                <span class="material-symbols-outlined text-lg">task_alt</span>
              </button>
              <button @click="handleDelete(comp.id)" title="Supprimer" class="p-2 hover:bg-white rounded-lg text-error transition-all active:scale-90 shadow-sm border border-transparent hover:border-surface-variant/30">
                <span class="material-symbols-outlined text-lg">delete</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Resolve Modal -->
    <div v-if="resolving" class="fixed inset-0 z-[100] flex items-center justify-center bg-on-surface/40 backdrop-blur-sm px-4" @click.self="resolving = null">
      <div class="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
        <div class="bg-[#015081] px-6 py-4 flex items-center justify-between">
          <h3 class="text-white font-bold">Traiter la réclamation #{{ resolving.id }}</h3>
          <button @click="resolving = null" class="text-white/60 hover:text-white"><span class="material-symbols-outlined">close</span></button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <p class="text-[11px] font-bold text-outline uppercase mb-1">Sujet</p>
            <p class="text-sm font-semibold">{{ resolving.subject }}</p>
          </div>
          <div>
            <p class="text-[11px] font-bold text-outline uppercase mb-1">Description</p>
            <p class="text-sm text-on-surface-variant bg-surface-container-low p-3 rounded-lg">{{ resolving.description }}</p>
          </div>
          <div class="space-y-1">
            <label class="text-[11px] font-bold text-outline uppercase">Réponse de l'agence</label>
            <textarea v-model="response" rows="3" class="w-full px-3 py-2 border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none resize-none" placeholder="Saisir votre réponse…"></textarea>
          </div>
          <div class="flex gap-3 pt-2">
            <button @click="resolving = null" class="flex-1 py-2.5 rounded-lg font-bold text-outline hover:bg-surface-container-low transition-colors">Annuler</button>
            <button @click="handleResolve" class="flex-1 py-2.5 bg-[#008F90] text-white rounded-lg font-bold hover:bg-[#007a7a] transition-colors">Résoudre</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Complaint } from '~/types/models'
import { ComplaintService } from '~/services'

definePageMeta({ layout: 'admin' })

const service = new ComplaintService()
const complaints = ref<Complaint[]>([])
const loading = ref(false)
const resolving = ref<Complaint | null>(null)
const response = ref('')

function openResolve(comp: Complaint) { resolving.value = comp; response.value = '' }

async function handleResolve() {
  if (!resolving.value || !response.value.trim()) return
  const updated = await service.resolve(resolving.value.id, response.value)
  const i = complaints.value.findIndex(c => c.id === updated.id)
  if (i !== -1) complaints.value[i] = updated
  resolving.value = null
}

async function handleDelete(id: number) {
  if (!confirm('Supprimer cette réclamation ?')) return
  await service.delete(id)
  complaints.value = complaints.value.filter(c => c.id !== id)
}

onMounted(async () => { loading.value = true; complaints.value = await service.getAll(); loading.value = false })
</script>
