<template>
  <div class="min-h-[calc(100dvh-61px)] flex bg-surface overflow-hidden">
    <Head>
      <title>Forgot Password - VoyageHub</title>
      <meta
        name="description"
        content="Request a secure password reset link for your VoyageHub account."
      />
    </Head>

    <div class="hidden lg:flex lg:w-1/2 relative bg-primary items-center justify-center overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=2000"
        alt="Luxury hotel interior"
        class="absolute inset-0 h-full w-full object-cover opacity-60 mix-blend-overlay"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent"></div>
      <div class="relative z-10 px-12 text-center">
        <div class="mb-6 flex items-center justify-center gap-4">
          <span class="material-symbols-outlined flex h-16 w-16 items-center justify-center leading-none text-white" style="font-size: 32px; display: flex; align-items: center; justify-content: center;">travel_explore</span>
          <h1 class="m-0 text-4xl font-bold tracking-tight text-white">VoyageHub</h1>
        </div>
        <p class="mx-auto max-w-md text-lg leading-relaxed text-white">
          We will send a secure reset link to the email address linked to your account.
        </p>
      </div>
    </div>

    <div class="relative flex w-full items-center justify-center p-6 sm:p-8 lg:w-1/2 lg:p-10">
      <div class="absolute left-8 top-8 flex items-center gap-2 lg:hidden">
        <span class="material-symbols-outlined text-2xl text-primary">travel_explore</span>
        <span class="text-xl font-bold text-secondary-container">VoyageHub</span>
      </div>

      <div class="w-full max-w-md space-y-5 lg:space-y-4">
        <div>
          <h2 class="mb-2 text-3xl font-bold tracking-tight text-on-surface">Reset your password</h2>
          <p class="text-sm text-on-surface-variant">
            Enter your email and we will send you a reset link if the account exists.
          </p>
        </div>

        <div
          v-if="submitted"
          class="rounded-xl border border-primary/15 bg-primary/5 p-4 text-sm text-on-surface"
        >
          <div class="flex items-start gap-3">
            <span class="material-symbols-outlined text-primary">mark_email_read</span>
            <div>
              <p class="font-semibold text-primary">Check your inbox</p>
              <p class="mt-1 text-on-surface-variant">
                If an account matches <strong>{{ email }}</strong>, a reset link is on its way.
              </p>
            </div>
          </div>
        </div>

        <form v-else class="space-y-4" @submit.prevent="handleSubmit">

          <div class="space-y-2">
            <label class="block text-sm font-semibold text-on-surface" for="email">Email address</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline">mail</span>
              <input
                id="email"
                v-model="email"
                type="email"
                required
                autocomplete="email"
                placeholder="you@example.com"
                class="w-full rounded-xl border border-outline-variant/50 bg-white py-2 pl-10 pr-4 text-sm text-on-surface outline-none transition-all placeholder:text-outline/60 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-primary to-primary-container px-4 py-2.5 font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/25 disabled:cursor-not-allowed disabled:opacity-70 disabled:shadow-none"
          >
            <span v-if="loading" class="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
            <span v-else class="text-sm">Send reset link</span>
          </button>
        </form>

        <div class="text-center text-sm text-on-surface-variant">
          <NuxtLink to="/login" class="font-bold text-primary transition-all hover:text-primary-container hover:underline underline-offset-4">
            Back to sign in
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  middleware: 'guest',
})

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



