<template>
  <div
    class="hotel-card"
    :class="[`hotel-card--${viewMode || 'grid'}`]"
    @click="navigateTo(`/hotels/${hotel.id}`)"
  >
    <div class="hotel-card__image-container">
      <img
        :src="hotel.images[0] || fallbackImage"
        :alt="hotel.name"
        class="hotel-card__image"
        loading="lazy"
      />
      <div class="hotel-card__image-shade"></div>

      <div class="hotel-card__image-top">
        <div class="hotel-card__chips">
          <span v-if="viewMode !== 'list'" class="hotel-card__chip">{{ hotel.city }}</span>
          <span v-if="viewMode === 'list'" class="hotel-card__chip hotel-card__chip--rating">
            <span class="hotel-card__rating-value">{{ hotel.stars }}</span>
            <span class="material-symbols-outlined hotel-card__rating-star">star</span>
          </span>
        </div>

        <button
          v-if="viewMode !== 'list'"
          class="hotel-card__favorite"
          :aria-label="t('hotelCard.toggleFavorite')"
          @click.stop="toggleFavorite"
        >
          <span class="material-symbols-outlined" :class="{ filled: isFavorite }">favorite</span>
        </button>
      </div>

      <div v-if="viewMode !== 'list'" class="hotel-card__image-bottom">
        <h3 class="hotel-card__name">{{ hotel.name }}</h3>
      </div>
    </div>

    <div class="hotel-card__body">
      <div v-if="viewMode === 'list'" class="hotel-card__header-list">
        <div class="hotel-card__title-wrap">
          <h3 class="hotel-card__name-list">{{ hotel.name }}</h3>
          <div class="hotel-card__location-list">
            <span class="material-symbols-outlined">location_on</span>
            <span>{{ hotel.city }}, {{ hotel.country }}</span>
          </div>
        </div>
        <div class="hotel-card__price-list">
          <span class="price-amount">{{ priceText }}</span>
          <span class="price-unit">{{ t("common.perNight") }}</span>
        </div>
      </div>

      <div v-if="viewMode !== 'list'" class="hotel-card__meta">
        <div class="hotel-card__location">
          <span class="material-symbols-outlined">location_on</span>
          <span>{{ hotel.city }}, {{ hotel.country }}</span>
        </div>
        <div class="hotel-card__rating">
          <span
            v-for="i in 5"
            :key="i"
            class="material-symbols-outlined star-icon"
            :class="{ active: i <= hotel.stars }"
          >
            star
          </span>
        </div>
      </div>

      <div v-if="viewMode === 'list'" class="hotel-card__info-grid">
        <div class="info-grid-item">
          <span class="material-symbols-outlined">meeting_room</span>
          <span>{{ roomCount || 0 }} {{ t("common.rooms") }}</span>
        </div>
        <div class="info-grid-item">
          <span class="material-symbols-outlined">call</span>
          <span>{{ hotel.phone || t("common.na") }}</span>
        </div>
        <div class="info-grid-item">
          <span class="material-symbols-outlined">mail</span>
          <span class="truncate">{{ hotel.email || t("common.na") }}</span>
        </div>
        <div class="info-grid-item" v-if="hotel.amenities && hotel.amenities.length > 0">
          <span class="material-symbols-outlined">star</span>
          <span class="truncate">{{ hotel.amenities.slice(0, 2).join(", ") }}</span>
        </div>
        <div class="info-grid-item" v-else>
          <span class="material-symbols-outlined">star</span>
          <span>{{ t("common.standard") }}</span>
        </div>
      </div>

      <div class="hotel-card__footer">
        <div v-if="viewMode !== 'list'" class="hotel-card__price-info">
          <span class="price-label">{{ t("common.from") }}</span>
          <div class="price-inline">
            <span class="price-amount">{{ priceText }}</span>
            <span class="price-unit">{{ t("common.perNight") }}</span>
          </div>
        </div>

        <div v-if="viewMode === 'list'" class="hotel-card__action-link">
          <span class="material-symbols-outlined rtl-flip">arrow_forward</span>
          <span>{{ t("common.viewDetails") }}</span>
        </div>

        <button
          v-if="viewMode === 'list'"
          class="hotel-card__favorite-btn-list"
          @click.stop="toggleFavorite"
        >
          <span class="material-symbols-outlined" :class="{ filled: isFavorite }">favorite</span>
          <span>{{ t("common.save") }}</span>
        </button>

        <button
          v-if="viewMode !== 'list'"
          class="hotel-card__btn-primary"
          @click.stop="reserveHotel"
        >
          {{ t("common.view") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Hotel } from "~/types/models";
import { useWishlist } from "~/composables/useWishlist";

const props = defineProps<{
  hotel: Hotel;
  minPrice?: number;
  viewMode?: "grid" | "list";
  roomCount?: number;
}>();

const fallbackImage =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200";
const { isWishlisted, toggle } = useWishlist();
const { t, formatCurrency } = useAppI18n();
const isFavorite = computed(() => isWishlisted(props.hotel.id));
const priceText = computed(() => formatCurrency(props.minPrice || 0));

function toggleFavorite() {
  toggle(props.hotel.id);
}

function reserveHotel() {
  navigateTo(`/hotels/${props.hotel.id}`);
}
</script>

<style scoped>
.hotel-card {
  background: var(--hotel-card-bg);
  border-radius: 1.15rem;
  overflow: hidden;
  cursor: pointer;
  transition:
    transform 0.28s ease,
    box-shadow 0.28s ease,
    border-color 0.28s ease;
  display: flex;
  flex-direction: column;
  min-height: 100%;
  border: 1px solid var(--hotel-card-border);
  box-shadow: var(--hotel-card-shadow);
}

.hotel-card:hover {
  transform: translateY(-4px);
  border-color: color-mix(in srgb, var(--color-primary-300) 42%, transparent);
  box-shadow: var(--hotel-card-hover-shadow);
}

.hotel-card__image-container {
  position: relative;
  height: 11.4rem;
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
    linear-gradient(180deg, rgb(15 23 42 / 0.05) 0%, rgb(15 23 42 / 0.02) 36%, rgb(15 23 42 / 0.68) 100%);
}

.hotel-card__image-top,
.hotel-card__image-bottom {
  position: absolute;
  inset-inline: 0.9rem;
  z-index: 2;
}

.hotel-card__image-top {
  top: 0.9rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.7rem;
}

.hotel-card__image-bottom {
  bottom: 0.9rem;
}

.hotel-card__chips {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.hotel-card__chip {
  display: inline-flex;
  align-items: center;
  padding: 0.38rem 0.7rem;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.18);
  border: 1px solid rgb(255 255 255 / 0.18);
  backdrop-filter: blur(12px);
  color: var(--color-white);
  font-size: 0.66rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.14em;
}

.hotel-card__chip--rating {
  gap: 0.35rem;
  padding-inline: 0.8rem;
  background: rgb(15 23 42 / 0.52);
  border-color: rgb(255 255 255 / 0.32);
}

.hotel-card__rating-value {
  font-size: 0.86rem;
  font-weight: 700;
  line-height: 1;
}

.hotel-card__rating-star {
  font-size: 1rem;
  line-height: 1;
  color: #f4c542;
  font-variation-settings: "FILL" 1, "wght" 700, "GRAD" 0, "opsz" 24;
}

.hotel-card__favorite {
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-surface) 94%, white);
  border: 1px solid color-mix(in srgb, var(--color-surface) 94%, white);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease;
  color: var(--color-text-secondary);
  box-shadow: 0 8px 18px rgb(15 23 42 / 0.12);
}

.hotel-card__favorite:hover {
  transform: translateY(-1px);
}

.hotel-card__favorite .material-symbols-outlined {
  font-size: 1.1rem;
  line-height: 1;
}

.hotel-card__favorite .material-symbols-outlined.filled,
.hotel-card__favorite-btn-list .material-symbols-outlined.filled {
  color: #ef4444;
  font-variation-settings: "FILL" 1;
}

.hotel-card__name {
  margin: 0;
  color: var(--color-white);
  font-size: 1.3rem;
  line-height: 1.1;
  font-weight: 800;
  letter-spacing: -0.025em;
}

.hotel-card__body {
  padding: 0.95rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  flex: 1;
}

.hotel-card__meta {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
}

.hotel-card__location,
.hotel-card__location-list,
.info-grid-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--color-text-secondary);
  font-size: 0.8rem;
  font-weight: 600;
}

.hotel-card__location .material-symbols-outlined,
.hotel-card__location-list .material-symbols-outlined,
.info-grid-item .material-symbols-outlined {
  font-size: 1rem;
  color: var(--color-text-muted);
}

.hotel-card__rating {
  display: flex;
  gap: 0.08rem;
}

.star-icon {
  font-size: 0.95rem;
  color: color-mix(in srgb, var(--color-border) 90%, transparent);
  font-variation-settings: "FILL" 1, "wght" 500, "GRAD" 0, "opsz" 20;
}

.star-icon.active {
  color: var(--color-accent-500);
}

.hotel-card__footer {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.75rem;
  padding-top: 0.85rem;
  border-top: 1px solid color-mix(in srgb, var(--color-border) 72%, transparent);
  margin-top: auto;
}

.hotel-card__price-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.price-label {
  font-size: 0.63rem;
  font-weight: 800;
  color: var(--color-text-muted);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.price-inline,
.hotel-card__price-list {
  display: flex;
  align-items: baseline;
  gap: 0.35rem;
}

.price-amount {
  font-size: 1.35rem;
  line-height: 1;
  font-weight: 800;
  color: var(--color-text-primary);
  letter-spacing: -0.03em;
}

.price-unit {
  font-size: 0.78rem;
  color: var(--color-text-secondary);
  font-weight: 700;
}

.hotel-card__btn-primary {
  padding: 0.65rem 0.95rem;
  background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600));
  color: var(--color-white);
  border: none;
  border-radius: 0.8rem;
  font-size: 0.8rem;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.22s ease, box-shadow 0.22s ease;
  box-shadow: 0 10px 20px rgb(0 103 104 / 0.18);
  white-space: nowrap;
}

.hotel-card__btn-primary:hover {
  transform: translateY(-1px);
}

.hotel-card--list {
  flex-direction: row;
  min-height: 15rem;
}

.hotel-card--list .hotel-card__image-container {
  width: min(20rem, 42%);
  height: auto;
  min-height: 100%;
  flex-shrink: 0;
}

.hotel-card--list .hotel-card__body {
  padding: 1.35rem;
  gap: 1rem;
}

.hotel-card__header-list {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.hotel-card__title-wrap {
  min-width: 0;
}

.hotel-card__name-list {
  margin: 0 0 0.45rem;
  color: var(--color-heading);
  font-size: 1.45rem;
  font-weight: 800;
  line-height: 1.2;
}

.hotel-card__info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.8rem 1rem;
  margin-top: 0.35rem;
}

.hotel-card--list .hotel-card__footer {
  border-top: none;
  padding-top: 0;
  align-items: center;
}

.hotel-card__action-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-heading);
  font-weight: 700;
  font-size: 0.88rem;
}

.hotel-card__action-link .material-symbols-outlined {
  font-size: 1.05rem;
  color: var(--color-text-muted);
}

.hotel-card__favorite-btn-list {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  background: transparent;
  border: 1px solid transparent;
  color: var(--color-primary-600);
  font-weight: 700;
  font-size: 0.88rem;
  cursor: pointer;
  padding: 0.55rem 0.8rem;
  border-radius: 0.8rem;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.hotel-card__favorite-btn-list:hover {
  background: color-mix(in srgb, var(--color-primary-50) 72%, transparent);
  border-color: color-mix(in srgb, var(--color-primary-300) 35%, transparent);
}

.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 960px) {
  .hotel-card--list {
    flex-direction: column;
  }

  .hotel-card--list .hotel-card__image-container {
    width: 100%;
    min-height: 11.5rem;
  }

  .hotel-card__header-list,
  .hotel-card--list .hotel-card__footer {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 640px) {
  .hotel-card__image-container {
    height: 10.6rem;
  }

  .hotel-card__name {
    font-size: 1.12rem;
  }

  .price-amount {
    font-size: 1.2rem;
  }

  .hotel-card__info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
