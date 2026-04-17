<template>
  <div>
    <Head>
      <title>VoyageHub — Premium Hotel Booking</title>
      <meta name="description" content="Discover exceptional hotel stays across France. Book your perfect luxury getaway with VoyageHub." />
    </Head>

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1 class="hero-title">
          Discover <span class="hero-accent">Extraordinary</span> Stays
        </h1>
        <p class="hero-subtitle">Curated luxury hotels across France. Unforgettable experiences, one booking away.</p>
        <div class="hero-actions">
          <NuxtLink to="/hotels" class="hero-btn hero-btn--primary">Explore Hotels</NuxtLink>
          <NuxtLink to="/offers" class="hero-btn hero-btn--outline">View Offers</NuxtLink>
        </div>
      </div>
    </section>

    <!-- Featured Hotels -->
    <section class="section">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">Featured Hotels</h2>
          <p class="section-subtitle">Handpicked 5-star destinations for an exceptional experience</p>
        </div>
        <div class="hotels-grid">
          <HotelCard
            v-for="hotel in featured"
            :key="hotel.id"
            :hotel="hotel"
            :min-price="getMinPrice(hotel.id)"
          />
        </div>
        <div class="section-action">
          <NuxtLink to="/hotels" class="view-all-link">
            View all hotels <i class="pi pi-arrow-right"></i>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Special Offers -->
    <section class="section section--alt">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">Special Offers</h2>
          <p class="section-subtitle">Exclusive deals and seasonal packages for unforgettable journeys</p>
        </div>
        <div class="offers-grid">
          <OfferCard v-for="offer in activeOffers" :key="offer.id" :offer="offer" />
        </div>
      </div>
    </section>

    <!-- Stats Bar -->
    <section class="stats-bar">
      <div class="section-container">
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-number">6</span>
            <span class="stat-label">Premium Hotels</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">24</span>
            <span class="stat-label">Luxury Rooms</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">5</span>
            <span class="stat-label">French Cities</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">4.8</span>
            <span class="stat-label">Average Rating</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useHotels } from '~/composables/useHotels'
import { useOffers } from '~/composables/useOffers'
import { useRooms } from '~/composables/useRooms'

const { featured, fetchFeatured } = useHotels()
const { offers: activeOffers, fetchActive } = useOffers()
const { rooms, fetchAll: fetchAllRooms } = useRooms()

function getMinPrice(hotelId: number): number {
  const hotelRooms = rooms.value.filter(r => r.hotelId === hotelId)
  if (hotelRooms.length === 0) return 120
  return Math.min(...hotelRooms.map(r => r.pricePerNight))
}

onMounted(async () => {
  await Promise.all([fetchFeatured(), fetchActive(), fetchAllRooms()])
})
</script>

<style scoped>
/* Hero */
.hero {
  position: relative;
  height: 75vh;
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600') center/cover no-repeat;
}
.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.75) 0%, rgba(15, 23, 42, 0.45) 100%);
}
.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 680px;
  padding: var(--spacing-6);
}
.hero-title {
  font-family: var(--font-family-heading);
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 700;
  color: white;
  line-height: 1.15;
  margin-bottom: var(--spacing-4);
}
.hero-accent { color: var(--color-accent-400); }
.hero-subtitle {
  font-size: var(--font-size-lg);
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: var(--spacing-8);
  line-height: 1.6;
}
.hero-actions { display: flex; justify-content: center; gap: var(--spacing-4); flex-wrap: wrap; }
.hero-btn {
  padding: var(--spacing-3) var(--spacing-8);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-weight: 600;
  text-decoration: none;
  transition: all var(--motion-duration-normal) var(--motion-ease-default);
}
.hero-btn--primary { background: var(--color-primary-500); color: white; }
.hero-btn--primary:hover { background: var(--color-primary-600); transform: translateY(-2px); box-shadow: var(--shadow-lg); }
.hero-btn--outline { border: 2px solid rgba(255,255,255,0.5); color: white; background: transparent; }
.hero-btn--outline:hover { border-color: white; background: rgba(255,255,255,0.1); }

/* Sections */
.section { padding: var(--spacing-16) 0; }
.section--alt { background: var(--color-surface-secondary); }
.section-container { max-width: 1280px; margin: 0 auto; padding: 0 var(--spacing-6); }
.section-header { text-align: center; margin-bottom: var(--spacing-10); }
.section-title { font-family: var(--font-family-heading); font-size: var(--font-size-2xl); font-weight: 700; color: var(--color-text-primary); margin: 0 0 var(--spacing-2); }
.section-subtitle { font-size: var(--font-size-base); color: var(--color-text-secondary); }

.hotels-grid, .offers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: var(--spacing-6);
}

.section-action { text-align: center; margin-top: var(--spacing-8); }
.view-all-link {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-primary-600);
  text-decoration: none;
  transition: gap var(--motion-duration-fast) var(--motion-ease-default);
}
.view-all-link:hover { gap: var(--spacing-3); }

/* Stats Bar */
.stats-bar {
  background: var(--color-primary-600);
  padding: var(--spacing-10) 0;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-6);
  text-align: center;
}
.stat-item { display: flex; flex-direction: column; gap: var(--spacing-1); }
.stat-number {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: white;
}
.stat-label { font-size: var(--font-size-sm); color: rgba(255,255,255,0.75); }

@media (max-width: 768px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .hotels-grid, .offers-grid { grid-template-columns: 1fr; }
}
</style>
