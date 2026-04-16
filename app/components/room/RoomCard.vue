<template>
  <AppCard class="room-card" variant="default">
    <div class="room-card__layout">
      <!-- Image Section -->
      <div class="room-card__image-wrap">
        <img :src="room.images[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600'" :alt="room.type" loading="lazy" />
      </div>

      <!-- Info Section -->
      <div class="room-card__info">
        <div class="room-card__header">
          <div>
            <div class="room-card__badge-row">
              <AppBadge v-if="room.isAvailable" color="success" size="sm">Available</AppBadge>
              <AppBadge v-else color="danger" size="sm">Booked</AppBadge>
              <span class="room-card__capacity">
                <i class="pi pi-users"></i> Up to {{ room.capacity }}
              </span>
            </div>
            <h3 class="room-card__title">{{ room.type }}</h3>
          </div>
          <div class="room-card__price-box">
            <span class="price-value">€{{ room.pricePerNight }}</span>
            <span class="price-unit">/night</span>
          </div>
        </div>

        <p class="room-card__desc">{{ room.description }}</p>

        <div class="room-card__amenities">
          <span v-for="amenity in room.amenities" :key="amenity" class="amenity-item">
            <i class="pi pi-check"></i> {{ amenity }}
          </span>
        </div>

        <div class="room-card__actions">
          <button 
            class="app-btn app-btn--primary" 
            :disabled="!room.isAvailable"
            @click="$emit('book', room)"
          >
            {{ room.isAvailable ? 'Book Now' : 'Not Available' }}
          </button>
        </div>
      </div>
    </div>
  </AppCard>
</template>

<script setup lang="ts">
import type { Room } from '~/types/models'

defineProps<{ room: Room }>()
defineEmits<{ (e: 'book', room: Room): void }>()
</script>

<style scoped>
.room-card { overflow: hidden; }
.room-card__layout {
  display: flex;
  flex-direction: column;
}
@media (min-width: 768px) {
  .room-card__layout { flex-direction: row; }
}

.room-card__image-wrap {
  width: 100%;
  height: 240px;
  flex-shrink: 0;
}
@media (min-width: 768px) {
  .room-card__image-wrap { width: 300px; height: auto; min-height: 100%; }
}
.room-card__image-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; }

.room-card__info {
  flex: 1;
  padding: var(--spacing-5);
  display: flex;
  flex-direction: column;
}

.room-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-3);
  flex-wrap: wrap;
}
.room-card__badge-row { display: flex; align-items: center; gap: var(--spacing-3); margin-bottom: var(--spacing-2); }
.room-card__capacity { font-size: var(--font-size-xs); color: var(--color-text-muted); display: flex; align-items: center; gap: 4px; }
.room-card__title { font-family: var(--font-family-heading); font-size: var(--font-size-lg); font-weight: 600; color: var(--color-text-primary); margin: 0; }

.room-card__price-box { display: flex; flex-direction: column; align-items: flex-end; }
.price-value { font-size: var(--font-size-xl); font-weight: 700; color: var(--color-primary-600); font-family: var(--font-family-heading); line-height: 1; }
.price-unit { font-size: var(--font-size-xs); color: var(--color-text-muted); }

.room-card__desc { font-size: var(--font-size-sm); color: var(--color-text-secondary); line-height: 1.5; margin: 0 0 var(--spacing-4); flex: 1; }

.room-card__amenities {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-5);
  border-top: 1px solid var(--color-border);
  padding-top: var(--spacing-4);
}
.amenity-item { font-size: var(--font-size-sm); color: var(--color-text-secondary); display: flex; align-items: center; gap: 6px; }
.amenity-item i { color: var(--color-success); font-size: 0.8rem; }

.room-card__actions { display: flex; justify-content: flex-end; }

.app-btn {
  padding: var(--spacing-2) var(--spacing-6);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all var(--motion-duration-fast) var(--motion-ease-default);
}
.app-btn--primary { background: var(--color-primary-600); color: white; }
.app-btn--primary:hover:not(:disabled) { background: var(--color-primary-700); }
.app-btn:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
