<template>
  <div class="offer-card" @click="navigateTo(`/hotels/${offer.hotelId}`)">
    <!-- ── Image Zone ── -->
    <div class="offer-card__image-container">
      <img
        :src="offer.image || fallbackImage"
        :alt="offer.title"
        class="offer-card__image"
        loading="lazy"
        @error="onImageError"
      />
      <!-- dark gradient shade -->
      <div class="offer-card__shade"></div>

      <!-- top row: location chip + discount badge -->
      <div class="offer-card__image-top">
        <span v-if="offer.hotelName" class="offer-card__chip">
          <span class="material-symbols-outlined">location_on</span>
          {{ offer.hotelName }}
        </span>
        <span class="offer-card__discount">
          <span class="material-symbols-outlined">local_offer</span>
          {{ offer.discountRate }}% OFF
        </span>
      </div>

      <!-- bottom: active pill -->
      <div class="offer-card__image-bottom">
        <span class="offer-card__status" :class="{ 'offer-card__status--active': offer.active }">
          <span class="offer-card__status-dot"></span>
          {{ offer.active ? 'Active Deal' : 'Upcoming' }}
        </span>
      </div>
    </div>

    <!-- ── Body ── -->
    <div class="offer-card__body">
      <div class="offer-card__meta">
        <span class="offer-card__label">Exclusive Offer</span>
      </div>

      <h3 class="offer-card__title">{{ offer.title }}</h3>

      <p v-if="offer.description" class="offer-card__desc">{{ truncatedDescription }}</p>

      <!-- footer: validity + CTA -->
      <div class="offer-card__footer">
        <div class="offer-card__validity">
          <span class="material-symbols-outlined">event</span>
          <span>Until {{ formatDate(offer.endDate) }}</span>
        </div>
        <button class="offer-card__cta" @click.stop="navigateTo(`/hotels/${offer.hotelId}`)">
          View
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Offer } from '~/types/models'

const props = defineProps<{ offer: Offer }>()

const offerFallbackImages = [
  'https://images.unsplash.com/photo-1540541338287-41700ceee514?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200',
]

const fallbackImage = offerFallbackImages[props.offer.id % offerFallbackImages.length]

function onImageError(e: Event) {
  const img = e.target as HTMLImageElement
  img.src = fallbackImage
}

const truncatedDescription = computed(() => {
  const desc = props.offer.description || ''
  return desc.length > 80 ? `${desc.substring(0, 80)}…` : desc
})

function formatDate(dateStr: string) {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>

<style scoped>
/* ─── Card Shell ─────────────────────────────────────────── */
.offer-card {
  background: var(--color-white);
  border-radius: 18px;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid var(--color-border-soft);
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
  transition: transform var(--motion-duration-normal) var(--motion-ease-default),
              box-shadow var(--motion-duration-normal) var(--motion-ease-default),
              border-color var(--motion-duration-normal) var(--motion-ease-default);
}

.offer-card:hover {
  transform: translateY(-4px);
  border-color: rgba(0, 103, 104, 0.2);
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.10);
}

/* ─── Image Container ─────────────────────────────────────── */
.offer-card__image-container {
  position: relative;
  height: 186px;
  overflow: hidden;
  flex-shrink: 0;
}

.offer-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--motion-duration-slow) var(--motion-ease-default);
}

.offer-card:hover .offer-card__image {
  transform: scale(1.05);
}

.offer-card__shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(15, 23, 42, 0.08) 0%,
    rgba(15, 23, 42, 0.02) 35%,
    rgba(15, 23, 42, 0.65) 100%
  );
  pointer-events: none;
}

/* ─── Image Overlay Rows ──────────────────────────────────── */
.offer-card__image-top,
.offer-card__image-bottom {
  position: absolute;
  left: 13px;
  right: 13px;
  z-index: 2;
  display: flex;
  align-items: center;
}

.offer-card__image-top {
  top: 13px;
  justify-content: space-between;
  gap: 8px;
}

.offer-card__image-bottom {
  bottom: 12px;
}

/* Location chip */
.offer-card__chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 9px;
  border-radius: var(--radius-pill);
  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: var(--color-white);
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.offer-card__chip .material-symbols-outlined {
  font-size: 12px;
  flex-shrink: 0;
}

/* Discount badge — gold */
.offer-card__discount {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  border-radius: var(--radius-pill);
  background: var(--color-accent-500);
  color: var(--color-white);
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.04em;
  box-shadow: 0 4px 12px rgba(205, 175, 93, 0.4);
  white-space: nowrap;
  flex-shrink: 0;
}

.offer-card__discount .material-symbols-outlined {
  font-size: 13px;
}

/* Active status pill */
.offer-card__status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: var(--radius-pill);
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: rgba(255, 255, 255, 0.9);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.offer-card__status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-gray-400);
  flex-shrink: 0;
}

.offer-card__status--active .offer-card__status-dot {
  background: var(--color-success-400);
  box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.7);
  animation: pulse-green 2s infinite;
}

@keyframes pulse-green {
  0%   { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.7); }
  70%  { box-shadow: 0 0 0 6px rgba(52, 211, 153, 0); }
  100% { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0); }
}

/* ─── Card Body ───────────────────────────────────────────── */
.offer-card__body {
  padding: 14px 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.offer-card__meta {
  display: flex;
  align-items: center;
}

.offer-card__label {
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--color-primary-500);
}

.offer-card__title {
  margin: 0;
  font-size: 16px;
  font-weight: 800;
  color: var(--color-navy-800);
  line-height: 1.25;
  letter-spacing: -0.02em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.offer-card__desc {
  margin: 0;
  font-size: 12.5px;
  line-height: 1.55;
  color: var(--color-text-muted);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ─── Footer ──────────────────────────────────────────────── */
.offer-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--color-border-soft);
  margin-top: auto;
}

.offer-card__validity {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 600;
  color: var(--color-text-muted);
}

.offer-card__validity .material-symbols-outlined {
  font-size: 14px;
}

.offer-card__cta {
  padding: 8px 16px;
  background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600));
  color: var(--color-white);
  border: none;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.01em;
  cursor: pointer;
  transition: transform var(--motion-duration-fast) var(--motion-ease-default),
              box-shadow var(--motion-duration-fast) var(--motion-ease-default);
  box-shadow: 0 6px 16px rgba(0, 103, 104, 0.2);
  white-space: nowrap;
}

.offer-card__cta:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 22px rgba(0, 103, 104, 0.28);
}

/* ─── Responsive ──────────────────────────────────────────── */
@media (max-width: 768px) {
  .offer-card__image-container {
    height: 170px;
  }

  .offer-card__title {
    font-size: 15px;
  }
}
</style>
