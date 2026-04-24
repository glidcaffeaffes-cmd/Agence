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
            aria-label="Close"
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
              Sign in
            </NuxtLink>
            <NuxtLink
              :to="registerTarget"
              class="auth-prompt__secondary"
              @click="close"
            >
              Register
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
  z-index: 1000;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(9, 25, 38, 0.34);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(14px);
}

.auth-prompt__panel {
  position: relative;
  width: min(100%, 440px);
  padding: 32px;
  border: 1px solid color-mix(in srgb, var(--color-gray-200) 68%, white 32%);
  border-radius: 26px;
  background:
    radial-gradient(
      circle at top left,
      color-mix(in srgb, var(--color-primary-50) 72%, white 28%) 0%,
      transparent 44%
    ),
    rgba(255, 255, 255, 0.96);
  box-shadow: 0 34px 80px rgba(5, 17, 32, 0.28);
  text-align: center;
}

.auth-prompt__close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid color-mix(in srgb, var(--color-gray-200) 80%, white 20%);
  border-radius: 999px;
  background: white;
  color: var(--color-gray-500);
  cursor: pointer;
  transition:
    color 0.2s ease,
    border-color 0.2s ease,
    background 0.2s ease;
}

.auth-prompt__close:hover {
  color: var(--color-navy-500);
  border-color: color-mix(in srgb, var(--color-primary-200) 68%, white 32%);
  background: color-mix(in srgb, var(--color-primary-25) 70%, white 30%);
}

.auth-prompt__close .material-symbols-outlined {
  font-size: 20px;
}

.auth-prompt__icon {
  width: 64px;
  height: 64px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
  border-radius: 20px;
  background: linear-gradient(
    135deg,
    var(--color-primary-500),
    var(--color-primary-600)
  );
  color: white;
  box-shadow: 0 16px 32px rgba(0, 103, 104, 0.22);
}

.auth-prompt__icon .material-symbols-outlined {
  font-size: 30px;
  font-variation-settings:
    "FILL" 1,
    "wght" 500,
    "GRAD" 0,
    "opsz" 30;
}

.auth-prompt__eyebrow {
  margin: 0 0 8px;
  color: var(--color-primary-600);
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.auth-prompt h2 {
  margin: 0;
  color: var(--color-navy-500);
  font-size: 1.72rem;
  line-height: 1.14;
  font-weight: 800;
}

.auth-prompt__message {
  margin: 14px auto 0;
  max-width: 340px;
  color: var(--color-gray-500);
  font-size: 0.96rem;
  line-height: 1.55;
}

.auth-prompt__actions {
  display: grid;
  gap: 12px;
  margin-top: 26px;
}

.auth-prompt__primary,
.auth-prompt__secondary {
  min-height: 46px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 18px;
  border-radius: 14px;
  font-size: 0.94rem;
  font-weight: 800;
  text-decoration: none;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.auth-prompt__primary {
  background: linear-gradient(
    135deg,
    var(--color-primary-500),
    var(--color-primary-600)
  );
  color: white;
  box-shadow: 0 14px 28px rgba(0, 103, 104, 0.2);
}

.auth-prompt__secondary {
  border: 1px solid color-mix(in srgb, var(--color-primary-200) 68%, white 32%);
  background: white;
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
    padding: 28px 20px 22px;
  }

  .auth-prompt h2 {
    font-size: 1.45rem;
  }
}
</style>
