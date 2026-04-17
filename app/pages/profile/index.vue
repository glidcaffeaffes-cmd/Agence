<template>
  <div class="min-h-screen bg-surface">
    <Head>
      <title>My Profile — VoyageHub</title>
      <meta name="description" content="Manage your VoyageHub profile and preferences." />
    </Head>

    <!-- Global Client Navbar (Placeholder for context if needed, usually handled by layout) -->
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Page Header -->
      <header class="mb-10">
        <h1 class="text-4xl font-bold text-on-surface tracking-tight">My Account</h1>
        <p class="text-on-surface-variant mt-2 text-lg">Manage your personal information and preferences.</p>
      </header>

      <div class="flex flex-col lg:flex-row gap-10">
        <!-- Sidebar Navigation -->
        <aside class="w-full lg:w-72 flex-shrink-0">
          <div class="bg-white rounded-2xl shadow-sm border border-outline-variant/40 overflow-hidden sticky top-8">
            <!-- User Summary -->
            <div class="p-6 border-b border-outline-variant/30 text-center">
              <div class="w-24 h-24 mx-auto rounded-full bg-surface-container-high border-4 border-white shadow-md overflow-hidden mb-4">
                <img :src="currentProfile?.photo || 'https://i.pravatar.cc/150'" alt="Avatar" class="w-full h-full object-cover" />
              </div>
              <h2 class="text-xl font-bold text-on-surface">{{ currentProfile?.firstName || 'Jean' }} {{ currentProfile?.lastName || 'Dupont' }}</h2>
              <p class="text-sm text-on-surface-variant mt-1">{{ currentProfile?.email || 'jean.dupont@example.com' }}</p>
              
              <div class="mt-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
                   :class="currentProfile?.role === 'Admin' ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'">
                {{ currentProfile?.role || 'Client' }}
              </div>
            </div>

            <!-- Nav Links -->
            <nav class="p-3 space-y-1">
              <NuxtLink to="/profile" class="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/5 text-primary font-semibold transition-colors">
                <span class="material-symbols-outlined text-[20px]">person</span>
                Personal Info
              </NuxtLink>
              <NuxtLink to="/reservations/history" class="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors font-medium">
                <span class="material-symbols-outlined text-[20px]">history</span>
                Reservation History
              </NuxtLink>
              <NuxtLink to="/settings" class="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors font-medium">
                <span class="material-symbols-outlined text-[20px]">settings</span>
                Settings & Security
              </NuxtLink>
            </nav>
          </div>
        </aside>

        <!-- Main Content Form -->
        <main class="flex-1">
          <div class="bg-white rounded-2xl shadow-sm border border-outline-variant/40 overflow-hidden">
            <div class="p-8 border-b border-outline-variant/30">
              <h3 class="text-2xl font-bold text-on-surface">Personal Information</h3>
              <p class="text-sm text-on-surface-variant mt-1">Update your details to ensure smooth bookings.</p>
            </div>

            <form @submit.prevent="saveProfile" class="p-8 space-y-8">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <!-- First Name -->
                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-on-surface">First Name</label>
                  <input 
                    type="text" 
                    :value="currentProfile?.firstName" 
                    class="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/60 rounded-xl text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  />
                </div>
                <!-- Last Name -->
                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-on-surface">Last Name</label>
                  <input 
                    type="text" 
                    :value="currentProfile?.lastName" 
                    class="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/60 rounded-xl text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  />
                </div>
              </div>

              <!-- Email -->
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <label class="block text-sm font-semibold text-on-surface">Email Address</label>
                  <span class="text-xs text-on-surface-variant font-medium bg-surface-container-high px-2 py-1 rounded">Verified</span>
                </div>
                <div class="relative">
                  <input 
                    type="email" 
                    :value="currentProfile?.email" 
                    disabled
                    class="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/40 rounded-xl text-on-surface-variant cursor-not-allowed outline-none"
                  />
                  <span class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant">lock</span>
                </div>
                <p class="text-xs text-outline mt-1">Email cannot be changed directly. Please contact support.</p>
              </div>

              <!-- Phone -->
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-on-surface">Phone Number</label>
                <div class="relative">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-medium">+33</span>
                  <input 
                    type="tel" 
                    :value="currentProfile?.phone" 
                    placeholder="6 12 34 56 78"
                    class="w-full pl-12 pr-4 py-3 bg-surface-container-lowest border border-outline-variant/60 rounded-xl text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  />
                </div>
              </div>

              <!-- Actions -->
              <div class="pt-6 border-t border-outline-variant/30 flex justify-end">
                <button type="submit" class="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-container shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
                  Save Changes
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
