<template>
  <div class="hotel-card" @click="navigateTo(`/hotels/${hotel.id}`)">
    <div class="hotel-card__image-container">
      <img :src="hotel.images[0] || fallbackImage" :alt="hotel.name" class="hotel-card__image" loading="lazy" />
      <div class="hotel-card__image-shade"></div>

      <div class="hotel-card__image-top">
        <span class="hotel-card__chip">{{ hotel.stars }}-star stay</span>
        <button class="hotel-card__favorite" @click.stop="toggleFavorite" aria-label="Toggle favorite">
          <span class="material-symbols-outlined" :class="{ filled: isFavorite }">favorite</span>
        </button>
      </div>

      <div class="hotel-card__image-bottom">
        <h3 class="hotel-card__name">{{ hotel.name }}</h3>
        <div class="hotel-card__location">
          <span class="material-symbols-outlined">location_on</span>
          <span>{{ hotel.city }}, {{ hotel.country }}</span>
        </div>
      </div>
    </div>

    <div class="hotel-card__body">
      <div class="hotel-card__rating-row">
        <div class="hotel-card__rating">
          <span v-for="i in 5" :key="i" class="material-symbols-outlined star-icon" :class="{ active: i <= hotel.stars }">star</span>
        </div>
        <span class="hotel-card__rating-text">Refined hospitality collection</span>
      </div>

      <p class="hotel-card__description">{{ truncatedDesc }}</p>

      <div class="hotel-card__footer">
        <div class="hotel-card__price-info">
          <span class="price-label">From</span>
          <div class="price-value-wrap">
            <span class="price-amount">{{ minPrice }}</span>
            <span class="price-unit">EUR / night</span>
          </div>
        </div>
        <button class="hotel-card__btn-primary" @click.stop="reserveHotel">
          View Stay
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Hotel } from '~/types/models'

const props = defineProps<{ hotel: Hotel; minPrice?: number }>()

const fallbackImage =
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200'
const isFavorite = ref(false)

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
}

const truncatedDesc = computed(() => {
  const description = props.hotel.description || ''
  return description.length > 92 ? `${description.substring(0, 92)}...` : description
})

const reserveHotel = () => {
  navigateTo(`/hotels/${props.hotel.id}`)
}
</script>

<style scoped>
.hotel-card {
  background: #ffffff;
  border-radius: 24px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease;
  display: flex;
  flex-direction: column;
  min-height: 100%;
  border: 1px solid rgba(225, 232, 240, 0.95);
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.06);
}

.hotel-card:hover {
  transform: translateY(-6px);
  border-color: rgba(188, 201, 200, 0.9);
  box-shadow: 0 22px 44px rgba(15, 23, 42, 0.1);
}

.hotel-card__image-container {
  position: relative;
  height: 236px;
  overflow: hidden;
}

.hotel-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.45s ease;
}

.hotel-card:hover .hotel-card__image {
  transform: scale(1.04);
}

.hotel-card__image-shade {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(15, 23, 42, 0.06) 0%, rgba(15, 23, 42, 0.04) 28%, rgba(15, 23, 42, 0.62) 100%);
}

.hotel-card__image-top,
.hotel-card__image-bottom {
  position: absolute;
  left: 18px;
  right: 18px;
  z-index: 2;
}

.hotel-card__image-top {
  top: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.hotel-card__image-bottom {
  bottom: 18px;
}

.hotel-card__chip {
  display: inline-flex;
  align-items: center;
  padding: 7px 11px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(12px);
  color: #ffffff;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.14em;
}

.hotel-card__favorite {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid rgba(255, 255, 255, 0.94);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease;
  color: #64748b;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.12);
}

.hotel-card__favorite:hover {
  transform: translateY(-1px);
}

.hotel-card__favorite .material-symbols-outlined {
  font-size: 18px;
  line-height: 1;
  font-variation-settings: 'FILL' 0, 'wght' 500, 'GRAD' 0, 'opsz' 20;
}

.hotel-card__favorite .material-symbols-outlined.filled {
  color: #ef4444;
  font-variation-settings: 'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 20;
}

.hotel-card__name {
  margin: 0 0 8px;
  color: #ffffff;
  font-size: 22px;
  line-height: 1.08;
  font-weight: 800;
  letter-spacing: -0.025em;
}

.hotel-card__location {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 12px;
  font-weight: 600;
}

.hotel-card__location .material-symbols-outlined {
  font-size: 16px;
}

.hotel-card__body {
  padding: 18px 18px 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  flex: 1;
}

.hotel-card__rating-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.hotel-card__rating {
  display: flex;
  gap: 2px;
}

.star-icon {
  font-size: 14px;
  color: #d8e1e8;
  font-variation-settings: 'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 20;
}

.star-icon.active {
  color: #cdaf5d;
}

.hotel-card__rating-text {
  color: #64748b;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.hotel-card__description {
  margin: 0;
  color: #475569;
  font-size: 13px;
  line-height: 1.65;
  flex: 1;
}

.hotel-card__footer {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 14px;
  padding-top: 14px;
  border-top: 1px solid #eef2f6;
}

.hotel-card__price-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.price-label {
  font-size: 10px;
  font-weight: 800;
  color: #94a3b8;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.price-value-wrap {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.price-amount {
  font-size: 26px;
  line-height: 1;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.03em;
}

.price-unit {
  font-size: 12px;
  color: #64748b;
  font-weight: 600;
}

.hotel-card__btn-primary {
  padding: 11px 16px;
  background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600));
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.01em;
  cursor: pointer;
  transition: transform 0.22s ease, box-shadow 0.22s ease;
  box-shadow: 0 10px 20px rgba(0, 103, 104, 0.18);
  white-space: nowrap;
}

.hotel-card__btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 24px rgba(0, 103, 104, 0.24);
}

@media (max-width: 768px) {
  .hotel-card__image-container {
    height: 220px;
  }

  .hotel-card__name {
    font-size: 20px;
  }

  .price-amount {
    font-size: 24px;
  }
}
</style>
