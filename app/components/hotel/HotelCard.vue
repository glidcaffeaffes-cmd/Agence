<template>
  <div class="hotel-card" @click="navigateTo(`/hotels/${hotel.id}`)">
    <div class="hotel-card__image-container">
      <img :src="hotel.images[0]" :alt="hotel.name" class="hotel-card__image" loading="lazy" />
      <button class="hotel-card__favorite" @click.stop="toggleFavorite">
        <span class="material-symbols-outlined" :class="{ 'filled': isFavorite }">{{ isFavorite ? 'favorite' : 'favorite' }}</span>
      </button>
    </div>
    
    <div class="hotel-card__body">
      <div class="hotel-card__header">
        <h3 class="hotel-card__name">{{ hotel.name }}</h3>
        <div class="hotel-card__rating">
          <span v-for="i in 5" :key="i" class="material-symbols-outlined star-icon" :class="{ 'active': i <= hotel.stars }">star</span>
        </div>
      </div>
      
      <div class="hotel-card__location">
        <span class="material-symbols-outlined">location_on</span>
        <span>{{ hotel.city }}, {{ hotel.country }}</span>
      </div>
      
      <p class="hotel-card__description">{{ truncatedDesc }}</p>
      
      <div class="hotel-card__footer">
        <div class="hotel-card__price-info">
          <span class="price-label">À PARTIR DE</span>
          <div class="price-value-wrap">
            <span class="price-amount">{{ minPrice }}€</span>
            <span class="price-unit">/ Nuit</span>
          </div>
        </div>
        <button class="hotel-card__btn-primary" @click.stop="reserveHotel">
          Réserver
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Hotel } from '~/types/models'

const props = defineProps<{ hotel: Hotel; minPrice?: number }>()

const isFavorite = ref(false)
const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
}

const truncatedDesc = computed(() => {
  const d = props.hotel.description
  return d.length > 95 ? d.substring(0, 95) + '...' : d
})

const reserveHotel = () => {
  alert(`Réservation initiée pour ${props.hotel.name} ! (Simulation)`)
}
</script>

<style scoped>
.hotel-card {
  background: var(--color-surface-lowest, #ffffff);
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer !important;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 12px rgba(1, 80, 129, 0.04);
  border: 1px solid rgba(225, 233, 240, 0.5);
}

.hotel-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(1, 80, 129, 0.08);
}

.hotel-card__image-container {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.hotel-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.hotel-card:hover .hotel-card__image {
  transform: scale(1.03);
}

.hotel-card__favorite {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #6d7979;
}

.hotel-card__favorite .material-symbols-outlined {
  font-size: 18px;
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20;
}

.hotel-card__favorite .material-symbols-outlined.filled {
  color: #ff4d4f;
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 20;
}

.hotel-card__body {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.hotel-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.hotel-card__name {
  font-size: 16px;
  font-weight: 700;
  color: #015081;
  margin: 0;
  font-family: inherit;
  letter-spacing: -0.01em;
}

.hotel-card__rating {
  display: flex;
}

.star-icon {
  font-size: 14px;
  color: #e2e8f0;
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.star-icon.active {
  color: #CDAF5D;
}

.hotel-card__location {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #334155;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 10px;
}

.hotel-card__location .material-symbols-outlined {
  font-size: 16px;
  color: #008F90;
}

.hotel-card__description {
  font-size: 13px;
  color: #475569;
  line-height: 1.5;
  margin: 0 0 16px 0;
  flex: 1;
}

.hotel-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
  margin-top: auto;
}

.hotel-card__price-info {
  display: flex;
  flex-direction: column;
}

.price-label {
  font-size: 9px;
  font-weight: 800;
  color: #94a3b8;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.price-value-wrap {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.price-amount {
  font-size: 18px;
  font-weight: 800;
  color: #001d34;
}

.price-unit {
  font-size: 11px;
  color: #64748b;
  font-weight: 600;
}

.hotel-card__btn-primary {
  padding: 8px 16px;
  background: #008F90;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 143, 144, 0.2);
}

.hotel-card__btn-primary:hover {
  background: #017879;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 143, 144, 0.3);
}
</style>


