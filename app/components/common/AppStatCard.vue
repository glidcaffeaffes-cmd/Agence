<template>
  <div class="app-stat-card" :class="{ 'app-stat-card--accent': accent }">
    <div class="stat-icon-wrap" :style="iconBg">
      <i :class="icon" class="stat-icon"></i>
    </div>
    <div class="stat-content">
      <span class="stat-label">{{ label }}</span>
      <span class="stat-value">{{ formattedValue }}</span>
      <span v-if="trend" class="stat-trend" :class="trendClass">
        <i :class="trend > 0 ? 'pi pi-arrow-up' : 'pi pi-arrow-down'"></i>
        {{ Math.abs(trend) }}%
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  label: string
  value: number | string
  icon: string
  color?: string
  accent?: boolean
  trend?: number
  prefix?: string
  suffix?: string
}>()

const formattedValue = computed(() => {
  const v = typeof props.value === 'number'
    ? props.value.toLocaleString()
    : props.value
  return `${props.prefix || ''}${v}${props.suffix || ''}`
})

const iconBg = computed(() => ({
  background: props.color ? `${props.color}15` : 'var(--color-primary-50)',
  color: props.color || 'var(--color-primary-600)',
}))

const trendClass = computed(() => ({
  'stat-trend--up': props.trend && props.trend > 0,
  'stat-trend--down': props.trend && props.trend < 0,
}))
</script>

<style scoped>
.app-stat-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  padding: var(--spacing-5);
  background: var(--color-surface-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  transition: all var(--motion-duration-normal) var(--motion-ease-default);
}
.app-stat-card:hover { box-shadow: var(--shadow-sm); transform: translateY(-2px); }
.app-stat-card--accent { border-left: 4px solid var(--color-primary-500); }

.stat-icon-wrap {
  width: 48px; height: 48px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.stat-icon { font-size: 1.3rem; }

.stat-content { display: flex; flex-direction: column; gap: 2px; }
.stat-label { font-size: var(--font-size-xs); color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.04em; font-weight: 500; }
.stat-value { font-size: var(--font-size-xl); font-weight: 700; color: var(--color-text-primary); }
.stat-trend { font-size: var(--font-size-xs); font-weight: 600; display: flex; align-items: center; gap: 2px; }
.stat-trend--up { color: #16a34a; }
.stat-trend--down { color: #dc2626; }
</style>
