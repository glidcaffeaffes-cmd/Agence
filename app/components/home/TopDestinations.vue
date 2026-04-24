<template>
  <section class="top-destinations">
    <div class="td-container">
      <div class="td-header">
        <h2 class="td-title">Top Destinations</h2>
        <p class="td-subtitle">Explore Tunisia's most sought-after cities</p>
      </div>

      <!-- Loading skeleton -->
      <div v-if="loading" class="td-track">
        <div v-for="i in 7" :key="i" class="td-item td-item--skeleton">
          <div class="td-circle td-circle--skeleton"></div>
          <div class="td-skeleton-line td-skeleton-line--name"></div>
          <div class="td-skeleton-line td-skeleton-line--count"></div>
        </div>
      </div>

      <!-- Cities row -->
      <div v-else class="td-track">
        <button
          v-for="dest in displayed"
          :key="dest.ville"
          class="td-item"
          @click="navigateToCity(dest.ville)"
        >
          <div class="td-circle-wrap">
            <div class="td-circle">
              <img
                :src="cityImage(dest.ville)"
                :alt="dest.ville"
                loading="lazy"
                @error="onImgError"
              />
            </div>
          </div>
          <span class="td-name">{{ dest.ville }}</span>
          <span class="td-count">
            {{ dest.count }} {{ dest.count === 1 ? 'Hotel' : 'Hotels' }}
          </span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useDestinations } from '~/composables/useDestinations'

const router = useRouter()

const { destinations, loading, fetchDestinations } = useDestinations()

onMounted(fetchDestinations)

/**
 * The 7 featured Tunisian cities with curated Unsplash images.
 * The API may return more cities; we filter to only show these 7
 * and fall back to any city with hotels if needed.
 */
const FEATURED_CITIES = [
  'Tunis',
  'Sfax',
  'Sousse',
  'Bizerte',
  'Nabeul',
  'Kairouan',
  'Gabès',
]

/** Curated images per city (Unsplash, landscape, Tunisia) */
const CITY_IMAGES: Record<string, string> = {
  Tunis:    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=600',
  Sfax:     'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&q=80&w=600',
  Sousse:   'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600',
  Bizerte:  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
  Nabeul:   'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=600',
  Kairouan: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&q=80&w=600',
  'Gabès':  'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?auto=format&fit=crop&q=80&w=600',
  // fallback pattern for other cities
  _default: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=600',
}

/**
 * Build displayed list:
 * 1. Start with the 7 featured cities, getting their count from the API (0 if not present)
 * 2. This ensures always 7 items shown
 */
const displayed = computed(() => {
  const map = new Map(destinations.value.map((d) => [d.ville.toLowerCase(), d.count]))

  return FEATURED_CITIES.map((ville) => ({
    ville,
    count: map.get(ville.toLowerCase()) ?? 0,
  }))
})

function cityImage(ville: string): string {
  return CITY_IMAGES[ville] || CITY_IMAGES['_default']
}

function onImgError(e: Event) {
  const img = e.target as HTMLImageElement
  img.src = CITY_IMAGES['_default']
}

function navigateToCity(ville: string) {
  router.push({ path: '/hotels', query: { city: ville, q: ville } })
}
</script>

<style scoped>
/* ─── Section ────────────────────────────────────────────── */
.top-destinations {
  background: var(--color-white);
  padding: 32px 0 36px;
}

.td-container {
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 32px;
}

/* ─── Header ─────────────────────────────────────────────── */
.td-header {
  text-align: center;
  margin-bottom: 28px;
}

.td-title {
  font-size: 26px;
  font-weight: 800;
  color: var(--color-text-primary);
  letter-spacing: -0.03em;
  margin: 0 0 4px;
}

.td-subtitle {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin: 0;
  line-height: 1.5;
}

/* ─── Cities Track ───────────────────────────────────────── */
.td-track {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 12px;
  flex-wrap: nowrap;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding-bottom: 4px;
}

.td-track::-webkit-scrollbar {
  display: none;
}

/* ─── City Item ──────────────────────────────────────────── */
.td-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px 8px 8px;
  border-radius: var(--radius-2xl);
  min-width: 108px;
  max-width: 130px;
  flex-shrink: 0;
  transition: transform var(--motion-duration-normal) var(--motion-ease-default);
}

.td-item:hover {
  transform: translateY(-4px);
}

.td-item:hover .td-circle {
  box-shadow: 0 12px 32px rgba(0, 103, 104, 0.22);
  border-color: var(--color-primary-300);
}

/* ─── Circle Image ───────────────────────────────────────── */
.td-circle-wrap {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  padding: 3px;
  background: linear-gradient(135deg, var(--color-primary-200), var(--color-accent-300));
  transition: padding var(--motion-duration-fast);
}

.td-item:hover .td-circle-wrap {
  background: linear-gradient(135deg, var(--color-primary-400), var(--color-accent-500));
}

.td-circle {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid var(--color-white);
  box-shadow: 0 6px 20px rgba(15, 23, 42, 0.12);
  transition: box-shadow var(--motion-duration-normal),
              border-color var(--motion-duration-normal);
}

.td-circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform var(--motion-duration-slow) var(--motion-ease-default);
}

.td-item:hover .td-circle img {
  transform: scale(1.1);
}

/* ─── Labels ─────────────────────────────────────────────── */
.td-name {
  font-size: 13px;
  font-weight: 800;
  color: var(--color-heading);
  text-align: center;
  letter-spacing: -0.01em;
  line-height: 1.2;
}

.td-count {
  font-size: 11.5px;
  font-weight: 600;
  color: var(--color-text-muted);
  text-align: center;
  letter-spacing: 0.01em;
}

/* ─── Skeleton ───────────────────────────────────────────── */
.td-item--skeleton {
  cursor: default;
  pointer-events: none;
}

.td-circle--skeleton {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background: linear-gradient(90deg, var(--color-gray-100) 25%, var(--color-gray-50) 50%, var(--color-gray-100) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.6s infinite;
}

.td-skeleton-line {
  height: 11px;
  border-radius: var(--radius-sm);
  background: linear-gradient(90deg, var(--color-gray-100) 25%, var(--color-gray-50) 50%, var(--color-gray-100) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.6s infinite;
}

.td-skeleton-line--name  { width: 70px; }
.td-skeleton-line--count { width: 50px; }

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ─── Responsive ─────────────────────────────────────────── */
@media (max-width: 768px) {
  .td-track {
    justify-content: flex-start;
  }

  .td-circle-wrap,
  .td-circle--skeleton {
    width: 90px;
    height: 90px;
  }

  .td-item {
    min-width: 90px;
    max-width: 105px;
  }
}
</style>
