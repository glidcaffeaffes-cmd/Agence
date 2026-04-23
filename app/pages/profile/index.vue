<template>
  <div class="profile-page">
    <Head>
      <title>My Profile — VoyageHub</title>
      <meta name="description" content="Manage your VoyageHub profile and preferences." />
    </Head>

    <div class="profile-container">

      <!-- Page Header -->
      <header class="profile-header">
        <p class="profile-header__label">Account</p>
        <h1 class="profile-header__title">My Profile</h1>
        <p class="profile-header__sub">Manage your personal credentials and global preferences.</p>
      </header>

      <div class="profile-body">
        <!-- Sidebar -->
        <aside class="profile-sidebar">
          <div class="profile-card sidebar-card">
            <!-- Avatar + User Summary -->
            <div class="sidebar-hero">
              <div class="avatar-wrapper">
                <!-- Letter avatar: first letter of firstName -->
                <div class="avatar-letter" :title="currentProfile?.firstName">
                  {{ avatarLetter }}
                </div>
              </div>
              <h2 class="sidebar-name">
                {{ currentProfile?.firstName || 'Guest' }} {{ currentProfile?.lastName || '' }}
              </h2>

            </div>

            <!-- Navigation -->
            <nav class="sidebar-nav">
              <NuxtLink to="/profile" class="sidebar-nav__link sidebar-nav__link--active">
                <span class="material-symbols-outlined">person</span>
                Identity
              </NuxtLink>

              <NuxtLink to="/reservations/history" class="sidebar-nav__link">
                <span class="material-symbols-outlined">history</span>
                Reservations
              </NuxtLink>

              <NuxtLink to="/settings" class="sidebar-nav__link">
                <span class="material-symbols-outlined">settings</span>
                Settings
              </NuxtLink>
            </nav>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="profile-main">
          <!-- Profile Completion Card -->
          <ProfileCompletionCard />

          <div class="profile-card">
            <!-- Card Header -->
            <div class="card-section-header">
              <div class="card-section-icon">
                <span class="material-symbols-outlined">account_circle</span>
              </div>
              <div>
                <h3 class="card-section-title">Identity Details</h3>
                <p class="card-section-subtitle">Update your profile to ensure seamless coordination across all properties.</p>
              </div>
            </div>

            <!-- Form -->
            <form @submit.prevent="saveProfile" class="profile-form">
              <div class="form-row">
                <!-- First Name -->
                <div class="form-group" :class="getFieldState('firstName', formData.firstName)">
                  <div class="form-label-row">
                    <label class="form-label">Given Name</label>
                    <span class="field-status-text">{{ getFieldStatusText('firstName', formData.firstName) }}</span>
                  </div>
                  <div class="input-icon-wrap">
                    <input
                      type="text"
                      v-model="formData.firstName"
                      class="form-input"
                      placeholder="Your first name"
                    />
                    <span class="material-symbols-outlined state-icon">{{ getFieldIcon('firstName', formData.firstName) }}</span>
                  </div>
                </div>
                <!-- Last Name -->
                <div class="form-group" :class="getFieldState('lastName', formData.lastName)">
                  <div class="form-label-row">
                    <label class="form-label">Surname</label>
                    <span class="field-status-text">{{ getFieldStatusText('lastName', formData.lastName) }}</span>
                  </div>
                  <div class="input-icon-wrap">
                    <input
                      type="text"
                      v-model="formData.lastName"
                      class="form-input"
                      placeholder="Your last name"
                    />
                    <span class="material-symbols-outlined state-icon">{{ getFieldIcon('lastName', formData.lastName) }}</span>
                  </div>
                </div>
              </div>

              <!-- Email -->
              <div class="form-group">
                <div class="form-label-row">
                  <label class="form-label">Email Address</label>
                  <span class="badge-verified">
                    <span class="material-symbols-outlined" style="font-size:13px;vertical-align:middle;">verified</span>
                    Verified
                  </span>
                </div>
                <div class="input-icon-wrap">
                  <input
                    type="email"
                    :value="currentProfile?.email"
                    disabled
                    class="form-input form-input--disabled"
                  />
                  <span class="material-symbols-outlined input-icon">lock</span>
                </div>
                <p class="form-hint">Identity verification is locked. Contact concierge for changes.</p>
              </div>

              <!-- Phone -->
              <div class="form-group" :class="getFieldState('phone', formData.phone)">
                <div class="form-label-row">
                  <label class="form-label">Phone Number</label>
                  <span class="field-status-text">{{ getFieldStatusText('phone', formData.phone) }}</span>
                </div>
                <div class="input-icon-wrap">
                  <span class="input-prefix">+216</span>
                  <input
                    type="tel"
                    v-model="formData.phone"
                    placeholder="01 234 567"
                    class="form-input form-input--prefix"
                  />
                  <span class="material-symbols-outlined state-icon">{{ getFieldIcon('phone', formData.phone) }}</span>
                </div>
              </div>

              <!-- Date of Birth + Passport -->
              <div class="form-row">
                <div class="form-group" :class="getFieldState('dateOfBirth', formData.dateOfBirth)">
                  <div class="form-label-row">
                    <label class="form-label">Date of Birth</label>
                    <span class="field-status-text">{{ getFieldStatusText('dateOfBirth', formData.dateOfBirth) }}</span>
                  </div>
                  <div class="input-icon-wrap">
                    <input type="date" v-model="formData.dateOfBirth" class="form-input" />
                    <span class="material-symbols-outlined state-icon">{{ getFieldIcon('dateOfBirth', formData.dateOfBirth) }}</span>
                  </div>
                </div>
                <div class="form-group" :class="getFieldState('passportNumber', formData.passportNumber)">
                  <div class="form-label-row">
                    <label class="form-label">Passport Number</label>
                    <span class="field-status-text">{{ getFieldStatusText('passportNumber', formData.passportNumber) }}</span>
                  </div>
                  <div class="input-icon-wrap">
                    <input type="text" v-model="formData.passportNumber" class="form-input" placeholder="e.g. AB123456" />
                    <span class="material-symbols-outlined state-icon">{{ getFieldIcon('passportNumber', formData.passportNumber) }}</span>
                  </div>
                </div>
              </div>

              <!-- Bio -->
              <div class="form-group" :class="getFieldState('bio', formData.bio)">
                <div class="form-label-row">
                  <label class="form-label">Bio / About Me</label>
                  <span class="field-status-text">{{ getFieldStatusText('bio', formData.bio) }}</span>
                </div>
                <div class="input-icon-wrap">
                  <textarea
                    v-model="formData.bio"
                    class="form-input form-input--textarea"
                    placeholder="Tell fellow travellers about yourself…"
                    rows="3"
                  ></textarea>
                  <span class="material-symbols-outlined state-icon">{{ getFieldIcon('bio', formData.bio) }}</span>
                </div>
              </div>

              <!-- Preferred Destinations -->
              <div class="form-group" :class="getFieldState('preferredDestinations', formData.preferredDestinations)">
                <div class="form-label-row">
                  <label class="form-label">Preferred Destinations</label>
                  <span class="field-status-text">{{ getFieldStatusText('preferredDestinations', formData.preferredDestinations) }}</span>
                </div>
                <div class="input-icon-wrap">
                  <input
                    type="text"
                    :value="formData.preferredDestinations.join(', ')"
                    @input="formData.preferredDestinations = ($event.target as HTMLInputElement).value.split(',').map(s => s.trim()).filter(Boolean)"
                    class="form-input"
                    placeholder="Paris, Bali, New York…"
                  />
                  <span class="material-symbols-outlined state-icon">{{ getFieldIcon('preferredDestinations', formData.preferredDestinations) }}</span>
                </div>
                <p class="form-hint">Separate destinations with commas</p>
              </div>

              <!-- Travel Preferences -->
              <div class="form-group" :class="formData.travelPreferences.length > 0 ? 'form-group--completed' : 'form-group--neutral'">
                <div class="form-label-row">
                  <label class="form-label">Travel Preferences</label>
                  <span class="field-status-text">{{ formData.travelPreferences.length > 0 ? 'Completed' : '' }}</span>
                </div>
                <div class="travel-prefs">
                  <label
                    v-for="pref in travelPrefOptions"
                    :key="pref"
                    class="pref-chip"
                    :class="formData.travelPreferences.includes(pref) ? 'pref-chip--active' : ''"
                  >
                    <input
                      type="checkbox"
                      :value="pref"
                      v-model="formData.travelPreferences"
                      class="sr-only"
                    />
                    <span v-if="formData.travelPreferences.includes(pref)" class="material-symbols-outlined chip-check">check</span>
                    {{ pref }}
                  </label>
                </div>
              </div>

              <!-- Actions -->
              <div class="form-actions">
                <button
                  type="submit"
                  :disabled="loading"
                  class="btn-save"
                  id="profile-save-btn"
                >
                  <span v-if="loading">Processing…</span>
                  <template v-else>
                    Save Changes
                    <span class="material-symbols-outlined btn-icon">arrow_forward</span>
                  </template>
                </button>
              </div>
            </form>
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

const { currentProfile, updateProfile, loading } = useAuth()

const travelPrefOptions = [
  'Luxury', 'Adventure', 'Beach', 'City Break', 'Cultural',
  'Eco Travel', 'Family', 'Solo', 'Wellness', 'Ski'
]

const formData = ref({
  firstName: '',
  lastName: '',
  phone: '',
  dateOfBirth: '',
  passportNumber: '',
  bio: '',
  preferredDestinations: [] as string[],
  travelPreferences: [] as string[],
})

watch(currentProfile, (profile) => {
  if (profile) {
    formData.value = {
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      phone: profile.phone || '',
      dateOfBirth: profile.dateOfBirth || '',
      passportNumber: profile.passportNumber || '',
      bio: profile.bio || '',
      preferredDestinations: profile.preferredDestinations || [],
      travelPreferences: profile.travelPreferences || [],
    }
  }
}, { immediate: true })

const avatarLetter = computed(() => {
  const name = currentProfile.value?.firstName || formData.value.firstName || ''
  return name.trim().charAt(0).toUpperCase() || '?'
})

async function saveProfile() {
  const success = await updateProfile(formData.value)
  if (success) {
    alert('Profile updated successfully!')
  } else {
    alert('Failed to update profile. Please try again.')
  }
}

// ─── Field State Logic ───
const requiredFields = ['firstName']

function hasValue(val: any) {
  if (val === null || val === undefined) return false
  if (typeof val === 'string') return val.trim().length > 0
  if (Array.isArray(val)) return val.length > 0
  return false
}

function getFieldState(key: string, value: any) {
  if (hasValue(value)) return 'form-group--completed'
  if (requiredFields.includes(key)) return 'form-group--incomplete'
  return 'form-group--neutral'
}

function getFieldStatusText(key: string, value: any) {
  if (hasValue(value)) return 'Completed'
  if (requiredFields.includes(key)) return 'Missing information'
  return ''
}

function getFieldIcon(key: string, value: any) {
  if (hasValue(value)) return 'check_circle'
  if (requiredFields.includes(key)) return 'error'
  return ''
}
</script>

<style scoped>
/* ──────────────────────────────────────────
   Material Icons
────────────────────────────────────────── */
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

/* ──────────────────────────────────────────
   Page shell
────────────────────────────────────────── */
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

/* ──────────────────────────────────────────
   Page Header
────────────────────────────────────────── */
.profile-header {
  margin-bottom: 40px;
}

.profile-header__label {
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--color-primary-600);
  margin-bottom: 8px;
}

.profile-header__title {
  font-family: var(--font-family-heading);
  font-size: clamp(32px, 4vw, 44px);
  font-weight: 700;
  color: var(--color-heading);
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin-bottom: 8px;
}

.profile-header__sub {
  font-size: var(--font-size-body-md);
  color: var(--color-text-muted);
  line-height: var(--line-height-relaxed);
}

/* ──────────────────────────────────────────
   Two-column layout
────────────────────────────────────────── */
.profile-body {
  display: flex;
  gap: 28px;
  align-items: flex-start;
}

/* ──────────────────────────────────────────
   Base card
────────────────────────────────────────── */
.profile-card {
  background: var(--color-card);
  border: 1px solid var(--color-border-soft);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-card);
  overflow: hidden;
}

/* ──────────────────────────────────────────
   Sidebar
────────────────────────────────────────── */
.profile-sidebar {
  width: 264px;
  flex-shrink: 0;
  position: sticky;
  top: 88px;
}

.sidebar-card {
  display: flex;
  flex-direction: column;
}

/* Sidebar hero (avatar + name) */
.sidebar-hero {
  padding: 32px 24px 28px;
  background: linear-gradient(135deg, var(--color-navy-700) 0%, var(--color-primary-600) 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
  position: relative;
  overflow: hidden;
}

.sidebar-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Ccircle cx='20' cy='20' r='15'/%3E%3C/g%3E%3C/svg%3E") repeat;
  pointer-events: none;
}

.avatar-wrapper {
  position: relative;
  z-index: 1;
}

/* Letter avatar */
.avatar-letter {
  width: 88px;
  height: 88px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.15);
  border: 3px solid rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-family-heading);
  font-size: 2.4rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.02em;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.avatar-letter:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
}

.sidebar-name {
  position: relative;
  z-index: 1;
  font-family: var(--font-family-heading);
  font-size: var(--font-size-title-md);
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.01em;
  line-height: 1.2;
}

.sidebar-role {
  position: relative;
  z-index: 1;
  display: inline-block;
  padding: 4px 14px;
  border-radius: var(--radius-pill);
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.28);
  color: rgba(255, 255, 255, 0.92);
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.14em;
}

/* Sidebar navigation */
.sidebar-nav {
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sidebar-nav__link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: var(--radius-xl);
  text-decoration: none;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-text-muted);
  transition: all 0.2s ease;
}

.sidebar-nav__link:hover {
  background: var(--color-bg-soft);
  color: var(--color-text);
}

.sidebar-nav__link--active {
  background: var(--color-primary-50);
  color: var(--color-primary-700);
  box-shadow: inset 0 0 0 1px var(--color-primary-200);
}

.sidebar-nav__link .material-symbols-outlined {
  font-size: 20px;
}

/* ──────────────────────────────────────────
   Main Form Card
────────────────────────────────────────── */
.profile-main {
  flex: 1;
  min-width: 0;
}

/* Card header strip */
.card-section-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 28px 32px;
  background: var(--color-bg-soft);
  border-bottom: 1px solid var(--color-border);
}

.card-section-icon {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border-radius: var(--radius-xl);
  background: var(--color-primary-50);
  border: 1px solid var(--color-primary-100);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary-600);
}

.card-section-icon .material-symbols-outlined {
  font-size: 24px;
}

.card-section-title {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-title-lg);
  font-weight: 700;
  color: var(--color-heading);
  letter-spacing: -0.01em;
  margin-bottom: 2px;
}

.card-section-subtitle {
  font-size: var(--font-size-body-sm);
  color: var(--color-text-muted);
  line-height: var(--line-height-relaxed);
}

/* ──────────────────────────────────────────
   Form
────────────────────────────────────────── */
.profile-form {
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--color-text-muted);
}

.form-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.form-input {
  width: 100%;
  padding: 14px 18px;
  background: var(--color-bg-soft);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-xl);
  font-family: var(--font-family-base);
  font-size: var(--font-size-body-md);
  font-weight: 500;
  color: var(--color-text);
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  outline: none;
  box-sizing: border-box;
}

.form-input:hover:not(:disabled) {
  border-color: var(--color-border-soft);
}

.form-input:focus:not(:disabled) {
  background: var(--color-card);
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px rgba(0, 103, 104, 0.12);
}

.form-input--disabled {
  color: var(--color-text-muted);
  cursor: not-allowed;
  opacity: 0.7;
}

.form-input--prefix {
  padding-left: 52px;
}

.input-icon-wrap {
  position: relative;
}

.input-icon {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-muted);
  font-size: 20px;
  pointer-events: none;
}

.state-icon {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
  pointer-events: none;
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform: translateY(-50%) scale(0.5);
}

.form-group--completed .state-icon,
.form-group--incomplete .state-icon {
  opacity: 1;
  transform: translateY(-50%) scale(1);
}

.form-group--completed .state-icon { color: var(--color-success-600); }
.form-group--incomplete .state-icon { color: var(--color-warning-600); }

.field-status-text {
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.form-group--completed .field-status-text { color: var(--color-success-600); opacity: 1; }
.form-group--incomplete .field-status-text { color: var(--color-warning-600); opacity: 1; }

.form-group--completed .form-input {
  border-color: var(--color-success-400);
  background: var(--color-success-50/30);
}
.form-group--incomplete .form-input {
  border-color: var(--color-warning-400);
  background: var(--color-warning-50/30);
}

.input-prefix {
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  font-size: var(--font-size-body-sm);
  font-weight: 700;
  color: var(--color-text-muted);
  pointer-events: none;
  z-index: 1;
}

.form-hint {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--color-text-muted);
  text-transform: uppercase;
}

/* Verified badge */
.badge-verified {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: var(--radius-pill);
  background: var(--color-success-50);
  color: var(--color-success-700);
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border: 1px solid var(--color-success-200);
}

/* ──────────────────────────────────────────
   Action button
────────────────────────────────────────── */
.form-actions {
  padding-top: 24px;
  border-top: 1px solid var(--color-border-soft);
  display: flex;
  justify-content: flex-end;
}

.btn-save {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 32px;
  background: var(--color-primary-600);
  color: #ffffff;
  border: none;
  border-radius: var(--radius-xl);
  font-family: var(--font-family-base);
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(0, 103, 104, 0.25);
  transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
}

.btn-save:hover:not(:disabled) {
  background: var(--color-primary-700);
  transform: translateY(-1px);
  box-shadow: 0 10px 28px rgba(0, 103, 104, 0.3);
}

.btn-save:active:not(:disabled) {
  transform: scale(0.98);
}

.btn-save:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.btn-icon {
  font-size: 18px;
  transition: transform 0.2s ease;
}

.btn-save:hover .btn-icon {
  transform: translateX(3px);
}

/* ──────────────────────────────────────────
   Responsive
────────────────────────────────────────── */
@media (max-width: 900px) {
  .profile-body {
    flex-direction: column;
  }

  .profile-sidebar {
    width: 100%;
    position: static;
  }

  .sidebar-hero {
    flex-direction: row;
    text-align: left;
    padding: 24px;
    gap: 16px;
  }

  .avatar-letter {
    width: 64px;
    height: 64px;
    font-size: 1.8rem;
    flex-shrink: 0;
  }

  .sidebar-name,
  .sidebar-role {
    position: static;
  }
}

@media (max-width: 600px) {
  .profile-container {
    padding: 28px 16px 60px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .profile-form {
    padding: 24px 20px;
  }

  .card-section-header {
    padding: 20px;
  }
}
/* Textarea */
.form-input--textarea {
  resize: vertical;
  min-height: 88px;
  line-height: var(--line-height-relaxed);
}

/* Travel preference chips */
.travel-prefs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.pref-chip {
  display: inline-flex;
  align-items: center;
  padding: 7px 14px;
  border-radius: var(--radius-pill);
  border: 1.5px solid var(--color-border);
  background: var(--color-bg-soft);
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}
.pref-chip:hover {
  border-color: var(--color-primary-400);
  color: var(--color-primary-600);
}
.pref-chip--active {
  background: var(--color-success-600); /* Travel teal success */
  border-color: var(--color-success-600);
  color: #ffffff;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.2);
}
.chip-check {
  font-size: 14px;
  margin-right: 4px;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}
/* profile-main stacks children vertically */
.profile-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
</style>
