<template>
  <aside class="admin-sidebar" :class="{ 'admin-sidebar--collapsed': collapsed }">
    <div class="sidebar-header">
      <NuxtLink to="/admin" class="sidebar-brand">
        <span class="brand-icon">✈</span>
        <span v-if="!collapsed" class="brand-text">Voyage<span class="brand-accent">Hub</span></span>
      </NuxtLink>
      <button v-if="!collapsed" class="sidebar-collapse-btn" @click="$emit('toggle')">
        <i class="pi pi-angle-double-left"></i>
      </button>
    </div>

    <nav class="sidebar-nav">
      <div class="nav-section">
        <span v-if="!collapsed" class="nav-section-label">Overview</span>
        <NuxtLink to="/admin" class="sidebar-link" active-class="sidebar-link--active" :title="collapsed ? 'Dashboard' : undefined">
          <i class="pi pi-th-large"></i>
          <span v-if="!collapsed">Dashboard</span>
        </NuxtLink>
        <NuxtLink to="/admin/statistics" class="sidebar-link" active-class="sidebar-link--active" :title="collapsed ? 'Statistics' : undefined">
          <i class="pi pi-chart-bar"></i>
          <span v-if="!collapsed">Statistics</span>
        </NuxtLink>
      </div>

      <div class="nav-section">
        <span v-if="!collapsed" class="nav-section-label">Management</span>
        <NuxtLink to="/admin/hotels" class="sidebar-link" active-class="sidebar-link--active">
          <i class="pi pi-building"></i>
          <span v-if="!collapsed">Hotels</span>
        </NuxtLink>
        <NuxtLink to="/admin/reservations" class="sidebar-link" active-class="sidebar-link--active">
          <i class="pi pi-calendar"></i>
          <span v-if="!collapsed">Reservations</span>
        </NuxtLink>
        <NuxtLink to="/admin/partners" class="sidebar-link" active-class="sidebar-link--active">
          <i class="pi pi-users"></i>
          <span v-if="!collapsed">Partners</span>
        </NuxtLink>
        <NuxtLink to="/admin/offers" class="sidebar-link" active-class="sidebar-link--active">
          <i class="pi pi-tag"></i>
          <span v-if="!collapsed">Offers</span>
        </NuxtLink>
        <NuxtLink to="/admin/complaints" class="sidebar-link" active-class="sidebar-link--active">
          <i class="pi pi-exclamation-circle"></i>
          <span v-if="!collapsed">Complaints</span>
        </NuxtLink>
        <NuxtLink to="/admin/users" class="sidebar-link" active-class="sidebar-link--active">
          <i class="pi pi-user"></i>
          <span v-if="!collapsed">Users</span>
        </NuxtLink>
      </div>

      <div class="nav-section">
        <span v-if="!collapsed" class="nav-section-label">System</span>
        <NuxtLink to="/admin/reports" class="sidebar-link" active-class="sidebar-link--active">
          <i class="pi pi-dollar"></i>
          <span v-if="!collapsed">Financial Reports</span>
        </NuxtLink>
        <NuxtLink to="/admin/settings" class="sidebar-link" active-class="sidebar-link--active">
          <i class="pi pi-cog"></i>
          <span v-if="!collapsed">Settings</span>
        </NuxtLink>
        <NuxtLink to="/admin/roles" class="sidebar-link" active-class="sidebar-link--active">
          <i class="pi pi-shield"></i>
          <span v-if="!collapsed">Access & Roles</span>
        </NuxtLink>
        <NuxtLink to="/admin/audit-logs" class="sidebar-link" active-class="sidebar-link--active">
          <i class="pi pi-list"></i>
          <span v-if="!collapsed">Audit Logs</span>
        </NuxtLink>
        <NuxtLink to="/admin/integrations" class="sidebar-link" active-class="sidebar-link--active">
          <i class="pi pi-link"></i>
          <span v-if="!collapsed">Integrations</span>
        </NuxtLink>
        <NuxtLink to="/admin/notifications" class="sidebar-link" active-class="sidebar-link--active">
          <i class="pi pi-envelope"></i>
          <span v-if="!collapsed">Notifications</span>
        </NuxtLink>
      </div>
    </nav>

    <div class="sidebar-footer">
      <NuxtLink to="/" class="sidebar-link">
        <i class="pi pi-arrow-left"></i>
        <span v-if="!collapsed">Back to Site</span>
      </NuxtLink>
    </div>
  </aside>
</template>

<script setup lang="ts">
defineProps<{ collapsed: boolean }>()
defineEmits(['toggle'])
</script>

<style scoped>
.admin-sidebar {
  width: 260px;
  min-height: 100vh;
  background: var(--color-neutral-900);
  color: var(--color-neutral-300);
  display: flex;
  flex-direction: column;
  transition: width var(--motion-duration-normal) var(--motion-ease-default);
  overflow: hidden;
}
.admin-sidebar--collapsed { width: 72px; }

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-5) var(--spacing-4);
  border-bottom: 1px solid var(--color-neutral-700);
}
.sidebar-brand {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  text-decoration: none;
}
.sidebar-brand .brand-icon { font-size: 1.4rem; }
.sidebar-brand .brand-text { font-size: var(--font-size-base); font-weight: 700; color: white; white-space: nowrap; font-family: var(--font-family-heading) !important; }
.sidebar-brand .brand-accent { color: var(--color-primary-400); }

.sidebar-collapse-btn {
  background: none;
  border: none;
  color: var(--color-neutral-500);
  cursor: pointer;
  padding: var(--spacing-1);
  border-radius: var(--radius-md);
  transition: all var(--motion-duration-fast) var(--motion-ease-default);
}
.sidebar-collapse-btn:hover { color: white; background: var(--color-neutral-700); }

.sidebar-nav {
  flex: 1;
  padding: var(--spacing-4) var(--spacing-3);
  overflow-y: auto;
}

.nav-section { margin-bottom: var(--spacing-4); }
.nav-section-label {
  display: block;
  padding: var(--spacing-1) var(--spacing-3);
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-neutral-500);
  margin-bottom: var(--spacing-1);
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--radius-md);
  text-decoration: none;
  font-size: var(--font-size-sm);
  color: var(--color-neutral-400);
  transition: all var(--motion-duration-fast) var(--motion-ease-default);
  white-space: nowrap;
}
.sidebar-link:hover { color: white; background: var(--color-neutral-800); }
.sidebar-link--active { color: white; background: var(--color-primary-600); }
.sidebar-link i { font-size: 1rem; width: 20px; text-align: center; flex-shrink: 0; }

.sidebar-footer {
  padding: var(--spacing-4) var(--spacing-3);
  border-top: 1px solid var(--color-neutral-700);
}
</style>
