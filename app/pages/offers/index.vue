<template>
  <div class="offers-page">
    <!-- ── Hero ── -->
    <section class="offers-hero">
      <div class="offers-hero__overlay"></div>
      <div class="offers-hero__noise"></div>
      <div class="page-container">
        <div class="offers-hero__content">
          <h1 class="offers-hero__title">
            Curated <span class="offers-hero__accent">Deals</span>
          </h1>
          <p class="offers-hero__subtitle">
            Premium escapes and seasonal packages selected for you.
          </p>

          <!-- stats pill row -->
          <div v-if="!loading && offers.length > 0" class="offers-hero__stats">
            <div class="stat-pill">
              <span class="material-symbols-outlined">local_offer</span>
              {{ offers.length }} active offer{{ offers.length !== 1 ? 's' : '' }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Main content ── -->
    <main class="page-container offers-main">

      <!-- Loading skeletons -->
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

      <!-- Grid -->
      <div v-else-if="offers.length > 0" class="offers-grid">
        <OfferCard
          v-for="offer in offers"
          :key="offer.id"
          :offer="offer"
        />
      </div>

      <!-- Empty state -->
      <AppEmptyState
        v-else
        icon="pi pi-ticket"
        title="No active offers"
        description="We're currently preparing new exclusive deals. Please check back soon."
      >
        <template #action>
          <NuxtLink to="/hotels" class="btn-explore">
            <span class="material-symbols-outlined">hotel</span>
            Explore Hotels
          </NuxtLink>
        </template>
      </AppEmptyState>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useOffers } from '~/composables/useOffers'

const { offers, loading, fetchActive } = useOffers()

onMounted(() => {
  fetchActive()
})

useHead({
  title: 'Exclusive Offers | VoyageHub',
  meta: [
    { name: 'description', content: 'Discover the best seasonal travel deals and exclusive hotel offers on VoyageHub.' }
  ]
})
</script>

<style scoped>
/* ─── Page Shell ─────────────────────────────────────────── */
.offers-page {
  background: var(--color-bg-soft);
  min-height: 100vh;
  padding-bottom: var(--spacing-12);
}

/* ─── Hero ───────────────────────────────────────────────── */
.offers-hero {
  position: relative;
  background: linear-gradient(135deg, var(--color-navy-700) 0%, var(--color-primary-700) 100%);
  padding: var(--spacing-10) 0 var(--spacing-16);
  color: var(--color-white);
  overflow: hidden;
  margin-bottom: 0;
}

.offers-hero__overlay {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 75% 0%, rgba(205, 175, 93, 0.14) 0%, transparent 60%),
    radial-gradient(ellipse at 10% 100%, rgba(0, 103, 104, 0.2) 0%, transparent 55%);
}

/* subtle noise texture overlay */
.offers-hero__noise {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
  opacity: 0.4;
  pointer-events: none;
}

.offers-hero__content {
  position: relative;
  z-index: 1;
  max-width: 680px;
}

.offers-hero__title {
  font-size: clamp(1.8rem, 4.5vw, 2.8rem);
  font-weight: 800;
  margin: 0 0 var(--spacing-2);
  line-height: 1.1;
  letter-spacing: -0.025em;
  color: var(--color-white);
}

.offers-hero__accent {
  color: var(--color-accent-400);
}

.offers-hero__subtitle {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.72);
  margin: 0 0 var(--spacing-5);
  font-weight: 500;
  line-height: 1.5;
}

/* Stats pills */
.offers-hero__stats {
  display: flex;
  gap: var(--spacing-3);
  flex-wrap: wrap;
}

.stat-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: var(--radius-pill);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.14);
  font-size: 11px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.88);
  letter-spacing: 0.04em;
  backdrop-filter: blur(10px);
}

.stat-pill .material-symbols-outlined {
  font-size: 14px;
  color: var(--color-accent-400);
}

/* ─── Container ─────────────────────────────────────────── */
.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-6);
}

/* ─── Main Content ──────────────────────────────────────── */
.offers-main {
  margin-top: calc(-1 * var(--spacing-8));
  position: relative;
  z-index: 10;
}

/* ─── Offers Grid ───────────────────────────────────────── */
.offers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(268px, 1fr));
  gap: var(--spacing-6);
}

/* ─── Skeleton Cards ────────────────────────────────────── */
.skeleton-card {
  background: var(--color-white);
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid var(--color-border-soft);
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);
}

.skeleton-image {
  height: 186px;
  background: linear-gradient(90deg, var(--color-gray-100) 25%, var(--color-gray-50) 50%, var(--color-gray-100) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.6s infinite;
}

.skeleton-body {
  padding: 14px 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.skeleton-line {
  height: 12px;
  border-radius: var(--radius-sm);
  background: linear-gradient(90deg, var(--color-gray-100) 25%, var(--color-gray-50) 50%, var(--color-gray-100) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.6s infinite;
  width: 100%;
}

.skeleton-line--short { width: 45%; }
.skeleton-line--medium { width: 70%; }

.skeleton-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  border-top: 1px solid var(--color-border-soft);
  gap: 10px;
}

.skeleton-btn {
  width: 64px;
  height: 34px;
  border-radius: 10px;
  background: linear-gradient(90deg, var(--color-gray-100) 25%, var(--color-gray-50) 50%, var(--color-gray-100) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.6s infinite;
  flex-shrink: 0;
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ─── Explore CTA ───────────────────────────────────────── */
.btn-explore {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-3) var(--spacing-8);
  background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600));
  color: var(--color-white);
  border-radius: var(--radius-pill);
  font-weight: 700;
  margin-top: var(--spacing-5);
  transition: all var(--motion-duration-normal);
  font-size: var(--font-size-sm);
  box-shadow: 0 8px 20px rgba(0, 103, 104, 0.22);
}

.btn-explore .material-symbols-outlined {
  font-size: 18px;
}

.btn-explore:hover {
  background: linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700));
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(0, 103, 104, 0.3);
  color: var(--color-white);
}

/* ─── Responsive ────────────────────────────────────────── */
@media (max-width: 1024px) {
  .offers-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
}

@media (max-width: 768px) {
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
