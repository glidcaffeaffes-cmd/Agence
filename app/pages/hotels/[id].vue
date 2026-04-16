<template>
  <div class="hotel-detail">
    <div v-if="loading" class="loading-state">
      <i class="pi pi-spinner pi-spin"></i> Loading hotel details...
    </div>
    
    <template v-else-if="hotel">
      <!-- Image Gallery Header -->
      <section class="gallery-header">
        <div class="gallery-grid">
          <div class="gallery-main">
            <img :src="hotel.images[0]" :alt="hotel.name">
          </div>
          <div class="gallery-side">
            <img v-for="(img, idx) in hotel.images.slice(1, 3)" :key="idx" :src="img" :alt="`${hotel.name} - Image ${idx + 2}`">
          </div>
        </div>
      </section>

      <!-- Content -->
      <div class="detail-container">
        <div class="detail-layout">
          <!-- Main Info -->
          <div class="main-column">
            <div class="hotel-header">
              <div class="hotel-badges">
                <AppBadge color="primary">{{ hotel.stars }} Stars</AppBadge>
                <AppStarRating :rating="hotel.stars" :count="48" :show-count="true" />
              </div>
              <h1 class="hotel-title">{{ hotel.name }}</h1>
              <p class="hotel-location"><i class="pi pi-map-marker"></i> {{ hotel.address }}, {{ hotel.city }}, {{ hotel.country }}</p>
            </div>

            <section class="info-section">
              <h2 class="section-title">About the Hotel</h2>
              <p class="hotel-description">{{ hotel.description }}</p>
            </section>

            <section class="info-section">
              <h2 class="section-title">Amenities</h2>
              <div class="amenities-grid">
                <div v-for="amenity in hotel.amenities" :key="amenity" class="amenity-item">
                  <i class="pi pi-check-circle"></i> {{ amenity }}
                </div>
              </div>
            </section>

            <section id="rooms" class="info-section">
              <h2 class="section-title">Available Rooms</h2>
              <div class="rooms-list">
                <RoomCard 
                  v-for="room in rooms" 
                  :key="room.id" 
                  :room="room" 
                  @book="handleBooking"
                />
              </div>
            </section>
          </div>

          <!-- Sticky Sidebar -->
          <aside class="sidebar-column">
            <AppCard class="booking-card" variant="elevated">
              <h3 class="booking-title">Book your stay</h3>
              <div class="price-wrap">
                <span class="price-from">From</span>
                <span class="price-val">€{{ minPrice }}</span>
                <span class="price-unit">/night</span>
              </div>
              
              <div class="booking-form">
                <div class="form-group">
                  <label>Check-in / Check-out</label>
                  <input type="text" placeholder="Select dates" class="form-input" disabled />
                </div>
                <div class="form-group">
                  <label>Guests</label>
                  <select class="form-input" disabled>
                    <option>2 Adults, 1 Room</option>
                  </select>
                </div>
                <!-- Demo action implies redirect to room selection hash -->
                <button class="book-btn" @click="scrollToRooms">See Availability</button>
              </div>
            </AppCard>
            
            <div class="map-placeholder">
              <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&q=80" alt="Map" />
              <div class="map-overlay">
                <i class="pi pi-map"></i> View on map
              </div>
            </div>
          </aside>
        </div>
      </div>
    </template>

    <AppEmptyState 
      v-else 
      icon="pi pi-exclamation-triangle" 
      title="Hotel not found" 
      description="The hotel you're looking for doesn't exist or has been removed."
    >
      <template #action>
        <NuxtLink to="/hotels" class="app-btn">Back to Hotels</NuxtLink>
      </template>
    </AppEmptyState>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHotels } from '~/composables/useHotels'
import { useRooms } from '~/composables/useRooms'
import type { Hotel, Room } from '~/types/models'

const route = useRoute()
const router = useRouter()
const { getById } = useHotels()
const { rooms, fetchByHotel } = useRooms()

const hotel = ref<Hotel | null>(null)
const loading = ref(true)

const minPrice = computed(() => {
  if (rooms.value.length === 0) return 0
  return Math.min(...rooms.value.map(r => r.pricePerNight))
})

onMounted(async () => {
  const id = Number(route.params.id)
  if (!isNaN(id)) {
    const data = await getById(id)
    if (data) {
      hotel.value = data
      await fetchByHotel(id)
    }
  }
  loading.value = false
})

function scrollToRooms() {
  document.getElementById('rooms')?.scrollIntoView({ behavior: 'smooth' })
}

function handleBooking(room: Room) {
  // In a real app, go to checkout page or show booking modal
  // For UI implementation, we'll just redirect to a checkout placeholder or show alert
  alert(`Booking initiated for ${room.type} at ${hotel.value?.name}`)
}
</script>

<style scoped>
.hotel-detail { padding-bottom: var(--spacing-16); background: var(--color-bg-soft); }

.loading-state { text-align: center; padding: var(--spacing-16); color: var(--color-text-muted); font-size: var(--font-size-lg); }

/* Gallery */
.gallery-header { padding: var(--spacing-4) var(--spacing-6); max-width: 1280px; margin: 0 auto; }
.gallery-grid { display: grid; grid-template-columns: 2fr 1fr; gap: var(--spacing-2); height: 50vh; min-height: 400px; border-radius: var(--radius-xl); overflow: hidden; }
.gallery-main img { width: 100%; height: 100%; object-fit: cover; }
.gallery-side { display: grid; grid-template-rows: 1fr 1fr; gap: var(--spacing-2); }
.gallery-side img { width: 100%; height: 100%; object-fit: cover; }
@media (max-width: 768px) { .gallery-grid { grid-template-columns: 1fr; } .gallery-side { display: none; } }

/* Layout */
.detail-container { max-width: 1280px; margin: 0 auto; padding: var(--spacing-8) var(--spacing-6); }
.detail-layout { display: flex; flex-direction: column; gap: var(--spacing-8); }
@media (min-width: 992px) { .detail-layout { flex-direction: row; } .main-column { flex: 1; } .sidebar-column { width: 340px; flex-shrink: 0; } }

/* Main Column */
.hotel-header { padding-bottom: var(--spacing-6); border-bottom: 1px solid var(--color-border); margin-bottom: var(--spacing-6); }
.hotel-badges { display: flex; align-items: center; gap: var(--spacing-4); margin-bottom: var(--spacing-3); }
.hotel-title { font-family: var(--font-family-heading); font-size: var(--font-size-3xl); font-weight: 700; color: var(--color-text-primary); margin: 0 0 var(--spacing-2); }
.hotel-location { font-size: var(--font-size-sm); color: var(--color-text-muted); display: flex; align-items: center; gap: var(--spacing-2); }

.info-section { margin-bottom: var(--spacing-8); }
.section-title { font-family: var(--font-family-heading); font-size: var(--font-size-xl); font-weight: 600; margin: 0 0 var(--spacing-4); border-bottom: 1px solid var(--color-border); padding-bottom: var(--spacing-2); }
.hotel-description { font-size: var(--font-size-base); color: var(--color-text-secondary); line-height: 1.7; }

.amenities-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: var(--spacing-4); }
.amenity-item { display: flex; align-items: center; gap: var(--spacing-2); font-size: var(--font-size-sm); color: var(--color-text-primary); }
.amenity-item i { color: var(--color-success); font-size: 1.2rem; }

.rooms-list { display: flex; flex-direction: column; gap: var(--spacing-6); }

/* Sidebar */
.sidebar-column { position: sticky; top: 100px; }
.booking-card { padding: var(--spacing-6); margin-bottom: var(--spacing-6); }
.booking-title { font-size: var(--font-size-lg); font-weight: 600; margin: 0 0 var(--spacing-4); }
.price-wrap { display: flex; align-items: baseline; gap: 4px; margin-bottom: var(--spacing-6); padding-bottom: var(--spacing-4); border-bottom: 1px solid var(--color-border); }
.price-from { font-size: var(--font-size-sm); color: var(--color-text-muted); }
.price-val { font-size: var(--font-size-2xl); font-weight: 700; color: var(--color-primary-600); font-family: var(--font-family-heading); }
.price-unit { font-size: var(--font-size-sm); color: var(--color-text-muted); }

.form-group { margin-bottom: var(--spacing-4); }
.form-group label { display: block; font-size: var(--font-size-xs); font-weight: 600; color: var(--color-text-muted); margin-bottom: var(--spacing-1); text-transform: uppercase; }
.form-input { width: 100%; padding: var(--spacing-3); border: 1px solid var(--color-border); border-radius: var(--radius-md); font-size: var(--font-size-sm); background: var(--color-bg-soft); }

.book-btn { width: 100%; padding: var(--spacing-3); background: var(--color-accent-500); color: white; border: none; border-radius: var(--radius-md); font-size: var(--font-size-base); font-weight: 600; cursor: pointer; transition: background 0.2s; margin-top: var(--spacing-2); }
.book-btn:hover { background: var(--color-accent-600); }

.map-placeholder { position: relative; height: 160px; border-radius: var(--radius-lg); overflow: hidden; cursor: pointer; }
.map-placeholder img { width: 100%; height: 100%; object-fit: cover; }
.map-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; gap: var(--spacing-2); transition: background 0.2s; }
.map-placeholder:hover .map-overlay { background: rgba(0,0,0,0.5); }

.app-btn { display: inline-block; padding: var(--spacing-2) var(--spacing-4); background: var(--color-primary-600); color: white; text-decoration: none; border-radius: var(--radius-md); font-weight: 500; }
</style>
