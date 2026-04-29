<template>
  <div class="min-h-[calc(100dvh-61px)] flex bg-surface overflow-hidden">
    <Head>
      <title>Sign In — VoyageHub</title>
      <meta name="description" content="Sign in to your VoyageHub account to manage bookings and explore exclusive hotel offers." />
    </Head>

    <!-- Left Side: Image / Brand -->
    <div class="hidden lg:flex lg:w-1/2 relative bg-primary items-center justify-center overflow-hidden">
      <img src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=2000" alt="Luxury Hotel Suite" class="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay" />
      <div class="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent"></div>
      <div class="relative z-10 px-12 text-center">
        <div class="mb-6 flex items-center justify-center gap-4">
          <img :src="brandLogoUrl" alt="" class="h-16 w-16 rounded-2xl object-contain brightness-0 invert" aria-hidden="true" />
          <h1 class="m-0 text-4xl font-bold tracking-tight text-white">VoyageHub</h1>
        </div>
        <p class="mx-auto max-w-md text-lg leading-relaxed text-white">
          Join an exclusive network of travelers. Experience curated properties with exceptional architectural prestige.
        </p>
      </div>
    </div>

    <!-- Right Side: Auth Form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-10 relative">
      <!-- Mobile Brand Header -->
      <div class="absolute top-8 left-8 flex lg:hidden items-center gap-2">
        <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <img :src="brandLogoUrl" alt="" class="h-6 w-6 object-contain brightness-0 invert" aria-hidden="true" />
        </span>
        <span class="font-bold text-xl text-secondary-container">VoyageHub</span>
      </div>

      <div class="w-full max-w-md space-y-5 lg:space-y-4">
        <div>
          <h2 class="text-3xl font-bold text-on-surface mb-2 tracking-tight">Welcome back</h2>
          <p class="text-on-surface-variant text-sm">Please sign in to access your dashboard.</p>
        </div>

        <!-- Google Sign In -->
        <button type="button" @click="handleGoogleSignIn" class="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white border border-outline-variant/50 rounded-xl text-on-surface font-semibold hover:bg-surface-container-low transition-colors shadow-sm">
          <svg viewBox="0 0 24 24" class="w-5 h-5">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Sign in with Google
        </button>

        <div class="flex items-center gap-4 py-2">
          <div class="flex-1 h-px bg-outline-variant/30"></div>
          <span class="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">or sign in with email</span>
          <div class="flex-1 h-px bg-outline-variant/30"></div>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4 lg:space-y-3">
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
                class="w-full pl-10 pr-4 py-2 bg-white border border-outline-variant/50 rounded-xl text-sm text-on-surface placeholder:text-outline/60 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              />
            </div>
          </div>

          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <label class="block text-sm font-semibold text-on-surface" for="password">Password</label>
              <NuxtLink to="/forgot-password" class="text-sm font-medium text-primary hover:text-primary-container transition-colors">Forgot password?</NuxtLink>
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
                class="w-full pl-10 pr-10 py-2 bg-white border border-outline-variant/50 rounded-xl text-sm text-on-surface placeholder:text-outline/60 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              />
              <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors flex items-center justify-center">
                <span class="material-symbols-outlined text-xl">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
          </div>

          <button type="submit" :disabled="loading" class="w-full flex items-center justify-center gap-2 py-2.5 px-4 mt-2 bg-gradient-to-br from-primary to-primary-container text-white font-bold rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/25 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none">
            <span v-if="loading" class="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
            <span v-else class="text-sm">Sign In</span>
          </button>
        </form>

        <p class="text-center text-sm text-on-surface-variant pt-2">
          Don't have an account? 
          <NuxtLink to="/register" class="font-bold text-primary hover:text-primary-container hover:underline underline-offset-4 transition-all">Create one free</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'

const brandLogoUrl = new URL('../../assets/images/logo.png', import.meta.url).href

definePageMeta({
  middleware: 'guest'
})

const router = useRouter()
const route = useRoute()
const { login, loginGoogle, loading, error } = useAuth()

const email = ref('')
const password = ref('')
const showPassword = ref(false)

async function handleLogin() {
  const ok = await login(email.value, password.value)
  if (ok) {
    const { currentAccount } = useAuth()
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : ''
    const fallbackPath = currentAccount.value?.role === 'admin' ? '/admin' : '/'
    router.push(redirect.startsWith('/') ? redirect : fallbackPath)
  }
}

import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

async function handleGoogleSignIn() {
  const { $firebaseAuth } = useNuxtApp()
  if (!$firebaseAuth) return

  loading.value = true
  try {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup($firebaseAuth, provider)
    const user = result.user
    
    const [firstName, ...lastNameArr] = (user.displayName || '').split(' ')
    const lastName = lastNameArr.join(' ')

    const ok = await loginGoogle({
      email: user.email || '',
      firstName: firstName || 'Google User',
      lastName: lastName || '',
      uid: user.uid,
      photo: user.photoURL || undefined
    })
    
    if (ok) {
      const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
      router.push(redirect)
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to sign in with Google'
  } finally {
    loading.value = false
  }
}
</script>



