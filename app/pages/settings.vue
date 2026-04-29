<template>
  <div class="profile-page">
    <Head>
      <title>Settings &amp; Security — VoyageHub</title>
      <meta
        name="description"
        content="Manage your VoyageHub account settings and security."
      />
    </Head>

    <div class="profile-container">
      <header class="page-header">
        <div>
          <p class="page-header__label">Privacy &amp; Security</p>
        </div>
      </header>

      <div class="profile-body">
        <ProfileSidebar />

        <!-- Main -->
        <main class="profile-main" style="flex: 1;">
          <!-- Tabs -->
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

          <!-- Tab Content -->
          <ClientOnly>
          <!-- Security Tab -->
          <div v-if="showSecurityTab" v-show="activeTab === 'security'" class="content-card auth-card fade-in-up">
            <div class="card-header">
              <div class="card-header__icon">
                <span class="material-symbols-outlined">shield</span>
              </div>
              <div>
                <h2 class="card-header__title">Authentication</h2>
              </div>
            </div>
            <div class="card-body">
              <p class="security-intro">Change your password here.</p>
              <div class="auth-form-stack">
                <div class="form-group">
                  <label class="form-label">Current Password</label>
                  <input
                    v-model="passwordForm.currentPassword"
                    type="password"
                    class="form-input"
                    placeholder="Enter your current password"
                  />
                </div>
                <div class="form-group">
                  <label class="form-label">New Password</label>
                  <input
                    v-model="passwordForm.newPassword"
                    type="password"
                    class="form-input"
                    placeholder="Create a strong new password"
                  />
                </div>
                <div class="form-group">
                  <label class="form-label">Confirm New Password</label>
                  <input
                    v-model="passwordForm.confirmPassword"
                    type="password"
                    class="form-input"
                    placeholder="Verify your new password"
                  />
                </div>
              </div>
              <div class="card-actions">
                <button
                  @click="changePasswordHandler"
                  type="button"
                  class="btn-primary-action"
                >
                  <span class="material-symbols-outlined btn-icon"
                    >lock_reset</span
                  >
                  Update Password
                </button>
              </div>
            </div>
          </div>

          <!-- Privacy Tab -->
            <div v-show="activeTab === 'privacy'" class="content-card privacy-card">
               <div class="card-header">
                 <div class="card-header__icon">
                   <span class="material-symbols-outlined">privacy_tip</span>
                 </div>
                 <div>
                   <h2 class="card-header__title">Privacy & Data</h2>
                 </div>
               </div>
               <div class="card-body">
              <div class="toggle-row">
                <div>
                  <span class="toggle-row__title">Data Collection</span>
                  <p class="toggle-row__sub">Allow us to collect usage data for improvements</p>
                </div>
                <label class="toggle-wrap">
                  <input type="checkbox" class="sr-only" checked />
                  <span class="toggle-track"></span>
                </label>
              </div>
              <div class="card-actions privacy-actions">
                <button type="button" class="btn-outline-action">
                  <span class="material-symbols-outlined">download</span>
                  Download My Data
                </button>
                <button type="button" class="btn-outline-action btn-danger">
                  <span class="material-symbols-outlined">delete_forever</span>
                  Delete Account
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
definePageMeta({ middleware: "auth" });
import { useAuth } from "~/composables/useAuth";
import { computed, ref } from "vue";
import { useAppToast } from "~/composables/useAppToast";

const { changePassword, error, currentAccount } = useAuth();
const { success: toastSuccess, error: toastError, warn: toastWarn } = useAppToast();

const activeTab = useState('settings-active-tab', () => 'security');

const passwordForm = ref({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

onMounted(() => {
  activeTab.value = showSecurityTab.value ? 'security' : 'privacy'
})

const showSecurityTab = computed(() => currentAccount.value?.authProvider !== 'google')
const tabs = computed(() => {
  const result = [{ key: 'privacy', label: 'Privacy' }]
  return showSecurityTab.value
    ? [{ key: 'security', label: 'Security' }, ...result]
    : result
})

async function changePasswordHandler() {
  if (!passwordForm.value.currentPassword || !passwordForm.value.newPassword) {
    toastWarn("Please complete all password fields.");
    return;
  }
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    toastWarn("The new password confirmation does not match.");
    return;
  }
  const success = await changePassword(
    passwordForm.value.currentPassword,
    passwordForm.value.newPassword,
  );
  if (success) {
    passwordForm.value = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };
    toastSuccess("Password updated successfully.");
  } else {
    toastError(error.value || "Failed to update password.");
  }
}

</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings:
    "FILL" 0,
    "wght" 400,
    "GRAD" 0,
    "opsz" 24;
}

/* Page shell */
.profile-page {
  min-height: 100vh;
  background: var(--color-bg-soft);
}
.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 32px 80px;
}

.page-header__label {
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  color: var(--color-primary-600);
  letter-spacing: 0.12em;
  margin-bottom: 12px;
  padding: 4px 12px;
}
.page-header__title {
  font-size: clamp(32px, 4vw, 44px);
  font-weight: 700;
  color: var(--color-heading);
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin-bottom: 8px;
}
.page-header__sub {
  font-size: var(--font-size-body-md);
  color: var(--color-text-muted);
}

/* Layout */
.profile-body {
  display: flex;
  gap: 32px;
  align-items: flex-start;
}
.profile-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.settings-tabs {
  display: flex;
  gap: 24px;
  background: #fff;
  border: 1px solid var(--color-border-soft);
  border-radius: 0;
  padding: 0 32px;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 0;
  padding: 20px 0;
  border: none;
  background: transparent;
  color: #64748b;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s;
  white-space: nowrap;
  position: relative;
}

.tab-button:hover {
  color: var(--color-primary-600);
}

.tab-button--active {
  color: var(--color-primary-600);
}

.tab-button--active::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 4px;
  border-radius: 3px 3px 0 0;
  background: var(--color-primary-600);
}

/* ProfileSidebar.vue handles sidebar styles */

/* Content cards */
.content-card {
  background: #ffffff;
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border-soft);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.auth-card,
.privacy-card {
  width: 100%;
  max-width: none;
}

.auth-form-stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 640px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  background: var(--color-bg-soft);
  border-bottom: 1px solid var(--color-border-soft);
}
.card-header__icon {
  font-size: 20px;
  color: var(--color-primary-600);
  display: flex;
}
.card-header__icon .material-symbols-outlined {
  font-size: 20px;
}
.card-header__title {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-heading);
  margin: 0;
}

.card-body {
  padding: 28px 36px 30px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.security-intro {
  margin: 0;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-muted);
}

/* Form */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.form-group--full {
  grid-column: 1 / -1;
}
.form-label {
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-heading);
}
.form-input {
  width: 100%;
  padding: 12px 16px;
  background: var(--color-bg-soft);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text);
  outline: none;
  box-sizing: border-box;
  transition:
    border-color 0.2s,
    box-shadow 0.2s,
    background 0.2s;
}
.form-input:focus {
  background: var(--color-card);
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px rgba(0, 103, 104, 0.12);
}

/* Buttons */
.card-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 10px;
  border-top: 1px solid var(--color-border-soft);
}
.btn-primary-action {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 22px;
  background: var(--color-primary-600);
  color: #fff;
  border: none;
  border-radius: var(--radius-xl);
  cursor: pointer;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  box-shadow: 0 6px 16px rgba(0, 103, 104, 0.24);
  transition:
    background 0.2s,
    transform 0.15s,
    box-shadow 0.2s;
}
.btn-primary-action:hover:not(:disabled) {
  background: var(--color-primary-700);
  transform: translateY(-1px);
  box-shadow: 0 10px 28px rgba(0, 103, 104, 0.3);
}
.btn-primary-action:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.btn-icon {
  font-size: 18px;
  transition: transform 0.2s ease;
}
.btn-primary-action:hover .btn-icon {
  transform: translateX(3px);
}

.btn-outline-action {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 20px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  background: transparent;
  cursor: pointer;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.11em;
  color: var(--color-text);
  transition: all 0.2s ease;
  white-space: nowrap;
}
.btn-outline-action:hover {
  background: var(--color-primary-600);
  color: #fff;
  border-color: var(--color-primary-600);
}

.btn-danger {
  border-color: #dc2626;
  color: #dc2626;
}

.btn-danger:hover {
  background: #dc2626;
  color: #fff;
}

/* MFA block */
.mfa-block {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px;
  border-radius: var(--radius-xl);
  background: var(--color-bg-soft);
  border: 1px solid var(--color-border);
}
.mfa-block__title {
  font-size: var(--font-size-body-sm);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-text);
  margin-bottom: 4px;
}
.mfa-block__sub {
  font-size: var(--font-size-body-sm);
  color: var(--color-text-muted);
}

/* Toggle */
.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 20px;
  border-radius: var(--radius-xl);
  cursor: pointer;
  background: var(--color-bg-soft);
  border: 1px solid transparent;
  transition:
    background 0.2s,
    border-color 0.2s;
}
.toggle-row:hover {
  background: var(--color-card);
  border-color: var(--color-border);
}
.toggle-row__title {
  display: block;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--color-text);
  margin-bottom: 4px;
}
.toggle-row__sub {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-muted);
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
  display: block;
  width: 52px;
  height: 30px;
  border-radius: 99px;
  background: var(--color-gray-200);
  position: relative;
  transition: background 0.25s;
}
.toggle-track::after {
  content: "";
  position: absolute;
  top: 4px;
  left: 4px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  transition: transform 0.25s;
}
.sr-only:checked + .toggle-track,
input[type="checkbox"]:checked ~ .toggle-wrap .toggle-track {
  background: var(--color-primary-500);
}
.sr-only:checked + .toggle-track::after,
input[type="checkbox"]:checked ~ .toggle-wrap .toggle-track::after {
  transform: translateX(22px);
}

.privacy-actions {
  justify-content: center;
}

/* Empty vault */
.empty-vault {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 56px 24px;
  text-align: center;
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-xl);
  background: var(--color-bg-soft);
  gap: 16px;
}
.empty-vault__icon {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-full);
  background: var(--color-card);
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
}
.empty-vault__icon .material-symbols-outlined {
  font-size: 28px;
}
.empty-vault__text {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--color-text-muted);
}

.info-message {
  color: var(--color-text-muted);
  font-size: 14px;
  text-align: center;
  padding: 20px;
}

/* Responsive */
@media (max-width: 900px) {
  .profile-body {
    flex-direction: column;
  }
}
@media (max-width: 600px) {
  .profile-container {
    padding: 28px 16px 60px;
  }
  .form-row {
    grid-template-columns: 1fr;
  }
  .mfa-block {
    flex-direction: column;
    align-items: flex-start;
  }
  .card-body {
    padding: 20px 18px 22px;
  }
  .settings-tabs {
    padding: 0 16px;
    gap: 18px;
  }
}


</style>
