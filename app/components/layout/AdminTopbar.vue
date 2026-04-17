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
      <kbd class="search-kbd">⌘K</kbd>
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
        <img
          src="https://i.pravatar.cc/40?u=admin"
          alt="Admin"
          class="user-avatar"
        />
        <div class="user-info">
          <span class="user-name">Admin</span>
          <span class="user-role">Super Admin</span>
        </div>
        <span class="material-symbols-outlined chevron" :class="{ 'rotate-180': showMenu }">expand_more</span>
      </button>

      <!-- Dropdown (same pattern as ClientNavbar's user-dropdown) -->
      <Transition name="dropdown">
        <div v-if="showMenu" class="user-dropdown" @click.outside="showMenu = false">
          <div class="dropdown-header">
            <img src="https://i.pravatar.cc/40?u=admin" alt="Admin" class="dropdown-avatar" />
            <div>
              <p class="dropdown-name">Admin</p>
              <p class="dropdown-email">admin@voyagehub.com</p>
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
import { ref } from 'vue'

const searchQuery = ref('')
const showMenu = ref(false)
const notifCount = ref(3)

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
  background: rgba(245, 250, 255, 0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(188, 201, 200, 0.3);
  box-shadow: 0 1px 8px rgba(1, 80, 129, 0.05);
  font-family: 'Inter', sans-serif;
}

/* ─── Brand (left) ───────────────────────────────────── */
.topbar-brand {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  flex-shrink: 0;
  text-decoration: none;
}
.brand-icon {
  font-size: 1.5rem;
  color: #CDAF5D;
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
.brand-text-group { display: flex; flex-direction: column; line-height: 1; }
.brand-name {
  font-size: 0.9375rem;
  font-weight: 700;
  color: #015081;
  letter-spacing: -0.02em;
}
.brand-badge {
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #008F90;
  margin-top: 2px;
}

/* ─── Search (center) ────────────────────────────────── */
.topbar-search {
  flex: 1;
  max-width: 400px;
  position: relative;
  display: flex;
  align-items: center;
}
.search-icon {
  position: absolute;
  left: 0.75rem;
  font-size: 1rem;
  color: #6d7979;
  pointer-events: none;
}
.search-input {
  width: 100%;
  height: 38px;
  padding: 0 2.5rem 0 2.5rem;
  background: #fff;
  border: 1px solid rgba(188, 201, 200, 0.4);
  border-radius: 0.625rem;
  font-size: 0.875rem;
  color: #151d22;
  font-family: 'Inter', sans-serif;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.search-input::placeholder { color: #9eaaa9; }
.search-input:focus {
  border-color: #008F90;
  box-shadow: 0 0 0 3px rgba(0, 143, 144, 0.12);
}
.search-kbd {
  position: absolute;
  right: 0.625rem;
  background: #f5faff;
  border: 1px solid rgba(188, 201, 200, 0.4);
  border-radius: 0.25rem;
  padding: 0.1rem 0.4rem;
  font-size: 0.6875rem;
  color: #6d7979;
  font-family: 'Inter', sans-serif;
  pointer-events: none;
}

/* ─── Actions (right) ────────────────────────────────── */
.topbar-actions {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-left: auto;
  flex-shrink: 0;
  position: relative;
}
.topbar-icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 0.5rem;
  border: none;
  background: transparent;
  color: #3d4949;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  text-decoration: none;
  position: relative;
}
.topbar-icon-btn .material-symbols-outlined { font-size: 1.25rem; }
.topbar-icon-btn:hover { background: rgba(1, 80, 129, 0.07); color: #015081; }

.notification-btn { position: relative; }
.notif-badge {
  position: absolute;
  top: 4px; right: 4px;
  min-width: 16px; height: 16px;
  border-radius: 999px;
  background: #CDAF5D;
  color: #241a00;
  font-size: 0.6rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 3px;
}

.topbar-divider {
  width: 1px;
  height: 28px;
  background: rgba(188, 201, 200, 0.4);
  margin: 0 0.375rem;
}

/* ─── User Pill (inspired by ClientNavbar nav-avatar-btn) ── */
.user-pill {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.25rem 0.75rem 0.25rem 0.25rem;
  border: 1px solid rgba(188, 201, 200, 0.4);
  border-radius: 999px;
  background: #fff;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.user-pill:hover {
  border-color: #008F90;
  box-shadow: 0 0 0 3px rgba(0, 143, 144, 0.1);
}
.user-avatar {
  width: 30px; height: 30px;
  border-radius: 50%;
  object-fit: cover;
}
.user-info { display: flex; flex-direction: column; text-align: left; line-height: 1.1; }
.user-name { font-size: 0.8125rem; font-weight: 700; color: #015081; }
.user-role { font-size: 0.6rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #6d7979; }
.chevron {
  font-size: 1rem;
  color: #6d7979;
  transition: transform 0.2s;
}
.rotate-180 { transform: rotate(180deg); }

/* ─── Dropdown (inspired by ClientNavbar user-dropdown) ─── */
.user-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  min-width: 220px;
  background: #fff;
  border: 1px solid rgba(188, 201, 200, 0.3);
  border-radius: 0.875rem;
  box-shadow: 0 8px 32px rgba(1, 80, 129, 0.12);
  padding: 0.5rem;
  z-index: 200;
}
.dropdown-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0.75rem 0.5rem;
}
.dropdown-avatar { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; }
.dropdown-name { font-size: 0.875rem; font-weight: 700; color: #015081; margin: 0; }
.dropdown-email { font-size: 0.75rem; color: #6d7979; margin: 0; }
.dropdown-divider { height: 1px; background: rgba(188, 201, 200, 0.3); margin: 0.375rem 0; }
.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  color: #151d22;
  background: none;
  border: none;
  cursor: pointer;
  transition: background 0.15s;
  font-family: 'Inter', sans-serif;
}
.dropdown-item .material-symbols-outlined { font-size: 1.125rem; color: #6d7979; }
.dropdown-item:hover { background: #f5faff; }
.dropdown-item--danger { color: #ba1a1a; }
.dropdown-item--danger .material-symbols-outlined { color: #ba1a1a; }
.dropdown-item--danger:hover { background: rgba(186,26,26,0.06); }

/* ─── Transitions ────────────────────────────────────── */
.dropdown-enter-active, .dropdown-leave-active { transition: opacity 0.18s ease, transform 0.18s ease; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-6px) scale(0.97); }
</style>
