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
          <p class="page-header__label">Account</p>
          <h1 class="page-header__title">Settings &amp; Security</h1>
          <p class="page-header__sub">Manage your account preferences, security settings, and privacy options.</p>
        </div>
      </header>

      <div class="profile-body">
        <!-- Main -->
        <main class="profile-main" style="flex: 1;">
          <!-- Tabs -->
          <div class="settings-tabs">
            <button
              v-for="tab in tabs"
              :key="tab.key"
              :class="['tab-button', { 'tab-button--active': activeTab === tab.key }]"
              @click="console.log('clicked', tab.key); activeTab = tab.key"
            >
              <span class="material-symbols-outlined">{{ tab.icon }}</span>
              {{ tab.label }}
            </button>
          </div>

          <!-- Tab Content -->
          <ClientOnly>
          <!-- Security Tab -->
          <div v-show="activeTab === 'security'" class="content-card auth-card fade-in-up">
            <div class="card-header">
              <div class="card-header__icon">
                <span class="material-symbols-outlined">shield</span>
              </div>
              <div>
                <h2 class="card-header__title">Authentication</h2>
                <p class="card-header__sub">Manage your password and security settings</p>
              </div>
            </div>
            <div class="card-body">
              <p>Change your password here.</p>
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

          <!-- Profile Tab -->
            <div v-show="activeTab === 'profile'" class="content-card profile-card fade-in-up">
              <div class="card-header">
                <div class="card-header__icon">
                  <span class="material-symbols-outlined">person</span>
                </div>
                <div>
                  <h2 class="card-header__title">Profile Information</h2>
                  <p class="card-header__sub">Update your personal details</p>
                </div>
              </div>
              <div class="card-body">
                <p v-if="!currentProfile" class="info-message">Profile information is loading or not available.</p>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">First Name</label>
                  <input v-model="profileForm.firstName" type="text" class="form-input" placeholder="Enter your first name" />
                </div>
                <div class="form-group">
                  <label class="form-label">Last Name</label>
                  <input v-model="profileForm.lastName" type="text" class="form-input" placeholder="Enter your last name" />
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Email Address</label>
                <input v-model="profileForm.email" type="email" class="form-input" placeholder="Enter your email" />
              </div>
              <div class="form-group">
                <label class="form-label">Phone Number</label>
                <input v-model="profileForm.phone" type="tel" class="form-input" placeholder="Enter your phone number" />
              </div>
              <div class="card-actions">
                <button @click="updateProfileHandler" type="button" class="btn-primary-action">
                  <span class="material-symbols-outlined btn-icon">save</span>
                  Update Profile
                </button>
              </div>
            </div>
          </div>

          <!-- Notifications Tab -->
            <div v-show="activeTab === 'notifications'" class="content-card notifications-card fade-in-up">
              <div class="card-header">
              <div class="card-header__icon">
                <span class="material-symbols-outlined">notifications</span>
              </div>
              <div>
                <h2 class="card-header__title">Notification Preferences</h2>
                <p class="card-header__sub">Choose how you want to be notified</p>
              </div>
            </div>
            <div class="card-body">
              <div class="toggle-row">
                <div>
                  <span class="toggle-row__title">Email Bookings</span>
                  <p class="toggle-row__sub">Receive email confirmations for bookings</p>
                </div>
                <label class="toggle-wrap">
                  <input type="checkbox" class="sr-only" v-model="notificationSettings.emailBookings" />
                  <span class="toggle-track"></span>
                </label>
              </div>
              <div class="toggle-row">
                <div>
                  <span class="toggle-row__title">Promotional Emails</span>
                  <p class="toggle-row__sub">Get updates on offers and promotions</p>
                </div>
                <label class="toggle-wrap">
                  <input type="checkbox" class="sr-only" v-model="notificationSettings.emailPromotions" />
                  <span class="toggle-track"></span>
                </label>
              </div>
              <div class="toggle-row">
                <div>
                  <span class="toggle-row__title">SMS Reminders</span>
                  <p class="toggle-row__sub">Receive SMS reminders for check-ins</p>
                </div>
                <label class="toggle-wrap">
                  <input type="checkbox" class="sr-only" v-model="notificationSettings.smsReminders" />
                  <span class="toggle-track"></span>
                </label>
              </div>
              <div class="card-actions">
                <button @click="saveNotificationsHandler" type="button" class="btn-primary-action">
                  <span class="material-symbols-outlined btn-icon">save</span>
                  Save Preferences
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
                   <p class="card-header__sub">Control your data and account privacy</p>
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
              <div class="card-actions">
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
import { ref, watch, computed, onMounted } from "vue";

console.log('settings page setup');

const { currentProfile, updateProfile, changePassword, loading, error } =
  useAuth();

const activeTab = useState('settings-active-tab', () => 'security');

const passwordForm = ref({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const profileForm = ref({
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  phone: "+1234567890",
});

watch(currentProfile, (profile) => {
  if (profile) {
    profileForm.value = {
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      email: profile.email || '',
      phone: profile.phone || '',
    };
  }
}, { immediate: true });

onMounted(() => {
  activeTab.value = 'security'
})

const notificationSettings = ref({
  emailBookings: true,
  emailPromotions: false,
  smsReminders: true,
});

const tabs = [
  { key: 'security', label: 'Security', icon: 'shield' },
  { key: 'profile', label: 'Profile', icon: 'person' },
  { key: 'notifications', label: 'Notifications', icon: 'notifications' },
  { key: 'privacy', label: 'Privacy', icon: 'privacy_tip' },
];

async function changePasswordHandler() {
  if (!passwordForm.value.currentPassword || !passwordForm.value.newPassword) {
    alert("Please complete all password fields.");
    return;
  }
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    alert("The new password confirmation does not match.");
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
    alert("Password updated successfully!");
  } else {
    alert(error.value || "Failed to update password.");
  }
}

async function updateProfileHandler() {
  const success = await updateProfile(profileForm.value);
  if (success) {
    alert("Profile updated successfully!");
  } else {
    alert(error.value || "Failed to update profile.");
  }
}

async function saveNotificationsHandler() {
  // TODO: Implement save notifications
  alert("Notification preferences saved!");
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

.settings-tabs {
  display: flex;
  gap: 8px;
  background: #fff;
  border: 1px solid var(--color-border-soft);
  border-radius: var(--radius-xl);
  padding: 8px;
  overflow-x: auto;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border: none;
  background: transparent;
  color: var(--color-text-muted);
  font-size: 13px;
  font-weight: 600;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.tab-button:hover {
  background: var(--color-bg-soft);
  color: var(--color-text);
}

.tab-button--active {
  background: var(--color-primary-600);
  color: #fff;
}

.tab-button .material-symbols-outlined {
  font-size: 16px;
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

.auth-card,
.profile-card,
.notifications-card,
.privacy-card {
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
}


</style>
