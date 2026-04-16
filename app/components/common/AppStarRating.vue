<template>
  <div class="star-rating">
    <i
      v-for="star in 5"
      :key="star"
      :class="star <= rating ? 'pi pi-star-fill' : 'pi pi-star'"
      class="star"
      :style="{ color: star <= rating ? 'var(--color-accent-500)' : 'var(--color-neutral-300)' }"
    ></i>
    <span v-if="showCount" class="star-count">({{ count }})</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  rating: number
  count?: number
  showCount?: boolean
}>()
</script>

<style scoped>
.star-rating { display: inline-flex; align-items: center; gap: 2px; }
.star { font-size: 0.9rem; }
.star-count { margin-left: var(--spacing-1); font-size: var(--font-size-xs); color: var(--color-text-muted); }
</style>
