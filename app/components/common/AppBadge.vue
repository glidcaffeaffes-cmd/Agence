<template>
  <span class="app-badge" :class="[`app-badge--${color}`, `app-badge--${size}`]">
    <i v-if="icon" :class="icon" class="badge-icon"></i>
    <slot />
  </span>
</template>

<script setup lang="ts">
defineProps<{
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'muted'
  size?: 'sm' | 'md' | 'lg'
  icon?: string
}>()
</script>

<style scoped>
.app-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-1);
  border-radius: var(--radius-full);
  font-weight: 600;
  white-space: nowrap;
}
.app-badge--sm { padding: 2px var(--spacing-2); font-size: 0.65rem; }
.app-badge--md { padding: var(--spacing-1) var(--spacing-3); font-size: var(--font-size-xs); }
.app-badge--lg { padding: var(--spacing-2) var(--spacing-4); font-size: var(--font-size-sm); }

.app-badge--primary { background: var(--color-primary-100); color: var(--color-primary-700); }
.app-badge--success { background: #dcfce7; color: #15803d; }
.app-badge--warning { background: #fef3c7; color: #b45309; }
.app-badge--danger { background: #fee2e2; color: #dc2626; }
.app-badge--info { background: #dbeafe; color: #2563eb; }
.app-badge--muted { background: var(--color-neutral-100); color: var(--color-neutral-500); }

.badge-icon { font-size: 0.75em; }
</style>
