<template>
  <div class="app-card" :class="[`app-card--${variant}`, { 'app-card--hoverable': hoverable, 'app-card--clickable': clickable }]" @click="clickable && $emit('click')">
    <div v-if="$slots.image" class="app-card__image">
      <slot name="image" />
    </div>
    <div v-if="$slots.header" class="app-card__header">
      <slot name="header" />
    </div>
    <div class="app-card__body">
      <slot />
    </div>
    <div v-if="$slots.footer" class="app-card__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost'
  hoverable?: boolean
  clickable?: boolean
}>()
defineEmits(['click'])
</script>

<style scoped>
.app-card {
  background: var(--color-surface-primary);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all var(--motion-duration-normal) var(--motion-ease-default);
}
.app-card--default { border: 1px solid var(--color-border); }
.app-card--elevated { box-shadow: var(--shadow-md); border: none; }
.app-card--outlined { border: 1px solid var(--color-border); background: transparent; }
.app-card--ghost { border: none; background: transparent; }

.app-card--hoverable:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
.app-card--clickable { cursor: pointer; }

.app-card__image { overflow: hidden; }
.app-card__image :deep(img) { width: 100%; height: 200px; object-fit: cover; display: block; transition: transform var(--motion-duration-slow) var(--motion-ease-default); }
.app-card--hoverable:hover .app-card__image :deep(img) { transform: scale(1.05); }

.app-card__header { padding: var(--spacing-4) var(--spacing-5) 0; }
.app-card__body { padding: var(--spacing-4) var(--spacing-5); }
.app-card__footer { padding: 0 var(--spacing-5) var(--spacing-4); border-top: 1px solid var(--color-border); padding-top: var(--spacing-4); margin-top: 0; }
</style>
