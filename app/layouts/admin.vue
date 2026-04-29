<template>
  <div class="bg-surface text-on-surface antialiased min-h-screen">
    <!-- SideNavBar -->
    <aside class="admin-sidebar h-screen w-64 fixed left-0 top-0 z-50 flex flex-col overflow-y-auto">
      <!-- Brand -->
      <div class="px-6 py-5 flex-shrink-0 border-b mb-2" style="border-color: var(--color-primary-500);">
        <div class="flex items-center gap-2">
          <img :src="brandLogoUrl" alt="" class="h-8 w-8 rounded-lg object-contain brightness-0 invert" aria-hidden="true" />
          <h1 class="text-lg font-bold tracking-tight" style="color: var(--color-white);">VoyageHub</h1>
        </div>
      </div>

      <nav class="flex-1 px-2 pb-4" id="sidebar-nav">
        <!-- Overview -->
        <p class="nav-group-label">Overview</p>
        <NuxtLink to="/admin" exact active-class="nav-active" class="nav-item">
          <span class="material-symbols-outlined">dashboard</span>
          <span>Dashboard</span>
        </NuxtLink>
        <NuxtLink to="/admin/stats" active-class="nav-active" class="nav-item">
          <span class="material-symbols-outlined">bar_chart</span>
          <span>Statistics</span>
        </NuxtLink>
        <NuxtLink to="/admin/reports" active-class="nav-active" class="nav-item">
          <span class="material-symbols-outlined">receipt_long</span>
          <span>Financial Reports</span>
        </NuxtLink>

        <!-- Operations -->
        <p class="nav-group-label">Operations</p>
        <NuxtLink to="/admin/hotels" active-class="nav-active" class="nav-item">
          <span class="material-symbols-outlined">hotel</span>
          <span>Hotels</span>
        </NuxtLink>
        <NuxtLink to="/admin/reservations" active-class="nav-active" class="nav-item">
          <span class="material-symbols-outlined">calendar_month</span>
          <span>Reservations</span>
        </NuxtLink>
        <NuxtLink to="/admin/partners" active-class="nav-active" class="nav-item">
          <span class="material-symbols-outlined">handshake</span>
          <span>Partners</span>
        </NuxtLink>
        <NuxtLink to="/admin/offers" active-class="nav-active" class="nav-item">
          <span class="material-symbols-outlined">sell</span>
          <span>Offers</span>
        </NuxtLink>
        <NuxtLink to="/admin/complaints" active-class="nav-active" class="nav-item">
          <span class="material-symbols-outlined">forum</span>
          <span>Complaints</span>
        </NuxtLink>

        <!-- People -->
        <p class="nav-group-label">People</p>
        <NuxtLink to="/admin/users" active-class="nav-active" class="nav-item">
          <span class="material-symbols-outlined">group</span>
          <span>Users</span>
        </NuxtLink>
        <NuxtLink to="/admin/notifications" active-class="nav-active" class="nav-item">
          <span class="material-symbols-outlined">notifications</span>
          <span>Notifications</span>
        </NuxtLink>

        <!-- System -->
        <p class="nav-group-label">System</p>
        <NuxtLink to="/admin/roles" active-class="nav-active" class="nav-item">
          <span class="material-symbols-outlined">manage_accounts</span>
          <span>Roles & Access</span>
        </NuxtLink>
        <NuxtLink to="/admin/settings" active-class="nav-active" class="nav-item">
          <span class="material-symbols-outlined">settings</span>
          <span>Settings</span>
        </NuxtLink>
        <NuxtLink to="/admin/audit" active-class="nav-active" class="nav-item">
          <span class="material-symbols-outlined">policy</span>
          <span>Audit Logs</span>
        </NuxtLink>
        <NuxtLink to="/admin/integrations" active-class="nav-active" class="nav-item">
          <span class="material-symbols-outlined">extension</span>
          <span>API & Integrations</span>
        </NuxtLink>
      </nav>

      <!-- Footer -->
      <div class="px-4 pb-4 pt-4 border-t flex-shrink-0" style="border-color: var(--color-primary-500);">
        <NuxtLink to="/" class="nav-item">
          <span class="material-symbols-outlined">open_in_new</span>
          <span>View Site</span>
        </NuxtLink>
        <button type="button" class="nav-item nav-item--danger w-full text-left" @click="handleLogout">
          <span class="material-symbols-outlined">logout</span>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>

    <!-- Main Content Canvas -->
    <main class="ml-64 min-h-screen">
      <!-- Admin Topbar (autonomous from client layout) -->
      <AdminTopbar />


      <!-- Exact Page Output Slot -->
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

const runtimeConfig = useRuntimeConfig()
const brandLogoUrl = `${runtimeConfig.app.baseURL}logo.png`
const { logout } = useAuth()

function handleLogout() {
  logout()
  navigateTo('/login')
}
</script>

<style>
/* Base typography and scrollbars */
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #bcc9c8; border-radius: 10px; }

/* Sidebar Shell */
.admin-sidebar {
  background-color: var(--color-primary-600);
  box-shadow: var(--shadow-xl);
}

/* Sidebar Navigation Classes */
.nav-group-label {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--sidebar-text);
  opacity: 0.6;
  margin: var(--spacing-6) var(--spacing-4) var(--spacing-2);
}
.nav-item {
  display: flex; align-items: center; gap: var(--spacing-3);
  padding: var(--spacing-3) var(--spacing-4);
  margin-bottom: var(--spacing-1);
  color: var(--sidebar-text);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-md);
  transition: all var(--motion-duration-fast) var(--motion-ease-default);
  text-decoration: none;
}
.nav-item:hover {
  background-color: var(--color-primary-700);
  color: var(--color-white);
}
.nav-item .material-symbols-outlined {
  font-size: 1.25rem;
  transition: color var(--motion-duration-fast) ease;
}
.nav-active {
  background-color: var(--color-primary-800);
  color: var(--color-white);
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
}
.nav-active .material-symbols-outlined {
  color: var(--color-white);
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.nav-item--danger:hover {
  background-color: var(--alert-danger-bg) !important;
  color: var(--color-danger-600) !important;
}
.nav-item--danger:hover .material-symbols-outlined {
  color: var(--color-danger-600);
}
</style>
