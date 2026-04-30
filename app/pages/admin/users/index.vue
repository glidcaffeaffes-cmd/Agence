<template>
  <div class="mx-auto max-w-7xl p-8 antialiased">
    <Head>
      <title>{{ copy.metaTitle }}</title>
    </Head>

    <div class="mb-8 flex items-end justify-between">
      <div>
        <h2 class="mb-1 text-3xl font-bold tracking-tight text-[#015081]">{{ copy.title }}</h2>
        <p class="text-sm text-outline">{{ copy.subtitle }}</p>
      </div>
    </div>

    <div v-if="error" class="mb-4 rounded-lg border border-error/20 bg-error/5 px-4 py-3 text-sm text-error">
      {{ error }}
    </div>

    <div class="overflow-hidden rounded-xl bg-white shadow-[0_4px_20px_rgba(1,80,129,0.06)]">
      <table class="w-full border-collapse text-left">
        <thead>
          <tr class="border-b border-surface-variant/30 bg-surface-container-high/50 text-xs font-bold uppercase tracking-widest text-outline">
            <th class="px-6 py-4">ID</th>
            <th class="px-6 py-4">Email</th>
            <th class="px-6 py-4">{{ copy.role }}</th>
            <th class="px-6 py-4">{{ copy.registrationDate }}</th>
            <th class="px-6 py-4">{{ copy.status }}</th>
            <th class="px-6 py-4 text-right">{{ copy.actions }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-surface-variant/20 text-sm">
          <tr v-if="loading">
            <td colspan="6" class="px-6 py-8 text-center text-outline">{{ copy.loading }}</td>
          </tr>
          <tr
            v-for="acc in accounts"
            :key="acc.id"
            class="group transition-colors hover:bg-surface-container-low/50"
          >
            <td class="px-6 py-4 font-mono text-outline">#{{ acc.id }}</td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#006768] to-[#008283] text-xs font-bold text-white">
                  {{ acc.email.charAt(0).toUpperCase() }}
                </div>
                <span class="font-medium">{{ acc.email }}</span>
              </div>
            </td>
            <td class="px-6 py-4">
              <span
                class="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
                :class="acc.role === 'admin' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'"
              >
                {{ acc.role }}
              </span>
            </td>
            <td class="px-6 py-4 text-on-surface-variant">{{ formatDate(acc.registrationDate) }}</td>
            <td class="px-6 py-4">
              <span
                class="inline-flex items-center gap-1.5 text-xs font-semibold"
                :class="isActive(acc) ? 'text-primary' : 'text-error'"
              >
                <span class="h-1.5 w-1.5 rounded-full" :class="isActive(acc) ? 'bg-primary' : 'bg-error'"></span>
                {{ isActive(acc) ? copy.active : copy.inactive }}
              </span>
            </td>
            <td class="space-x-1 px-6 py-4 text-right">
              <button
                class="rounded-lg border border-transparent p-2 text-secondary shadow-sm transition-all hover:border-surface-variant/30 hover:bg-white active:scale-90"
                @click="openEdit(acc)"
              >
                <span class="material-symbols-outlined text-lg">edit</span>
              </button>
              <button
                class="rounded-lg border border-transparent p-2 shadow-sm transition-all hover:border-surface-variant/30 hover:bg-white active:scale-90"
                :class="isActive(acc) ? 'text-error' : 'text-primary'"
                :title="isActive(acc) ? copy.deactivate : copy.activate"
                @click="toggleActive(acc)"
              >
                <span class="material-symbols-outlined text-lg">{{ isActive(acc) ? 'person_off' : 'how_to_reg' }}</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="editing"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-on-surface/40 px-4 backdrop-blur-sm"
      @click.self="editing = null"
    >
      <div class="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div class="flex items-center justify-between bg-[#015081] px-6 py-4">
          <h3 class="font-bold text-white">{{ copy.editUser }} #{{ editing.id }}</h3>
          <button class="text-white/60 hover:text-white" @click="editing = null">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <div class="space-y-4 p-6">
          <div class="space-y-1">
            <label class="text-[11px] font-bold uppercase text-outline">Email</label>
            <input
              v-model="editing.email"
              class="w-full rounded-lg border border-outline-variant/30 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              type="email"
            >
          </div>
          <div class="space-y-1">
            <label class="text-[11px] font-bold uppercase text-outline">{{ copy.role }}</label>
            <div class="rounded-lg border border-outline-variant/30 bg-surface-container-low px-3 py-2 text-sm text-on-surface-variant">
              {{ editing.role }}
            </div>
            <p class="text-xs text-outline">{{ copy.roleLocked }}</p>
          </div>
          <div class="flex gap-3 pt-2">
            <button
              class="flex-1 rounded-lg py-2.5 font-bold text-outline transition-colors hover:bg-surface-container-low"
              @click="editing = null"
            >
              {{ copy.cancel }}
            </button>
            <button
              class="flex-1 rounded-lg bg-[#008F90] py-2.5 font-bold text-white transition-colors hover:bg-[#007a7a]"
              @click="saveEdit"
            >
              {{ copy.save }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { Account } from '~/types/models'
import { AccountService } from '~/services'

definePageMeta({ layout: 'admin' })

const service = new AccountService()
const { t, formatDate: formatLocaleDate } = useAppI18n()
const accounts = ref<Account[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const editing = ref<Account | null>(null)

function isActive(account: Account) {
  return account.active !== false
}

function formatDate(value: string) {
  return formatLocaleDate(new Date(value), {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const copy = computed(() => {
  return {
    metaTitle: t("adminUsers.metaTitle"),
    title: t("adminUsers.title"),
    subtitle: t("adminUsers.subtitle"),
    role: t("adminUsers.role"),
    registrationDate: t("adminUsers.registrationDate"),
    status: t("adminUsers.status"),
    actions: t("adminUsers.actions"),
    loading: t("adminUsers.loading"),
    active: t("adminUsers.active"),
    inactive: t("adminUsers.inactive"),
    activate: t("adminUsers.activate"),
    deactivate: t("adminUsers.deactivate"),
    editUser: t("adminUsers.editUser"),
    roleLocked: t("adminUsers.roleLocked"),
    cancel: t("adminUsers.cancel"),
    save: t("adminUsers.save"),
  }
})

function openEdit(account: Account) {
  editing.value = { ...account }
}

async function toggleActive(account: Account) {
  try {
    error.value = null
    const active = isActive(account)

    if (active) {
      await service.deactivate(account.id)
    } else {
      await service.update(account.id, { active: true })
    }

    const index = accounts.value.findIndex((entry) => entry.id === account.id)
    if (index !== -1) {
      accounts.value[index] = { ...accounts.value[index], active: !active }
    }
  } catch (cause: any) {
    error.value = cause.message
  }
}

async function saveEdit() {
  if (!editing.value) {
    return
  }

  try {
    error.value = null

    const updated = await service.update(editing.value.id, {
      email: editing.value.email,
      active: editing.value.active,
    })

    const index = accounts.value.findIndex((entry) => entry.id === updated.id)
    if (index !== -1) {
      accounts.value[index] = updated
    }

    editing.value = null
  } catch (cause: any) {
    error.value = cause.message
  }
}

onMounted(async () => {
  loading.value = true
  error.value = null

  try {
    accounts.value = await service.getAll()
  } catch (cause: any) {
    error.value = cause.message
    accounts.value = []
  } finally {
    loading.value = false
  }
})
</script>
