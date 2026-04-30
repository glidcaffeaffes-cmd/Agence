<template>
  <section class="top-destinations">
    <div class="td-container">
      <div class="td-header">
        <h2 class="td-title">{{ t("destinations.title") }}</h2>
        <p class="td-subtitle">{{ t("destinations.subtitle") }}</p>
      </div>

      <div v-if="loading" class="td-track">
        <div v-for="i in 7" :key="i" class="td-item td-item--skeleton">
          <div class="td-circle td-circle--skeleton"></div>
          <div class="td-skeleton-line td-skeleton-line--name"></div>
          <div class="td-skeleton-line td-skeleton-line--count"></div>
        </div>
      </div>

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
            {{
              dest.count === 1
                ? `${dest.count} ${t("destinations.hotelOne")}`
                : `${dest.count} ${t("destinations.hotelOther")}`
            }}
          </span>
        </button>
      </div>

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
          <span class="td-count">{{ t("destinations.explore") }}</span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useDestinations } from "~/composables/useDestinations";

const router = useRouter();
const { t } = useAppI18n();
const { destinations, loading, fetchDestinations } = useDestinations();

onMounted(fetchDestinations);

const ALL_TUNISIA_CITIES = [
  "Ariana",
  "Beja",
  "Ben Arous",
  "Bizerte",
  "Gabes",
  "Gafsa",
  "Jendouba",
  "Kairouan",
  "Kasserine",
  "Kebili",
  "La Manouba",
  "Le Kef",
  "Mahdia",
  "Medenine",
  "Monastir",
  "Nabeul",
  "Sfax",
  "Sidi Bouzid",
  "Siliana",
  "Sousse",
  "Tataouine",
  "Tozeur",
  "Tunis",
  "Zaghouan",
];

const FALLBACK_CITIES = [
  "Tunis",
  "Sousse",
  "Sfax",
  "Monastir",
  "Kairouan",
  "Tozeur",
  "Bizerte",
];

const CITY_IMAGES: Record<string, string> = {
  ariana:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/TunisAveHabibBourguiba.jpg/330px-TunisAveHabibBourguiba.jpg",
  beja: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/8e/1e/8c/caption.jpg?w=1200&h=-1&s=1",
  "ben arous":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmyzh6lMfIVEIndEzKDlkvC2zF9r4p_weY_Q&s",
  bizerte:
    "https://media.tacdn.com/media/attractions-splice-spp-674x446/13/2a/23/0c.jpg",
  gabes:
    "https://voyage-tunisie.info/wp-content/uploads/2017/11/Gab%C3%A8s-tourisme.jpg",
  gafsa:
    "https://polegafsa.com.tn/wp-content/uploads/2021/11/webElbayGafsaTourism.jpg",
  jendouba:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuYcJAMplb0cFJiTs5EUQXuZI8L_TMqoZtag&s",
  kairouan:
    "https://upload.wikimedia.org/wikipedia/commons/2/2b/Vue_a%C3%A9rienne_rapproch%C3%A9e_de_la_Grande_Mosqu%C3%A9e_de_Kairouan.jpg",
  kasserine:
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80",
  kebili:
    "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=900&q=80",
  "la manouba":
    "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=900&q=80",
  "le kef":
    "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=900&q=80",
  mahdia:
    "https://static1.mclcm.net/iod/images/v2/103/photo/320174/1280x720_100_300_000000x30x0.jpg?ts=20190618120839",
  medenine:
    "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=900&q=80",
  monastir:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Monastir-_Al_Qurayyah_beach.jpg/1280px-Monastir-_Al_Qurayyah_beach.jpg",
  nabeul:
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=900&q=80",
  sfax: "https://www.mosaicnorthafrica.com/wp-content/uploads/2017/01/sfax-medina.jpg",
  siliana:
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80",
  sousse:
    "https://upload.wikimedia.org/wikipedia/commons/b/b9/Sousse_Ribat_Aussicht.JPG",
  tataouine:
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80",
  tozeur:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVYCu5wzHRk0MMaLonSAvziwU0y6SqdwUTOg&s",
  tunis:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1JrzsT0yHRpxyAvA29J1YJcb0KckfjXeW4g&s",
  zaghouan:
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80",
};

const DEFAULT_IMAGES = Object.values(CITY_IMAGES);
const DEFAULT_IMAGE = DEFAULT_IMAGES[0];

const normalizeCityKey = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

const tunisiaCitiesLower = new Set(
  ALL_TUNISIA_CITIES.map((city) => normalizeCityKey(city)),
);

const displayed = computed(() => {
  return destinations.value
    .filter(
      (destination) =>
        destination.count > 0 &&
        tunisiaCitiesLower.has(normalizeCityKey(destination.ville)),
    )
    .sort((left, right) => right.count - left.count)
    .slice(0, 7);
});

function cityImage(ville: string): string {
  const cityKey = normalizeCityKey(ville);
  if (CITY_IMAGES[cityKey]) {
    return CITY_IMAGES[cityKey];
  }

  const fallbackIndex = Math.abs(hashString(cityKey)) % DEFAULT_IMAGES.length;
  return DEFAULT_IMAGES[fallbackIndex] ?? DEFAULT_IMAGE;
}

function hashString(value: string): number {
  return value
    .split("")
    .reduce((hash, char) => ((hash << 5) - hash + char.charCodeAt(0)) | 0, 0);
}

const failedImages = new Set<string>();

function onImgError(event: Event, ville: string) {
  const image = event.target as HTMLImageElement;
  const cityKey = normalizeCityKey(ville);
  if (!failedImages.has(cityKey)) {
    failedImages.add(cityKey);
    image.src = DEFAULT_IMAGE;
  }
}

function navigateToCity(ville: string) {
  router.push({ path: "/hotels", query: { city: ville, q: ville } });
}
</script>

<style scoped>
.top-destinations {
  background: var(--color-surface);
  padding: 32px 0 36px;
}

.td-container {
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 32px;
}

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

.td-track {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 12px;
  flex-wrap: nowrap;
  overflow-x: auto;
  padding-bottom: 4px;
}

.td-item {
  min-width: 140px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 12px 10px;
  border: 1px solid transparent;
  border-radius: 22px;
  background: transparent;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.td-item:hover {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--color-primary-300) 45%, transparent);
  background: color-mix(in srgb, var(--color-primary-50) 56%, transparent);
}

.td-circle-wrap {
  position: relative;
}

.td-circle {
  width: 94px;
  height: 94px;
  border-radius: 999px;
  overflow: hidden;
  border: 3px solid color-mix(in srgb, var(--color-primary-200) 55%, transparent);
  box-shadow: 0 10px 18px rgba(15, 23, 42, 0.08);
}

.td-circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.td-name {
  color: var(--color-text-primary);
  font-size: 15px;
  font-weight: 800;
  text-align: center;
}

.td-count {
  color: var(--color-text-secondary);
  font-size: 12px;
  font-weight: 600;
  text-align: center;
}

.td-item--skeleton {
  pointer-events: none;
}

.td-circle--skeleton,
.td-skeleton-line {
  background: linear-gradient(
    90deg,
    var(--color-skeleton-bg, var(--skeleton-bg)) 0%,
    var(--color-skeleton-highlight, var(--skeleton-highlight)) 50%,
    var(--color-skeleton-bg, var(--skeleton-bg)) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

.td-circle--skeleton {
  width: 94px;
  height: 94px;
  border-radius: 999px;
}

.td-skeleton-line {
  border-radius: 999px;
}

.td-skeleton-line--name {
  width: 84px;
  height: 14px;
}

.td-skeleton-line--count {
  width: 62px;
  height: 12px;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@media (max-width: 768px) {
  .td-container {
    padding: 0 16px;
  }

  .td-track {
    justify-content: flex-start;
  }

  .td-item {
    min-width: 124px;
  }
}
</style>
