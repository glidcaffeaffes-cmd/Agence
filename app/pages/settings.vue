<template>
  <div class="min-h-screen bg-surface">
    <Head>
      <title>Settings & Security — VoyageHub</title>
      <meta name="description" content="Manage your VoyageHub account settings and security." />
    </Head>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Page Header -->
      <header class="mb-10">
        <h1 class="text-4xl font-bold text-on-surface tracking-tight">Settings & Security</h1>
        <p class="text-on-surface-variant mt-2 text-lg">Manage your account security, notifications, and payment methods.</p>
      </header>

      <div class="flex flex-col lg:flex-row gap-10">
        <!-- Sidebar Navigation (Consistent with Profile) -->
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
              <NuxtLink to="/profile" class="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors font-medium">
                <span class="material-symbols-outlined text-[20px]">person</span>
                Personal Info
              </NuxtLink>
              <NuxtLink to="/reservations/history" class="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors font-medium">
                <span class="material-symbols-outlined text-[20px]">history</span>
                Reservation History
              </NuxtLink>
              <NuxtLink to="/settings" class="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/5 text-primary font-semibold transition-colors">
                <span class="material-symbols-outlined text-[20px]">settings</span>
                Settings & Security
              </NuxtLink>
            </nav>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 space-y-8">
          
          <!-- Security Card -->
          <div class="bg-white rounded-2xl shadow-sm border border-outline-variant/40 overflow-hidden">
            <div class="p-8 border-b border-outline-variant/30">
              <h3 class="text-2xl font-bold text-on-surface">Security & Password</h3>
              <p class="text-sm text-on-surface-variant mt-1">Ensure your account is secure with a strong password.</p>
            </div>
            <div class="p-8 space-y-8">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-on-surface">Current Password</label>
                  <input type="password" class="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/60 rounded-xl text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none" />
                </div>
                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-on-surface">New Password</label>
                  <input type="password" class="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/60 rounded-xl text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none" />
                </div>
                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-on-surface">Confirm New Password</label>
                  <input type="password" class="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/60 rounded-xl text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none" />
                </div>
              </div>
              <div class="flex justify-end">
                <button type="button" class="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-container shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
                  Update Password
                </button>
              </div>

              <hr class="border-outline-variant/30" />

              <div>
                <h4 class="text-lg font-bold text-on-surface mb-2">Two-Factor Authentication</h4>
                <p class="text-sm text-on-surface-variant mb-4">Add an extra layer of security to your account.</p>
                <button class="px-5 py-2.5 border-2 border-outline-variant/60 text-on-surface font-semibold rounded-xl hover:bg-surface-container-lowest transition-colors">
                  Enable 2FA
                </button>
              </div>
            </div>
          </div>

          <!-- Notifications Card -->
          <div class="bg-white rounded-2xl shadow-sm border border-outline-variant/40 overflow-hidden">
            <div class="p-8 border-b border-outline-variant/30">
              <h3 class="text-2xl font-bold text-on-surface">Notification Preferences</h3>
              <p class="text-sm text-on-surface-variant mt-1">Choose what we notify you about.</p>
            </div>
            <div class="p-8 space-y-4">
              <!-- Toggle 1 -->
              <label class="flex items-center justify-between p-4 border border-outline-variant/40 rounded-xl hover:bg-surface-container-lowest cursor-pointer transition-colors">
                <div>
                  <span class="block font-bold text-on-surface">Booking Updates</span>
                  <span class="text-sm text-on-surface-variant">Confirmations, changes, and cancellations.</span>
                </div>
                <input type="checkbox" checked class="w-5 h-5 text-primary bg-white border-outline-variant rounded focus:ring-primary focus:ring-2 accent-primary" />
              </label>
              <!-- Toggle 2 -->
              <label class="flex items-center justify-between p-4 border border-outline-variant/40 rounded-xl hover:bg-surface-container-lowest cursor-pointer transition-colors">
                <div>
                  <span class="block font-bold text-on-surface">Special Offers</span>
                  <span class="text-sm text-on-surface-variant">Promotions, discounts, and personalized deals.</span>
                </div>
                <input type="checkbox" class="w-5 h-5 text-primary bg-white border-outline-variant rounded focus:ring-primary focus:ring-2 accent-primary" />
              </label>
              <!-- Toggle 3 -->
              <label class="flex items-center justify-between p-4 border border-outline-variant/40 rounded-xl hover:bg-surface-container-lowest cursor-pointer transition-colors">
                <div>
                  <span class="block font-bold text-on-surface">News & Updates</span>
                  <span class="text-sm text-on-surface-variant">New features, policies, and company news.</span>
                </div>
                <input type="checkbox" checked class="w-5 h-5 text-primary bg-white border-outline-variant rounded focus:ring-primary focus:ring-2 accent-primary" />
              </label>
            </div>
          </div>

          <!-- Payment Methods Card -->
          <div class="bg-white rounded-2xl shadow-sm border border-outline-variant/40 overflow-hidden">
            <div class="p-8 border-b border-outline-variant/30">
              <h3 class="text-2xl font-bold text-on-surface">Payment Methods</h3>
              <p class="text-sm text-on-surface-variant mt-1">Manage your saved credit cards for faster booking.</p>
            </div>
            <div class="p-8">
              <div class="flex flex-col items-center justify-center p-10 bg-surface-container-lowest border-2 border-dashed border-outline-variant/60 rounded-xl text-center">
                <span class="material-symbols-outlined text-4xl text-outline mb-3">credit_card_off</span>
                <p class="text-on-surface-variant mb-6 font-medium">You have no saved payment methods.</p>
                <button class="px-5 py-2.5 border-2 border-outline-variant/60 text-on-surface font-semibold rounded-xl hover:bg-surface-container-lowest transition-colors flex items-center gap-2">
                  <span class="material-symbols-outlined text-[20px]">add</span>
                  Add Payment Method
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

const { currentAccount, currentProfile } = useAuth()
</script>
