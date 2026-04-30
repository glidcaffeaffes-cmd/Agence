<template>
  <div class="p-8 max-w-7xl mx-auto antialiased">
    <!-- Header -->
    <div class="flex justify-between items-end mb-8">
      <div>
        <h2 class="text-3xl font-bold text-[#015081] tracking-tight mb-1">{{ copy.title }}</h2>
        <p class="text-outline text-sm">{{ copy.subtitle }}</p>
      </div>
    </div>

    <div v-if="error" class="mb-4 rounded-lg border border-error/20 bg-error/5 px-4 py-3 text-sm text-error">
      {{ error }}
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(1,80,129,0.06)]">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-surface-container-high/50 border-b border-surface-variant/30 text-outline text-xs font-bold uppercase tracking-widest">
            <th class="px-6 py-4">ID</th>
            <th class="px-6 py-4">{{ copy.client }}</th>
            <th class="px-6 py-4">{{ copy.subject }}</th>
            <th class="px-6 py-4">{{ copy.date }}</th>
            <th class="px-6 py-4">{{ copy.status }}</th>
            <th class="px-6 py-4 text-right">{{ copy.actions }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-surface-variant/20 text-sm">
          <tr v-if="loading"><td colspan="6" class="px-6 py-8 text-center text-outline">{{ copy.loading }}</td></tr>
          <tr v-for="comp in complaints" :key="comp.id" class="hover:bg-surface-container-low/50 transition-colors group">
            <td class="px-6 py-4 font-mono text-secondary font-semibold">#{{ comp.id }}</td>
            <td class="px-6 py-4 font-medium">Client #{{ comp.accountId }}</td>
            <td class="px-6 py-4 text-on-surface-variant max-w-xs truncate">{{ comp.subject }}</td>
            <td class="px-6 py-4 text-on-surface-variant">{{ comp.complaintDate }}</td>
            <td class="px-6 py-4">
              <span v-if="comp.status === 'OPEN'"      class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-error/10 text-error uppercase">{{ copy.open }}</span>
              <span v-else-if="comp.status === 'IN_PROGRESS'" class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#CDAF5D]/10 text-[#735c10] uppercase">{{ copy.inProgress }}</span>
              <span v-else-if="comp.status === 'RESOLVED'"   class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-primary/10 text-primary uppercase">{{ copy.resolved }}</span>
              <span v-else class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-surface-variant text-on-surface-variant uppercase">{{ copy.closed }}</span>
            </td>
            <td class="px-6 py-4 text-right space-x-1">
              <button @click="openResolve(comp)" :title="copy.process" class="p-2 hover:bg-white rounded-lg text-primary transition-all active:scale-90 shadow-sm border border-transparent hover:border-surface-variant/30">
                <span class="material-symbols-outlined text-lg">task_alt</span>
              </button>
              <button @click="handleDelete(comp.id)" :title="copy.delete" class="p-2 hover:bg-white rounded-lg text-error transition-all active:scale-90 shadow-sm border border-transparent hover:border-surface-variant/30">
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
          <h3 class="text-white font-bold">{{ copy.processComplaint }} #{{ resolving.id }}</h3>
          <button @click="resolving = null" class="text-white/60 hover:text-white"><span class="material-symbols-outlined">close</span></button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <p class="text-[11px] font-bold text-outline uppercase mb-1">{{ copy.subject }}</p>
            <p class="text-sm font-semibold">{{ resolving.subject }}</p>
          </div>
          <div>
            <p class="text-[11px] font-bold text-outline uppercase mb-1">{{ copy.description }}</p>
            <p class="text-sm text-on-surface-variant bg-surface-container-low p-3 rounded-lg">{{ resolving.description }}</p>
          </div>
          <div class="space-y-1">
            <label class="text-[11px] font-bold text-outline uppercase">{{ copy.agencyResponse }}</label>
            <textarea v-model="response" rows="3" class="w-full px-3 py-2 border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none resize-none" :placeholder="copy.responsePlaceholder"></textarea>
          </div>
          <div class="flex gap-3 pt-2">
            <button @click="resolving = null" class="flex-1 py-2.5 rounded-lg font-bold text-outline hover:bg-surface-container-low transition-colors">{{ copy.cancel }}</button>
            <button @click="handleResolve" class="flex-1 py-2.5 bg-[#008F90] text-white rounded-lg font-bold hover:bg-[#007a7a] transition-colors">{{ copy.resolve }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { Complaint } from '~/types/models'
import { ComplaintService } from '~/services'

definePageMeta({ layout: 'admin' })

const service = new ComplaintService()
const { t } = useAppI18n()
const complaints = ref<Complaint[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const resolving = ref<Complaint | null>(null)
const response = ref('')

const copy = computed(() => {
  return {
    title: t("adminComplaints.title"),
    subtitle: t("adminComplaints.subtitle"),
    client: t("adminComplaints.client"),
    subject: t("adminComplaints.subject"),
    date: t("adminComplaints.date"),
    status: t("adminComplaints.status"),
    actions: t("adminComplaints.actions"),
    loading: t("adminComplaints.loading"),
    open: t("adminComplaints.open"),
    inProgress: t("adminComplaints.inProgress"),
    resolved: t("adminComplaints.resolved"),
    closed: t("adminComplaints.closed"),
    process: t("adminComplaints.process"),
    delete: t("adminComplaints.delete"),
    processComplaint: t("adminComplaints.processComplaint"),
    description: t("adminComplaints.description"),
    agencyResponse: t("adminComplaints.agencyResponse"),
    responsePlaceholder: t("adminComplaints.responsePlaceholder"),
    cancel: t("adminComplaints.cancel"),
    resolve: t("adminComplaints.resolve"),
    deleteConfirm: t("adminComplaints.deleteConfirm"),
  }
})

function openResolve(comp: Complaint) { resolving.value = comp; response.value = '' }

async function handleResolve() {
  if (!resolving.value || !response.value.trim()) return
  try {
    error.value = null
    const updated = await service.resolve(resolving.value.id, response.value)
    const i = complaints.value.findIndex(c => c.id === updated.id)
    if (i !== -1) complaints.value[i] = updated
    resolving.value = null
  } catch (cause: any) {
    error.value = cause.message
  }
}

async function handleDelete(id: number) {
  if (!confirm(copy.value.deleteConfirm)) return
  try {
    error.value = null
    await service.delete(id)
    complaints.value = complaints.value.filter(c => c.id !== id)
  } catch (cause: any) {
    error.value = cause.message
  }
}

onMounted(async () => {
  loading.value = true
  error.value = null
  try {
    complaints.value = await service.getAll()
  } catch (cause: any) {
    error.value = cause.message
    complaints.value = []
  } finally {
    loading.value = false
  }
})
</script>
