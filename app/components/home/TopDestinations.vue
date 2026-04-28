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

      <!-- Cities row â€” only cities with hotels, up to 7 -->
      <div v-else-if="displayed.length > 0" class="td-track">
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
                @error="(e) => onImgError(e, dest.ville)"
              />
            </div>
          </div>
          <span class="td-name">{{ dest.ville }}</span>
          <span class="td-count">
            {{ dest.count }} {{ dest.count === 1 ? 'Hotel' : 'Hotels' }}
          </span>
        </button>
      </div>

      <!-- Fallback: no hotels yet â€” show top 7 cities as preview -->
      <div v-else class="td-track">
        <button
          v-for="city in FALLBACK_CITIES"
          :key="city"
          class="td-item"
          @click="navigateToCity(city)"
        >
          <div class="td-circle-wrap">
            <div class="td-circle">
              <img
                :src="cityImage(city)"
                :alt="city"
                loading="lazy"
                @error="(e) => onImgError(e, city)"
              />
            </div>
          </div>
          <span class="td-name">{{ city }}</span>
          <span class="td-count">Explore</span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDestinations } from '~/composables/useDestinations'

const router = useRouter()
const { destinations, loading, fetchDestinations } = useDestinations()

onMounted(fetchDestinations)

// All 24 Tunisian governorates
const ALL_TUNISIA_CITIES = [
  'Ariana', 'Beja', 'Ben Arous', 'Bizerte', 'Gabes', 'Gafsa',
  'Jendouba', 'Kairouan', 'Kasserine', 'Kebili', 'La Manouba', 'Le Kef',
  'Mahdia', 'Medenine', 'Monastir', 'Nabeul', 'Sfax', 'Sidi Bouzid',
  'Siliana', 'Sousse', 'Tataouine', 'Tozeur', 'Tunis', 'Zaghouan',
]

// 7 most iconic fallback cities when no hotels exist yet
const FALLBACK_CITIES = ['Tunis', 'Sousse', 'Sfax', 'Monastir', 'Kairouan', 'Tozeur', 'Bizerte']

const CITY_IMAGE_QUERY: Record<string, string> = {
  ariana: 'Ariana Tunisia cityscape',
  beja: 'Beja Tunisia old town',
  'ben arous': 'Ben Arous Tunisia skyline',
  bizerte: 'Bizerte Tunisia harbor',
  gabes: 'Gabes Tunisia oasis',
  gafsa: 'Gafsa Tunisia landscape',
  jendouba: 'Jendouba Tunisia nature',
  kairouan: 'Kairouan Tunisia mosque',
  kasserine: 'Kasserine Tunisia mountain',
  kebili: 'Kebili Tunisia desert oasis',
  'la manouba': 'Manouba Tunisia city',
  'le kef': 'Le Kef Tunisia medina',
  mahdia: 'Mahdia Tunisia coast',
  medenine: 'Medenine Tunisia ksar',
  monastir: 'Monastir Tunisia ribat',
  nabeul: 'Nabeul Tunisia medina',
  sfax: 'Sfax Tunisia medina',
  'sidi bouzid': 'Sidi Bouzid Tunisia city',
  siliana: 'Siliana Tunisia hills',
  sousse: 'Sousse Tunisia medina',
  tataouine: 'Tataouine Tunisia ksar',
  tozeur: 'Tozeur Tunisia palm oasis',
  tunis: 'Tunis Tunisia medina',
  zaghouan: 'Zaghouan Tunisia aqueduct',
}

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=900&q=80'

const normalizeCityKey = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()

// Computed: only Tunisian cities that have hotels, up to 7, desc by count
const tunisiaCitiesLower = new Set(ALL_TUNISIA_CITIES.map((c) => normalizeCityKey(c)))

const displayed = computed(() => {
  return destinations.value
    .filter((d) => d.count > 0 && tunisiaCitiesLower.has(normalizeCityKey(d.ville)))
    .sort((a, b) => b.count - a.count)
    .slice(0, 7)
})

function cityImage(ville: string): string {
  const cityKey = normalizeCityKey(ville)
  const query = CITY_IMAGE_QUERY[cityKey] ?? `${ville} Tunisia city`
  return `https://source.unsplash.com/900x900/?${encodeURIComponent(query)}`
}

// Improved error handler: tries default image, then stops retrying
const failedImages = new Set<string>()
function onImgError(e: Event, ville: string) {
  const img = e.target as HTMLImageElement
  const cityKey = normalizeCityKey(ville)
  if (!failedImages.has(cityKey)) {
    failedImages.add(cityKey)
    img.src = DEFAULT_IMAGE
  }
}

function navigateToCity(ville: string) {
  router.push({ path: '/hotels', query: { city: ville, q: ville } })
}
</script>

<style scoped>
/* â”€â”€â”€ Section â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
.top-destinations {
  background: var(--color-white);
  padding: 32px 0 36px;
}

.td-container {
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 32px;
}

/* â”€â”€â”€ Header â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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

/* â”€â”€â”€ Cities Track â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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

.td-track::-webkit-scrollbar { display: none; }

/* â”€â”€â”€ City Item â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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

.td-item:hover { transform: translateY(-4px); }

.td-item:hover .td-circle {
  box-shadow: 0 12px 32px rgba(0, 103, 104, 0.22);
  border-color: var(--color-primary-300);
}

/* â”€â”€â”€ Circle Image â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
.td-circle-wrap {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  padding: 3px;
  background: linear-gradient(135deg, var(--color-primary-200), var(--color-accent-300));
  transition: background var(--motion-duration-fast);
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

.td-item:hover .td-circle img { transform: scale(1.1); }

/* â”€â”€â”€ Labels â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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
}

/* â”€â”€â”€ Skeleton â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
.td-item--skeleton { cursor: default; pointer-events: none; }

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

/* â”€â”€â”€ Responsive â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
@media (max-width: 768px) {
  .td-track { justify-content: flex-start; }

  .td-circle-wrap,
  .td-circle--skeleton { width: 90px; height: 90px; }

  .td-item { min-width: 90px; max-width: 105px; }
}
</style>
