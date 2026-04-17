<template>
  <div class="min-h-screen flex bg-surface">
    <Head>
      <title>Create Account — VoyageHub</title>
      <meta name="description" content="Create your VoyageHub account and start discovering exceptional hotel stays across France." />
    </Head>

    <!-- Right Side: Image / Brand -->
    <div class="hidden lg:flex lg:w-1/2 relative bg-primary items-center justify-center overflow-hidden">
      <img src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=2000" alt="Luxury Hotel Suite" class="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay" />
      <div class="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent"></div>
      <div class="relative z-10 text-center text-white px-12">
        <div class="flex items-center justify-center gap-3 mb-6">
          <span class="material-symbols-outlined text-5xl text-accent">travel_explore</span>
          <h1 class="text-4xl font-bold tracking-tight">VoyageHub</h1>
        </div>
        <p class="text-lg text-primary-fixed max-w-md mx-auto leading-relaxed">
          Join an exclusive network of travelers. Experience curated properties with exceptional architectural prestige.
        </p>
      </div>
    </div>

    <!-- Left Side: Auth Form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 lg:p-16 relative">
      <!-- Mobile Brand Header -->
      <div class="absolute top-8 left-8 flex lg:hidden items-center gap-2">
        <span class="material-symbols-outlined text-2xl text-primary">travel_explore</span>
        <span class="font-bold text-xl text-secondary-container">VoyageHub</span>
      </div>

      <div class="w-full max-w-md space-y-5">
        <div>
          <h2 class="text-3xl font-bold text-on-surface mb-2 tracking-tight">Create your account</h2>
          <p class="text-on-surface-variant text-sm">Join thousands of travelers discovering France's best stays.</p>
        </div>

        <form @submit.prevent="handleRegister" novalidate class="space-y-3">
          <!-- Error Alert -->
          <div v-if="error" class="flex items-center gap-3 bg-error-container/30 border-l-4 border-error text-on-error-container p-4 rounded-r-lg text-sm font-medium">
            <span class="material-symbols-outlined text-error">error</span>
            {{ error }}
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-on-surface" for="firstName">First name <span class="text-error">*</span></label>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-lg transition-colors" :class="submitted && !firstName ? 'text-error' : 'text-outline'">person</span>
                <input
                  id="firstName"
                  v-model="firstName"
                  type="text"
                  placeholder="Jean"
                  class="w-full pl-10 pr-4 py-2 text-sm bg-white border rounded-xl text-on-surface placeholder:text-outline/60 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  :class="submitted && !firstName ? 'border-error focus:border-error' : 'border-outline-variant/50 focus:border-primary'"
                />
              </div>
              <p v-if="submitted && !firstName" class="text-xs text-error font-medium flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">error</span> First name is required</p>
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-on-surface" for="lastName">Last name</label>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-outline">badge</span>
                <input
                  id="lastName"
                  v-model="lastName"
                  type="text"
                  placeholder="Dupont"
                  class="w-full pl-10 pr-4 py-2 text-sm bg-white border border-outline-variant/50 rounded-xl text-on-surface placeholder:text-outline/60 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                />
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-semibold text-on-surface" for="email">Email address <span class="text-error">*</span></label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors" :class="submitted && (!email || !isValidEmail) ? 'text-error' : 'text-outline'">mail</span>
              <input
                id="email"
                v-model="email"
                type="email"
                placeholder="you@example.com"
                autocomplete="email"
                class="w-full pl-11 pr-4 py-2 text-sm bg-white border rounded-xl text-on-surface placeholder:text-outline/60 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                :class="submitted && (!email || !isValidEmail) ? 'border-error focus:border-error' : 'border-outline-variant/50 focus:border-primary'"
              />
            </div>
            <p v-if="submitted && !email" class="text-xs text-error font-medium flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">error</span> Email is required</p>
            <p v-else-if="submitted && !isValidEmail" class="text-xs text-error font-medium flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">error</span> Please enter a valid email</p>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-semibold text-on-surface" for="password">Password <span class="text-error">*</span></label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors" :class="submitted && (!password || password.length < 8) ? 'text-error' : 'text-outline'">lock</span>
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Min. 8 characters"
                autocomplete="new-password"
                class="w-full pl-11 pr-12 py-2 text-sm bg-white border rounded-xl text-on-surface placeholder:text-outline/60 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                :class="submitted && (!password || password.length < 8) ? 'border-error focus:border-error' : 'border-outline-variant/50 focus:border-primary'"
              />
              <button type="button" @click="showPassword = !showPassword" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors flex items-center justify-center">
                <span class="material-symbols-outlined text-xl">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
            <p v-if="submitted && !password" class="text-xs text-error font-medium flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">error</span> Password is required</p>
            <p v-else-if="submitted && password.length < 8" class="text-xs text-error font-medium flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">error</span> Password must be at least 8 characters</p>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-semibold text-on-surface" for="confirmPassword">Confirm password <span class="text-error">*</span></label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors" :class="submitted && (!confirmPassword || passwordMismatch) ? 'text-error' : 'text-outline'">lock_reset</span>
              <input
                id="confirmPassword"
                v-model="confirmPassword"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Re-enter your password"
                autocomplete="new-password"
                class="w-full pl-11 pr-4 py-2 text-sm bg-white border rounded-xl text-on-surface placeholder:text-outline/60 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                :class="submitted && (!confirmPassword || passwordMismatch) ? 'border-error focus:border-error' : 'border-outline-variant/50 focus:border-primary'"
              />
            </div>
            <p v-if="submitted && !confirmPassword" class="text-xs text-error font-medium flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">error</span> Please confirm your password</p>
            <p v-else-if="submitted && passwordMismatch" class="text-xs text-error font-medium flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">error</span> Passwords do not match</p>
          </div>

          <div>
            <label class="flex items-start gap-3 cursor-pointer pt-2">
              <input v-model="agreed" type="checkbox" class="mt-1 w-4 h-4 transition-colors rounded focus:ring-primary focus:ring-2 accent-primary" :class="submitted && !agreed ? 'border-error ring-1 ring-error' : 'border-outline-variant'" />
              <span class="text-sm text-on-surface-variant leading-snug">
                I agree to the <a href="#" class="font-semibold text-primary hover:underline">Terms of Service</a> and <a href="#" class="font-semibold text-primary hover:underline">Privacy Policy</a> <span class="text-error">*</span>
              </span>
            </label>
            <p v-if="submitted && !agreed" class="text-xs text-error font-medium mt-1 flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">error</span> You must agree to the terms to continue</p>
          </div>

          <button type="submit" :disabled="loading" class="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-br from-primary to-primary-container text-white font-bold rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/25 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none mt-1">
            <span v-if="loading" class="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
            <span v-else class="text-sm">Create Account</span>
          </button>
        </form>

        <p class="text-center text-sm text-on-surface-variant pt-2">
          Already have an account? 
          <NuxtLink to="/login" class="font-bold text-primary hover:text-primary-container hover:underline underline-offset-4 transition-all">Sign in</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  // using default layout
})

const router = useRouter()
const { register, loading, error } = useAuth()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const agreed = ref(false)

const passwordMismatch = computed(() =>
  confirmPassword.value.length > 0 && password.value !== confirmPassword.value
)

const isValidEmail = computed(() => /.+@.+\..+/.test(email.value))
const submitted = ref(false)

async function handleRegister() {
  submitted.value = true
  
  if (!firstName.value || !email.value || !isValidEmail.value || !password.value || password.value.length < 8 || !confirmPassword.value || passwordMismatch.value || !agreed.value) {
    return
  }
  
  const ok = await register(email.value, password.value, firstName.value, lastName.value)
  if (ok) router.push('/')
}
</script>
