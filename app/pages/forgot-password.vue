<template>
  <div class="min-h-[calc(100dvh-61px)] flex bg-surface overflow-hidden">
    <div class="hidden lg:flex lg:w-1/2 relative bg-primary items-center justify-center overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=2000"
        :alt="t('authRecovery.forgotHeroAlt')"
        class="absolute inset-0 h-full w-full object-cover opacity-60 mix-blend-overlay"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent"></div>
      <div class="relative z-10 px-12 text-center">
        <div class="mb-6 flex items-center justify-center gap-4">
          <img :src="brandLogoUrl" alt="" class="h-16 w-16 rounded-2xl object-contain brightness-0 invert" aria-hidden="true" />
          <h1 class="m-0 text-4xl font-bold tracking-tight text-white">VoyageHub</h1>
        </div>
        <p class="mx-auto max-w-md text-lg leading-relaxed text-white">
          {{ t("authRecovery.forgotHeroMessage") }}
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
          <h2 class="mb-2 text-3xl font-bold tracking-tight text-on-surface">{{ t("authRecovery.forgotTitle") }}</h2>
          <p class="text-sm text-on-surface-variant">
            {{ t("authRecovery.forgotSubtitle") }}
          </p>
        </div>

        <div
          v-if="submitted"
          class="rounded-xl border border-primary/15 bg-primary/5 p-4 text-sm text-on-surface"
        >
          <div class="flex items-start gap-3">
            <span class="material-symbols-outlined text-primary">mark_email_read</span>
            <div>
              <p class="font-semibold text-primary">{{ t("authRecovery.forgotSuccessTitle") }}</p>
              <p class="mt-1 text-on-surface-variant">
                {{ t("authRecovery.forgotSuccessMessage", { email }) }}
              </p>
            </div>
          </div>
        </div>

        <form v-else class="space-y-4" @submit.prevent="handleSubmit">

          <div class="space-y-2">
            <label class="block text-sm font-semibold text-on-surface" for="email">{{ t("auth.emailAddress") }}</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute start-3.5 top-1/2 -translate-y-1/2 text-outline">mail</span>
              <input
                id="email"
                v-model="email"
                type="email"
                required
                autocomplete="email"
                :placeholder="t('auth.emailPlaceholder')"
                class="w-full rounded-xl border border-outline-variant/50 bg-surface-container py-2 ps-10 pe-4 text-sm text-on-surface outline-none transition-all placeholder:text-outline/60 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-primary to-primary-container px-4 py-2.5 font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/25 disabled:cursor-not-allowed disabled:opacity-70 disabled:shadow-none"
          >
            <span v-if="loading" class="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
            <span v-else class="text-sm">{{ t("authRecovery.sendResetLink") }}</span>
          </button>
        </form>

        <div class="text-center text-sm text-on-surface-variant">
          <NuxtLink to="/login" class="font-bold text-primary transition-all hover:text-primary-container hover:underline underline-offset-4">
            {{ t("authRecovery.backToSignIn") }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '~/composables/useAuth'

const runtimeConfig = useRuntimeConfig()
const brandLogoUrl = `${runtimeConfig.app.baseURL}logo.png`
const { t } = useAppI18n()

definePageMeta({
  middleware: 'guest',
})

useHead(() => ({
  title: t('authRecovery.forgotMetaTitle'),
  meta: [
    {
      name: 'description',
      content: t('authRecovery.forgotMetaDescription'),
    },
  ],
}))

const { requestPasswordReset, loading, error } = useAuth()
const email = ref('')
const submitted = ref(false)

async function handleSubmit() {
  const ok = await requestPasswordReset(email.value)
  if (ok) {
    submitted.value = true
  }
}
</script>



