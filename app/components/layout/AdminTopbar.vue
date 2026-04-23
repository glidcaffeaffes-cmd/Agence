<template>
  <header class="admin-topbar">
    <!-- Left: Brand (mirrored from ClientNavbar structure) -->
      

    <!-- Center: Search -->
    <div class="topbar-search">
      <span class="material-symbols-outlined search-icon">search</span>
      <input
        v-model="searchQuery"
        class="search-input"
        placeholder="Rechercher…"
        type="text"
        @keyup.enter="handleSearch"
      />
    </div>

    <!-- Right: Actions + User -->
    <div class="topbar-actions">
      <!-- Quick links -->
      <NuxtLink to="/" target="_blank" class="topbar-icon-btn" title="Voir le site client">
        <span class="material-symbols-outlined">open_in_new</span>
      </NuxtLink>

      <!-- Notifications -->
      <button class="topbar-icon-btn notification-btn" title="Notifications">
        <span class="material-symbols-outlined">notifications</span>
        <span v-if="notifCount > 0" class="notif-badge">{{ notifCount }}</span>
      </button>

      <!-- Settings -->
      <NuxtLink to="/admin/settings" class="topbar-icon-btn" title="Paramètres">
        <span class="material-symbols-outlined">settings</span>
      </NuxtLink>

      <!-- Divider -->
      <div class="topbar-divider"></div>

      <!-- User pill (same pattern as ClientNavbar's nav-avatar-btn) -->
      <button class="user-pill" @click="showMenu = !showMenu">
        <div v-if="currentProfile?.photo" class="user-avatar-wrap">
          <img :src="currentProfile.photo" alt="Avatar" class="user-avatar" />
        </div>
        <div v-else class="user-avatar-placeholder brand-text">
          {{ avatarLetter }}
        </div>
        <div class="user-info">
          <span class="user-name">{{ currentProfile?.firstName || 'Admin' }}</span>
          <span class="user-role">{{ currentProfile?.role || 'Staff' }}</span>
        </div>
        <span class="material-symbols-outlined chevron" :class="{ 'rotate-180': showMenu }">expand_more</span>
      </button>

      <!-- Dropdown (same pattern as ClientNavbar's user-dropdown) -->
      <Transition name="dropdown">
        <div v-if="showMenu" class="user-dropdown" @click.outside="showMenu = false">
          <div class="dropdown-header">
            <div v-if="currentProfile?.photo" class="dropdown-avatar-wrap">
              <img :src="currentProfile.photo" alt="Avatar" class="dropdown-avatar" />
            </div>
            <div v-else class="dropdown-avatar-placeholder brand-text">
              {{ avatarLetter }}
            </div>
            <div>
              <p class="dropdown-name">{{ currentProfile?.firstName }} {{ currentProfile?.lastName }}</p>
              <p class="dropdown-email">{{ currentProfile?.email }}</p>
            </div>
          </div>
          <div class="dropdown-divider"></div>
          <NuxtLink to="/admin" class="dropdown-item" @click="showMenu = false">
            <span class="material-symbols-outlined">dashboard</span> Dashboard
          </NuxtLink>
          <NuxtLink to="/admin/settings" class="dropdown-item" @click="showMenu = false">
            <span class="material-symbols-outlined">settings</span> Paramètres
          </NuxtLink>
          <div class="dropdown-divider"></div>
          <NuxtLink to="/" class="dropdown-item" @click="showMenu = false">
            <span class="material-symbols-outlined">open_in_new</span> Voir le site
          </NuxtLink>
          <a href="/login" class="dropdown-item dropdown-item--danger">
            <span class="material-symbols-outlined">logout</span> Se déconnecter
          </a>
        </div>
      </Transition>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuth } from '~/composables/useAuth'

const { currentProfile, logout } = useAuth()
const searchQuery = ref('')
const showMenu = ref(false)
const notifCount = ref(3)

const avatarLetter = computed(() => {
  const first = currentProfile.value?.firstName?.trim().charAt(0).toUpperCase() || "";
  const last = currentProfile.value?.lastName?.trim().charAt(0).toUpperCase() || "";
  return (first + last) || "A";
});

function handleLogout() {
  logout()
  navigateTo('/login')
}

function handleSearch() {
  // placeholder — wire to real search when ready
}

// Close dropdown on outside click
onMounted(() => {
  document.addEventListener('click', (e) => {
    const el = document.querySelector('.user-pill')
    const dropdown = document.querySelector('.user-dropdown')
    if (el && dropdown && !el.contains(e.target as Node) && !dropdown.contains(e.target as Node)) {
      showMenu.value = false
    }
  })
})
</script>

<style scoped>
/* ─── Topbar Shell ───────────────────────────────────── */
.admin-topbar {
  position: sticky;
  top: 0;
  z-index: 40;
  width: 100%;
  height: 64px;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 0 2rem;
  background: rgba(255, 255, 255, 0.85); /* fallback */
  background: var(--topbar-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--topbar-border);
  box-shadow: var(--shadow-sm);
}

/* ─── Search (center) ────────────────────────────────── */
.topbar-search {
  flex: 1;
  max-width: 360px;
  position: relative;
  display: flex;
  align-items: center;
}
.search-icon {
  position: absolute;
  left: var(--spacing-3);
  font-size: 1.25rem;
  color: var(--color-text-muted);
  pointer-events: none;
}
.search-input {
  width: 100%;
  height: 38px;
  padding: 0 var(--spacing-3) 0 2.5rem;
  background-color: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md); /* Standard rectangle shape */
  font-size: var(--font-size-sm);
  color: var(--color-text);
  outline: none;
  transition: border-color var(--motion-duration-fast), box-shadow var(--motion-duration-fast);
}
.search-input::placeholder { color: var(--color-text-muted); }
.search-input:focus {
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px var(--color-primary-100);
}

/* ─── Actions (right) ────────────────────────────────── */
.topbar-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  margin-left: auto;
  flex-shrink: 0;
  position: relative;
}
.topbar-icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  border: none;
  background: transparent;
  color: var(--color-text-soft);
  cursor: pointer;
  transition: background var(--motion-duration-fast), color var(--motion-duration-fast);
  text-decoration: none;
  position: relative;
}
.topbar-icon-btn .material-symbols-outlined { font-size: 1.25rem; }
.topbar-icon-btn:hover { background: var(--color-bg-soft); color: var(--color-primary-600); }

.notification-btn { position: relative; }
.notif-badge {
  position: absolute;
  top: 4px; right: 4px;
  min-width: 16px; height: 16px;
  border-radius: 999px;
  background: var(--color-danger-500);
  color: var(--color-white);
  font-size: 0.65rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  border: 2px solid var(--topbar-bg);
}

.topbar-divider {
  width: 1px;
  height: 24px;
  background: var(--color-border);
  margin: 0 var(--spacing-2);
}

/* ─── User Pill ── */
.user-pill {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: 0.25rem 0.75rem 0.25rem 0.25rem;
  border: 1px solid var(--color-border-soft);
  border-radius: var(--radius-full);
  background: var(--color-surface);
  cursor: pointer;
  transition: all var(--motion-duration-fast) var(--motion-ease-default);
}
.user-pill:hover {
  border-color: var(--color-primary-400);
  box-shadow: var(--shadow-sm);
}
.user-avatar-wrap { width: 32px; height: 32px; border-radius: 50%; overflow: hidden; }
.user-avatar { width: 100%; height: 100%; object-fit: cover; }
.user-avatar-placeholder {
  width: 32px; height: 32px;
  border-radius: 50%;
  background: var(--color-primary-600);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 800;
}
.user-info { display: flex; flex-direction: column; text-align: left; line-height: 1.2; }
.user-name { font-size: var(--font-size-sm); font-weight: var(--font-weight-bold); color: var(--color-text); }
.user-role { font-size: var(--font-size-xs); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text-muted); }
.chevron {
  font-size: 1.125rem;
  color: var(--color-text-muted);
  transition: transform var(--motion-duration-fast);
}
.rotate-180 { transform: rotate(180deg); }

/* ─── Dropdown ─── */
.user-dropdown {
  position: absolute;
  top: calc(100% + var(--spacing-2));
  right: 0;
  min-width: 240px;
  background: var(--color-surface);
  border: 1px solid var(--color-border-soft);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: var(--spacing-2);
  z-index: var(--z-dropdown);
}
.dropdown-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-3) var(--spacing-3) var(--spacing-2);
}
.dropdown-avatar-wrap { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; }
.dropdown-avatar { width: 100%; height: 100%; object-fit: cover; }
.dropdown-avatar-placeholder {
  width: 40px; height: 40px;
  border-radius: 50%;
  background: var(--color-primary-600);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 800;
}
.dropdown-name { font-size: var(--font-size-base); font-weight: var(--font-weight-bold); color: var(--color-heading); margin: 0; }
.dropdown-email { font-size: var(--font-size-sm); color: var(--color-text-muted); margin: 0; }
.dropdown-divider { height: 1px; background: var(--color-border-soft); margin: var(--spacing-2) 0; }
.dropdown-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  width: 100%;
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--radius-md);
  text-decoration: none;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
  background: none;
  border: none;
  cursor: pointer;
  transition: background var(--motion-duration-fast);
}
.dropdown-item .material-symbols-outlined { font-size: 1.25rem; color: var(--color-text-muted); }
.dropdown-item:hover { background: var(--color-bg-soft); color: var(--color-primary-700); }
.dropdown-item:hover .material-symbols-outlined { color: var(--color-primary-700); }
.dropdown-item--danger { color: var(--color-danger-600); }
.dropdown-item--danger .material-symbols-outlined { color: var(--color-danger-600); }
.dropdown-item--danger:hover { background: var(--alert-danger-bg); color: var(--color-danger-700); }
.dropdown-item--danger:hover .material-symbols-outlined { color: var(--color-danger-700); }

/* ─── Transitions ────────────────────────────────────── */
.dropdown-enter-active, .dropdown-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-8px) scale(0.98); }
</style>
