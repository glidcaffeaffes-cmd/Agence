<template>
  <AppCard variant="default" hoverable clickable @click="navigateTo(`/hotels/${offer.hotelId}`)">
    <template #image>
      <img :src="offer.image || 'https://images.unsplash.com/photo-1540541338287-41700ceee514?w=800'" :alt="offer.title" loading="lazy" />
      <div class="offer-card__badge">
        <AppBadge color="warning" size="md">-{{ offer.discountRate }}%</AppBadge>
      </div>
    </template>
    <template #default>
      <h3 class="offer-card__title">{{ offer.title }}</h3>
      <p class="offer-card__desc">{{ offer.description }}</p>
      <div class="offer-card__dates">
        <i class="pi pi-calendar"></i>
        {{ formatDate(offer.startDate) }} — {{ formatDate(offer.endDate) }}
      </div>
    </template>
  </AppCard>
</template>

<script setup lang="ts">
import type { Offer } from '~/types/models'

defineProps<{ offer: Offer }>()

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
</script>

<style scoped>
:deep(.app-card__image) { position: relative; }
.offer-card__badge { position: absolute; top: var(--spacing-3); left: var(--spacing-3); }
.offer-card__title { font-family: var(--font-family-heading); font-size: var(--font-size-base); font-weight: 600; color: var(--color-text-primary); margin: 0 0 var(--spacing-2); }
.offer-card__desc { font-size: var(--font-size-sm); color: var(--color-text-secondary); line-height: 1.5; margin: 0; }
.offer-card__dates { display: flex; align-items: center; gap: var(--spacing-2); font-size: var(--font-size-xs); color: var(--color-text-muted); margin-top: var(--spacing-3); }
</style>
