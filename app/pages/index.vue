<template>
  <div class="landing-page">
    <Head>
      <title>VoyageHub — Premium Hotel Booking</title>
      <meta name="description" content="Discover exceptional hotel stays across France. Book your perfect luxury getaway with VoyageHub." />
    </Head>

    <!-- Hero Section: Editorial Asymmetry -->
    <section class="hero-premium">
      <div class="hero-layout">
        <div class="hero-text-side">
          <p class="hero-label">Curated Hospitality</p>
          <h1 class="hero-title">
            The New Era of <span class="text-primary">Exceptional</span> Stays
          </h1>
          <p class="hero-lead">
            Experience France through a lens of architectural authority and personalized luxury. 
            From the bustling streets of Paris to the serene shores of Nice.
          </p>
          <div class="hero-cta-group">
            <NuxtLink to="/hotels" class="btn-primary">Explore Collection</NuxtLink>
            <NuxtLink to="/offers" class="btn-ghost">Seasonal Offers</NuxtLink>
          </div>
        </div>
        <div class="hero-image-side">
          <HeroHotelScene />
        </div>
      </div>
    </section>

    <!-- Top Destinations: Staggered Grid -->
    <section class="destinations-section">
      <div class="section-container">
        <div class="section-header-left">
          <p class="section-tag">Explore France</p>
          <h2 class="section-title-large">Top Destinations</h2>
        </div>
        
        <div class="destinations-grid">
          <div v-for="dest in destinations" :key="dest.name" class="dest-card" :class="dest.size">
            <div class="dest-image-wrap">
              <img :src="dest.image" :alt="dest.name" />
              <div class="dest-overlay">
                <div class="dest-content">
                  <h3 class="dest-name">{{ dest.name }}</h3>
                  <p class="dest-count">{{ dest.hotels }} Collections</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Hotels: Tonal Background -->
    <section class="section-featured">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">Featured Collections</h2>
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
            Explore All Hotels <span class="material-symbols-outlined">arrow_forward</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Why VoyageHub: Benefits -->
    <section class="benefits-section">
      <div class="section-container">
        <div class="benefits-grid">
          <div v-for="benefit in benefits" :key="benefit.title" class="benefit-item">
            <div class="benefit-icon-wrap">
              <span class="material-symbols-outlined">{{ benefit.icon }}</span>
            </div>
            <h4 class="benefit-title">{{ benefit.title }}</h4>
            <p class="benefit-text">{{ benefit.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Special Offers -->
    <section class="section-offers">
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

const destinations = [
  { name: 'Paris', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34', hotels: 12, size: 'large' },
  { name: 'Nice', image: 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca', hotels: 8, size: 'small' },
  { name: 'Lyon', image: 'https://images.unsplash.com/photo-1509600110300-21b9d5fedeb7', hotels: 5, size: 'small' },
  { name: 'Bordeaux', image: 'https://images.unsplash.com/photo-1563214815-38f382b6831d', hotels: 7, size: 'medium' }
]

const benefits = [
  { icon: 'hotel', title: 'Handpicked Hotels', text: 'Every property in our collection is personally vetted for architectural merit and service excellence.' },
  { icon: 'support_agent', title: 'Concierge Service', text: 'Our travel experts are available 24/7 to handle your requests, from dinner reservations to private transfers.' },
  { icon: 'verified', title: 'Best Rate Guarantee', text: 'Book with confidence knowing you are receiving the most competitive rates available online.' }
]

onMounted(async () => {
  await fetchFeatured()
  await fetchActive()
  await fetchAllRooms()
})

function getMinPrice(hotelId: number): number {
  const hotelRooms = rooms.value.filter(r => r.hotelId === hotelId)
  if (hotelRooms.length === 0) return 120
  return Math.min(...hotelRooms.map(r => r.pricePerNight))
}
</script>

<style scoped>
.landing-page {
  background: white;
}

/* Hero Premium */
.hero-premium {
  padding: 36px 0 28px;
  background: linear-gradient(to bottom, #f8fafc 0%, white 100%);
}

.hero-layout {
  max-width: 1320px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 40px;
  padding: 0 32px;
}

.hero-label {
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--color-primary-600);
  margin-bottom: 12px;
}

.hero-title {
  font-size: clamp(42px, 4.4vw, 52px);
  line-height: 1.02;
  font-weight: 800;
  margin-bottom: 16px;
  letter-spacing: -0.03em;
  color: #1e293b;
}

.hero-lead {
  font-size: 16px;
  line-height: 1.6;
  color: #64748b;
  margin-bottom: 24px;
  max-width: 460px;
}

.hero-cta-group {
  display: flex;
  gap: 12px;
}

.btn-primary {
  background: var(--color-primary-600);
  color: white;
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 800;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 10px 20px rgba(0, 103, 104, 0.12);
}

.btn-primary:hover {
  background: var(--color-primary-700);
  transform: translateY(-2px);
}

.btn-ghost {
  color: #1e293b;
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 800;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-ghost:hover {
  background: #f1f5f9;
}

/* Destinations Section */
.destinations-section {
  padding: 24px 0 18px;
}

.section-container {
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 32px;
}

.section-header-left {
  margin-bottom: 16px;
}

.section-tag {
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: #64748b;
  margin-bottom: 6px;
}

.section-title-large {
  font-size: 28px;
  font-weight: 800;
  color: #1e293b;
  letter-spacing: -0.03em;
}

.destinations-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: 248px;
  gap: 14px;
}

.dest-card {
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
}

.dest-card.large { grid-column: span 2; }

.dest-image-wrap {
  width: 100%;
  height: 100%;
}

.dest-image-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.dest-card:hover img {
  transform: scale(1.1);
}

.dest-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(15, 23, 42, 0.72) 0%, rgba(15, 23, 42, 0.16) 55%, transparent 80%);
  display: flex;
  align-items: flex-end;
  padding: 16px;
}

.dest-name {
  color: white;
  font-size: 20px;
  font-weight: 800;
  margin: 0 0 2px;
}

.dest-count {
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  font-size: 13px;
  line-height: 1.4;
}

/* Sections */
.section-featured,
.benefits-section,
.section-offers {
  padding: 22px 0 30px;
}

.section-header {
  text-align: center;
  margin-bottom: 18px;
}

.section-title {
  font-family: var(--font-family-heading);
  font-size: 26px;
  font-weight: 800;
  color: var(--color-text-primary);
  letter-spacing: -0.03em;
  margin: 0 0 4px;
}

.section-subtitle {
  max-width: 520px;
  margin: 0 auto;
  font-size: 13px;
  line-height: 1.5;
  color: var(--color-text-secondary);
}

.hotels-grid, .offers-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  align-items: stretch;
}

.section-action { text-align: center; margin-top: 16px; }
.view-all-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 800;
  color: var(--color-primary-600);
  text-decoration: none;
  transition: gap var(--motion-duration-fast) var(--motion-ease-default);
}
.view-all-link:hover { gap: 12px; }

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.benefit-item {
  padding: 18px 16px;
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbfe 100%);
  border: 1px solid rgba(225, 232, 240, 0.92);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.05);
}

.benefit-icon-wrap {
  width: 38px;
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  margin-bottom: 10px;
  background: rgba(0, 103, 104, 0.08);
  color: var(--color-primary-600);
}

.benefit-icon-wrap .material-symbols-outlined {
  font-size: 22px;
}

.benefit-title {
  margin: 0 0 6px;
  color: #0f172a;
  font-size: 16px;
  line-height: 1.2;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.benefit-text {
  margin: 0;
  color: #64748b;
  font-size: 13px;
  line-height: 1.6;
}

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

@media (max-width: 1280px) {
  .hotels-grid,
  .offers-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 1024px) {
  .hero-layout {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .destinations-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-template-rows: 220px 220px;
  }

  .benefits-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .hero-premium {
    padding: 28px 0 30px;
  }

  .hero-layout {
    grid-template-columns: 1fr;
    gap: 22px;
    padding: 0 18px;
  }

  .hero-title {
    font-size: 36px;
  }

  .hero-lead {
    font-size: 16px;
    margin-bottom: 20px;
  }

  .hero-cta-group {
    flex-direction: column;
    align-items: flex-start;
  }

  .section-container {
    padding: 0 18px;
  }

  .destinations-grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }

  .dest-card.large {
    grid-column: span 1;
  }

  .dest-card {
    min-height: 200px;
  }

  .hotels-grid,
  .offers-grid {
    grid-template-columns: 1fr;
  }

  .destinations-section,
  .section-featured,
  .benefits-section,
  .section-offers {
    padding: 18px 0 24px;
  }

  .stats-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
