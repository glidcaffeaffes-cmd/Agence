<template>
  <AppCard variant="default" hoverable clickable @click="navigateTo(`/hotels/${hotel.id}`)">
    <template #image>
      <img :src="hotel.images[0]" :alt="hotel.name" loading="lazy" />
      <div class="hotel-card__overlay">
        <AppBadge color="primary" size="sm">{{ hotel.stars }} ★</AppBadge>
      </div>
    </template>
    <template #default>
      <div class="hotel-card__content">
        <div class="hotel-card__location">
          <i class="pi pi-map-marker"></i>
          {{ hotel.city }}, {{ hotel.country }}
        </div>
        <h3 class="hotel-card__name">{{ hotel.name }}</h3>
        <p class="hotel-card__desc">{{ truncatedDesc }}</p>
        <div class="hotel-card__amenities">
          <span v-for="amenity in hotel.amenities.slice(0, 3)" :key="amenity" class="amenity-tag">{{ amenity }}</span>
          <span v-if="hotel.amenities.length > 3" class="amenity-more">+{{ hotel.amenities.length - 3 }}</span>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="hotel-card__footer">
        <div class="hotel-card__rating">
          <AppStarRating :rating="hotel.stars" />
        </div>
        <div class="hotel-card__price">
          <span class="price-from">from</span>
          <span class="price-value">€{{ minPrice }}</span>
          <span class="price-unit">/night</span>
        </div>
      </div>
    </template>
  </AppCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Hotel } from '~/types/models'

const props = defineProps<{ hotel: Hotel; minPrice?: number }>()

const truncatedDesc = computed(() => {
  const d = props.hotel.description
  return d.length > 120 ? d.substring(0, 120) + '...' : d
})
</script>

<style scoped>
.hotel-card__overlay {
  position: absolute;
  top: var(--spacing-3);
  right: var(--spacing-3);
}
:deep(.app-card__image) { position: relative; }

.hotel-card__content { display: flex; flex-direction: column; gap: var(--spacing-2); }
.hotel-card__location {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
}
.hotel-card__name {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}
.hotel-card__desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin: 0;
}

.hotel-card__amenities {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-1);
  margin-top: var(--spacing-1);
}
.amenity-tag {
  padding: 2px var(--spacing-2);
  border-radius: var(--radius-sm);
  background: var(--color-surface-secondary);
  font-size: 0.65rem;
  color: var(--color-text-secondary);
  font-weight: 500;
}
.amenity-more {
  padding: 2px var(--spacing-2);
  font-size: 0.65rem;
  color: var(--color-primary-500);
  font-weight: 600;
}

.hotel-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hotel-card__price { display: flex; align-items: baseline; gap: 4px; }
.price-from { font-size: var(--font-size-xs); color: var(--color-text-muted); }
.price-value { font-size: var(--font-size-lg); font-weight: 700; color: var(--color-primary-600); font-family: var(--font-family-heading); }
.price-unit { font-size: var(--font-size-xs); color: var(--color-text-muted); }
</style>
