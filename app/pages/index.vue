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
          <div class="image-nest">
            <img src="/images/hero.png" alt="Luxury Hotel" class="main-hero-img" />
            <div class="floating-badge">
              <span class="badge-num">24/7</span>
              <span class="badge-txt">Concierge Support</span>
            </div>
          </div>
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
  padding: 80px 0;
  background: linear-gradient(to bottom, #f8fafc 0%, white 100%);
}

.hero-layout {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 80px;
  padding: 0 40px;
}

.hero-label {
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--color-primary-600);
  margin-bottom: 24px;
}

.hero-title {
  font-size: 64px;
  line-height: 1.1;
  font-weight: 800;
  margin-bottom: 32px;
  letter-spacing: -0.03em;
  color: #1e293b;
}

.hero-lead {
  font-size: 20px;
  line-height: 1.6;
  color: #64748b;
  margin-bottom: 48px;
  max-width: 540px;
}

.hero-cta-group {
  display: flex;
  gap: 20px;
}

.btn-primary {
  background: var(--color-primary-600);
  color: white;
  padding: 18px 36px;
  border-radius: 16px;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
}

.btn-primary:hover {
  background: var(--color-primary-700);
  transform: translateY(-2px);
}

.btn-ghost {
  color: #1e293b;
  padding: 18px 36px;
  border-radius: 16px;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-ghost:hover {
  background: #f1f5f9;
}

.image-nest {
  position: relative;
}

.main-hero-img {
  width: 100%;
  height: 600px;
  object-fit: cover;
  border-radius: 40px;
  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.1);
}

.floating-badge {
  position: absolute;
  bottom: 40px;
  left: -40px;
  background: white;
  padding: 24px;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.badge-num {
  font-size: 24px;
  font-weight: 800;
  color: var(--color-primary-600);
}

.badge-txt {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  color: #64748b;
  margin-top: 4px;
}

/* Destinations Section */
.destinations-section {
  padding: 120px 0;
}

.section-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
}

.section-header-left {
  margin-bottom: 60px;
}

.section-tag {
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #64748b;
  margin-bottom: 12px;
}

.section-title-large {
  font-size: 40px;
  font-weight: 800;
  color: #1e293b;
}

.destinations-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: 400px;
  gap: 24px;
}

.dest-card {
  border-radius: 24px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
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
  background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%);
  display: flex;
  align-items: flex-end;
  padding: 32px;
}

.dest-name {
  color: white;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 4px;
}

.dest-count {
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
