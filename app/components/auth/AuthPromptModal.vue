<template>
  <Teleport to="body">
    <transition name="auth-prompt">
      <div
        v-if="isOpen"
        class="auth-prompt"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-prompt-title"
        @click.self="close"
      >
        <div class="auth-prompt__panel">
          <button
            type="button"
            class="auth-prompt__close"
            :aria-label="t('authPrompt.close')"
            @click="close"
          >
            <span class="material-symbols-outlined">close</span>
          </button>

          <div class="auth-prompt__icon">
            <span class="material-symbols-outlined">{{ icon }}</span>
          </div>

          <p class="auth-prompt__eyebrow">{{ eyebrow }}</p>
          <h2 id="auth-prompt-title">{{ title }}</h2>
          <p class="auth-prompt__message">{{ message }}</p>

          <div class="auth-prompt__actions">
            <NuxtLink
              :to="signInTarget"
              class="auth-prompt__primary"
              @click="close"
            >
              {{ t("authPrompt.signIn") }}
            </NuxtLink>
            <NuxtLink
              :to="registerTarget"
              class="auth-prompt__secondary"
              @click="close"
            >
              {{ t("authPrompt.register") }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useAuthPrompt } from "~/composables/useAuthPrompt";

const { isOpen, redirectTo, title, message, icon, eyebrow, close } = useAuthPrompt();
const { t } = useAppI18n();

const signInTarget = computed(() => ({
  path: "/login",
  query: { redirect: redirectTo.value },
}));

const registerTarget = computed(() => ({
  path: "/register",
  query: { redirect: redirectTo.value },
}));
</script>

<style scoped>
.auth-prompt {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal);
  display: grid;
  place-items: center;
  padding: 1.5rem;
  background: rgb(5 16 24 / 0.52);
  backdrop-filter: blur(10px);
}

.auth-prompt__panel {
  position: relative;
  width: min(100%, 28rem);
  padding: 2rem;
  border: 1px solid var(--color-border);
  border-radius: 1.6rem;
  background:
    radial-gradient(
      circle at top left,
      color-mix(in srgb, var(--color-primary-50) 66%, transparent) 0%,
      transparent 48%
    ),
    color-mix(in srgb, var(--color-surface) 96%, transparent);
  box-shadow: 0 34px 80px rgb(0 0 0 / 0.3);
  text-align: center;
}

.auth-prompt__close {
  position: absolute;
  top: 1rem;
  inset-inline-end: 1rem;
  width: 2.1rem;
  height: 2.1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-surface);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition:
    color var(--duration-fast) var(--easing-standard),
    border-color var(--duration-fast) var(--easing-standard),
    background-color var(--duration-fast) var(--easing-standard);
}

.auth-prompt__close:hover {
  color: var(--color-primary-700);
  border-color: var(--color-primary-300);
  background: color-mix(in srgb, var(--color-primary-50) 70%, var(--color-surface));
}

.auth-prompt__close .material-symbols-outlined {
  font-size: 1.25rem;
}

.auth-prompt__icon {
  width: 4rem;
  height: 4rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.15rem;
  border-radius: 1.2rem;
  background: linear-gradient(
    135deg,
    var(--color-primary-500),
    var(--color-primary-600)
  );
  color: var(--color-white);
  box-shadow: 0 16px 32px rgb(0 103 104 / 0.22);
}

.auth-prompt__icon .material-symbols-outlined {
  font-size: 1.9rem;
  font-variation-settings:
    "FILL" 1,
    "wght" 500,
    "GRAD" 0,
    "opsz" 30;
}

.auth-prompt__eyebrow {
  margin: 0 0 0.5rem;
  color: var(--color-primary-600);
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.auth-prompt h2 {
  margin: 0;
  color: var(--color-heading);
  font-size: 1.7rem;
  line-height: 1.15;
  font-weight: 800;
}

.auth-prompt__message {
  margin: 0.9rem auto 0;
  max-width: 21rem;
  color: var(--color-text-secondary);
  font-size: 0.98rem;
  line-height: 1.6;
}

.auth-prompt__actions {
  display: grid;
  gap: 0.75rem;
  margin-top: 1.6rem;
}

.auth-prompt__primary,
.auth-prompt__secondary {
  min-height: 2.9rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 1.15rem;
  border-radius: 0.95rem;
  font-size: 0.94rem;
  font-weight: 800;
  text-decoration: none;
  transition:
    transform var(--duration-fast) var(--easing-standard),
    box-shadow var(--duration-fast) var(--easing-standard),
    background-color var(--duration-fast) var(--easing-standard),
    border-color var(--duration-fast) var(--easing-standard);
}

.auth-prompt__primary {
  background: linear-gradient(
    135deg,
    var(--color-primary-500),
    var(--color-primary-600)
  );
  color: var(--color-white);
  box-shadow: 0 14px 28px rgb(0 103 104 / 0.2);
}

.auth-prompt__secondary {
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-primary-700);
}

.auth-prompt__primary:hover,
.auth-prompt__secondary:hover {
  transform: translateY(-1px);
}

.auth-prompt-enter-active,
.auth-prompt-leave-active {
  transition: opacity 0.22s ease;
}

.auth-prompt-enter-active .auth-prompt__panel,
.auth-prompt-leave-active .auth-prompt__panel {
  transition:
    transform 0.22s ease,
    opacity 0.22s ease;
}

.auth-prompt-enter-from,
.auth-prompt-leave-to {
  opacity: 0;
}

.auth-prompt-enter-from .auth-prompt__panel,
.auth-prompt-leave-to .auth-prompt__panel {
  opacity: 0;
  transform: translateY(12px) scale(0.98);
}

@media (max-width: 520px) {
  .auth-prompt__panel {
    padding: 1.8rem 1.2rem 1.35rem;
  }

  .auth-prompt h2 {
    font-size: 1.45rem;
  }
}
</style>
