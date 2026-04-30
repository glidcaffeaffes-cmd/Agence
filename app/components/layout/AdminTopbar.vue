<template>
  <header class="admin-topbar">
    <div class="admin-topbar__start">
      <button
        class="topbar-icon-btn admin-topbar__menu-btn"
        :title="t('nav.menu')"
        @click="sidebarOpen = true"
      >
        <span class="material-symbols-outlined">menu</span>
      </button>

      <div class="topbar-search">
        <span class="material-symbols-outlined search-icon">search</span>
        <input
          v-model="searchQuery"
          class="search-input"
          :placeholder="t('admin.searchPlaceholder')"
          type="text"
          @keyup.enter="handleSearch"
        />
      </div>
    </div>

    <div class="topbar-actions">
      <div class="topbar-switchers">
        <LanguageSwitcher />
        <ThemeSwitcher />
      </div>

      <NuxtLink
        to="/"
        target="_blank"
        class="topbar-icon-btn"
        :title="t('admin.viewClientSite')"
      >
        <span class="material-symbols-outlined">open_in_new</span>
      </NuxtLink>

      <button class="topbar-icon-btn notification-btn" :title="t('admin.notifications')">
        <span class="material-symbols-outlined">notifications</span>
        <span v-if="notifCount > 0" class="notif-badge">{{ notifCount }}</span>
      </button>

      <NuxtLink
        to="/admin/settings"
        class="topbar-icon-btn"
        :title="t('admin.settings')"
      >
        <span class="material-symbols-outlined">settings</span>
      </NuxtLink>

      <div class="topbar-divider"></div>

      <div ref="menuRef" class="topbar-user-shell">
        <button class="user-pill" @click="showMenu = !showMenu">
          <div v-if="currentProfile?.photo" class="user-avatar-wrap">
            <img
              :src="currentProfile.photo"
              alt="Avatar"
              referrerpolicy="no-referrer"
              class="user-avatar"
            />
          </div>
          <div v-else class="user-avatar-placeholder brand-text">
            {{ avatarLetter }}
          </div>
          <div class="user-info">
            <span class="user-name">
              {{ currentProfile?.firstName || t("admin.adminFallback") }}
            </span>
            <span class="user-role">
              {{ currentProfile?.role || t("admin.staffFallback") }}
            </span>
          </div>
          <span class="material-symbols-outlined chevron" :class="{ 'rotate-180': showMenu }">
            expand_more
          </span>
        </button>

        <Transition name="dropdown">
          <div v-if="showMenu" class="user-dropdown">
            <div class="dropdown-header">
              <div v-if="currentProfile?.photo" class="dropdown-avatar-wrap">
                <img :src="currentProfile.photo" alt="Avatar" class="dropdown-avatar" />
              </div>
              <div v-else class="dropdown-avatar-placeholder brand-text">
                {{ avatarLetter }}
              </div>
              <div>
                <p class="dropdown-name">
                  {{ currentProfile?.firstName }} {{ currentProfile?.lastName }}
                </p>
                <p class="dropdown-email">{{ currentProfile?.email }}</p>
              </div>
            </div>
            <div class="dropdown-divider"></div>
            <NuxtLink to="/admin" class="dropdown-item" @click="showMenu = false">
              <span class="material-symbols-outlined">dashboard</span>
              {{ t("admin.dashboard") }}
            </NuxtLink>
            <NuxtLink to="/admin/settings" class="dropdown-item" @click="showMenu = false">
              <span class="material-symbols-outlined">settings</span>
              {{ t("admin.settings") }}
            </NuxtLink>
            <div class="dropdown-divider"></div>
            <NuxtLink to="/" class="dropdown-item" @click="showMenu = false">
              <span class="material-symbols-outlined">open_in_new</span>
              {{ t("admin.viewSite") }}
            </NuxtLink>
            <button type="button" class="dropdown-item dropdown-item--danger" @click="handleLogout">
              <span class="material-symbols-outlined">logout</span>
              {{ t("admin.signOut") }}
            </button>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useAuth } from "~/composables/useAuth";

const { currentProfile, logout } = useAuth();
const { t } = useAppI18n();
const sidebarOpen = useState<boolean>("admin-sidebar-open", () => false);
const searchQuery = ref("");
const showMenu = ref(false);
const notifCount = ref(3);
const menuRef = ref<HTMLElement | null>(null);

const avatarLetter = computed(() => {
  const first = currentProfile.value?.firstName?.trim().charAt(0).toUpperCase() || "";
  const last = currentProfile.value?.lastName?.trim().charAt(0).toUpperCase() || "";
  return (first + last) || "A";
});

function handleLogout() {
  logout();
  showMenu.value = false;
  navigateTo("/login");
}

function handleSearch() {
  // Placeholder for future admin search wiring.
}

function handleDocumentClick(event: MouseEvent) {
  const target = event.target as Node | null;
  if (!target) {
    return;
  }

  if (menuRef.value && !menuRef.value.contains(target)) {
    showMenu.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", handleDocumentClick);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleDocumentClick);
});
</script>

<style scoped>
.admin-topbar {
  position: sticky;
  top: 0;
  z-index: 35;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 4.35rem;
  padding: 0.85rem clamp(1rem, 3vw, 2rem);
  background: var(--topbar-bg);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--topbar-border);
  box-shadow: var(--shadow-sm);
}

.admin-topbar__start {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  flex: 1;
  min-width: 0;
}

.admin-topbar__menu-btn {
  display: inline-flex;
}

.topbar-search {
  position: relative;
  width: min(100%, 23rem);
  display: flex;
  align-items: center;
  min-width: 0;
}

.search-icon {
  position: absolute;
  inset-inline-start: 0.85rem;
  font-size: 1.15rem;
  color: var(--color-text-muted);
  pointer-events: none;
}

.search-input {
  width: 100%;
  min-height: 2.55rem;
  padding: 0 0.95rem 0 2.5rem;
  background-color: var(--input-bg);
  border: 1px solid var(--input-border);
  border-radius: var(--radius-xl);
  color: var(--input-text);
  outline: none;
  transition:
    border-color var(--duration-fast) var(--easing-standard),
    box-shadow var(--duration-fast) var(--easing-standard),
    background-color var(--duration-fast) var(--easing-standard);
}

.search-input::placeholder {
  color: var(--input-placeholder);
}

.search-input:focus {
  border-color: var(--input-focus-border);
  box-shadow: var(--shadow-focus);
}

.topbar-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.55rem;
  flex-wrap: wrap;
}

.topbar-switchers {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  flex-wrap: wrap;
}

.topbar-user-shell {
  position: relative;
}

.topbar-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.55rem;
  height: 2.55rem;
  border-radius: 999px;
  border: 1px solid var(--color-border-soft);
  background: var(--color-surface);
  color: var(--color-text-secondary);
  cursor: pointer;
  text-decoration: none;
  position: relative;
  transition:
    background-color var(--duration-fast) var(--easing-standard),
    color var(--duration-fast) var(--easing-standard),
    border-color var(--duration-fast) var(--easing-standard);
}

.topbar-icon-btn:hover {
  background: var(--color-surface-secondary);
  color: var(--color-primary-600);
  border-color: color-mix(in srgb, var(--color-primary-400) 45%, transparent);
}

.topbar-icon-btn .material-symbols-outlined {
  font-size: 1.2rem;
}

.notification-btn {
  position: relative;
}

.notif-badge {
  position: absolute;
  top: 0.15rem;
  inset-inline-end: 0.15rem;
  min-width: 1rem;
  height: 1rem;
  padding-inline: 0.2rem;
  border-radius: 999px;
  background: var(--color-danger-500);
  color: var(--color-white);
  font-size: 0.62rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--topbar-bg);
}

.topbar-divider {
  width: 1px;
  height: 1.6rem;
  background: var(--color-border);
  margin-inline: 0.15rem;
}

.user-pill {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.28rem 0.85rem 0.28rem 0.28rem;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-surface);
  cursor: pointer;
  transition:
    border-color var(--duration-fast) var(--easing-standard),
    box-shadow var(--duration-fast) var(--easing-standard),
    background-color var(--duration-fast) var(--easing-standard);
}

.user-pill:hover {
  border-color: color-mix(in srgb, var(--color-primary-400) 45%, transparent);
  box-shadow: var(--shadow-sm);
}

.user-avatar-wrap,
.user-avatar-placeholder {
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  overflow: hidden;
  flex-shrink: 0;
}

.user-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-avatar-placeholder {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary-500);
  color: var(--color-white);
  font-size: 0.7rem;
  font-weight: 800;
}

.user-info {
  display: flex;
  flex-direction: column;
  text-align: start;
  line-height: 1.2;
}

.user-name {
  color: var(--color-text-primary);
  font-size: 0.88rem;
  font-weight: 800;
}

.user-role {
  color: var(--color-text-muted);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.chevron {
  font-size: 1.05rem;
  color: var(--color-text-muted);
  transition: transform var(--duration-fast) var(--easing-standard);
}

.rotate-180 {
  transform: rotate(180deg);
}

.user-dropdown {
  position: absolute;
  top: calc(100% + 0.65rem);
  inset-inline-end: 0;
  min-width: 15rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border-soft);
  border-radius: 1rem;
  box-shadow: var(--shadow-dropdown);
  padding: 0.45rem;
  z-index: var(--z-dropdown);
}

.dropdown-header {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem 0.85rem 0.65rem;
}

.dropdown-avatar-wrap,
.dropdown-avatar-placeholder {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 999px;
  overflow: hidden;
  flex-shrink: 0;
}

.dropdown-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.dropdown-avatar-placeholder {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary-500);
  color: var(--color-white);
  font-size: 0.85rem;
  font-weight: 800;
}

.dropdown-name,
.dropdown-email {
  margin: 0;
}

.dropdown-name {
  color: var(--color-heading);
  font-size: 0.95rem;
  font-weight: 800;
}

.dropdown-email {
  color: var(--color-text-muted);
  font-size: 0.82rem;
}

.dropdown-divider {
  height: 1px;
  background: var(--color-border-soft);
  margin: 0.35rem 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 0.85rem;
  border-radius: 0.8rem;
  text-decoration: none;
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--color-text-primary);
  background: none;
  border: none;
  cursor: pointer;
  text-align: start;
  transition:
    background-color var(--duration-fast) var(--easing-standard),
    color var(--duration-fast) var(--easing-standard);
}

.dropdown-item .material-symbols-outlined {
  font-size: 1.15rem;
  color: var(--color-text-muted);
}

.dropdown-item:hover {
  background: color-mix(in srgb, var(--color-primary-500) 9%, transparent);
  color: var(--color-primary-700);
}

.dropdown-item--danger {
  color: var(--color-danger-600);
}

.dropdown-item--danger:hover {
  background: var(--alert-danger-bg);
  color: var(--color-danger-700);
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}

@media (min-width: 1024px) {
  .admin-topbar__menu-btn {
    display: none;
  }
}

@media (max-width: 860px) {
  .admin-topbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .admin-topbar__start,
  .topbar-actions {
    width: 100%;
  }

  .topbar-actions {
    justify-content: space-between;
  }

  .topbar-switchers {
    width: 100%;
  }
}

@media (max-width: 640px) {
  .topbar-search {
    width: 100%;
  }

  .topbar-switchers {
    display: grid;
    grid-template-columns: 1fr;
  }

  .topbar-divider {
    display: none;
  }

  .user-info {
    display: none;
  }
}
</style>
