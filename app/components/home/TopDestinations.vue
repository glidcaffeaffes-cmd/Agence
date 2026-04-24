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

      <!-- Cities row — only cities with hotels, up to 7 -->
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

      <!-- Fallback: no hotels yet — show top 7 cities as preview -->
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

// ─── All 24 Tunisian Governorates ─────────────────────────────────────────────
const ALL_TUNISIA_CITIES = [
  'Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabès', 'Gafsa',
  'Jendouba', 'Kairouan', 'Kasserine', 'Kébili', 'La Manouba', 'Le Kef',
  'Mahdia', 'Médenine', 'Monastir', 'Nabeul', 'Sfax', 'Sidi Bouzid',
  'Siliana', 'Sousse', 'Tataouine', 'Tozeur', 'Tunis', 'Zaghouan',
]

// 7 most iconic fallback cities when no hotels exist yet
const FALLBACK_CITIES = ['Tunis', 'Sousse', 'Sfax', 'Monastir', 'Kairouan', 'Tozeur', 'Bizerte']

// ─── Wikimedia Commons images for every Tunisian governorate ──────────────────
const CITY_IMAGES: Record<string, string> = {
  Ariana:       'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Ariana_city_2014.jpg/640px-Ariana_city_2014.jpg',
  'Béja':       'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Beja_mosque.jpg/640px-Beja_mosque.jpg',
  'Ben Arous':  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Ben_Arous_city.jpg/640px-Ben_Arous_city.jpg',
  Bizerte:      'https://upload.wikimedia.org/wikipedia/commons/b/b2/Old-Port-Bizerte.jpg',
  'Gabès':      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Gabes_oasis.jpg/640px-Gabes_oasis.jpg',
  Gafsa:        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Gafsa_oasis_historical.jpg/640px-Gafsa_oasis_historical.jpg',
  Jendouba:     'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Bulla_Regia_Tunisia.jpg/640px-Bulla_Regia_Tunisia.jpg',
  Kairouan:     'https://upload.wikimedia.org/wikipedia/commons/d/de/Grande_Mosqu%C3%A9e_de_Kairouan%2C_vue_d%27ensemble.jpg',
  Kasserine:    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Jebel_Chambi.jpg/640px-Jebel_Chambi.jpg',
  'Kébili':     'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Douz_oasis_Tunisia.jpg/640px-Douz_oasis_Tunisia.jpg',
  'La Manouba': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Manouba_city_Tunisia.jpg/640px-Manouba_city_Tunisia.jpg',
  'Le Kef':     'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Le_kef_Tunisia.jpg/640px-Le_kef_Tunisia.jpg',
  Mahdia:       'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Mahdia_medina_Tunisia.jpg/640px-Mahdia_medina_Tunisia.jpg',
  'Médenine':   'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Ksar_Ouled_Soltane%2C_Tunisia.jpg/640px-Ksar_Ouled_Soltane%2C_Tunisia.jpg',
  Monastir:     'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Monastir_ribat_Tunisia.jpg/640px-Monastir_ribat_Tunisia.jpg',
  Nabeul:       'https://upload.wikimedia.org/wikipedia/commons/8/83/Montage_ville_de_Nabeul.png',
  Sfax:         'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Sfax_medina_walls.jpg/640px-Sfax_medina_walls.jpg',
  'Sidi Bouzid':'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Sidi_Bouzid_Tunisia.jpg/640px-Sidi_Bouzid_Tunisia.jpg',
  Siliana:      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Siliana_Tunisia.jpg/640px-Siliana_Tunisia.jpg',
  Sousse:       'https://upload.wikimedia.org/wikipedia/commons/b/ba/Medina_of_Sousse-130323.jpg',
  Tataouine:    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Ksar_Hadada%2C_Tunisia.jpg/640px-Ksar_Hadada%2C_Tunisia.jpg',
  Tozeur:       'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Tozeur_oasis.jpg/640px-Tozeur_oasis.jpg',
  Tunis:        'https://upload.wikimedia.org/wikipedia/commons/1/14/Panorama_-_Medina_de_Tunis.jpg',
  Zaghouan:     'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Zaghouan_aqueduct_Tunisia.jpg/640px-Zaghouan_aqueduct_Tunisia.jpg',
}

// Generic fallback for any unrecognized city
const DEFAULT_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/1/14/Panorama_-_Medina_de_Tunis.jpg'

// ─── Computed: only Tunisian cities that have hotels, up to 7, desc by count ──
const tunisiaCitiesLower = new Set(ALL_TUNISIA_CITIES.map((c) => c.toLowerCase()))

const displayed = computed(() => {
  return destinations.value
    .filter((d) => d.count > 0 && tunisiaCitiesLower.has(d.ville.toLowerCase()))
    .sort((a, b) => b.count - a.count)
    .slice(0, 7)
})

function cityImage(ville: string): string {
  return CITY_IMAGES[ville] ?? DEFAULT_IMAGE
}

// Improved error handler: tries default image, then removes the src to show broken-image gracefully
const failedImages = new Set<string>()
function onImgError(e: Event, ville: string) {
  const img = e.target as HTMLImageElement
  if (!failedImages.has(ville)) {
    failedImages.add(ville)
    img.src = DEFAULT_IMAGE
  }
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

.td-track::-webkit-scrollbar { display: none; }

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

.td-item:hover { transform: translateY(-4px); }

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
}

/* ─── Skeleton ───────────────────────────────────────────── */
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

/* ─── Responsive ─────────────────────────────────────────── */
@media (max-width: 768px) {
  .td-track { justify-content: flex-start; }

  .td-circle-wrap,
  .td-circle--skeleton { width: 90px; height: 90px; }

  .td-item { min-width: 90px; max-width: 105px; }
}
</style>
