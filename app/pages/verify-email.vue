<template>
  <div class="min-h-[calc(100dvh-61px)] flex bg-surface overflow-hidden">
    <Head>
      <title>Verify Email — VoyageHub</title>
      <meta
        name="description"
        content="Verify your email to activate your VoyageHub account."
      />
    </Head>

    <div
      class="hidden lg:flex lg:w-1/2 relative bg-primary items-center justify-center overflow-hidden"
    >
      <img
        src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=2000"
        alt="Luxury Hotel Suite"
        class="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent"
      ></div>
      <div class="relative z-10 px-12 text-center">
        <div class="mb-6 flex items-center justify-center gap-4">
          <span
            class="material-symbols-outlined flex h-16 w-16 items-center justify-center leading-none text-white"
            style="
              font-size: 32px;
              display: flex;
              align-items: center;
              justify-content: center;
            "
            >travel_explore</span
          >
          <h1 class="m-0 text-4xl font-bold tracking-tight text-white">
            VoyageHub
          </h1>
        </div>
        <p class="mx-auto max-w-md text-lg leading-relaxed text-white">
          Join an exclusive network of travelers. Experience curated properties
          with exceptional architectural prestige.
        </p>
      </div>
    </div>

    <div
      class="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-10 relative"
    >
      <div class="absolute top-8 left-8 flex lg:hidden items-center gap-2">
        <span class="material-symbols-outlined text-2xl text-primary"
          >travel_explore</span
        >
        <span class="font-bold text-xl text-secondary-container"
          >VoyageHub</span
        >
      </div>

      <div class="w-full max-w-md space-y-5 lg:space-y-4">
        <div class="text-center">
          <div
            class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary"
          >
            <span class="material-symbols-outlined icon-verify leading-none"
              >mail</span
            >
          </div>
          <h2 class="text-3xl font-bold text-on-surface tracking-tight">
            Verify your email
          </h2>
          <p class="text-on-surface-variant text-sm">
            We sent a verification link to
            <span class="font-semibold text-on-surface">{{ displayEmail }}</span
            >.
          </p>
        </div>

        <div
          v-if="error"
          class="flex items-center gap-3 bg-error-container/30 border-l-4 border-error text-on-error-container p-4 rounded-r-lg text-sm font-medium"
        >
          <span class="material-symbols-outlined text-error">error</span>
          {{ error }}
        </div>
        <div
          v-if="infoMessage"
          class="flex items-center gap-3 bg-primary/10 border-l-4 border-primary text-on-surface p-4 rounded-r-lg text-sm font-medium"
        >
          <span class="material-symbols-outlined text-primary">info</span>
          {{ infoMessage }}
        </div>

        <div class="space-y-3">
          <button
            type="button"
            :disabled="loading"
            @click="handleContinue"
            class="w-full flex items-center justify-center gap-2 py-2.5 px-4 mt-2 bg-gradient-to-br from-primary to-primary-container text-white font-bold rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/25 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
          >
            <span
              v-if="loading"
              class="material-symbols-outlined animate-spin text-[20px]"
              >progress_activity</span
            >
            <span v-else class="text-sm">I’ve Verified My Email</span>
          </button>

          <button
            type="button"
            :disabled="loading"
            @click="handleResend"
            class="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-outline-variant/50 rounded-xl text-sm font-semibold text-on-surface hover:bg-surface-container-low transition-colors disabled:opacity-70"
          >
            Resend Verification Email
          </button>
        </div>

        <p class="text-center text-sm text-on-surface-variant pt-1">
          Back to
          <NuxtLink
            to="/login"
            class="font-bold text-primary hover:text-primary-container hover:underline underline-offset-4 transition-all"
            >Sign in</NuxtLink
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

definePageMeta({ middleware: "guest" });

const route = useRoute();
const router = useRouter();
const {
  loading,
  error,
  pendingVerificationEmail,
  resendVerificationEmail,
  completeVerificationLogin,
} = useAuth();

const infoMessage = ref("");
const displayEmail = computed(
  () =>
    pendingVerificationEmail.value ||
    (typeof route.query.email === "string" ? route.query.email : "your email"),
);

async function handleResend() {
  infoMessage.value = "";
  try {
    await resendVerificationEmail();
    infoMessage.value = "Verification email sent. Please check your inbox.";
  } catch (e: any) {
    error.value = e?.message || "Unable to resend verification email.";
  }
}

async function handleContinue() {
  infoMessage.value = "";
  const ok = await completeVerificationLogin();
  if (ok) {
    const redirect =
      typeof route.query.redirect === "string" ? route.query.redirect : "/";
    router.push(redirect.startsWith("/") ? redirect : "/");
    return;
  }

  if (!error.value) {
    error.value =
      "Email not verified yet. Please verify your inbox link first.";
  }
}
</script>
<style scoped>
.icon-verify {
  font-size: 40px !important;
}
</style>
