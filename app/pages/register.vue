<template>
  <div class="min-h-[calc(100dvh-61px)] flex bg-surface overflow-hidden">
    <Head>
      <title>Create Account — VoyageHub</title>
      <meta name="description" content="Create your VoyageHub account and start discovering exceptional hotel stays across France." />
    </Head>

    <!-- Right Side: Image / Brand -->
    <div class="hidden lg:flex lg:w-1/2 relative bg-primary items-center justify-center overflow-hidden">
      <img src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=2000" alt="Luxury Hotel Suite" class="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay" />
      <div class="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent"></div>
      <div class="relative z-10 px-12 text-center">
        <div class="mb-6 flex items-center justify-center gap-4">
          <span class="material-symbols-outlined flex h-16 w-16 items-center justify-center leading-none text-white" style="font-size: 32px; display: flex; align-items: center; justify-content: center;">travel_explore</span>
          <h1 class="m-0 text-4xl font-bold tracking-tight text-white">VoyageHub</h1>
        </div>
        <p class="mx-auto max-w-md text-lg leading-relaxed text-white">
          Join an exclusive network of travelers. Experience curated properties with exceptional architectural prestige.
        </p>
      </div>
    </div>

    <!-- Left Side: Auth Form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-10 relative">
      <!-- Mobile Brand Header -->
      <div class="absolute top-8 left-8 flex lg:hidden items-center gap-2">
        <span class="material-symbols-outlined text-2xl text-primary">travel_explore</span>
        <span class="font-bold text-xl text-secondary-container">VoyageHub</span>
      </div>

      <div class="w-full max-w-md space-y-5 lg:space-y-4">
        <div>
          <h2 class="text-3xl font-bold text-on-surface mb-2 tracking-tight">Create your account</h2>
          <p class="text-on-surface-variant text-sm">Join thousands of travelers discovering France's best stays.</p>
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
          <span class="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">or register with email</span>
          <div class="flex-1 h-px bg-outline-variant/30"></div>
        </div>

        <form @submit.prevent="handleRegister" novalidate class="space-y-3 lg:space-y-2.5">
          <!-- Error Alert -->
          <div v-if="error" class="flex items-center gap-3 bg-error-container/30 border-l-4 border-error text-on-error-container p-4 rounded-r-lg text-sm font-medium">
            <span class="material-symbols-outlined text-error">error</span>
            {{ error }}
          </div>

          <div class="grid grid-cols-2 gap-4 lg:gap-3">
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
              <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors" :class="submitted && !isPasswordValid ? 'text-error' : 'text-outline'">lock</span>
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Min. 8 characters"
                autocomplete="new-password"
                @focus="passwordFocused = true"
                @blur="passwordFocused = false"
                class="w-full pl-11 pr-12 py-2 text-sm bg-white border rounded-xl text-on-surface placeholder:text-outline/60 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                :class="submitted && !isPasswordValid ? 'border-error focus:border-error' : 'border-outline-variant/50 focus:border-primary'"
              />
              <button type="button" @click="showPassword = !showPassword" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors flex items-center justify-center">
                <span class="material-symbols-outlined text-xl">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
            <div v-if="showPasswordHelper" class="rounded-xl border border-outline-variant/30 bg-surface-container-low px-3 py-2.5">
              <div class="flex items-center justify-between gap-3">
                <p class="text-sm font-semibold text-on-surface">Choose a strong password</p>
                <span class="text-xs font-semibold" :class="passwordStrength.textClass">{{ passwordStrength.label }}</span>
              </div>
              <div class="mt-2 h-2 overflow-hidden rounded-full bg-outline-variant/30">
                <div
                  class="h-full rounded-full transition-all duration-300"
                  :class="passwordStrength.barClass"
                  :style="{ width: `${passwordStrength.percent}%` }"
                ></div>
              </div>
              <div class="mt-3 grid grid-cols-1 gap-x-4 gap-y-1.5 text-xs sm:grid-cols-2">
                <div class="flex items-center gap-2" :class="hasLowercase ? 'text-primary' : 'text-on-surface-variant'">
                  <span class="material-symbols-outlined text-sm">{{ hasLowercase ? 'check_circle' : 'radio_button_unchecked' }}</span>
                  <span>At least one lowercase letter</span>
                </div>
                <div class="flex items-center gap-2" :class="hasUppercase ? 'text-primary' : 'text-on-surface-variant'">
                  <span class="material-symbols-outlined text-sm">{{ hasUppercase ? 'check_circle' : 'radio_button_unchecked' }}</span>
                  <span>At least one uppercase letter</span>
                </div>
                <div class="flex items-center gap-2" :class="hasNumber ? 'text-primary' : 'text-on-surface-variant'">
                  <span class="material-symbols-outlined text-sm">{{ hasNumber ? 'check_circle' : 'radio_button_unchecked' }}</span>
                  <span>At least one number</span>
                </div>
                <div class="flex items-center gap-2" :class="hasMinLength ? 'text-primary' : 'text-on-surface-variant'">
                  <span class="material-symbols-outlined text-sm">{{ hasMinLength ? 'check_circle' : 'radio_button_unchecked' }}</span>
                  <span>Minimum 8 characters</span>
                </div>
              </div>
            </div>
            <p v-if="submitted && !password" class="text-xs text-error font-medium flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">error</span> Password is required</p>
            <p v-else-if="submitted && !isPasswordValid" class="text-xs text-error font-medium flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">error</span> Use 8+ characters, uppercase, lowercase, and a number</p>
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
            <label class="flex items-start gap-3 cursor-pointer pt-1">
              <input v-model="agreed" type="checkbox" class="mt-1 w-4 h-4 transition-colors rounded focus:ring-primary focus:ring-2 accent-primary" :class="submitted && !agreed ? 'border-error ring-1 ring-error' : 'border-outline-variant'" />
              <span class="text-sm text-on-surface-variant leading-snug">
                I agree to the <NuxtLink to="/terms" class="font-semibold text-primary hover:underline">Terms of Service</NuxtLink> and <NuxtLink to="/privacy" class="font-semibold text-primary hover:underline">Privacy Policy</NuxtLink> <span class="text-error">*</span>
              </span>
            </label>
            <p v-if="submitted && !agreed" class="text-xs text-error font-medium mt-1 flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">error</span> You must agree to the terms to continue</p>
          </div>

          <button type="submit" :disabled="loading" class="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-br from-primary to-primary-container text-white font-bold rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/25 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none mt-1">
            <span v-if="loading" class="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
            <span v-else class="text-sm">Create Account</span>
          </button>
        </form>

        <p class="text-center text-sm text-on-surface-variant pt-1">
          Already have an account? 
          <NuxtLink to="/login" class="font-bold text-primary hover:text-primary-container hover:underline underline-offset-4 transition-all">Sign in</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  middleware: 'guest'
})

const router = useRouter()
const route = useRoute()
const { register, loginGoogle, loading, error } = useAuth()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const passwordFocused = ref(false)
const agreed = ref(false)

const hasMinLength = computed(() => password.value.length >= 8)
const hasUppercase = computed(() => /[A-Z]/.test(password.value))
const hasLowercase = computed(() => /[a-z]/.test(password.value))
const hasNumber = computed(() => /\d/.test(password.value))
const isPasswordValid = computed(() =>
  hasMinLength.value && hasUppercase.value && hasLowercase.value && hasNumber.value
)
const passwordMismatch = computed(() =>
  confirmPassword.value.length > 0 && password.value !== confirmPassword.value
)
const isValidEmail = computed(() => /.+@.+\..+/.test(email.value))
const passwordStrengthScore = computed(() =>
  [hasMinLength.value, hasUppercase.value, hasLowercase.value, hasNumber.value].filter(Boolean).length
)
const showPasswordHelper = computed(() => passwordFocused.value || password.value.length > 0)
const passwordStrength = computed(() => {
  if (!password.value) {
    return {
      label: 'Start typing',
      percent: 0,
      barClass: 'bg-outline-variant',
      textClass: 'text-on-surface-variant'
    }
  }

  if (passwordStrengthScore.value <= 1) {
    return {
      label: 'Weak',
      percent: 25,
      barClass: 'bg-error',
      textClass: 'text-error'
    }
  }

  if (passwordStrengthScore.value === 2) {
    return {
      label: 'Fair',
      percent: 50,
      barClass: 'bg-[#f59e0b]',
      textClass: 'text-[#d97706]'
    }
  }

  if (passwordStrengthScore.value === 3) {
    return {
      label: 'Good',
      percent: 75,
      barClass: 'bg-secondary',
      textClass: 'text-secondary'
    }
  }

  return {
    label: 'Strong',
    percent: 100,
    barClass: 'bg-primary',
    textClass: 'text-primary'
  }
})
const submitted = ref(false)

async function handleRegister() {
  submitted.value = true
  
  if (!firstName.value || !email.value || !isValidEmail.value || !password.value || !isPasswordValid.value || !confirmPassword.value || passwordMismatch.value || !agreed.value) {
    return
  }
  
  const ok = await register(email.value, password.value, firstName.value, lastName.value)
  if (ok) {
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : ''
    router.push(redirect.startsWith('/') ? redirect : '/')
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



