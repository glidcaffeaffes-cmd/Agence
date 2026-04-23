<template>
  <div class="profile-page">
    <Head>
      <title>Settings &amp; Security — VoyageHub</title>
      <meta name="description" content="Manage your VoyageHub account settings and security." />
    </Head>

    <div class="profile-container">
      <header class="page-header">
        <p class="page-header__label">Account</p>
        <h1 class="page-header__title">Settings</h1>
        <p class="page-header__sub">Manage your security protocols and platform preferences.</p>
      </header>

      <div class="profile-body">
        <!-- Sidebar -->
        <ProfileSidebar />


        <!-- Main -->
        <main class="profile-main">

          <!-- Authentication Card -->
          <div class="content-card">
            <div class="card-header">
              <div class="card-header__icon">
                <span class="material-symbols-outlined">shield</span>
              </div>
              <div>
                <h3 class="card-header__title">Authentication</h3>
                <p class="card-header__sub">Update your cryptographic credentials.</p>
              </div>
            </div>
            <div class="card-body">
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Current Password</label>
                  <input v-model="passwordForm.currentPassword" type="password" class="form-input" />
                </div>
                <div class="form-group">
                  <label class="form-label">New Password</label>
                  <input v-model="passwordForm.newPassword" type="password" class="form-input" />
                </div>
                <div class="form-group form-group--full">
                  <label class="form-label">Confirm New Password</label>
                  <input v-model="passwordForm.confirmPassword" type="password" class="form-input" />
                </div>
              </div>
              <div class="card-actions">
                <button @click="changePasswordHandler" type="button" class="btn-primary-action">
                  Rotate Credentials
                  <span class="material-symbols-outlined btn-icon">sync_lock</span>
                </button>
              </div>

              <div class="mfa-block">
                <div>
                  <h4 class="mfa-block__title">Multi-Factor Authentication</h4>
                  <p class="mfa-block__sub">Add an additional verification layer to your account.</p>
                </div>
                <button class="btn-outline-action">Enable MFA</button>
              </div>
            </div>
          </div>

          <!-- Notifications Card -->
          <div class="content-card">
            <div class="card-header">
              <div class="card-header__icon">
                <span class="material-symbols-outlined">notifications</span>
              </div>
              <div>
                <h3 class="card-header__title">Notifications</h3>
                <p class="card-header__sub">Configure how you receive property updates and invitations.</p>
              </div>
            </div>
            <div class="card-body">
              <label class="toggle-row">
                <div>
                  <span class="toggle-row__title">Reservation Updates</span>
                  <span class="toggle-row__sub">Real-time confirmation of changes and cancellations.</span>
                </div>
                <div class="toggle-wrap">
                  <input type="checkbox" v-model="notificationSettings.reservation" class="sr-only peer" />
                  <div class="toggle-track peer-checked:toggle-track--on"></div>
                </div>
              </label>

              <label class="toggle-row">
                <div>
                  <span class="toggle-row__title">Exclusive Offers</span>
                  <span class="toggle-row__sub">Invitations to new collections and seasonal deals.</span>
                </div>
                <div class="toggle-wrap">
                  <input type="checkbox" v-model="notificationSettings.promotion" class="sr-only peer" />
                  <div class="toggle-track peer-checked:toggle-track--on"></div>
                </div>
              </label>

              <div class="card-actions">
                <button @click="updateNotifications" :disabled="loading" class="btn-primary-action">
                  <span v-if="loading">Saving…</span>
                  <template v-else>
                    Save Preferences
                    <span class="material-symbols-outlined btn-icon">save</span>
                  </template>
                </button>
              </div>
            </div>
          </div>

          <!-- Payment Card -->
          <div class="content-card">
            <div class="card-header">
              <div class="card-header__icon">
                <span class="material-symbols-outlined">payments</span>
              </div>
              <div>
                <h3 class="card-header__title">Payment Methods</h3>
                <p class="card-header__sub">Manage your encrypted payment instruments.</p>
              </div>
            </div>
            <div class="card-body">
              <div class="empty-vault">
                <div class="empty-vault__icon">
                  <span class="material-symbols-outlined">credit_card_off</span>
                </div>
                <p class="empty-vault__text">No payment methods added yet</p>
                <button class="btn-primary-action">
                  <span class="material-symbols-outlined btn-icon">add</span>
                  Add Payment Method
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
definePageMeta({ middleware: 'auth' })
import { useAuth } from '~/composables/useAuth'
import { ref, watch, computed } from 'vue'

const { currentProfile, updateProfile, changePassword, loading, error } = useAuth()

const notificationSettings = ref({ reservation: true, promotion: false })
const passwordForm = ref({ currentPassword: '', newPassword: '', confirmPassword: '' })

watch(currentProfile, (profile) => {
  if (profile) {
    notificationSettings.value = {
      reservation: profile.notificationsReservation,
      promotion: profile.notificationsPromotion
    }
  }
}, { immediate: true })

async function updateNotifications() {
  const success = await updateProfile({
    notificationsReservation: notificationSettings.value.reservation,
    notificationsPromotion: notificationSettings.value.promotion
  })
  if (success) alert('Notification preferences updated successfully!')
  else alert('Failed to update. Please try again.')
}

async function changePasswordHandler() {
  if (!passwordForm.value.currentPassword || !passwordForm.value.newPassword) {
    alert('Please complete all password fields.')
    return
  }
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    alert('The new password confirmation does not match.')
    return
  }
  const success = await changePassword(passwordForm.value.currentPassword, passwordForm.value.newPassword)
  if (success) {
    passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
    alert('Password updated successfully!')
  } else {
    alert(error.value || 'Failed to update password.')
  }
}
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

/* Page shell */
.profile-page {
  min-height: 100vh;
  background: var(--color-bg-soft);
  font-family: var(--font-family-base);
}
.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 32px 80px;
}

/* Header */
.page-header { margin-bottom: 40px; }
.page-header__label {
  font-size: 11px; font-weight: 800; text-transform: uppercase;
  letter-spacing: 0.18em; color: var(--color-primary-600); margin-bottom: 8px;
}
.page-header__title {
  font-family: var(--font-family-heading);
  font-size: clamp(32px, 4vw, 44px); font-weight: 700;
  color: var(--color-heading); letter-spacing: -0.02em; line-height: 1.1; margin-bottom: 8px;
}
.page-header__sub { font-size: var(--font-size-body-md); color: var(--color-text-muted); }

/* Layout */
.profile-body { display: flex; gap: 28px; align-items: flex-start; }
.profile-main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 24px; }

/* ProfileSidebar.vue handles sidebar styles */

/* Content cards */
.card-header {
  display: flex; align-items: center; gap: 16px;
  padding: 24px 28px; background: var(--color-bg-soft);
  border-bottom: 1px solid var(--color-border);
}
.card-header__icon {
  width: 44px; height: 44px; flex-shrink: 0; border-radius: var(--radius-xl);
  background: var(--color-primary-25); border: 1px solid var(--color-primary-100);
  display: flex; align-items: center; justify-content: center;
  color: var(--color-primary-600);
}
.card-header__icon .material-symbols-outlined { font-size: 24px; }
.card-header__title {
  font-family: var(--font-family-heading); font-size: var(--font-size-title-lg);
  font-weight: 700; color: var(--color-heading); letter-spacing: -0.01em; margin-bottom: 2px;
}
.card-header__sub { font-size: var(--font-size-body-sm); color: var(--color-text-muted); }

.card-body { padding: 28px; display: flex; flex-direction: column; gap: 20px; }

/* Form */
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 8px; }
.form-group--full { grid-column: 1 / -1; }
.form-label {
  font-size: 10px; font-weight: 800; text-transform: uppercase;
  letter-spacing: 0.14em; color: var(--color-text-muted);
}
.form-input {
  width: 100%; padding: 13px 18px; background: var(--color-bg-soft);
  border: 1.5px solid var(--color-border); border-radius: var(--radius-xl);
  font-family: var(--font-family-base); font-size: var(--font-size-body-md);
  font-weight: 500; color: var(--color-text); outline: none; box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
}
.form-input:focus {
  background: var(--color-card); border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px rgba(0,103,104,0.12);
}

/* Buttons */
.card-actions { display: flex; justify-content: flex-end; padding-top: 8px; border-top: 1px solid var(--color-border-soft); }
.btn-primary-action {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 13px 28px; background: var(--color-primary-600); color: #fff;
  border: none; border-radius: var(--radius-xl); cursor: pointer;
  font-family: var(--font-family-base); font-size: 12px; font-weight: 800;
  text-transform: uppercase; letter-spacing: 0.14em;
  box-shadow: 0 6px 20px rgba(0,103,104,0.25);
  transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
}
.btn-primary-action:hover:not(:disabled) {
  background: var(--color-primary-700); transform: translateY(-1px);
  box-shadow: 0 10px 28px rgba(0,103,104,0.3);
}
.btn-primary-action:disabled { opacity: 0.55; cursor: not-allowed; }
.btn-icon { font-size: 18px; transition: transform 0.2s ease; }
.btn-primary-action:hover .btn-icon { transform: translateX(3px); }

.btn-outline-action {
  padding: 11px 22px; border: 1.5px solid var(--color-border);
  border-radius: var(--radius-xl); background: transparent; cursor: pointer;
  font-family: var(--font-family-base); font-size: 12px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-text);
  transition: all 0.2s ease; white-space: nowrap;
}
.btn-outline-action:hover {
  background: var(--color-primary-600); color: #fff; border-color: var(--color-primary-600);
}

/* MFA block */
.mfa-block {
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  padding: 20px 24px; border-radius: var(--radius-xl);
  background: var(--color-bg-soft); border: 1px solid var(--color-border);
}
.mfa-block__title {
  font-size: var(--font-size-body-sm); font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-text); margin-bottom: 4px;
}
.mfa-block__sub { font-size: var(--font-size-body-sm); color: var(--color-text-muted); }

/* Toggle */
.toggle-row {
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  padding: 18px 20px; border-radius: var(--radius-xl); cursor: pointer;
  background: var(--color-bg-soft); border: 1px solid transparent;
  transition: background 0.2s, border-color 0.2s;
}
.toggle-row:hover { background: var(--color-card); border-color: var(--color-border); }
.toggle-row__title {
  display: block; font-size: 12px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-text); margin-bottom: 4px;
}
.toggle-row__sub { font-size: var(--font-size-body-sm); color: var(--color-text-muted); }
.toggle-wrap { position: relative; flex-shrink: 0; }
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); }
.toggle-track {
  display: block; width: 44px; height: 24px; border-radius: 99px;
  background: var(--color-gray-200); position: relative; transition: background 0.25s;
}
.toggle-track::after {
  content: ''; position: absolute; top: 3px; left: 3px;
  width: 18px; height: 18px; border-radius: 50%; background: #fff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.2); transition: transform 0.25s;
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
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 56px 24px; text-align: center;
  border: 2px dashed var(--color-border); border-radius: var(--radius-xl);
  background: var(--color-bg-soft); gap: 16px;
}
.empty-vault__icon {
  width: 56px; height: 56px; border-radius: var(--radius-full);
  background: var(--color-card); border: 1px solid var(--color-border);
  display: flex; align-items: center; justify-content: center;
  color: var(--color-text-muted);
}
.empty-vault__icon .material-symbols-outlined { font-size: 28px; }
.empty-vault__text {
  font-size: 11px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.12em; color: var(--color-text-muted);
}

/* Responsive */
@media (max-width: 900px) {
  .profile-body { flex-direction: column; }
}
@media (max-width: 600px) {
  .profile-container { padding: 28px 16px 60px; }
  .form-row { grid-template-columns: 1fr; }
  .mfa-block { flex-direction: column; align-items: flex-start; }
}
</style>
