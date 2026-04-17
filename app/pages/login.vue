<template>
  <div class="min-h-screen flex bg-surface">
    <Head>
      <title>Sign In — VoyageHub</title>
      <meta name="description" content="Sign in to your VoyageHub account to manage bookings and explore exclusive hotel offers." />
    </Head>

    <!-- Left Side: Image / Brand -->
    <div class="hidden lg:flex lg:w-1/2 relative bg-primary items-center justify-center overflow-hidden">
      <img src="https://images.unsplash.com/photo-1542314831-c6a4d27ce66f?auto=format&fit=crop&q=80&w=2000" alt="Luxury Hotel" class="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay" />
      <div class="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent"></div>
      <div class="relative z-10 text-center text-white px-12">
        <div class="flex items-center justify-center gap-3 mb-6">
          <span class="material-symbols-outlined text-5xl text-accent">travel_explore</span>
          <h1 class="text-4xl font-bold tracking-tight">VoyageHub</h1>
        </div>
        <p class="text-lg text-primary-fixed max-w-md mx-auto leading-relaxed">
          The architectural authority in luxury travel. Access your curated reservations and manage your global stays.
        </p>
      </div>
    </div>

    <!-- Right Side: Auth Form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative">
      <!-- Mobile Brand Header -->
      <div class="absolute top-8 left-8 flex lg:hidden items-center gap-2">
        <span class="material-symbols-outlined text-2xl text-primary">travel_explore</span>
        <span class="font-bold text-xl text-secondary-container">VoyageHub</span>
      </div>

      <div class="w-full max-w-md space-y-10">
        <div>
          <h2 class="text-3xl font-bold text-on-surface mb-2 tracking-tight">Welcome back</h2>
          <p class="text-on-surface-variant text-sm">Please sign in to access your dashboard.</p>
        </div>

        <!-- Demo Shortcuts -->
        <div class="flex flex-wrap items-center gap-3 bg-surface-container-low p-4 rounded-xl border border-outline-variant/30">
          <span class="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Demo Access</span>
          <button @click="handleDemoClient" class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-outline-variant/50 text-sm font-medium text-primary hover:bg-surface hover:border-primary transition-colors">
            <span class="material-symbols-outlined text-[18px]">person</span> Client
          </button>
          <button @click="handleDemoAdmin" class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-outline-variant/50 text-sm font-medium text-secondary hover:bg-surface hover:border-secondary transition-colors">
            <span class="material-symbols-outlined text-[18px]">admin_panel_settings</span> Admin
          </button>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Error Alert -->
          <div v-if="error" class="flex items-center gap-3 bg-error-container/30 border-l-4 border-error text-on-error-container p-4 rounded-r-lg text-sm font-medium">
            <span class="material-symbols-outlined text-error">error</span>
            {{ error }}
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-semibold text-on-surface" for="email">Email address</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline">mail</span>
              <input
                id="email"
                v-model="email"
                type="email"
                placeholder="you@example.com"
                autocomplete="email"
                required
                class="w-full pl-11 pr-4 py-3 bg-white border border-outline-variant/50 rounded-xl text-on-surface placeholder:text-outline/60 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              />
            </div>
          </div>

          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <label class="block text-sm font-semibold text-on-surface" for="password">Password</label>
              <a href="#" class="text-sm font-medium text-primary hover:text-primary-container transition-colors">Forgot password?</a>
            </div>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline">lock</span>
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                autocomplete="current-password"
                required
                class="w-full pl-11 pr-12 py-3 bg-white border border-outline-variant/50 rounded-xl text-on-surface placeholder:text-outline/60 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              />
              <button type="button" @click="showPassword = !showPassword" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors flex items-center justify-center">
                <span class="material-symbols-outlined text-xl">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
          </div>

          <button type="submit" :disabled="loading" class="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-br from-primary to-primary-container text-white font-bold rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/25 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none">
            <span v-if="loading" class="material-symbols-outlined animate-spin">progress_activity</span>
            <span v-else>Sign In</span>
          </button>
        </form>

        <p class="text-center text-sm text-on-surface-variant pt-4">
          Don't have an account? 
          <NuxtLink to="/register" class="font-bold text-primary hover:text-primary-container hover:underline underline-offset-4 transition-all">Create one free</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  // using default layout
})

const router = useRouter()
const { login, demoLoginClient, demoLoginAdmin, loading, error } = useAuth()

const email = ref('')
const password = ref('')
const showPassword = ref(false)

async function handleLogin() {
  const ok = await login(email.value, password.value)
  if (ok) {
    const { currentAccount } = useAuth()
    router.push(currentAccount.value?.role === 'admin' ? '/admin' : '/')
  }
}

async function handleDemoClient() {
  const ok = await demoLoginClient()
  if (ok) router.push('/')
}

async function handleDemoAdmin() {
  const ok = await demoLoginAdmin()
  if (ok) router.push('/admin')
}
</script>
