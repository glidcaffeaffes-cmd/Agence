<template>
  <header class="admin-topbar">
    <button class="topbar-toggle" @click="$emit('toggle-sidebar')">
      <i class="pi pi-bars"></i>
    </button>

    <div class="topbar-breadcrumb">
      <slot name="breadcrumb">
        <span class="breadcrumb-text">{{ pageTitle }}</span>
      </slot>
    </div>

    <div class="topbar-actions">
      <button class="topbar-icon-btn" title="Notifications">
        <i class="pi pi-bell"></i>
        <span class="topbar-badge">3</span>
      </button>
      <div class="topbar-user">
        <img src="https://i.pravatar.cc/36?u=admin" alt="Admin" class="topbar-avatar" />
        <div class="topbar-user-info">
          <span class="topbar-user-name">Admin</span>
          <span class="topbar-user-role">Super Admin</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{ pageTitle?: string }>()
defineEmits(['toggle-sidebar'])
</script>

<style scoped>
.admin-topbar {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  padding: var(--spacing-3) var(--spacing-6);
  background: var(--color-surface-primary);
  border-bottom: 1px solid var(--color-border);
  min-height: 60px;
}

.topbar-toggle {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: var(--color-text-secondary);
  padding: var(--spacing-2);
  border-radius: var(--radius-md);
  transition: all var(--motion-duration-fast) var(--motion-ease-default);
}
.topbar-toggle:hover { background: var(--color-surface-secondary); color: var(--color-text-primary); }

.topbar-breadcrumb { flex: 1; }
.breadcrumb-text { font-size: var(--font-size-lg); font-weight: 600; color: var(--color-text-primary); }

.topbar-actions { display: flex; align-items: center; gap: var(--spacing-4); }

.topbar-icon-btn {
  position: relative;
  background: none;
  border: none;
  padding: var(--spacing-2);
  border-radius: var(--radius-full);
  cursor: pointer;
  color: var(--color-text-secondary);
  transition: all var(--motion-duration-fast) var(--motion-ease-default);
}
.topbar-icon-btn:hover { background: var(--color-surface-secondary); color: var(--color-primary-600); }
.topbar-badge {
  position: absolute;
  top: 0; right: 0;
  width: 16px; height: 16px;
  border-radius: var(--radius-full);
  background: var(--color-accent-500);
  color: white;
  font-size: 0.6rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.topbar-user { display: flex; align-items: center; gap: var(--spacing-3); }
.topbar-avatar { width: 36px; height: 36px; border-radius: var(--radius-full); object-fit: cover; }
.topbar-user-info { display: flex; flex-direction: column; }
.topbar-user-name { font-size: var(--font-size-sm); font-weight: 600; color: var(--color-text-primary); }
.topbar-user-role { font-size: var(--font-size-xs); color: var(--color-text-muted); }
</style>
