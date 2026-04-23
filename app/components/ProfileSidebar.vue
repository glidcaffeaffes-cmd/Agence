<template>
  <aside class="profile-sidebar">
    <!-- Sidebar Info Card -->
    <div class="profile-card sidebar-info-card">
      <div class="sidebar-hero">
        <div class="avatar-wrapper">
          <!-- Radial Progress -->
          <svg class="avatar-progress-svg" viewBox="0 0 100 100">
            <circle
              class="progress-track"
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke-width="4"
            />
            <circle
              class="progress-bar"
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke-width="4"
              stroke-linecap="round"
              :stroke-dasharray="avatarCircumference"
              :stroke-dashoffset="avatarDashOffset"
              transform="rotate(150 50 50)"
            />
          </svg>
          <div class="avatar-letter">
            {{ avatarLetter }}
          </div>
          <button class="avatar-edit-btn" title="Update Profile Picture">
            <span class="material-symbols-outlined">photo_camera</span>
          </button>
        </div>
        <h2 class="sidebar-name">
          {{ currentProfile?.firstName || "Guest" }}
          {{ currentProfile?.lastName || "" }}
        </h2>
      </div>

      <div class="sidebar-divider"></div>

      <div class="sidebar-stats">
        <div class="stat-item">
          <span class="stat-label">Trips Completed</span>
          <span class="stat-value stat-value--primary">12</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Saved Hotels</span>
          <span class="stat-value">8</span>
        </div>
      </div>

      <div class="sidebar-divider"></div>
    </div>

    <!-- Secondary Navigation Card -->
    <div class="profile-card sidebar-nav-card">
      <nav class="sidebar-nav">
        <NuxtLink
          to="/profile"
          class="sidebar-nav__link"
          active-class="sidebar-nav__link--active"
        >
          <span class="material-symbols-outlined">person</span>
          Profile Settings
        </NuxtLink>
        <NuxtLink
          to="/reservations/history"
          class="sidebar-nav__link"
          active-class="sidebar-nav__link--active"
        >
          <span class="material-symbols-outlined">history</span>
          Reservations
        </NuxtLink>
        <NuxtLink
          to="/settings"
          class="sidebar-nav__link"
          active-class="sidebar-nav__link--active"
        >
          <span class="material-symbols-outlined">settings</span>
          Privacy & Security
        </NuxtLink>
      </nav>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useAuth } from "~/composables/useAuth";
import { computed } from "vue";
import { useProfileCompletion } from "~/composables/useProfileCompletion";

const { currentProfile } = useAuth();
const { percentage } = useProfileCompletion(currentProfile);

const isMounted = ref(false);
onMounted(() => {
  isMounted.value = true;
});

const avatarCircumference = 2 * Math.PI * 48;
const avatarDashOffset = computed(() => {
  if (!isMounted.value) return avatarCircumference;
  return avatarCircumference - (percentage.value / 100) * avatarCircumference;
});

const avatarLetter = computed(() => {
  if (!isMounted.value) return "?";
  const name = currentProfile.value?.firstName || "";
  return name.trim().charAt(0).toUpperCase() || "?";
});
</script>

<style scoped>
.profile-sidebar {
  width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: sticky;
  top: 100px;
}

.profile-card {
  background: #ffffff;
  border-radius: var(--radius-2xl);
  border: 1px solid var(--color-border-soft);
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.02),
    0 12px 24px -4px rgba(0, 103, 104, 0.04);
  overflow: hidden;
}

.sidebar-hero {
  padding: 0 24px 24px;
  padding-top: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.avatar-wrapper {
  position: relative;
  margin-bottom: 20px;
  width: 102px;
  height: 102px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-letter {
  width: 90px;
  height: 90px;
  background: linear-gradient(
    135deg,
    var(--color-primary-500),
    var(--color-primary-700)
  );
  color: #ffffff;
  font-size: 2.2rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-pill);
  box-shadow: 0 8px 24px rgba(0, 103, 104, 0.2);
  border: 4px solid #ffffff;
  position: relative;
  z-index: 2;
}

.avatar-progress-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
  rotate: 173deg;
  transform: scaleY(-1);
}

.progress-track {
  stroke: var(--color-gray-100);
}

.progress-bar {
  stroke: #10b981;
  transition: stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.avatar-edit-btn {
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-pill);
  background: var(--color-primary-600);
  color: #ffffff;
  border: 2px solid #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  z-index: 3;
}

.avatar-edit-btn:hover {
  transform: scale(1.1);
  background: var(--color-primary-700);
}

.avatar-edit-btn .material-symbols-outlined {
  font-size: 16px;
}

.sidebar-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-heading);
  line-height: 1.2;
}

.sidebar-divider {
  height: 1px;
  background: var(--color-border-soft);
  width: 100%;
}

.sidebar-stats {
  padding: 24px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  text-align: center;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 10px;
  font-weight: 700;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-value {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--color-heading);
}

.stat-value--primary {
  color: var(--color-primary-600);
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  padding: 12px;
  gap: 4px;
}

.sidebar-nav__link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: var(--radius-xl);
  color: var(--color-text-muted);
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.2s ease;
}

.sidebar-nav__link:hover {
  background: var(--color-bg-soft);
  color: var(--color-primary-600);
}

.sidebar-nav__link--active {
  background: var(--color-primary-25);
  color: var(--color-primary-600);
}

.sidebar-nav__link .material-symbols-outlined {
  font-size: 20px;
}

@media (max-width: 900px) {
  .profile-sidebar {
    width: 100%;
    position: static;
  }
}
</style>
