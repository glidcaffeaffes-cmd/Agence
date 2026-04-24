<template>
  <div class="hotel-card" @click="navigateTo(`/hotels/${hotel.id}`)">
    <div class="hotel-card__image-container">
      <img :src="hotel.images[0] || fallbackImage" :alt="hotel.name" class="hotel-card__image" loading="lazy" />
      <div class="hotel-card__image-shade"></div>

      <div class="hotel-card__image-top">
        <span class="hotel-card__chip">{{ hotel.city }}</span>
        <button class="hotel-card__favorite" @click.stop="toggleFavorite" aria-label="Toggle favorite">
          <span class="material-symbols-outlined" :class="{ filled: isFavorite }">favorite</span>
        </button>
      </div>

      <div class="hotel-card__image-bottom">
        <h3 class="hotel-card__name">{{ hotel.name }}</h3>
      </div>
    </div>

    <div class="hotel-card__body">
      <div class="hotel-card__meta">
        <div class="hotel-card__location">
          <span class="material-symbols-outlined">location_on</span>
          <span>{{ hotel.city }}, {{ hotel.country }}</span>
        </div>
        <div class="hotel-card__rating">
          <span v-for="i in 5" :key="i" class="material-symbols-outlined star-icon" :class="{ active: i <= hotel.stars }">star</span>
        </div>
      </div>

      <div class="hotel-card__footer">
        <div class="hotel-card__price-info">
          <span class="price-label">From</span>
          <div class="price-inline">
            <span class="price-amount">{{ minPrice }}€</span>
            <span class="price-unit">/ night</span>
          </div>
        </div>
        <button class="hotel-card__btn-primary" @click.stop="reserveHotel">
          View
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Hotel } from '~/types/models'
import { useWishlist } from '~/composables/useWishlist'

const props = defineProps<{ hotel: Hotel; minPrice?: number }>()

const fallbackImage =
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200'
const { isWishlisted, toggle } = useWishlist()
const isFavorite = computed(() => isWishlisted(props.hotel.id))

const toggleFavorite = () => {
  toggle(props.hotel.id)
}

const reserveHotel = () => {
  navigateTo(`/hotels/${props.hotel.id}`)
}
</script>

<style scoped>
.hotel-card {
  background: #ffffff;
  border-radius: 18px;
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
  transform: translateY(-4px);
  border-color: rgba(188, 201, 200, 0.9);
  box-shadow: 0 18px 34px rgba(15, 23, 42, 0.1);
}

.hotel-card__image-container {
  position: relative;
  height: 182px;
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
    linear-gradient(180deg, rgba(15, 23, 42, 0.05) 0%, rgba(15, 23, 42, 0.02) 36%, rgba(15, 23, 42, 0.68) 100%);
}

.hotel-card__image-top,
.hotel-card__image-bottom {
  position: absolute;
  left: 14px;
  right: 14px;
  z-index: 2;
}

.hotel-card__image-top {
  top: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.hotel-card__image-bottom {
  bottom: 14px;
}

.hotel-card__chip {
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(12px);
  color: #ffffff;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.14em;
}

.hotel-card__favorite {
  width: 32px;
  height: 32px;
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
  margin: 0;
  color: #ffffff;
  font-size: 21px;
  line-height: 1.1;
  font-weight: 800;
  letter-spacing: -0.025em;
}

.hotel-card__location {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
}

.hotel-card__location .material-symbols-outlined {
  font-size: 15px;
}

.hotel-card__body {
  padding: 14px 14px 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.hotel-card__meta {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.hotel-card__rating {
  display: flex;
  gap: 1px;
}

.star-icon {
  font-size: 15px;
  color: #d8e1e8;
  font-variation-settings: 'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 20;
}

.star-icon.active {
  color: #cdaf5d;
}

.hotel-card__footer {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid #eef2f6;
  margin-top: auto;
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

.price-inline {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.price-amount {
  font-size: 24px;
  line-height: 1;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.03em;
}

.price-unit {
  font-size: 12px;
  color: #64748b;
  font-weight: 700;
}

.hotel-card__btn-primary {
  padding: 10px 14px;
  background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600));
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 12px;
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
    height: 170px;
  }

  .hotel-card__name {
    font-size: 18px;
  }

  .price-amount {
    font-size: 22px;
  }
}
</style>
