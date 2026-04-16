<template>
  <div class="app-empty-state">
    <div class="empty-icon-wrap">
      <i :class="icon" class="empty-icon"></i>
    </div>
    <h3 class="empty-title">{{ title }}</h3>
    <p v-if="description" class="empty-description">{{ description }}</p>
    <slot name="action" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon?: string
  title: string
  description?: string
}>()
</script>

<style scoped>
.app-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-12) var(--spacing-6);
  text-align: center;
}
.empty-icon-wrap {
  width: 80px; height: 80px;
  border-radius: var(--radius-full);
  background: var(--color-surface-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-4);
}
.empty-icon { font-size: 2rem; color: var(--color-text-muted); }
.empty-title { font-size: var(--font-size-lg); font-weight: 600; color: var(--color-text-primary); margin-bottom: var(--spacing-2); }
.empty-description { font-size: var(--font-size-sm); color: var(--color-text-muted); max-width: 360px; }
</style>
