<template>
  <div class="offer-card" @click="navigateTo(`/hotels/${offer.hotelId}`)">
    <div class="offer-card__image-container">
      <img
        :src="offer.image || fallbackImage"
        :alt="offer.title"
        class="offer-card__image"
        loading="lazy"
        @error="onImageError"
      />
      <div class="offer-card__shade"></div>

      <div class="offer-card__image-top">
        <span v-if="offer.hotelCity" class="offer-card__chip">
          <span class="material-symbols-outlined">location_on</span>
          {{ offer.hotelCity }}
        </span>
        <span class="offer-card__discount">
          <span class="material-symbols-outlined">local_offer</span>
          {{ t("offerCard.discount", { value: offer.discountRate }) }}
        </span>
      </div>

      <div class="offer-card__image-bottom">
        <span
          class="offer-card__status"
          :class="{ 'offer-card__status--active': offer.active }"
        >
          <span class="offer-card__status-dot"></span>
          {{ offer.active ? t("offerCard.activeDeal") : t("offerCard.upcoming") }}
        </span>
      </div>
    </div>

    <div class="offer-card__body">
      <div class="offer-card__meta">
        <span class="offer-card__label">{{ t("offerCard.exclusiveOffer") }}</span>
      </div>
      <p class="offer-card__hotel-name">
        {{ offer.hotelName || `Hotel #${offer.hotelId}` }}
      </p>

      <p v-if="offer.description" class="offer-card__desc">
        {{ truncatedDescription }}
      </p>

      <div class="offer-card__footer">
        <div class="offer-card__validity">
          <span class="material-symbols-outlined">event</span>
          <span>{{ t("common.until", { date: formattedEndDate }) }}</span>
        </div>
        <button
          class="offer-card__cta"
          @click.stop="navigateTo(`/hotels/${offer.hotelId}`)"
        >
          {{ t("common.view") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Offer } from "~/types/models";

const props = defineProps<{ offer: Offer }>();

const { t, formatDate } = useAppI18n();

const offerFallbackImages = [
  "https://images.unsplash.com/photo-1540541338287-41700ceee514?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200",
];

const fallbackImage =
  offerFallbackImages[props.offer.id % offerFallbackImages.length];

const formattedEndDate = computed(() => {
  if (!props.offer.endDate) {
    return t("common.na");
  }

  return formatDate(props.offer.endDate, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
});

const truncatedDescription = computed(() => {
  const desc = props.offer.description || "";
  return desc.length > 80 ? `${desc.substring(0, 80)}...` : desc;
});

function onImageError(event: Event) {
  const image = event.target as HTMLImageElement;
  image.src = fallbackImage;
}
</script>

<style scoped>
.offer-card {
  background: var(--color-surface);
  border-radius: 1.15rem;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid var(--color-border-soft);
  box-shadow: var(--shadow-card);
  transition:
    transform var(--duration-normal) var(--easing-standard),
    box-shadow var(--duration-normal) var(--easing-standard),
    border-color var(--duration-normal) var(--easing-standard);
}

.offer-card:hover {
  transform: translateY(-4px);
  border-color: color-mix(in srgb, var(--color-primary-400) 30%, transparent);
  box-shadow: var(--shadow-card-hover);
}

.offer-card__image-container {
  position: relative;
  height: 11.6rem;
  overflow: hidden;
  flex-shrink: 0;
}

.offer-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--duration-slow) var(--easing-standard);
}

.offer-card:hover .offer-card__image {
  transform: scale(1.05);
}

.offer-card__shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgb(15 23 42 / 0.08) 0%,
    rgb(15 23 42 / 0.02) 35%,
    rgb(15 23 42 / 0.65) 100%
  );
}

.offer-card__image-top,
.offer-card__image-bottom {
  position: absolute;
  inset-inline: 0.8rem;
  z-index: 2;
  display: flex;
  align-items: center;
}

.offer-card__image-top {
  top: 0.8rem;
  justify-content: space-between;
  gap: 0.5rem;
}

.offer-card__image-bottom {
  bottom: 0.8rem;
}

.offer-card__chip,
.offer-card__status {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.33rem 0.65rem;
  border-radius: 999px;
  backdrop-filter: blur(10px);
  color: var(--color-white);
  font-size: 0.66rem;
  font-weight: 800;
  white-space: nowrap;
}

.offer-card__chip {
  max-width: 8.75rem;
  overflow: hidden;
  text-overflow: ellipsis;
  border: 1px solid rgb(255 255 255 / 0.18);
  background: rgb(255 255 255 / 0.16);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.offer-card__chip .material-symbols-outlined {
  font-size: 0.75rem;
  flex-shrink: 0;
}

.offer-card__discount {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  background: var(--color-accent-500);
  color: var(--color-white);
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.04em;
  box-shadow: 0 4px 12px rgb(205 175 93 / 0.4);
  white-space: nowrap;
}

.offer-card__discount .material-symbols-outlined {
  font-size: 0.8rem;
}

.offer-card__status {
  border: 1px solid rgb(255 255 255 / 0.18);
  background: rgb(255 255 255 / 0.14);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.offer-card__status-dot {
  width: 0.38rem;
  height: 0.38rem;
  border-radius: 50%;
  background: var(--color-gray-400);
  flex-shrink: 0;
}

.offer-card__status--active .offer-card__status-dot {
  background: var(--color-success-400);
  box-shadow: 0 0 0 0 rgb(52 211 153 / 0.7);
  animation: pulse-green 2s infinite;
}

@keyframes pulse-green {
  0% {
    box-shadow: 0 0 0 0 rgb(52 211 153 / 0.7);
  }
  70% {
    box-shadow: 0 0 0 6px rgb(52 211 153 / 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgb(52 211 153 / 0);
  }
}

.offer-card__body {
  padding: 0.95rem;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  flex: 1;
}

.offer-card__meta {
  display: flex;
  align-items: center;
}

.offer-card__label {
  font-size: 0.66rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--color-primary-500);
}

.offer-card__hotel-name {
  margin: 0;
  font-size: 0.98rem;
  font-weight: 800;
  color: var(--color-heading);
  line-height: 1.3;
}

.offer-card__desc {
  margin: 0;
  font-size: 0.8rem;
  line-height: 1.55;
  color: var(--color-text-muted);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.offer-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.65rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--color-border-soft);
  margin-top: auto;
}

.offer-card__validity {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.74rem;
  font-weight: 600;
  color: var(--color-text-secondary);
}

.offer-card__validity .material-symbols-outlined {
  font-size: 0.95rem;
}

.offer-card__cta {
  padding: 0.55rem 0.95rem;
  background: linear-gradient(
    135deg,
    var(--color-primary-500),
    var(--color-primary-600)
  );
  color: var(--color-white);
  border: none;
  border-radius: 0.7rem;
  font-size: 0.78rem;
  font-weight: 800;
  cursor: pointer;
  transition:
    transform var(--duration-fast) var(--easing-standard),
    box-shadow var(--duration-fast) var(--easing-standard);
  box-shadow: 0 6px 16px rgb(0 103 104 / 0.2);
  white-space: nowrap;
}

.offer-card__cta:hover {
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .offer-card__image-container {
    height: 10.6rem;
  }

  .offer-card__footer {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
