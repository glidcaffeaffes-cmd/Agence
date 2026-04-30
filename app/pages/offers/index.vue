<template>
  <div class="offers-page">
    <section class="offers-hero">
      <div class="offers-hero__overlay"></div>
      <div class="offers-hero__noise"></div>
      <div class="page-container">
        <div class="offers-hero__content">
          <h1 class="offers-hero__title">
            {{ t("offersPage.title") }}
            <span class="offers-hero__accent">{{ t("offersPage.accent") }}</span>
          </h1>
          <p class="offers-hero__subtitle">
            {{ t("offersPage.subtitle") }}
          </p>

          <div
            v-if="!loading && offers.length > 0"
            class="offers-hero__stats"
          >
            <div class="stat-pill">
              <span class="material-symbols-outlined">local_offer</span>
              {{ activeOffersLabel }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <main class="page-container offers-main">
      <div v-if="loading" class="offers-grid">
        <div v-for="i in 8" :key="i" class="skeleton-card">
          <div class="skeleton-image"></div>
          <div class="skeleton-body">
            <div class="skeleton-line skeleton-line--short"></div>
            <div class="skeleton-line"></div>
            <div class="skeleton-line skeleton-line--medium"></div>
            <div class="skeleton-footer">
              <div class="skeleton-line skeleton-line--short"></div>
              <div class="skeleton-btn"></div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="offers.length > 0" class="offers-grid">
        <OfferCard v-for="offer in offers" :key="offer.id" :offer="offer" />
      </div>

      <AppEmptyState
        v-else
        icon="pi pi-ticket"
        :title="t('offersPage.emptyTitle')"
        :description="t('offersPage.emptyDescription')"
      >
        <template #action>
          <NuxtLink to="/hotels" class="btn-explore">
            <span class="material-symbols-outlined">hotel</span>
            {{ t("offersPage.exploreHotels") }}
          </NuxtLink>
        </template>
      </AppEmptyState>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useOffers } from '~/composables/useOffers'

const { offers, loading, fetchActive } = useOffers()
const { t } = useAppI18n()

const activeOffersLabel = computed(() =>
  offers.value.length === 1
    ? t('offersPage.activeOfferOne', { count: offers.value.length })
    : t('offersPage.activeOfferOther', { count: offers.value.length }),
)

onMounted(() => {
  fetchActive()
})

useHead(() => ({
  title: t('offersPage.metaTitle'),
  meta: [
    {
      name: 'description',
      content: t('offersPage.metaDescription'),
    },
  ],
}))
</script>

<style scoped>
.offers-page {
  min-height: 100vh;
  padding-bottom: var(--spacing-12);
  background: var(--color-bg-soft);
}

.offers-hero {
  position: relative;
  overflow: hidden;
  margin-bottom: 0;
  padding: var(--spacing-10) 0 var(--spacing-16);
  color: var(--color-white);
  background: linear-gradient(
    135deg,
    var(--color-navy-700) 0%,
    var(--color-primary-700) 100%
  );
}

.offers-hero__overlay {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      ellipse at 75% 0%,
      rgb(205 175 93 / 0.14) 0%,
      transparent 60%
    ),
    radial-gradient(
      ellipse at 10% 100%,
      rgb(0 103 104 / 0.2) 0%,
      transparent 55%
    );
}

.offers-hero__noise {
  position: absolute;
  inset: 0;
  opacity: 0.4;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
}

.page-container {
  width: min(1200px, calc(100% - 2rem));
  margin: 0 auto;
}

.offers-hero__content {
  position: relative;
  z-index: 1;
  max-width: 680px;
}

.offers-hero__title {
  margin: 0 0 var(--spacing-2);
  color: var(--color-white);
  font-size: clamp(1.8rem, 4.5vw, 2.8rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.025em;
}

.offers-hero__accent {
  color: var(--color-accent-400);
}

.offers-hero__subtitle {
  margin: 0 0 var(--spacing-5);
  color: rgb(255 255 255 / 0.74);
  font-size: 0.96rem;
  font-weight: 500;
  line-height: 1.6;
}

.offers-hero__stats {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-3);
}

.stat-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border: 1px solid rgb(255 255 255 / 0.14);
  border-radius: var(--radius-pill);
  backdrop-filter: blur(10px);
  background: rgb(255 255 255 / 0.1);
  color: rgb(255 255 255 / 0.88);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.stat-pill .material-symbols-outlined {
  color: var(--color-accent-400);
  font-size: 14px;
}

.offers-main {
  position: relative;
  z-index: 10;
  margin-top: calc(-1 * var(--spacing-8));
}

.offers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(268px, 1fr));
  gap: var(--spacing-6);
}

.skeleton-card {
  overflow: hidden;
  border: 1px solid var(--color-border-soft);
  border-radius: 18px;
  background: var(--color-surface);
  box-shadow: var(--shadow-sm);
}

.skeleton-image,
.skeleton-line,
.skeleton-btn {
  background:
    linear-gradient(
      90deg,
      var(--color-surface-secondary) 25%,
      color-mix(in srgb, var(--color-surface) 85%, var(--color-surface-secondary)) 50%,
      var(--color-surface-secondary) 75%
    );
  background-size: 200% 100%;
  animation: shimmer 1.6s infinite;
}

.skeleton-image {
  height: 186px;
}

.skeleton-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px 15px;
}

.skeleton-line {
  width: 100%;
  height: 12px;
  border-radius: var(--radius-sm);
}

.skeleton-line--short {
  width: 45%;
}

.skeleton-line--medium {
  width: 70%;
}

.skeleton-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--color-border-soft);
}

.skeleton-btn {
  width: 64px;
  height: 34px;
  flex-shrink: 0;
  border-radius: 10px;
}

.btn-explore {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  margin-top: var(--spacing-5);
  padding: var(--spacing-3) var(--spacing-8);
  border-radius: var(--radius-pill);
  background: linear-gradient(
    135deg,
    var(--color-primary-500),
    var(--color-primary-600)
  );
  color: var(--color-white);
  font-size: var(--font-size-sm);
  font-weight: 700;
  box-shadow: 0 8px 20px rgb(0 103 104 / 0.22);
  transition: all var(--motion-duration-normal);
}

.btn-explore:hover {
  transform: translateY(-2px);
  color: var(--color-white);
  box-shadow: 0 12px 28px rgb(0 103 104 / 0.3);
}

.btn-explore .material-symbols-outlined {
  font-size: 18px;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}

@media (max-width: 1024px) {
  .offers-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
}

@media (max-width: 768px) {
  .page-container {
    width: min(100% - 1.5rem, 1200px);
  }

  .offers-hero {
    padding: var(--spacing-8) 0 var(--spacing-14);
  }

  .offers-main {
    margin-top: calc(-1 * var(--spacing-6));
  }

  .offers-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: var(--spacing-4);
  }
}

@media (max-width: 480px) {
  .offers-grid {
    grid-template-columns: 1fr;
  }
}
</style>
