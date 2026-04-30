<template>
  <main class="wishlist-page">
    <section class="wishlist-shell app-shell">
      <header class="wishlist-header">
        <div>
          <p class="wishlist-header__eyebrow">{{ t("wishlist.eyebrow") }}</p>
          <h1 class="wishlist-header__title">{{ t("wishlist.title") }}</h1>
        </div>
        <span class="wishlist-header__count">
          {{ t("common.saved", { count: hotelIds.length }) }}
        </span>
      </header>

      <div v-if="isFetching && hotels.length === 0" class="wishlist-loading">
        <span class="material-symbols-outlined spin">progress_activity</span>
      </div>

      <div v-else-if="!isFetching && hotelIds.length === 0" class="wishlist-empty">
        <span class="material-symbols-outlined">favorite</span>
        <h2>{{ t("wishlist.emptyTitle") }}</h2>
        <p>{{ t("wishlist.emptyDescription") }}</p>
        <NuxtLink to="/hotels" class="wishlist-empty__link">
          {{ t("wishlist.browseHotels") }}
        </NuxtLink>
      </div>

      <template v-else-if="hotels.length > 0">
        <div class="wishlist-grid">
          <HotelCard
            v-for="hotel in hotels"
            :key="hotel.id"
            :hotel="hotel"
            :min-price="getHotelMinPrice(hotel.id)"
          />
        </div>

        <div v-if="isFetching" class="wishlist-loading">
          <span class="material-symbols-outlined spin">progress_activity</span>
        </div>
      </template>
    </section>
  </main>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useAuth } from "~/composables/useAuth";
import { useAuthPrompt } from "~/composables/useAuthPrompt";
import { useHotels } from "~/composables/useHotels";
import { useRooms } from "~/composables/useRooms";
import { useWishlist } from "~/composables/useWishlist";

const { isAuthenticated } = useAuth();
const { open: openAuthPrompt } = useAuthPrompt();
const { hotels, fetchPaginated, totalPages, currentPage } = useHotels();
const { rooms, fetchAll: fetchRooms } = useRooms();
const { hotelIds, hydrate } = useWishlist();
const { t } = useAppI18n();

const pageSize = 6;
const isFetching = ref(false);
const initialized = ref(false);

useHead(() => ({
  title: t("wishlist.metaTitle"),
  meta: [
    {
      name: "description",
      content: t("wishlist.metaDescription"),
    },
  ],
}));

function getHotelMinPrice(hotelId: number) {
  const hotelRooms = rooms.value.filter((room) => room.hotelId === hotelId);
  if (hotelRooms.length === 0) return 0;
  return Math.min(...hotelRooms.map((room) => room.pricePerNight));
}

async function loadPage(page: number) {
  if (hotelIds.value.length === 0) {
    hotels.value = [];
    return;
  }

  isFetching.value = true;
  try {
    await fetchPaginated({
      page,
      limit: pageSize,
      ids: [...hotelIds.value],
    });
  } finally {
    isFetching.value = false;
  }
}

function handleScroll() {
  if (currentPage.value >= totalPages.value || isFetching.value) {
    return;
  }

  const nearBottom =
    document.documentElement.scrollTop + window.innerHeight >=
    document.documentElement.offsetHeight - 300;

  if (nearBottom) {
    loadPage(currentPage.value + 1);
  }
}

onMounted(async () => {
  if (!isAuthenticated.value) {
    openAuthPrompt({ redirectTo: "/wishlist" });
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  await hydrate();
  await Promise.all([fetchRooms(), loadPage(1)]);
  initialized.value = true;
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});

watch(
  hotelIds,
  () => {
    if (!initialized.value) {
      return;
    }

    hotels.value = [];
    loadPage(1);
  },
  { deep: true },
);
</script>

<style scoped>
.wishlist-page {
  min-height: 100vh;
  background:
    radial-gradient(
      circle at top,
      color-mix(in srgb, var(--color-primary-50) 72%, transparent) 0%,
      transparent 45%
    ),
    linear-gradient(180deg, var(--color-bg-soft) 0%, var(--color-bg) 100%);
}

.wishlist-shell {
  padding-block: clamp(2rem, 5vw, 4.5rem);
}

.wishlist-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.25rem;
  margin-bottom: 1.75rem;
}

.wishlist-header__eyebrow {
  margin: 0 0 0.4rem;
  color: var(--color-primary-600);
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.wishlist-header__title {
  margin: 0;
  color: var(--color-heading);
  font-size: clamp(1.9rem, 4vw, 2.3rem);
  line-height: 1.1;
  font-weight: 800;
}

.wishlist-header__count {
  display: inline-flex;
  align-items: center;
  min-height: 2.35rem;
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  font-weight: 800;
  white-space: nowrap;
}

.wishlist-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.5rem;
}

.wishlist-loading {
  display: flex;
  justify-content: center;
  padding: 2rem;
  color: var(--color-primary-500);
}

.spin {
  animation: spin 1s linear infinite;
  font-size: 2rem;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.wishlist-empty {
  display: grid;
  justify-items: center;
  gap: 0.75rem;
  padding: 4rem 1.5rem;
  border: 1px solid var(--color-border);
  border-radius: 1.5rem;
  background: color-mix(in srgb, var(--color-surface) 88%, transparent);
  text-align: center;
  box-shadow: var(--shadow-card);
}

.wishlist-empty .material-symbols-outlined {
  width: 3.5rem;
  height: 3.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-primary-50) 78%, var(--color-surface));
  color: var(--color-primary-600);
  font-size: 1.75rem;
  font-variation-settings: "FILL" 1, "wght" 500, "GRAD" 0, "opsz" 28;
}

.wishlist-empty h2 {
  margin: 0;
  color: var(--color-heading);
  font-size: 1.45rem;
  font-weight: 800;
}

.wishlist-empty p {
  max-width: 26rem;
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 0.96rem;
  line-height: 1.55;
}

.wishlist-empty__link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.85rem;
  margin-top: 0.25rem;
  padding: 0 1.15rem;
  border-radius: 0.95rem;
  background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600));
  color: var(--color-white);
  font-size: 0.92rem;
  font-weight: 800;
  text-decoration: none;
  box-shadow: 0 12px 24px rgb(0 103 104 / 0.18);
}

@media (max-width: 1024px) {
  .wishlist-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .wishlist-header {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.8rem;
  }

  .wishlist-grid {
    grid-template-columns: 1fr;
  }
}
</style>
