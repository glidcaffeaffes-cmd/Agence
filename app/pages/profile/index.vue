<template>
  <div class="min-h-screen bg-[#f8fafc] font-sans">
    <Head>
      <title>My Profile — VoyageHub</title>
      <meta name="description" content="Manage your VoyageHub profile and preferences." />
    </Head>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <!-- Page Header: Editorial Style -->
      <header class="mb-12">
        <h1 class="text-5xl font-black text-neutral-900 tracking-tighter uppercase leading-none">Portfolio Identity</h1>
        <p class="text-neutral-500 mt-4 text-lg font-medium">Manage your personal credentials and global profile.</p>
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
              <NuxtLink to="/profile" class="flex items-center gap-3 px-6 py-4 rounded-2xl bg-neutral-50 text-neutral-900 font-black text-[11px] uppercase tracking-widest transition-all">
                <span class="material-symbols-outlined text-[20px]">person</span>
                Identity
              </NuxtLink>
              <NuxtLink to="/reservations/history" class="flex items-center gap-3 px-6 py-4 rounded-2xl text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50 font-black text-[11px] uppercase tracking-widest transition-all">
                <span class="material-symbols-outlined text-[20px]">history</span>
                Ledger
              </NuxtLink>
              <NuxtLink to="/settings" class="flex items-center gap-3 px-6 py-4 rounded-2xl text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50 font-black text-[11px] uppercase tracking-widest transition-all">
                <span class="material-symbols-outlined text-[20px]">settings</span>
                Security
              </NuxtLink>
            </nav>
          </div>
        </aside>

        <!-- Main Content: Architectural Card -->
        <main class="flex-1">
          <div class="bg-white rounded-[32px] shadow-xl shadow-neutral-200/50 overflow-hidden border border-neutral-100">
            <div class="p-10 md:p-12 border-b border-neutral-50 bg-neutral-50/30">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-neutral-900">
                  <span class="material-symbols-outlined text-[28px]">account_circle</span>
                </div>
                <div>
                  <h3 class="text-2xl font-black text-neutral-900 tracking-tight uppercase">Identity Details</h3>
                  <p class="text-sm text-neutral-500 font-medium">Update your profile to ensure seamless coordination across all properties.</p>
                </div>
              </div>
            </div>

            <form @submit.prevent="saveProfile" class="p-10 md:p-12 space-y-12">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                <!-- First Name -->
                <div class="space-y-3">
                  <label class="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Given Name</label>
                  <input 
                    type="text" 
                    :value="currentProfile?.firstName" 
                    class="w-full px-6 py-5 bg-neutral-50 border-none rounded-2xl text-neutral-900 font-semibold focus:ring-2 focus:ring-neutral-900/5 focus:bg-white transition-all outline-none shadow-sm"
                  />
                </div>
                <!-- Last Name -->
                <div class="space-y-3">
                  <label class="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Surname</label>
                  <input 
                    type="text" 
                    :value="currentProfile?.lastName" 
                    class="w-full px-6 py-5 bg-neutral-50 border-none rounded-2xl text-neutral-900 font-semibold focus:ring-2 focus:ring-neutral-900/5 focus:bg-white transition-all outline-none shadow-sm"
                  />
                </div>
              </div>

              <!-- Email -->
              <div class="space-y-3">
                <div class="flex justify-between items-center ml-1">
                  <label class="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Digital Fingerprint</label>
                  <span class="text-[9px] font-black text-green-600 bg-green-50 px-2.5 py-1 rounded-full uppercase tracking-widest">Verified Identity</span>
                </div>
                <div class="relative group">
                  <input 
                    type="email" 
                    :value="currentProfile?.email" 
                    disabled
                    class="w-full px-6 py-5 bg-neutral-50 border-none rounded-2xl text-neutral-400 font-semibold cursor-not-allowed outline-none shadow-sm opacity-60"
                  />
                  <span class="material-symbols-outlined absolute right-6 top-1/2 -translate-y-1/2 text-neutral-300">lock</span>
                </div>
                <p class="text-[10px] text-neutral-400 font-bold uppercase tracking-wide mt-2 ml-1">Identity verification is locked. Contact concierge for changes.</p>
              </div>

              <!-- Phone -->
              <div class="space-y-3">
                <label class="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Communication Line</label>
                <div class="relative group">
                  <span class="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-400 font-bold text-sm">+33</span>
                  <input 
                    type="tel" 
                    :value="currentProfile?.phone" 
                    placeholder="6 12 34 56 78"
                    class="w-full pl-16 pr-6 py-5 bg-neutral-50 border-none rounded-2xl text-neutral-900 font-semibold focus:ring-2 focus:ring-neutral-900/5 focus:bg-white transition-all outline-none shadow-sm"
                  />
                </div>
              </div>

              <!-- Actions -->
              <div class="pt-10 border-t border-neutral-50 flex justify-end">
                <button type="submit" class="group flex items-center gap-3 px-12 py-5 bg-neutral-900 text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-neutral-800 transition-all shadow-xl shadow-neutral-900/10 active:scale-95">
                  Secure Changes <span class="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

const { currentProfile } = useAuth()

function saveProfile() {
  alert('Profile updated successfully! (Mock Action)')
}
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
