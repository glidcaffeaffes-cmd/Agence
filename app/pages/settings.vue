<template>
  <div class="min-h-screen bg-[#f8fafc] font-sans">
    <Head>
      <title>Settings & Security — VoyageHub</title>
      <meta name="description" content="Manage your VoyageHub account settings and security." />
    </Head>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <!-- Page Header: Editorial Style -->
      <header class="mb-12">
        <h1 class="text-5xl font-black text-neutral-900 tracking-tighter uppercase leading-none">Access Control</h1>
        <p class="text-neutral-500 mt-4 text-lg font-medium">Manage your security protocols and platform preferences.</p>
      </header>

      <div class="flex flex-col lg:flex-row gap-12">
        <!-- Premium Sidebar Navigation -->
        <aside class="w-full lg:w-72 flex-shrink-0">
          <div class="bg-white rounded-[32px] shadow-xl shadow-neutral-200/50 overflow-hidden sticky top-8 border border-neutral-100">
            <!-- User Summary: Concierge Style -->
            <div class="p-8 text-center bg-neutral-900 text-white relative overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-br from-neutral-800 to-transparent opacity-50"></div>
              <div class="relative z-10">
                <div class="w-24 h-24 mx-auto rounded-2xl bg-white/10 border border-white/20 shadow-2xl overflow-hidden mb-4 p-1 backdrop-blur-md">
                  <img :src="currentProfile?.photo || 'https://i.pravatar.cc/150'" alt="Avatar" class="w-full h-full object-cover rounded-xl grayscale hover:grayscale-0 transition-all duration-500" />
                </div>
                <h2 class="text-xl font-black tracking-tight leading-tight">{{ currentProfile?.firstName || 'Jean' }} {{ currentProfile?.lastName || 'Dupont' }}</h2>
                <div class="mt-4 inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] bg-white text-neutral-900">
                  {{ currentProfile?.role || 'Verified Member' }}
                </div>
              </div>
            </div>

            <!-- Nav Links: Brutalist Minimal -->
            <nav class="p-4 space-y-2 bg-white">
              <NuxtLink to="/profile" class="flex items-center gap-3 px-6 py-4 rounded-2xl text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50 font-black text-[11px] uppercase tracking-widest transition-all">
                <span class="material-symbols-outlined text-[20px]">person</span>
                Identity
              </NuxtLink>
              <NuxtLink to="/reservations/history" class="flex items-center gap-3 px-6 py-4 rounded-2xl text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50 font-black text-[11px] uppercase tracking-widest transition-all">
                <span class="material-symbols-outlined text-[20px]">history</span>
                Ledger
              </NuxtLink>
              <NuxtLink to="/settings" class="flex items-center gap-3 px-6 py-4 rounded-2xl bg-neutral-50 text-neutral-900 font-black text-[11px] uppercase tracking-widest transition-all">
                <span class="material-symbols-outlined text-[20px]">settings</span>
                Security
              </NuxtLink>
            </nav>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 space-y-12">
          
          <!-- Security Card -->
          <div class="bg-white rounded-[32px] shadow-xl shadow-neutral-200/50 overflow-hidden border border-neutral-100">
            <div class="p-10 border-b border-neutral-50 bg-neutral-50/30">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-neutral-900">
                  <span class="material-symbols-outlined text-[28px]">shield</span>
                </div>
                <div>
                  <h3 class="text-2xl font-black text-neutral-900 tracking-tight uppercase">Authentication</h3>
                  <p class="text-sm text-neutral-500 font-medium">Update your cryptographic credentials.</p>
                </div>
              </div>
            </div>
            
            <div class="p-10 space-y-10">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="space-y-3">
                  <label class="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Current Passcode</label>
                  <input v-model="passwordForm.currentPassword" type="password" class="w-full px-6 py-5 bg-neutral-50 border-none rounded-2xl text-neutral-900 font-semibold focus:ring-2 focus:ring-neutral-900/5 focus:bg-white transition-all outline-none shadow-sm" />
                </div>
                <div class="space-y-3">
                  <label class="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">New Passcode</label>
                  <input v-model="passwordForm.newPassword" type="password" class="w-full px-6 py-5 bg-neutral-50 border-none rounded-2xl text-neutral-900 font-semibold focus:ring-2 focus:ring-neutral-900/5 focus:bg-white transition-all outline-none shadow-sm" />
                </div>
                <div class="space-y-3 md:col-span-2">
                  <label class="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Verify New Passcode</label>
                  <input v-model="passwordForm.confirmPassword" type="password" class="w-full px-6 py-5 bg-neutral-50 border-none rounded-2xl text-neutral-900 font-semibold focus:ring-2 focus:ring-neutral-900/5 focus:bg-white transition-all outline-none shadow-sm" />
                </div>
              </div>
              <div class="flex justify-end pt-6">
                <button @click="changePasswordHandler" type="button" class="group flex items-center gap-3 px-10 py-5 bg-neutral-900 text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-neutral-800 transition-all shadow-xl shadow-neutral-900/10 active:scale-95">
                  Rotate Credentials <span class="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">sync_lock</span>
                </button>
              </div>

              <div class="pt-10 border-t border-neutral-50">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-[24px] bg-neutral-50 border border-neutral-100">
                  <div>
                    <h4 class="text-sm font-black text-neutral-900 uppercase tracking-widest mb-1">Multi-Factor Protocol</h4>
                    <p class="text-xs text-neutral-500 font-medium">Add an additional layer of verification to your account.</p>
                  </div>
                  <button class="px-8 py-3 bg-white border border-neutral-200 text-neutral-900 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-neutral-900 hover:text-white transition-all">
                    Enable Protocol
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Notifications Card -->
          <div class="bg-white rounded-[32px] shadow-xl shadow-neutral-200/50 overflow-hidden border border-neutral-100">
             <div class="p-10 border-b border-neutral-50 bg-neutral-50/30">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-neutral-900">
                  <span class="material-symbols-outlined text-[28px]">notifications</span>
                </div>
                <div>
                  <h3 class="text-2xl font-black text-neutral-900 tracking-tight uppercase">Intelligence</h3>
                  <p class="text-sm text-neutral-500 font-medium">Configure how you receive property updates and invitations.</p>
                </div>
              </div>
            </div>
            
            <div class="p-10 space-y-4">
              <label class="group flex items-center justify-between p-6 rounded-[24px] bg-neutral-50 hover:bg-white border border-transparent hover:border-neutral-100 transition-all cursor-pointer">
                <div class="space-y-1">
                  <span class="block text-xs font-black text-neutral-900 uppercase tracking-widest">Property Ledger Updates</span>
                  <span class="text-xs text-neutral-500 font-medium">Real-time confirmation of changes and cancellations.</span>
                </div>
                <div class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="notificationSettings.reservation" class="sr-only peer">
                  <div class="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neutral-900"></div>
                </div>
              </label>

              <label class="group flex items-center justify-between p-6 rounded-[24px] bg-neutral-50 hover:bg-white border border-transparent hover:border-neutral-100 transition-all cursor-pointer">
                <div class="space-y-1">
                  <span class="block text-xs font-black text-neutral-900 uppercase tracking-widest">Curation Insights</span>
                  <span class="text-xs text-neutral-500 font-medium">Exclusive invitations to new architectural listings.</span>
                </div>
                <div class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="notificationSettings.promotion" class="sr-only peer">
                  <div class="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neutral-900"></div>
                </div>
              </label>

              <div class="flex justify-end pt-6">
                <button
                  @click="updateNotifications"
                  :disabled="loading"
                  class="group flex items-center gap-3 px-10 py-4 bg-neutral-900 text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-neutral-800 transition-all shadow-xl shadow-neutral-900/10 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="loading">Updating...</span>
                  <span v-else>Save Preferences</span>
                  <span v-if="!loading" class="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">save</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Payment Methods Card -->
          <div class="bg-white rounded-[32px] shadow-xl shadow-neutral-200/50 overflow-hidden border border-neutral-100">
            <div class="p-10 border-b border-neutral-50 bg-neutral-50/30">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-neutral-900">
                  <span class="material-symbols-outlined text-[28px]">payments</span>
                </div>
                <div>
                  <h3 class="text-2xl font-black text-neutral-900 tracking-tight uppercase">Financial Vault</h3>
                  <p class="text-sm text-neutral-500 font-medium">Manage your encrypted payment instruments.</p>
                </div>
              </div>
            </div>
            <div class="p-10">
              <div class="flex flex-col items-center justify-center p-16 bg-neutral-50 border-2 border-dashed border-neutral-200 rounded-[24px] text-center">
                <div class="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-neutral-300 mb-6">
                  <span class="material-symbols-outlined text-[32px]">credit_card_off</span>
                </div>
                <p class="text-xs font-black text-neutral-400 uppercase tracking-[0.2em] mb-8">Vault is currently empty</p>
                <button class="flex items-center gap-3 px-10 py-4 bg-neutral-900 text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-neutral-800 transition-all shadow-xl shadow-neutral-900/10">
                  <span class="material-symbols-outlined text-[20px]">add</span>
                  Initialize Vault Entry
                </button>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import { ref, watch } from 'vue'

const { currentProfile, updateProfile, changePassword, loading, error } = useAuth()

const notificationSettings = ref({
  reservation: true,
  promotion: false
})
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

watch(currentProfile, (profile) => {
  if (profile) {
    notificationSettings.value = {
      reservation: profile.notificationsReservation,
      promotion: profile.notificationsPromotion
    }
  }
}, { immediate: true })

async function updateNotifications() {
  const success = await updateProfile({
    notificationsReservation: notificationSettings.value.reservation,
    notificationsPromotion: notificationSettings.value.promotion
  })
  if (success) {
    alert('Notification preferences updated successfully!')
  } else {
    alert('Failed to update notification preferences. Please try again.')
  }
}

async function changePasswordHandler() {
  if (!passwordForm.value.currentPassword || !passwordForm.value.newPassword) {
    alert('Please complete all password fields.')
    return
  }

  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    alert('The new password confirmation does not match.')
    return
  }

  const success = await changePassword(passwordForm.value.currentPassword, passwordForm.value.newPassword)
  if (success) {
    passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
    alert('Password updated successfully!')
  } else {
    alert(error.value || 'Failed to update password. Please try again.')
  }
}
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
