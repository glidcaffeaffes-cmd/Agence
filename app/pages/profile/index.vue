<template>
  <div class="profile-page">
    <Head>
      <title>My Profile — VoyageHub</title>
      <meta
        name="description"
        content="Manage your VoyageHub profile and preferences."
      />
    </Head>

    <div class="profile-container">
      <!-- Page Header -->
      <header class="profile-header">
        <h1 class="profile-header__title">My Profile</h1>
      </header>

      <div class="profile-body">
        <!-- Sidebar -->
        <ProfileSidebar />

        <!-- Main Content -->
        <main class="profile-main">
          <div class="profile-card main-settings-card">
            <!-- Tabs Header -->
            <div class="tabs-header">
              <button
                v-for="tab in [
                  'Account Settings',
                  'Travel Preferences',
                  'Documents',
                  'Billing',
                  'Notifications',
                ]"
                :key="tab"
                class="tab-btn"
                :class="{ 'tab-btn--active': activeTab === tab }"
                @click="activeTab = tab"
              >
                {{ tab }}
              </button>
            </div>

            <!-- Tab Content -->
            <div class="tab-content">
              <!-- Account Settings Tab -->
              <div v-if="activeTab === 'Account Settings'" class="tab-pane">
                <form @submit.prevent="saveProfile" class="profile-form">
                  <!-- Personal Details Section -->
                  <section class="settings-section">
                    <div class="settings-section__header">
                      <span class="material-symbols-outlined section-icon"
                        >account_circle</span
                      >
                      <h2 class="settings-section__title">Personal Details</h2>
                    </div>
                    <div class="settings-section__body">
                      <div class="form-row">
                        <!-- First Name -->
                        <div
                          class="form-group"
                          :class="
                            getFieldState('firstName', formData.firstName)
                          "
                        >
                          <div class="form-label-row">
                            <label class="form-label">First Name</label>
                            <span class="field-status-text">{{
                              getFieldStatusText(
                                "firstName",
                                formData.firstName,
                              )
                            }}</span>
                          </div>
                          <div class="input-icon-wrap">
                            <input
                              type="text"
                              v-model="formData.firstName"
                              class="form-input"
                              placeholder="Nathaniel"
                            />
                            <span
                              class="material-symbols-outlined state-icon"
                              >{{
                                getFieldIcon("firstName", formData.firstName)
                              }}</span
                            >
                          </div>
                        </div>
                        <!-- Last Name -->
                        <div
                          class="form-group"
                          :class="getFieldState('lastName', formData.lastName)"
                        >
                          <div class="form-label-row">
                            <label class="form-label">Last Name</label>
                            <span class="field-status-text">{{
                              getFieldStatusText("lastName", formData.lastName)
                            }}</span>
                          </div>
                          <div class="input-icon-wrap">
                            <input
                              type="text"
                              v-model="formData.lastName"
                              class="form-input"
                              placeholder="Poole"
                            />
                            <span
                              class="material-symbols-outlined state-icon"
                              >{{
                                getFieldIcon("lastName", formData.lastName)
                              }}</span
                            >
                          </div>
                        </div>
                      </div>

                      <div class="form-row">
                        <!-- Date of Birth -->
                        <div
                          class="form-group"
                          :class="
                            getFieldState('dateOfBirth', formData.dateOfBirth)
                          "
                        >
                          <div class="form-label-row">
                            <label class="form-label">Date of Birth</label>
                            <span class="field-status-text">{{
                              getFieldStatusText(
                                "dateOfBirth",
                                formData.dateOfBirth,
                              )
                            }}</span>
                          </div>
                          <div class="input-icon-wrap">
                            <input
                              type="date"
                              v-model="formData.dateOfBirth"
                              class="form-input"
                            />
                            <span
                              class="material-symbols-outlined state-icon"
                              >{{
                                getFieldIcon(
                                  "dateOfBirth",
                                  formData.dateOfBirth,
                                )
                              }}</span
                            >
                          </div>
                        </div>
                        <!-- Empty slot for grid alignment if needed, or leave for 2-column flow -->
                        <div class="form-group"></div>
                      </div>
                    </div>
                  </section>

                  <!-- Contact Information Section -->
                  <section class="settings-section">
                    <div class="settings-section__header">
                      <span class="material-symbols-outlined section-icon"
                        >contact_page</span
                      >
                      <h2 class="settings-section__title">
                        Contact Information
                      </h2>
                    </div>
                    <div class="settings-section__body">
                      <div class="form-row">
                        <!-- Phone -->
                        <div
                          class="form-group"
                          :class="getFieldState('phone', formData.phone)"
                        >
                          <div class="form-label-row">
                            <label class="form-label">Phone Number</label>
                            <span class="field-status-text">{{
                              getFieldStatusText("phone", formData.phone)
                            }}</span>
                          </div>
                          <div class="input-icon-wrap">
                            <span class="input-prefix">+216</span>
                            <input
                              type="tel"
                              v-model="formData.phone"
                              placeholder="01 234 567"
                              class="form-input form-input--prefix"
                            />
                            <span
                              class="material-symbols-outlined state-icon"
                              >{{ getFieldIcon("phone", formData.phone) }}</span
                            >
                          </div>
                        </div>
                        <!-- Email (Locked) -->
                        <div class="form-group">
                          <div class="form-label-row">
                            <label class="form-label">Email Address</label>
                            <span class="badge-verified">Verified</span>
                          </div>
                          <div class="input-icon-wrap">
                            <input
                              type="email"
                              :value="currentProfile?.email"
                              disabled
                              class="form-input form-input--disabled"
                            />
                            <span class="material-symbols-outlined input-icon"
                              >lock</span
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  <!-- Identification Section -->
                  <section class="settings-section">
                    <div class="settings-section__header">
                      <span class="material-symbols-outlined section-icon"
                        >badge</span
                      >
                      <h2 class="settings-section__title">Identification</h2>
                    </div>
                    <div class="settings-section__body">
                      <div class="form-row">
                        <!-- Passport -->
                        <div
                          class="form-group"
                          :class="
                            getFieldState(
                              'passportNumber',
                              formData.passportNumber,
                            )
                          "
                        >
                          <div class="form-label-row">
                            <label class="form-label">Passport Number</label>
                            <span class="field-status-text">{{
                              getFieldStatusText(
                                "passportNumber",
                                formData.passportNumber,
                              )
                            }}</span>
                          </div>
                          <div class="input-icon-wrap">
                            <input
                              type="text"
                              v-model="formData.passportNumber"
                              class="form-input"
                              placeholder="e.g. AB123456"
                            />
                            <span
                              class="material-symbols-outlined state-icon"
                              >{{
                                getFieldIcon(
                                  "passportNumber",
                                  formData.passportNumber,
                                )
                              }}</span
                            >
                          </div>
                        </div>
                        <div class="form-group"></div>
                      </div>
                    </div>
                  </section>

                  <div class="form-actions">
                    <button
                      type="submit"
                      :disabled="loading"
                      class="btn-update"
                    >
                      {{ loading ? "Updating..." : "Update Profile" }}
                    </button>
                  </div>
                </form>
              </div>

              <!-- Travel Preferences Tab -->
              <div v-if="activeTab === 'Travel Preferences'" class="tab-pane">
                <form @submit.prevent="saveProfile" class="profile-form">
                  <!-- Bio Section -->
                  <section class="settings-section">
                    <div class="settings-section__header">
                      <span class="material-symbols-outlined section-icon"
                        >description</span
                      >
                      <h2 class="settings-section__title">Bio & About Me</h2>
                    </div>
                    <div class="settings-section__body">
                      <div
                        class="form-group"
                        :class="getFieldState('bio', formData.bio)"
                      >
                        <div class="form-label-row">
                          <label class="form-label">Bio / About Me</label>
                          <span class="field-status-text">{{
                            getFieldStatusText("bio", formData.bio)
                          }}</span>
                        </div>
                        <textarea
                          v-model="formData.bio"
                          class="form-input form-input--textarea"
                          placeholder="Tell fellow travellers about yourself..."
                          rows="4"
                        ></textarea>
                      </div>
                    </div>
                  </section>

                  <!-- Travel Interests Section -->
                  <section class="settings-section">
                    <div class="settings-section__header">
                      <span class="material-symbols-outlined section-icon"
                        >explore</span
                      >
                      <h2 class="settings-section__title">
                        Travel Styles & Interests
                      </h2>
                    </div>
                    <div class="settings-section__body">
                      <div
                        class="form-group"
                        :class="
                          getFieldState(
                            'preferredDestinations',
                            formData.preferredDestinations,
                          )
                        "
                      >
                        <div class="form-label-row">
                          <label class="form-label"
                            >Preferred Destinations</label
                          >
                          <span class="field-status-text">{{
                            getFieldStatusText(
                              "preferredDestinations",
                              formData.preferredDestinations,
                            )
                          }}</span>
                        </div>
                        <input
                          type="text"
                          :value="formData.preferredDestinations.join(', ')"
                          @input="
                            formData.preferredDestinations = (
                              $event.target as HTMLInputElement
                            ).value
                              .split(',')
                              .map((s) => s.trim())
                              .filter(Boolean)
                          "
                          class="form-input"
                          placeholder="Paris, Bali, New York..."
                        />
                      </div>

                      <div class="form-group">
                        <label class="form-label">Travel Style</label>
                        <div class="travel-prefs">
                          <label
                            v-for="pref in travelPrefOptions"
                            :key="pref"
                            class="pref-chip"
                            :class="
                              formData.travelPreferences.includes(pref)
                                ? 'pref-chip--active'
                                : ''
                            "
                          >
                            <input
                              type="checkbox"
                              :value="pref"
                              v-model="formData.travelPreferences"
                              class="sr-only"
                            />
                            {{ pref }}
                          </label>
                        </div>
                      </div>
                    </div>
                  </section>

                  <div class="form-actions">
                    <button
                      type="submit"
                      :disabled="loading"
                      class="btn-update"
                    >
                      Update Preferences
                    </button>
                  </div>
                </form>
              </div>

              <!-- Empty Tabs for now -->
              <div
                v-if="
                  ['Documents', 'Billing', 'Notifications'].includes(activeTab)
                "
                class="tab-pane tab-pane--empty"
              >
                <div class="empty-state">
                  <span class="material-symbols-outlined">construction</span>
                  <p>
                    The <strong>{{ activeTab }}</strong> module is coming soon
                    to VoyageHub.
                  </p>
                </div>
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
import { useProfileCompletion } from "~/composables/useProfileCompletion";

const { currentProfile, updateProfile, loading } = useAuth();
const activeTab = ref("Account Settings");

const travelPrefOptions = [
  "Luxury",
  "Adventure",
  "Beach",
  "City Break",
  "Cultural",
  "Eco Travel",
  "Family",
  "Solo",
  "Wellness",
  "Ski",
];

const formData = ref({
  firstName: "",
  lastName: "",
  phone: "",
  dateOfBirth: "",
  passportNumber: "",
  bio: "",
  preferredDestinations: [] as string[],
  travelPreferences: [] as string[],
});

watch(
  currentProfile,
  (profile) => {
    if (profile) {
      formData.value = {
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        phone: profile.phone || "",
        dateOfBirth: profile.dateOfBirth || "",
        passportNumber: profile.passportNumber || "",
        bio: profile.bio || "",
        preferredDestinations: profile.preferredDestinations || [],
        travelPreferences: profile.travelPreferences || [],
      };
    }
  },
  { immediate: true },
);

async function saveProfile() {
  const success = await updateProfile(formData.value);
  if (success) {
    alert("Profile updated successfully!");
  } else {
    alert("Failed to update profile. Please try again.");
  }
}

// ─── Field State Logic ───
const requiredFields = ["firstName"];

function hasValue(val: any) {
  if (val === null || val === undefined) return false;
  if (typeof val === "string") return val.trim().length > 0;
  if (Array.isArray(val)) return val.length > 0;
  return Boolean(val);
}

function getFieldState(key: string, value: any) {
  if (hasValue(value)) return "form-group--completed";
  return "form-group--incomplete";
}

function getFieldStatusText(key: string, value: any) {
  if (hasValue(value)) return "Completed";
  return "Missing information";
}

function getFieldIcon(key: string, value: any) {
  if (hasValue(value)) return "check_circle";
  return "error";
}
</script>

<style scoped>
/* ──────────────────────────────────────────
   Material Icons
────────────────────────────────────────── */
.material-symbols-outlined {
  font-variation-settings:
    "FILL" 0,
    "wght" 400,
    "GRAD" 0,
    "opsz" 24;
}

/* ──────────────────────────────────────────
   Page shell
────────────────────────────────────────── */
.profile-page {
  min-height: 100vh;
  background: var(--color-bg-soft);
}

.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 24px 80px;
}

/* ──────────────────────────────────────────
   Body layout
────────────────────────────────────────── */
.profile-body {
  display: flex;
  gap: 32px;
  align-items: flex-start;
}
/* Sidebar styles are now in ProfileSidebar.vue */

/* Main Content Layout */

/* ──────────────────────────────────────────
   Main Settings Card & Tabs
────────────────────────────────────────── */
.profile-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.main-settings-card {
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
}

.tabs-header {
  display: flex;
  gap: 24px;
  padding: 0 32px;
  border-bottom: 1px solid var(--color-border-soft);
  background: #ffffff;
}

.tab-btn {
  background: none;
  border: none;
  padding: 20px 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-muted);
  cursor: pointer;
  position: relative;
  transition: color 0.2s ease;
  white-space: nowrap;
}

.tab-btn:hover {
  color: var(--color-primary-600);
}

.tab-btn--active {
  color: var(--color-primary-600);
}

.tab-btn--active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--color-primary-600);
  border-radius: 3px 3px 0 0;
}

.tab-content {
  padding: 32px 0;
}

.tab-pane--empty {
  padding: 60px 32px;
  text-align: center;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: var(--color-text-muted);
}

.empty-state .material-symbols-outlined {
  font-size: 48px;
  color: var(--color-primary-200);
}

.btn-update {
  padding: 12px 32px;
  background: var(--color-primary-600);
  color: #ffffff;
  border: none;
  border-radius: var(--radius-lg);
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 103, 104, 0.2);
}

.btn-update:hover {
  background: var(--color-primary-700);
  transform: translateY(-1px);
}

/* ──────────────────────────────────────────
   Settings Sections (Divided Blocks)
────────────────────────────────────────── */
.settings-section {
  background: #ffffff;
  border: 1px solid var(--color-border-soft);
  border-radius: var(--radius-xl);
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.settings-section:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.settings-section__header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  background: var(--color-bg-soft);
  border-bottom: 1px solid var(--color-border-soft);
}

.section-icon {
  font-size: 20px;
  color: var(--color-primary-600);
}

.settings-section__title {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-heading);
  margin: 0;
}

.settings-section__body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Form Styles */
.profile-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
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

.form-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-label {
  font-size: 11px;
  font-weight: 800;
  color: var(--color-heading);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.form-input {
  width: 100%;
  padding: 14px 18px;
  background: var(--color-bg-soft);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-xl);
  font-family: var(--font-family-base);
  font-size: 14px;
  color: var(--color-text);
  transition: all 0.2s ease;
  outline: none;
}

.form-input:focus {
  background: #ffffff;
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
.input-prefix {
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text-muted);
  z-index: 1;
}

.field-status-text {
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.form-group--completed .field-status-text {
  color: var(--color-success-400);
  opacity: 1;
}
.form-group--incomplete .field-status-text {
  color: var(--color-warning-600);
  opacity: 1;
}

.state-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
  pointer-events: none;
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform: translateY(-50%) scale(0.5);
  z-index: 2;
}

input[type="date"] ~ .state-icon {
  right: 36px;
}

.form-group--completed .state-icon,
.form-group--incomplete .state-icon {
  opacity: 1;
  transform: translateY(-50%) scale(1);
}

.form-group--completed .state-icon {
  color: var(--color-success-600);
}
.form-group--incomplete .state-icon {
  color: var(--color-warning-600);
}

.form-group--completed .form-input {
  border-color: #10b981;
  background: var(--color-success-25);
}
.form-group--incomplete .form-input {
  border-color: #f59e0b;
  background: var(--color-warning-25);
}

.form-actions {
  padding-top: 24px;
  border-top: 1px solid var(--color-border-soft);
  display: flex;
  justify-content: flex-end;
}

/* Chips */
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
}
.pref-chip--active {
  background: var(--color-success-600);
  border-color: var(--color-success-600);
  color: #ffffff;
}

.badge-verified {
  font-size: 10px;
  font-weight: 700;
  color: var(--color-success-600);
  text-transform: uppercase;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

@media (max-width: 900px) {
  .profile-body {
    flex-direction: column;
  }
  .profile-sidebar {
    width: 100%;
    position: static;
  }
}

@media (max-width: 600px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  .tabs-header {
    overflow-x: auto;
    padding: 0 16px;
    gap: 16px;
  }
}
</style>
