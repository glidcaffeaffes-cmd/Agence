<template>
  <div class="min-h-[calc(100dvh-61px)] flex bg-surface overflow-hidden">
    <Head>
      <title>Set New Password - VoyageHub</title>
      <meta
        name="description"
        content="Create a new password for your VoyageHub account."
      />
    </Head>

    <div class="hidden lg:flex lg:w-1/2 relative bg-primary items-center justify-center overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=2000"
        alt="Luxury hotel suite"
        class="absolute inset-0 h-full w-full object-cover opacity-60 mix-blend-overlay"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent"></div>
      <div class="relative z-10 px-12 text-center text-white">
        <div class="mb-6 flex items-center justify-center gap-3">
          <img :src="brandLogoUrl" alt="" class="h-16 w-16 rounded-2xl object-contain brightness-0 invert" aria-hidden="true" />
          <h1 class="text-4xl font-bold tracking-tight">VoyageHub</h1>
        </div>
        <p class="mx-auto max-w-md text-lg leading-relaxed text-primary-fixed">
          Choose a strong password so your next booking is only waiting for your bags, not for account recovery.
        </p>
      </div>
    </div>

    <div class="relative flex w-full items-center justify-center p-6 sm:p-8 lg:w-1/2 lg:p-10">
      <div class="absolute left-8 top-8 flex items-center gap-2 lg:hidden">
        <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <img :src="brandLogoUrl" alt="" class="h-6 w-6 object-contain brightness-0 invert" aria-hidden="true" />
        </span>
        <span class="text-xl font-bold text-secondary-container">VoyageHub</span>
      </div>

      <div class="w-full max-w-md space-y-5 lg:space-y-4">
        <div>
          <h2 class="mb-2 text-3xl font-bold tracking-tight text-on-surface">Create a new password</h2>
          <p class="text-sm text-on-surface-variant">
            Your new password should be at least 8 characters and feel sturdy.
          </p>
        </div>

        <div
          v-if="completed"
          class="rounded-xl border border-primary/15 bg-primary/5 p-4 text-sm text-on-surface"
        >
          <div class="flex items-start gap-3">
            <span class="material-symbols-outlined text-primary">verified_user</span>
            <div>
              <p class="font-semibold text-primary">Password updated</p>
              <p class="mt-1 text-on-surface-variant">
                You can sign in now with your new password.
              </p>
            </div>
          </div>
        </div>

        <div
          v-else-if="!token"
          class="rounded-xl border border-error/20 bg-error/5 p-4 text-sm text-error"
        >
          This reset link is missing or invalid. Request a new one to continue.
        </div>

        <form v-else class="space-y-3" @submit.prevent="handleSubmit">
          <div v-if="error" class="flex items-center gap-3 rounded-r-lg border-l-4 border-error bg-error-container/30 p-4 text-sm font-medium text-on-error-container">
            <span class="material-symbols-outlined text-error">error</span>
            {{ error }}
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-semibold text-on-surface" for="password">New password</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors" :class="submitted && !isPasswordValid ? 'text-error' : 'text-outline'">lock</span>
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password"
                placeholder="Min. 8 characters"
                class="w-full rounded-xl border bg-white py-2 pl-11 pr-12 text-sm text-on-surface outline-none transition-all placeholder:text-outline/60 focus:ring-2 focus:ring-primary/20"
                :class="submitted && !isPasswordValid ? 'border-error focus:border-error' : 'border-outline-variant/50 focus:border-primary'"
              />
              <button type="button" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-outline transition-colors hover:text-primary" @click="showPassword = !showPassword">
                <span class="material-symbols-outlined text-xl">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
            <div class="rounded-xl border border-outline-variant/30 bg-surface-container-low px-3 py-2.5">
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
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-semibold text-on-surface" for="confirmPassword">Confirm password</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors" :class="submitted && (!confirmPassword || passwordMismatch) ? 'text-error' : 'text-outline'">lock_reset</span>
              <input
                id="confirmPassword"
                v-model="confirmPassword"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password"
                placeholder="Re-enter your password"
                class="w-full rounded-xl border bg-white py-2 pl-11 pr-4 text-sm text-on-surface outline-none transition-all placeholder:text-outline/60 focus:ring-2 focus:ring-primary/20"
                :class="submitted && (!confirmPassword || passwordMismatch) ? 'border-error focus:border-error' : 'border-outline-variant/50 focus:border-primary'"
              />
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-primary to-primary-container px-4 py-2.5 font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/25 disabled:cursor-not-allowed disabled:opacity-70 disabled:shadow-none"
          >
            <span v-if="loading" class="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
            <span v-else class="text-sm">Update password</span>
          </button>
        </form>

        <div class="text-center text-sm text-on-surface-variant">
          <NuxtLink
            :to="completed ? '/login' : '/forgot-password'"
            class="font-bold text-primary transition-all hover:text-primary-container hover:underline underline-offset-4"
          >
            {{ completed ? 'Back to sign in' : 'Request a new reset link' }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'

const brandLogoUrl = new URL('../../assets/images/logo.png', import.meta.url).href

definePageMeta({
  middleware: 'guest',
})

const route = useRoute()
const router = useRouter()
const { resetPassword, loading, error } = useAuth()

const token = computed(() => (typeof route.query.token === 'string' ? route.query.token : ''))
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const submitted = ref(false)
const completed = ref(false)

const hasMinLength = computed(() => password.value.length >= 8)
const hasUppercase = computed(() => /[A-Z]/.test(password.value))
const hasLowercase = computed(() => /[a-z]/.test(password.value))
const hasNumber = computed(() => /\d/.test(password.value))
const isPasswordValid = computed(() =>
  hasMinLength.value && hasUppercase.value && hasLowercase.value && hasNumber.value,
)
const passwordMismatch = computed(() =>
  confirmPassword.value.length > 0 && password.value !== confirmPassword.value,
)
const passwordStrengthScore = computed(() =>
  [hasMinLength.value, hasUppercase.value, hasLowercase.value, hasNumber.value].filter(Boolean).length,
)
const passwordStrength = computed(() => {
  if (!password.value) {
    return {
      label: 'Start typing',
      percent: 0,
      barClass: 'bg-outline-variant',
      textClass: 'text-on-surface-variant',
    }
  }

  if (passwordStrengthScore.value <= 1) {
    return {
      label: 'Weak',
      percent: 25,
      barClass: 'bg-error',
      textClass: 'text-error',
    }
  }

  if (passwordStrengthScore.value === 2) {
    return {
      label: 'Fair',
      percent: 50,
      barClass: 'bg-[#f59e0b]',
      textClass: 'text-[#d97706]',
    }
  }

  if (passwordStrengthScore.value === 3) {
    return {
      label: 'Good',
      percent: 75,
      barClass: 'bg-secondary',
      textClass: 'text-secondary',
    }
  }

  return {
    label: 'Strong',
    percent: 100,
    barClass: 'bg-primary',
    textClass: 'text-primary',
  }
})

async function handleSubmit() {
  submitted.value = true

  if (!token.value || !isPasswordValid.value || passwordMismatch.value || !confirmPassword.value) {
    return
  }

  const ok = await resetPassword(token.value, password.value)
  if (ok) {
    completed.value = true
    window.setTimeout(() => {
      router.push('/login')
    }, 1200)
  }
}
</script>
