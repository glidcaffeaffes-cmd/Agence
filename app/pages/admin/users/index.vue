<template>
  <div class="p-8 max-w-7xl mx-auto antialiased">
    <Head>
      <title>Gestion des Utilisateurs — Admin</title>
    </Head>

    <!-- Header -->
    <div class="flex justify-between items-end mb-8">
      <div>
        <h2 class="text-3xl font-bold text-[#015081] tracking-tight mb-1">Gestion des Utilisateurs</h2>
        <p class="text-outline text-sm">Gérez les comptes clients et administrateurs.</p>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(1,80,129,0.06)]">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-surface-container-high/50 border-b border-surface-variant/30 text-outline text-xs font-bold uppercase tracking-widest">
            <th class="px-6 py-4">ID</th>
            <th class="px-6 py-4">Email</th>
            <th class="px-6 py-4">Rôle</th>
            <th class="px-6 py-4">Date d'inscription</th>
            <th class="px-6 py-4">Statut</th>
            <th class="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-surface-variant/20 text-sm">
          <tr v-if="loading"><td colspan="6" class="px-6 py-8 text-center text-outline">Chargement…</td></tr>
          <tr v-for="acc in accounts" :key="acc.id" class="hover:bg-surface-container-low/50 transition-colors group">
            <td class="px-6 py-4 font-mono text-outline">#{{ acc.id }}</td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-[#006768] to-[#008283] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {{ acc.email.charAt(0).toUpperCase() }}
                </div>
                <span class="font-medium">{{ acc.email }}</span>
              </div>
            </td>
            <td class="px-6 py-4">
              <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                :class="acc.role === 'admin' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'">
                {{ acc.role }}
              </span>
            </td>
            <td class="px-6 py-4 text-on-surface-variant">{{ formatDate(acc.registrationDate) }}</td>
            <td class="px-6 py-4">
              <span class="inline-flex items-center gap-1.5 text-xs font-semibold" :class="acc.active ? 'text-primary' : 'text-error'">
                <span class="w-1.5 h-1.5 rounded-full" :class="acc.active ? 'bg-primary' : 'bg-error'"></span>
                {{ acc.active ? 'Actif' : 'Inactif' }}
              </span>
            </td>
            <td class="px-6 py-4 text-right space-x-1">
              <button @click="openEdit(acc)" class="p-2 hover:bg-white rounded-lg text-secondary transition-all active:scale-90 shadow-sm border border-transparent hover:border-surface-variant/30">
                <span class="material-symbols-outlined text-lg">edit</span>
              </button>
              <button @click="toggleActive(acc)" class="p-2 hover:bg-white rounded-lg transition-all active:scale-90 shadow-sm border border-transparent hover:border-surface-variant/30"
                :class="acc.active ? 'text-error' : 'text-primary'" :title="acc.active ? 'Désactiver' : 'Activer'">
                <span class="material-symbols-outlined text-lg">{{ acc.active ? 'person_off' : 'how_to_reg' }}</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Edit Modal -->
    <div v-if="editing" class="fixed inset-0 z-[100] flex items-center justify-center bg-on-surface/40 backdrop-blur-sm px-4" @click.self="editing = null">
      <div class="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div class="bg-[#015081] px-6 py-4 flex items-center justify-between">
          <h3 class="text-white font-bold">Modifier l'utilisateur #{{ editing.id }}</h3>
          <button @click="editing = null" class="text-white/60 hover:text-white">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <div class="p-6 space-y-4">
          <div class="space-y-1">
            <label class="text-[11px] font-bold text-outline uppercase">Email</label>
            <input v-model="editing.email" class="w-full px-3 py-2 border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" type="email">
          </div>
          <div class="space-y-1">
            <label class="text-[11px] font-bold text-outline uppercase">Rôle</label>
            <select v-model="editing.role" class="w-full px-3 py-2 border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none">
              <option value="client">Client</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div class="pt-2 flex gap-3">
            <button @click="editing = null" class="flex-1 py-2.5 rounded-lg font-bold text-outline hover:bg-surface-container-low transition-colors">Annuler</button>
            <button @click="saveEdit" class="flex-1 py-2.5 bg-[#008F90] text-white rounded-lg font-bold hover:bg-[#007a7a] transition-colors">Enregistrer</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Account } from '~/types/models'
import { AccountService } from '~/services'

definePageMeta({ layout: 'admin' })

const service = new AccountService()
const accounts = ref<Account[]>([])
const loading = ref(false)
const editing = ref<Account | null>(null)

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

function openEdit(acc: Account) { editing.value = { ...acc } }

async function toggleActive(acc: Account) {
  if (acc.active) await service.deactivate(acc.id)
  else await service.update(acc.id, { active: true })
  const i = accounts.value.findIndex(a => a.id === acc.id)
  if (i !== -1) accounts.value[i] = { ...accounts.value[i], active: !acc.active }
}

async function saveEdit() {
  if (!editing.value) return
  const updated = await service.update(editing.value.id, {
    email: editing.value.email,
    active: editing.value.active,
  })
  const i = accounts.value.findIndex(a => a.id === updated.id)
  if (i !== -1) accounts.value[i] = updated
  editing.value = null
}

onMounted(async () => { loading.value = true; accounts.value = await service.getAll(); loading.value = false })
</script>
