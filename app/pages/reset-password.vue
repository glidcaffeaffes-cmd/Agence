<template>
  <div class="min-h-[calc(100dvh-61px)] flex bg-surface overflow-hidden">
    <div class="hidden lg:flex lg:w-1/2 relative bg-primary items-center justify-center overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=2000"
        :alt="t('authRecovery.resetHeroAlt')"
        class="absolute inset-0 h-full w-full object-cover opacity-60 mix-blend-overlay"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent"></div>
      <div class="relative z-10 px-12 text-center text-white">
        <div class="mb-6 flex items-center justify-center gap-3">
          <img :src="brandLogoUrl" alt="" class="h-16 w-16 rounded-2xl object-contain brightness-0 invert" aria-hidden="true" />
          <h1 class="text-4xl font-bold tracking-tight">VoyageHub</h1>
        </div>
        <p class="mx-auto max-w-md text-lg leading-relaxed text-primary-fixed">
          {{ t("authRecovery.resetHeroMessage") }}
        </p>
      </div>
    </div>

    <div class="relative flex w-full items-center justify-center p-6 sm:p-8 lg:w-1/2 lg:p-10">
      <div class="absolute start-8 top-8 flex items-center gap-2 lg:hidden">
        <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <img :src="brandLogoUrl" alt="" class="h-6 w-6 object-contain brightness-0 invert" aria-hidden="true" />
        </span>
        <span class="text-xl font-bold text-secondary-container">VoyageHub</span>
      </div>

      <div class="w-full max-w-md space-y-5 lg:space-y-4">
        <div>
          <h2 class="mb-2 text-3xl font-bold tracking-tight text-on-surface">{{ t("authRecovery.resetTitle") }}</h2>
          <p class="text-sm text-on-surface-variant">
            {{ t("authRecovery.resetSubtitle") }}
          </p>
        </div>

        <div
          v-if="completed"
          class="rounded-xl border border-primary/15 bg-primary/5 p-4 text-sm text-on-surface"
        >
          <div class="flex items-start gap-3">
            <span class="material-symbols-outlined text-primary">verified_user</span>
            <div>
              <p class="font-semibold text-primary">{{ t("authRecovery.resetSuccessTitle") }}</p>
              <p class="mt-1 text-on-surface-variant">
                {{ t("authRecovery.resetSuccessMessage") }}
              </p>
            </div>
          </div>
        </div>

        <div
          v-else-if="!token"
          class="rounded-xl border border-error/20 bg-error/5 p-4 text-sm text-error"
        >
          {{ t("authRecovery.resetInvalidLink") }}
        </div>

        <form v-else class="space-y-3" @submit.prevent="handleSubmit">
          <div v-if="error" class="flex items-center gap-3 rounded-e-lg border-s-4 border-error bg-error-container/30 p-4 text-sm font-medium text-on-error-container">
            <span class="material-symbols-outlined text-error">error</span>
            {{ error }}
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-semibold text-on-surface" for="password">{{ t("auth.password") }}</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute start-3.5 top-1/2 -translate-y-1/2 transition-colors" :class="submitted && !isPasswordValid ? 'text-error' : 'text-outline'">lock</span>
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password"
                :placeholder="t('auth.passwordPlaceholder')"
                class="w-full rounded-xl border bg-surface-container py-2 ps-11 pe-12 text-sm text-on-surface outline-none transition-all placeholder:text-outline/60 focus:ring-2 focus:ring-primary/20"
                :class="submitted && !isPasswordValid ? 'border-error focus:border-error' : 'border-outline-variant/50 focus:border-primary'"
              />
              <button type="button" class="absolute end-3.5 top-1/2 -translate-y-1/2 text-outline transition-colors hover:text-primary" @click="showPassword = !showPassword">
                <span class="material-symbols-outlined text-xl">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
            <div class="rounded-xl border border-outline-variant/30 bg-surface-container-low px-3 py-2.5">
              <div class="flex items-center justify-between gap-3">
                <p class="text-sm font-semibold text-on-surface">{{ t("auth.strongPassword") }}</p>
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
                  <span>{{ t("auth.passwordRuleLower") }}</span>
                </div>
                <div class="flex items-center gap-2" :class="hasUppercase ? 'text-primary' : 'text-on-surface-variant'">
                  <span class="material-symbols-outlined text-sm">{{ hasUppercase ? 'check_circle' : 'radio_button_unchecked' }}</span>
                  <span>{{ t("auth.passwordRuleUpper") }}</span>
                </div>
                <div class="flex items-center gap-2" :class="hasNumber ? 'text-primary' : 'text-on-surface-variant'">
                  <span class="material-symbols-outlined text-sm">{{ hasNumber ? 'check_circle' : 'radio_button_unchecked' }}</span>
                  <span>{{ t("auth.passwordRuleNumber") }}</span>
                </div>
                <div class="flex items-center gap-2" :class="hasMinLength ? 'text-primary' : 'text-on-surface-variant'">
                  <span class="material-symbols-outlined text-sm">{{ hasMinLength ? 'check_circle' : 'radio_button_unchecked' }}</span>
                  <span>{{ t("auth.passwordRuleLength") }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-semibold text-on-surface" for="confirmPassword">{{ t("auth.confirmPassword") }}</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute start-3.5 top-1/2 -translate-y-1/2 transition-colors" :class="submitted && (!confirmPassword || passwordMismatch) ? 'text-error' : 'text-outline'">lock_reset</span>
              <input
                id="confirmPassword"
                v-model="confirmPassword"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password"
                :placeholder="t('auth.confirmPasswordPlaceholder')"
                class="w-full rounded-xl border bg-surface-container py-2 ps-11 pe-4 text-sm text-on-surface outline-none transition-all placeholder:text-outline/60 focus:ring-2 focus:ring-primary/20"
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
            <span v-else class="text-sm">{{ t("authRecovery.updatePassword") }}</span>
          </button>
        </form>

        <div class="text-center text-sm text-on-surface-variant">
          <NuxtLink
            :to="completed ? '/login' : '/forgot-password'"
            class="font-bold text-primary transition-all hover:text-primary-container hover:underline underline-offset-4"
          >
            {{ completed ? t("authRecovery.backToSignIn") : t("authRecovery.requestNewResetLink") }}
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

const runtimeConfig = useRuntimeConfig()
const brandLogoUrl = `${runtimeConfig.app.baseURL}logo.png`
const { t } = useAppI18n()

definePageMeta({
  middleware: 'guest',
})

useHead(() => ({
  title: t('authRecovery.resetMetaTitle'),
  meta: [
    {
      name: 'description',
      content: t('authRecovery.resetMetaDescription'),
    },
  ],
}))

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
      label: t('auth.passwordStart'),
      percent: 0,
      barClass: 'bg-outline-variant',
      textClass: 'text-on-surface-variant',
    }
  }

  if (passwordStrengthScore.value <= 1) {
    return {
      label: t('auth.passwordWeak'),
      percent: 25,
      barClass: 'bg-error',
      textClass: 'text-error',
    }
  }

  if (passwordStrengthScore.value === 2) {
    return {
      label: t('auth.passwordFair'),
      percent: 50,
      barClass: 'bg-[#f59e0b]',
      textClass: 'text-[#d97706]',
    }
  }

  if (passwordStrengthScore.value === 3) {
    return {
      label: t('auth.passwordStrong'),
      percent: 75,
      barClass: 'bg-secondary',
      textClass: 'text-secondary',
    }
  }

  return {
    label: t('auth.passwordExcellent'),
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
