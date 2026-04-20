<template>
  <AppCard class="offer-card" variant="default" hoverable clickable @click="navigateTo(`/hotels/${offer.hotelId}`)">
    <template #image>
      <img :src="offer.image || fallbackImage" :alt="offer.title" loading="lazy" />
      <div class="offer-card__badge">
        <AppBadge color="warning" size="md">Save {{ offer.discountRate }}%</AppBadge>
      </div>
    </template>

    <template #default>
      <div class="offer-card__eyebrow">Seasonal package</div>
      <h3 class="offer-card__title">{{ offer.title }}</h3>
      <p class="offer-card__desc">{{ truncatedDescription }}</p>
      <div class="offer-card__dates">
        <span class="material-symbols-outlined">calendar_month</span>
        <span>{{ formatDate(offer.startDate) }} - {{ formatDate(offer.endDate) }}</span>
      </div>
    </template>

    <template #footer>
      <div class="offer-card__footer">
        <span class="offer-card__value">Limited availability</span>
        <span class="offer-card__cta">
          Explore
          <span class="material-symbols-outlined">arrow_forward</span>
        </span>
      </div>
    </template>
  </AppCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Offer } from '~/types/models'

const props = defineProps<{ offer: Offer }>()

const fallbackImage =
  'https://images.unsplash.com/photo-1540541338287-41700ceee514?auto=format&fit=crop&q=80&w=1200'

const truncatedDescription = computed(() => {
  const description = props.offer.description || ''
  return description.length > 88 ? `${description.substring(0, 88)}...` : description
})

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
</script>

<style scoped>
:deep(.offer-card.app-card) {
  border-radius: 24px;
  border: 1px solid rgba(225, 232, 240, 0.95);
  background: #ffffff;
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.06);
}

:deep(.offer-card.app-card:hover) {
  border-color: rgba(188, 201, 200, 0.9);
  box-shadow: 0 22px 44px rgba(15, 23, 42, 0.1);
}

:deep(.offer-card .app-card__image) {
  position: relative;
}

:deep(.offer-card .app-card__image img) {
  height: 170px;
}

:deep(.offer-card .app-card__body) {
  padding: 16px 16px 14px;
}

:deep(.offer-card .app-card__footer) {
  padding: 0 16px 16px;
  border-top: 1px solid #eef2f6;
  padding-top: 14px;
}

.offer-card__badge {
  position: absolute;
  top: 12px;
  left: 12px;
}

.offer-card__eyebrow {
  margin-bottom: 8px;
  color: #64748b;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.14em;
}

.offer-card__title {
  margin: 0 0 8px;
  color: #0f172a;
  font-size: 18px;
  line-height: 1.18;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.offer-card__desc {
  margin: 0;
  color: #475569;
  font-size: 13px;
  line-height: 1.6;
  min-height: 62px;
}

.offer-card__dates {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
  color: #64748b;
  font-size: 12px;
  font-weight: 600;
}

.offer-card__dates .material-symbols-outlined {
  font-size: 16px;
}

.offer-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.offer-card__value {
  color: #64748b;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.offer-card__cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--color-primary-700);
  font-size: 13px;
  font-weight: 800;
}

.offer-card__cta .material-symbols-outlined {
  font-size: 16px;
}
</style>
