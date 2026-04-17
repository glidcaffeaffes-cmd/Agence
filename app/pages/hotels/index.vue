<template>
  <div class="hotels-page">
    <!-- Header -->
    <header class="page-header">
      <div class="header-content">
        <h1 class="page-title">Find Your Perfect Stay</h1>
        <p class="page-subtitle">Browse through our curated collection of luxury hotels</p>
      </div>
    </header>

    <div class="page-container">
      <!-- Search & Filters -->
      <aside class="filters-sidebar">
        <AppCard class="filters-card" variant="default">
          <h3 class="filters-title">Filter By</h3>
          
          <div class="filter-group">
            <label class="filter-label">Destination</label>
            <div class="search-input-wrap">
              <i class="pi pi-search search-icon"></i>
              <input type="text" v-model="searchQuery" placeholder="City or hotel name..." class="filter-input" />
            </div>
          </div>

          <div class="filter-group">
            <label class="filter-label">Star Rating</label>
            <div class="rating-filters">
              <label v-for="star in [5,4,3]" :key="star" class="checkbox-label">
                <input type="checkbox" :value="star" v-model="selectedStars" />
                <AppStarRating :rating="star" />
              </label>
            </div>
          </div>
          
          <div class="filter-group">
            <label class="filter-label">Amenities</label>
            <div class="amenity-filters">
              <label v-for="amenity in commonAmenities" :key="amenity" class="checkbox-label">
                <input type="checkbox" :value="amenity" v-model="selectedAmenities" />
                <span>{{ amenity }}</span>
              </label>
            </div>
          </div>

          <button class="clear-btn" @click="clearFilters" v-if="hasActiveFilters">Clear Filters</button>
        </AppCard>
      </aside>

      <!-- Results Grid -->
      <main class="results-main">
        <div class="results-header">
          <span class="results-count">Showing {{ filteredHotels.length }} hotels</span>
        </div>

        <div v-if="filteredHotels.length > 0" class="hotels-grid">
          <HotelCard 
            v-for="hotel in filteredHotels" 
            :key="hotel.id" 
            :hotel="hotel" 
            :min-price="getMinPrice(hotel.id)" 
          />
        </div>

        <AppEmptyState 
          v-else 
          icon="pi pi-search" 
          title="No hotels found" 
          description="Try adjusting your filters or destination to see more results."
        >
          <template #action>
            <button class="app-btn app-btn--primary" @click="clearFilters">Clear all filters</button>
          </template>
        </AppEmptyState>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useHotels } from '~/composables/useHotels'
import { useRooms } from '~/composables/useRooms'

const { hotels, fetchAll } = useHotels()
const { rooms, fetchAll: fetchAllRooms } = useRooms()

// Filter State
const searchQuery = ref('')
const selectedStars = ref<number[]>([])
const selectedAmenities = ref<string[]>([])

const commonAmenities = ['Spa', 'Pool', 'Restaurant', 'Gym', 'Sea View', 'Parking']

const hasActiveFilters = computed(() => {
  return searchQuery.value !== '' || selectedStars.value.length > 0 || selectedAmenities.value.length > 0
})

const filteredHotels = computed(() => {
  return hotels.value.filter(hotel => {
    // Text search
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      if (!hotel.name.toLowerCase().includes(q) && !hotel.city.toLowerCase().includes(q)) return false
    }
    // Stars
    if (selectedStars.value.length > 0 && !selectedStars.value.includes(hotel.stars)) return false
    // Amenities
    if (selectedAmenities.value.length > 0) {
      const hasAllSelected = selectedAmenities.value.every(a => hotel.amenities.includes(a))
      if (!hasAllSelected) return false
    }
    return true
  })
})

function getMinPrice(hotelId: number): number {
  const hotelRooms = rooms.value.filter(r => r.hotelId === hotelId)
  if (hotelRooms.length === 0) return 120
  return Math.min(...hotelRooms.map(r => r.pricePerNight))
}

function clearFilters() {
  searchQuery.value = ''
  selectedStars.value = []
  selectedAmenities.value = []
}

onMounted(() => {
  fetchAll()
  fetchAllRooms()
})
</script>

<style scoped>
.hotels-page { background: var(--color-bg-soft); min-height: 100vh; padding-bottom: var(--spacing-16); }

.page-header {
  background: var(--color-surface-primary);
  border-bottom: 1px solid var(--color-border);
  padding: var(--spacing-10) var(--spacing-6);
  margin-bottom: var(--spacing-8);
}
.header-content { max-width: 1280px; margin: 0 auto; }
.page-title { font-family: var(--font-family-heading); font-size: var(--font-size-2xl); font-weight: 700; margin: 0 0 var(--spacing-2); color: var(--color-text-primary); }
.page-subtitle { font-size: var(--font-size-base); color: var(--color-text-secondary); margin: 0; }

.page-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--spacing-6);
  display: flex;
  gap: var(--spacing-8);
  flex-direction: column;
}
@media (min-width: 992px) {
  .page-container { flex-direction: row; align-items: flex-start; }
}

.filters-sidebar { width: 100%; }
@media (min-width: 992px) { .filters-sidebar { width: 280px; flex-shrink: 0; position: sticky; top: 100px; } }

.filters-title { font-size: var(--font-size-lg); font-weight: 600; margin: 0 0 var(--spacing-4); padding-bottom: var(--spacing-3); border-bottom: 1px solid var(--color-border); }

.filter-group { margin-bottom: var(--spacing-5); }
.filter-label { display: block; font-size: var(--font-size-sm); font-weight: 600; color: var(--color-text-primary); margin-bottom: var(--spacing-2); }

.search-input-wrap { position: relative; }
.search-icon { position: absolute; left: var(--spacing-3); top: 50%; transform: translateY(-50%); color: var(--color-text-muted); }
.filter-input { width: 100%; padding: var(--spacing-2) var(--spacing-3) var(--spacing-2) var(--spacing-8); border: 1px solid var(--color-border); border-radius: var(--radius-md); font-size: var(--font-size-sm); transition: border-color var(--motion-duration-fast); }
.filter-input:focus { outline: none; border-color: var(--color-primary-500); }

.checkbox-label { display: flex; align-items: center; gap: var(--spacing-2); font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-bottom: var(--spacing-2); cursor: pointer; }
.checkbox-label input { cursor: pointer; accent-color: var(--color-primary-500); }

.clear-btn { width: 100%; background: none; border: 1px dashed var(--color-border); padding: var(--spacing-2); border-radius: var(--radius-md); color: var(--color-text-muted); cursor: pointer; font-size: var(--font-size-sm); transition: all 0.2s; }
.clear-btn:hover { border-color: var(--color-error); color: var(--color-error); }

.results-main { flex: 1; }
.results-header { margin-bottom: var(--spacing-4); }
.results-count { font-size: var(--font-size-sm); color: var(--color-text-secondary); font-weight: 500; }

.hotels-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: var(--spacing-6); }

.app-btn { padding: var(--spacing-2) var(--spacing-4); border-radius: var(--radius-md); font-weight: 500; cursor: pointer; border: none; }
.app-btn--primary { background: var(--color-primary-600); color: white; }
</style>
