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
        <p class="page-header__label">Account</p>
      </header>

      <div class="profile-body">
        <!-- Sidebar -->
        <ProfileSidebar />

        <!-- Main -->
        <main class="profile-main">
          <!-- Authentication Card -->
          <div class="content-card auth-card">
            <div class="card-header">
              <div class="card-header__icon">
                <span class="material-symbols-outlined">shield</span>
              </div>
              <div>
                <h2 class="card-header__title">Authentication</h2>
              </div>
            </div>
            <div class="card-body">
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
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "auth" });
import { useAuth } from "~/composables/useAuth";
import { ref, watch, computed } from "vue";
import { useAppToast } from "~/composables/useAppToast";

const { currentProfile, updateProfile, changePassword, loading, error } =
  useAuth();
const { success: toastSuccess, error: toastError, warn: toastWarn } = useAppToast();

const passwordForm = ref({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

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
  gap: 28px;
  align-items: flex-start;
}
.profile-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* ProfileSidebar.vue handles sidebar styles */

/* Content cards */
.content-card {
  background: #ffffff;
  border-radius: var(--radius-2xl);
  border: 1px solid var(--color-border-soft);
  box-shadow: 0 4px 20px -4px rgba(0, 103, 104, 0.05);
  overflow: hidden;
}

.auth-card {
  max-width: 800px;
}

.auth-form-stack {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 480px;
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
}
.card-header__icon .material-symbols-outlined {
  font-size: 20px;
}
.card-header__title {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-heading);
  margin: 0;
}
.card-header__sub {
  font-size: var(--font-size-body-sm);
  color: var(--color-text-muted);
}

.card-body {
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
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
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--color-text-muted);
}
.form-input {
  width: 100%;
  padding: 13px 18px;
  background: var(--color-bg-soft);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-xl);
  font-size: var(--font-size-body-md);
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
  padding-top: 8px;
  border-top: 1px solid var(--color-border-soft);
}
.btn-primary-action {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 13px 28px;
  background: var(--color-primary-600);
  color: #fff;
  border: none;
  border-radius: var(--radius-xl);
  cursor: pointer;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  box-shadow: 0 6px 20px rgba(0, 103, 104, 0.25);
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
  padding: 11px 22px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-xl);
  background: transparent;
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-text);
  transition: all 0.2s ease;
  white-space: nowrap;
}
.btn-outline-action:hover {
  background: var(--color-primary-600);
  color: #fff;
  border-color: var(--color-primary-600);
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
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-text);
  margin-bottom: 4px;
}
.toggle-row__sub {
  font-size: var(--font-size-body-sm);
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
  width: 44px;
  height: 24px;
  border-radius: 99px;
  background: var(--color-gray-200);
  position: relative;
  transition: background 0.25s;
}
.toggle-track::after {
  content: "";
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
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
  transform: translateX(20px);
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
}
</style>
