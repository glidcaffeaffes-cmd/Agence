<template>
  <div class="min-h-[calc(100dvh-61px)] flex bg-surface overflow-hidden">
    <div
      class="hidden lg:flex lg:w-1/2 relative bg-primary items-center justify-center overflow-hidden"
    >
      <img
        src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=2000"
        :alt="t('authRecovery.verifyHeroAlt')"
        class="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent"
      ></div>
      <div class="relative z-10 px-12 text-center">
        <div class="mb-6 flex items-center justify-center gap-4">
          <span
            class="material-symbols-outlined flex h-16 w-16 items-center justify-center leading-none text-white"
            style="font-size: 32px"
            >travel_explore</span
          >
          <h1 class="m-0 text-4xl font-bold tracking-tight text-white">
            VoyageHub
          </h1>
        </div>
        <p class="mx-auto max-w-md text-lg leading-relaxed text-white">
          {{ t("authRecovery.verifyHeroMessage") }}
        </p>
      </div>
    </div>

    <div
      class="relative flex w-full items-center justify-center p-6 sm:p-8 lg:w-1/2 lg:p-10"
    >
      <div class="absolute top-8 start-8 flex lg:hidden items-center gap-2">
        <span class="material-symbols-outlined text-2xl text-primary"
          >travel_explore</span
        >
        <span class="font-bold text-xl text-secondary-container">
          VoyageHub
        </span>
      </div>

      <div class="w-full max-w-md space-y-5 lg:space-y-4">
        <div class="text-center">
          <div
            class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary"
          >
            <span class="material-symbols-outlined icon-verify leading-none">
              mail
            </span>
          </div>
          <h2 class="text-3xl font-bold text-on-surface tracking-tight">
            {{ t("authRecovery.verifyTitle") }}
          </h2>
          <p class="text-on-surface-variant text-sm">
            {{ t("authRecovery.verifySubtitle", { email: displayEmail }) }}
          </p>
        </div>

        <div
          v-if="error"
          class="flex items-center gap-3 rounded-e-lg border-s-4 border-error bg-error-container/30 p-4 text-sm font-medium text-on-error-container"
        >
          <span class="material-symbols-outlined text-error">error</span>
          {{ error }}
        </div>
        <div
          v-if="infoMessage"
          class="flex items-center gap-3 rounded-e-lg border-s-4 border-primary bg-primary/10 p-4 text-sm font-medium text-on-surface"
        >
          <span class="material-symbols-outlined text-primary">info</span>
          {{ infoMessage }}
        </div>

        <div class="space-y-3">
          <button
            type="button"
            :disabled="loading"
            class="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-primary to-primary-container px-4 py-2.5 font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/25 disabled:cursor-not-allowed disabled:opacity-70 disabled:transform-none disabled:shadow-none"
            @click="handleContinue"
          >
            <span
              v-if="loading"
              class="material-symbols-outlined animate-spin text-[20px]"
            >
              progress_activity
            </span>
            <span v-else class="text-sm">
              {{ t("authRecovery.verifiedButton") }}
            </span>
          </button>

          <button
            type="button"
            :disabled="loading"
            class="w-full rounded-xl border border-outline-variant/50 px-4 py-2.5 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-low disabled:opacity-70"
            @click="handleResend"
          >
            {{ t("authRecovery.resendButton") }}
          </button>
        </div>

        <div class="pt-1 text-center text-sm text-on-surface-variant">
          <NuxtLink
            to="/login"
            class="font-bold text-primary transition-all hover:text-primary-container hover:underline underline-offset-4"
          >
            {{ t("authRecovery.backToSignIn") }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuth } from "~/composables/useAuth";

definePageMeta({ middleware: "guest" });

const route = useRoute();
const router = useRouter();
const { t } = useAppI18n();
const {
  loading,
  error,
  pendingVerificationEmail,
  resendVerificationEmail,
  completeVerificationLogin,
} = useAuth();

useHead(() => ({
  title: t("authRecovery.verifyMetaTitle"),
  meta: [
    {
      name: "description",
      content: t("authRecovery.verifyMetaDescription"),
    },
  ],
}));

const infoMessage = ref("");
const displayEmail = computed(
  () =>
    pendingVerificationEmail.value ||
    (typeof route.query.email === "string"
      ? route.query.email
      : t("authRecovery.yourEmail")),
);

async function handleResend() {
  infoMessage.value = "";
  try {
    await resendVerificationEmail();
    infoMessage.value = t("authRecovery.resendSuccess");
  } catch (cause: any) {
    error.value = cause?.message || t("authRecovery.resendError");
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
    error.value = t("authRecovery.notVerifiedYet");
  }
}
</script>

<style scoped>
.icon-verify {
  font-size: 40px !important;
}
</style>
