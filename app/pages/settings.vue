<template>
  <div class="profile-page">
    <div class="profile-container">
      <header class="page-header">
        <div>
          <p class="page-header__label">{{ t("settingsPage.badge") }}</p>
        </div>
      </header>

      <div class="profile-body">
        <ProfileSidebar />

        <main class="profile-main">
          <div class="settings-tabs">
            <button
              v-for="tab in tabs"
              :key="tab.key"
              :class="['tab-button', { 'tab-button--active': activeTab === tab.key }]"
              @click="activeTab = tab.key"
            >
              {{ tab.label }}
            </button>
          </div>

          <ClientOnly>
            <div
              v-if="showSecurityTab"
              v-show="activeTab === 'security'"
              class="content-card auth-card fade-in-up"
            >
              <div class="card-header">
                <div class="card-header__icon">
                  <span class="material-symbols-outlined">shield</span>
                </div>
                <div>
                  <h2 class="card-header__title">{{ t("settingsPage.authenticationTitle") }}</h2>
                </div>
              </div>
              <div class="card-body">
                <p class="security-intro">{{ t("settingsPage.authenticationIntro") }}</p>
                <div class="auth-form-stack">
                  <div class="form-group">
                    <label class="form-label">{{ t("settingsPage.currentPassword") }}</label>
                    <input
                      v-model="passwordForm.currentPassword"
                      type="password"
                      class="form-input"
                      :placeholder="t('settingsPage.currentPasswordPlaceholder')"
                    />
                  </div>
                  <div class="form-group">
                    <label class="form-label">{{ t("settingsPage.newPassword") }}</label>
                    <input
                      v-model="passwordForm.newPassword"
                      type="password"
                      class="form-input"
                      :placeholder="t('settingsPage.newPasswordPlaceholder')"
                    />
                  </div>
                  <div class="form-group">
                    <label class="form-label">{{ t("settingsPage.confirmNewPassword") }}</label>
                    <input
                      v-model="passwordForm.confirmPassword"
                      type="password"
                      class="form-input"
                      :placeholder="t('settingsPage.confirmNewPasswordPlaceholder')"
                    />
                  </div>
                </div>
                <div class="card-actions">
                  <button
                    type="button"
                    class="btn-primary-action"
                    @click="changePasswordHandler"
                  >
                    <span class="material-symbols-outlined btn-icon">lock_reset</span>
                    {{ t("settingsPage.updatePassword") }}
                  </button>
                </div>
              </div>
            </div>

            <div v-show="activeTab === 'privacy'" class="content-card privacy-card fade-in-up">
              <div class="card-header">
                <div class="card-header__icon">
                  <span class="material-symbols-outlined">privacy_tip</span>
                </div>
                <div>
                  <h2 class="card-header__title">{{ t("settingsPage.privacyTitle") }}</h2>
                </div>
              </div>
              <div class="card-body">
                <label class="toggle-row">
                  <div>
                    <span class="toggle-row__title">{{ t("settingsPage.dataCollectionTitle") }}</span>
                    <p class="toggle-row__sub">{{ t("settingsPage.dataCollectionDescription") }}</p>
                  </div>
                  <span class="toggle-wrap">
                    <input v-model="allowAnalytics" type="checkbox" class="sr-only" />
                    <span class="toggle-track"></span>
                  </span>
                </label>

                <div class="card-actions privacy-actions">
                  <button type="button" class="btn-outline-action">
                    <span class="material-symbols-outlined">download</span>
                    {{ t("settingsPage.downloadData") }}
                  </button>
                  <button type="button" class="btn-outline-action btn-danger">
                    <span class="material-symbols-outlined">delete_forever</span>
                    {{ t("settingsPage.deleteAccount") }}
                  </button>
                </div>
              </div>
            </div>
          </ClientOnly>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

import { computed, onMounted, ref } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useAppToast } from '~/composables/useAppToast'

const { changePassword, error, currentAccount } = useAuth()
const { success: toastSuccess, error: toastError, warn: toastWarn } = useAppToast()
const { t } = useAppI18n()

const activeTab = useState<'security' | 'privacy'>('settings-active-tab', () => 'security')
const allowAnalytics = ref(true)
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const showSecurityTab = computed(
  () => currentAccount.value?.authProvider !== 'google',
)

const tabs = computed(() => {
  const privacyTab = { key: 'privacy' as const, label: t('settingsPage.privacyTab') }
  return showSecurityTab.value
    ? [{ key: 'security' as const, label: t('settingsPage.securityTab') }, privacyTab]
    : [privacyTab]
})

onMounted(() => {
  activeTab.value = showSecurityTab.value ? 'security' : 'privacy'
})

async function changePasswordHandler() {
  if (!passwordForm.value.currentPassword || !passwordForm.value.newPassword) {
    toastWarn(t('settingsPage.completeAllFields'))
    return
  }

  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    toastWarn(t('settingsPage.confirmationMismatch'))
    return
  }

  const success = await changePassword(
    passwordForm.value.currentPassword,
    passwordForm.value.newPassword,
  )

  if (success) {
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
    toastSuccess(t('settingsPage.passwordUpdated'))
    return
  }

  toastError(error.value || t('settingsPage.passwordUpdateFailed'))
}

useHead(() => ({
  title: t('settingsPage.metaTitle'),
  meta: [
    {
      name: 'description',
      content: t('settingsPage.metaDescription'),
    },
  ],
}))
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: var(--color-bg-soft);
}

.profile-container {
  width: min(1200px, calc(100% - 2rem));
  margin: 0 auto;
  padding: 48px 0 80px;
}

.page-header__label {
  margin-bottom: 12px;
  padding: 4px 12px;
  border-radius: var(--radius-full);
  background: var(--color-primary-25);
  color: var(--color-primary-700);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.profile-body {
  display: flex;
  align-items: flex-start;
  gap: 32px;
}

.profile-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.settings-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  padding: 0 32px;
  border: 1px solid var(--color-border-soft);
  border-radius: 18px;
  background: var(--color-surface);
  box-shadow: var(--shadow-sm);
  overflow-x: auto;
  scrollbar-width: none;
}

.settings-tabs::-webkit-scrollbar {
  display: none;
}

.tab-button {
  position: relative;
  padding: 20px 0;
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: color 0.2s ease;
}

.tab-button:hover,
.tab-button--active {
  color: var(--color-primary-600);
}

.tab-button--active::after {
  content: '';
  position: absolute;
  inset-inline: 0;
  bottom: 0;
  height: 4px;
  border-radius: 3px 3px 0 0;
  background: var(--color-primary-600);
}

.content-card {
  overflow: hidden;
  border: 1px solid var(--color-border-soft);
  border-radius: var(--radius-xl);
  background: var(--color-surface);
  box-shadow: var(--shadow-sm);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  border-bottom: 1px solid var(--color-border-soft);
  background: var(--color-surface-secondary);
}

.card-header__icon,
.card-header__icon .material-symbols-outlined {
  color: var(--color-primary-600);
  font-size: 20px;
}

.card-header__title {
  margin: 0;
  color: var(--color-text-primary);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 28px 36px 30px;
}

.security-intro,
.toggle-row__sub {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 500;
}

.auth-form-stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 640px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  color: var(--color-text-primary);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  background: var(--color-surface-secondary);
  color: var(--color-text-primary);
  font-size: 13px;
  font-weight: 500;
  outline: none;
  transition:
    border-color 0.2s,
    box-shadow 0.2s,
    background 0.2s;
}

.form-input:focus {
  border-color: var(--color-primary-500);
  background: var(--color-surface);
  box-shadow: 0 0 0 3px rgb(0 103 104 / 0.12);
}

.card-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 10px;
  border-top: 1px solid var(--color-border-soft);
}

.btn-primary-action,
.btn-outline-action {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: var(--radius-xl);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary-action {
  padding: 12px 22px;
  border: none;
  background: var(--color-primary-600);
  color: var(--color-white);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  box-shadow: 0 6px 16px rgb(0 103 104 / 0.24);
}

.btn-primary-action:hover {
  transform: translateY(-1px);
  background: var(--color-primary-700);
  box-shadow: 0 10px 28px rgb(0 103 104 / 0.3);
}

.btn-outline-action {
  padding: 11px 20px;
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text-primary);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.11em;
  text-transform: uppercase;
  white-space: nowrap;
}

.btn-outline-action:hover {
  border-color: var(--color-primary-600);
  background: var(--color-primary-600);
  color: var(--color-white);
}

.btn-danger {
  color: var(--color-danger-600);
  border-color: color-mix(in srgb, var(--color-danger-500) 42%, transparent);
}

.btn-danger:hover {
  background: var(--color-danger-600);
  border-color: var(--color-danger-600);
}

.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 20px;
  border: 1px solid transparent;
  border-radius: var(--radius-xl);
  background: var(--color-surface-secondary);
  cursor: pointer;
  transition:
    background 0.2s,
    border-color 0.2s;
}

.toggle-row:hover {
  border-color: var(--color-border);
  background: var(--color-surface);
}

.toggle-row__title {
  display: block;
  margin-bottom: 4px;
  color: var(--color-text-primary);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.toggle-wrap {
  position: relative;
  flex-shrink: 0;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
}

.toggle-track {
  position: relative;
  display: block;
  width: 52px;
  height: 30px;
  border-radius: 99px;
  background: var(--color-border);
  transition: background 0.25s;
}

.toggle-track::after {
  content: '';
  position: absolute;
  top: 4px;
  left: 4px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--color-white);
  box-shadow: 0 1px 4px rgb(0 0 0 / 0.2);
  transition: transform 0.25s;
}

.sr-only:checked + .toggle-track {
  background: var(--color-primary-500);
}

.sr-only:checked + .toggle-track::after {
  transform: translateX(22px);
}

.privacy-actions {
  justify-content: center;
  flex-wrap: wrap;
}

.btn-icon {
  font-size: 18px;
}

@media (max-width: 900px) {
  .profile-body {
    flex-direction: column;
  }
}

@media (max-width: 600px) {
  .profile-container {
    width: min(100% - 1.5rem, 1200px);
    padding: 28px 0 60px;
  }

  .card-body {
    padding: 20px 18px 22px;
  }

  .settings-tabs {
    padding: 0 16px;
    gap: 18px;
  }

  .card-actions {
    flex-direction: column;
    align-items: stretch;
  }
}

html[data-theme-resolved="dark"] .settings-tabs {
  background: var(--color-surface-2);
  border-color: var(--color-border);
}

html[data-theme-resolved="dark"] .content-card {
  background: var(--color-surface);
  border-color: var(--color-border);
}

html[data-theme-resolved="dark"] .card-header {
  background: var(--color-surface-2);
  border-bottom-color: var(--color-border);
}

html[data-theme-resolved="dark"] .toggle-row {
  background: var(--color-surface-2);
  border-color: var(--color-border-soft);
}

html[data-theme-resolved="dark"] .toggle-row:hover {
  background: var(--color-surface);
  border-color: var(--color-border);
}

html[data-theme-resolved="dark"] .toggle-track {
  background: var(--switch-track-bg);
}

html[data-theme-resolved="dark"] .toggle-track::after {
  background: var(--switch-thumb-bg);
}
</style>
