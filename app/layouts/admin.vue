<template>
  <div class="admin-shell">
    <button
      v-if="sidebarOpen"
      class="admin-shell__overlay"
      aria-label="Close navigation"
      @click="sidebarOpen = false"
    ></button>

    <aside :class="['admin-sidebar', { 'admin-sidebar--open': sidebarOpen }]">
      <div class="admin-sidebar__brand">
        <NuxtLink to="/admin" class="admin-sidebar__brand-link" @click="sidebarOpen = false">
          <img
            :src="brandLogoUrl"
            alt=""
            class="admin-sidebar__brand-logo"
            aria-hidden="true"
          />
          <h1 class="admin-sidebar__brand-title">VoyageHub</h1>
        </NuxtLink>
      </div>

      <nav class="admin-sidebar__nav" id="sidebar-nav">
        <section v-for="group in navGroups" :key="group.label" class="admin-sidebar__group">
          <p class="nav-group-label">{{ group.label }}</p>
          <NuxtLink
            v-for="item in group.items"
            :key="item.to"
            :to="item.to"
            class="nav-item"
            active-class="nav-active"
            :exact-active-class="item.exact ? 'nav-active' : undefined"
            @click="sidebarOpen = false"
          >
            <span class="material-symbols-outlined">{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </NuxtLink>
        </section>
      </nav>

      <div class="admin-sidebar__footer">
        <NuxtLink to="/" class="nav-item" @click="sidebarOpen = false">
          <span class="material-symbols-outlined">open_in_new</span>
          <span>{{ t("admin.viewSite") }}</span>
        </NuxtLink>
        <button type="button" class="nav-item nav-item--danger" @click="handleLogout">
          <span class="material-symbols-outlined">logout</span>
          <span>{{ t("admin.signOut") }}</span>
        </button>
      </div>
    </aside>

    <div class="admin-canvas">
      <AdminTopbar />
      <main class="admin-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import { useRoute } from "vue-router";
import { useAuth } from "~/composables/useAuth";

const runtimeConfig = useRuntimeConfig();
const route = useRoute();
const { logout } = useAuth();
const { t } = useAppI18n();
const sidebarOpen = useState<boolean>("admin-sidebar-open", () => false);
const brandLogoUrl = `${runtimeConfig.app.baseURL}logo.png`;

const navGroups = computed(() => [
  {
    label: t("admin.overview"),
    items: [
      { to: "/admin", label: t("admin.dashboard"), icon: "dashboard", exact: true },
      { to: "/admin/stats", label: t("admin.statistics"), icon: "bar_chart" },
      { to: "/admin/reports", label: t("admin.financialReports"), icon: "receipt_long" },
    ],
  },
  {
    label: t("admin.operations"),
    items: [
      { to: "/admin/hotels", label: t("admin.hotels"), icon: "hotel" },
      { to: "/admin/reservations", label: t("admin.reservations"), icon: "calendar_month" },
      { to: "/admin/partners", label: t("admin.partners"), icon: "handshake" },
      { to: "/admin/offers", label: t("admin.offers"), icon: "sell" },
      { to: "/admin/complaints", label: t("admin.complaints"), icon: "forum" },
    ],
  },
  {
    label: t("admin.people"),
    items: [
      { to: "/admin/users", label: t("admin.users"), icon: "group" },
      { to: "/admin/notifications", label: t("admin.notifications"), icon: "notifications" },
    ],
  },
  {
    label: t("admin.system"),
    items: [
      { to: "/admin/roles", label: t("admin.rolesAccess"), icon: "manage_accounts" },
      { to: "/admin/settings", label: t("admin.settings"), icon: "settings" },
      { to: "/admin/audit", label: t("admin.auditLogs"), icon: "policy" },
      { to: "/admin/integrations", label: t("admin.apiIntegrations"), icon: "extension" },
    ],
  },
]);

function handleLogout() {
  sidebarOpen.value = false;
  logout();
  navigateTo("/login");
}

watch(
  () => route.fullPath,
  () => {
    sidebarOpen.value = false;
  },
);
</script>

<style scoped>
.admin-shell {
  min-height: 100vh;
  background: var(--color-bg-soft);
  color: var(--color-text);
}

.admin-shell__overlay {
  position: fixed;
  inset: 0;
  z-index: 40;
  border: 0;
  background: var(--color-overlay);
}

.admin-sidebar {
  position: fixed;
  inset-block: 0;
  inset-inline-start: 0;
  z-index: 45;
  width: min(16rem, calc(100vw - 2rem));
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background: var(--sidebar-bg);
  box-shadow: var(--shadow-xl);
  transform: translateX(-100%);
  transition: transform var(--duration-normal) var(--easing-standard);
}

.admin-sidebar--open {
  transform: translateX(0);
}

.admin-sidebar__brand {
  padding: 1.35rem 1.25rem 1rem;
  border-bottom: 1px solid color-mix(in srgb, var(--color-primary-400) 48%, transparent);
}

.admin-sidebar__brand-link {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
}

.admin-sidebar__brand-logo {
  width: 2rem;
  height: 2rem;
  object-fit: contain;
  filter: brightness(0) invert(1);
}

.admin-sidebar__brand-title {
  margin: 0;
  color: var(--color-white);
  font-size: 1.1rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.admin-sidebar__nav {
  flex: 1;
  padding: 0.75rem 0.6rem 1rem;
}

.admin-sidebar__group + .admin-sidebar__group {
  margin-top: 0.5rem;
}

.admin-sidebar__footer {
  padding: 1rem 0.75rem 1.15rem;
  border-top: 1px solid color-mix(in srgb, var(--color-primary-400) 48%, transparent);
}

.admin-canvas {
  min-height: 100vh;
}

.admin-content {
  padding: clamp(1rem, 2.5vw, 1.75rem);
}

.nav-group-label {
  margin: 1rem 0.65rem 0.45rem;
  color: rgb(255 255 255 / 0.62);
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.nav-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.78rem 0.95rem;
  margin-bottom: 0.25rem;
  border: 0;
  border-radius: 0.9rem;
  background: transparent;
  color: var(--sidebar-text);
  font-size: 0.88rem;
  font-weight: 600;
  text-decoration: none;
  text-align: start;
  cursor: pointer;
  transition:
    background-color var(--duration-fast) var(--easing-standard),
    color var(--duration-fast) var(--easing-standard),
    transform var(--duration-fast) var(--easing-standard);
}

.nav-item:hover {
  background: var(--sidebar-hover-bg);
  color: var(--color-white);
  transform: translateX(2px);
}

.nav-item .material-symbols-outlined {
  font-size: 1.2rem;
}

.nav-active {
  background: var(--sidebar-active-bg);
  color: var(--color-white);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.06);
}

.nav-item--danger:hover {
  background: var(--alert-danger-bg);
  color: var(--color-danger-200);
}

html[dir='rtl'] .admin-sidebar {
  inset-inline-start: auto;
  inset-inline-end: 0;
  transform: translateX(100%);
}

html[dir='rtl'] .admin-sidebar--open {
  transform: translateX(0);
}

@media (min-width: 1024px) {
  .admin-shell__overlay {
    display: none;
  }

  .admin-sidebar {
    transform: none;
  }

  .admin-canvas {
    margin-inline-start: 16rem;
  }

  html[dir='rtl'] .admin-canvas {
    margin-inline-start: 0;
    margin-inline-end: 16rem;
  }
}
</style>
