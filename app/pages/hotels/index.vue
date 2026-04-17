<template>
  <div class="hotels-page">
    <div class="page-header">
      <div class="page-header__content">
        <h1 class="page-title">Nos Hôtels</h1>
        <p class="page-subtitle">Trouvez l'hôtel parfait pour votre séjour</p>
      </div>
    </div>

    <div class="main-container">
      <!-- Filters Sidebar -->
      <aside class="filters-sidebar">
        <div class="sidebar-header">
          <span class="material-symbols-outlined">filter_list</span>
          <span>Filtres</span>
        </div>

        <div class="filter-section">
          <label class="filter-label">Prix par nuit</label>
          <div class="slider-wrapper">
            <Slider v-model="priceRange" range :min="0" :max="1000" class="custom-slider" />
            <div class="slider-values">
              <span>{{ priceRange[0] }}€</span>
              <span>{{ priceRange[1] }}€</span>
            </div>
          </div>
        </div>

        <div class="filter-section">
          <label class="filter-label">Classement</label>
          <div class="checkbox-group">
            <div v-for="star in [5, 4, 3]" :key="star" class="checkbox-field">
              <Checkbox v-model="selectedStars" :inputId="`star-${star}`" :value="star" />
              <label :for="`star-${star}`" class="checkbox-label">
                {{ star }} <span class="material-symbols-outlined star-icon-small">star</span>
              </label>
            </div>
          </div>
        </div>

        <div class="filter-section">
          <label class="filter-label">Destination</label>
          <Select 
            v-model="selectedCity" 
            :options="cityOptions" 
            optionLabel="label" 
            optionValue="value" 
            placeholder="Toutes les villes" 
            appendTo="self"
            class="full-width-select destination-dropdown" 
          />
        </div>

        <div class="filter-actions">
          <button class="apply-btn" @click="applyFilters">Appliquer</button>
          <button class="reset-btn" @click="resetFilters">Réinitialiser les filtres</button>
        </div>
      </aside>

      <!-- Main Results -->
      <main class="results-main">
        <div class="search-sort-bar">
          <div class="search-input-wrap">
            <span class="material-symbols-outlined">search</span>
            <input type="text" v-model="searchQuery" placeholder="Rechercher un hôtel..." />
          </div>
          <div class="sort-wrap">
            <span class="sort-label">TRIER PAR</span>
            <Select 
              v-model="sortBy" 
              :options="sortOptions" 
              optionLabel="label" 
              optionValue="value" 
              appendTo="self"
              class="sort-select-small" 
            />
          </div>
        </div>

        <div class="results-info">
          <strong>{{ filteredHotels.length }}</strong> hôtels trouvés
        </div>

        <div v-if="filteredHotels.length > 0" class="hotels-grid">
          <HotelCard 
            v-for="hotel in filteredHotels" 
            :key="hotel.id" 
            :hotel="hotel" 
            :min-price="getHotelMinPrice(hotel.id)" 
          />
        </div>
        <div v-else class="empty-results-state">
          <span class="material-symbols-outlined">hotel_class</span>
          <p>Aucun établissement ne correspond à votre sélection.</p>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useHotels } from '~/composables/useHotels'
import { useRooms } from '~/composables/useRooms'

// Props/Data
const { hotels, fetchAll: fetchHotels } = useHotels()
const { rooms, fetchAll: fetchRooms } = useRooms()

// State
const priceRange = ref([0, 1000])
const selectedStars = ref<number[]>([3, 4, 5])
const selectedCity = ref<string | null>(null)
const searchQuery = ref('')
const sortBy = ref('note')

// Options
const cityOptions = computed(() => {
  const cities = [...new Set(hotels.value.map(h => h.city))]
  return [
    { label: 'Toutes les villes', value: null },
    ...cities.map(c => ({ label: c, value: c }))
  ]
})

const sortOptions = [
  { label: 'Note', value: 'note' },
  { label: 'Prix croissant', value: 'price_asc' },
  { label: 'Prix décroissant', value: 'price_desc' }
]

// Logic
function getHotelMinPrice(hotelId: number) {
  const hotelRooms = rooms.value.filter(r => r.hotelId === hotelId)
  if (hotelRooms.length === 0) return 0
  return Math.min(...hotelRooms.map(r => r.pricePerNight))
}

const filteredHotels = computed(() => {
  let list = hotels.value.filter(h => {
    // Name Search
    if (searchQuery.value && !h.name.toLowerCase().includes(searchQuery.value.toLowerCase()) && !h.city.toLowerCase().includes(searchQuery.value.toLowerCase())) return false
    
    // Rating
    if (selectedStars.value.length > 0 && !selectedStars.value.includes(h.stars)) return false
    
    // City
    if (selectedCity.value && h.city !== selectedCity.value) return false
    
    // Price
    const minP = getHotelMinPrice(h.id)
    if (minP < priceRange.value[0] || minP > priceRange.value[1]) return false
    
    return true
  })
  
  // Sort
  if (sortBy.value === 'note') list.sort((a, b) => b.stars - a.stars)
  else if (sortBy.value === 'price_asc') list.sort((a, b) => getHotelMinPrice(a.id) - getHotelMinPrice(b.id))
  else if (sortBy.value === 'price_desc') list.sort((a, b) => getHotelMinPrice(b.id) - getHotelMinPrice(a.id))
  
  return list
})

function applyFilters() {
  // Mobile only feature usually or just a visual trigger.
  // Reactive Vue updates automatically.
}

function resetFilters() {
  priceRange.value = [0, 1000]
  selectedStars.value = [3, 4, 5]
  selectedCity.value = null
  searchQuery.value = ''
  sortBy.value = 'note'
}

onMounted(async () => {
  await Promise.all([fetchHotels(), fetchRooms()])
})
</script>

<style scoped>
.hotels-page {
  background: white;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
}

.page-header {
  background: white;
  padding: 32px 0 16px;
  border-bottom: 1px solid #f1f5f9;
}

.page-header__content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.page-title {
  font-size: 32px;
  font-weight: 800;
  color: #015081;
  margin: 0 0 4px 0;
  font-family: 'Playfair Display', serif;
}

.page-subtitle {
  font-size: 15px;
  color: #64748b;
  margin: 0;
}

.main-container {
  max-width: 1200px;
  margin: 32px auto;
  padding: 0 24px;
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 40px;
}

@media (max-width: 1024px) {
  .main-container {
    grid-template-columns: 1fr;
  }
}

/* Filters Sidebar matched to User Mockup */
.filters-sidebar {
  background: #f8fafc;
  padding: 24px;
  border-radius: 12px;
  border: none;
  height: fit-content;
  position: sticky;
  top: 24px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #015081;
  font-weight: 700;
  font-size: 20px;
  margin-bottom: 32px;
}

.sidebar-header .material-symbols-outlined {
  font-size: 24px;
}

.filter-section {
  margin-bottom: 28px;
}

.filter-label {
  display: block;
  font-size: 14px;
  font-weight: 700;
  color: #334155;
  margin-bottom: 16px;
}

.slider-wrapper {
  padding-top: 8px;
}

.slider-values {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.checkbox-field {
  display: flex;
  align-items: center;
  gap: 12px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
}

.star-icon-small {
  color: #CDAF5D;
  font-size: 14px;
  font-variation-settings: 'FILL' 1;
}

/* Removed Toggle Switch CSS */


.filter-actions {
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.apply-btn {
  width: 100%;
  padding: 12px;
  background: #008F90;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.apply-btn:hover {
  opacity: 0.9;
}

.reset-btn {
  width: 100%;
  padding: 10px;
  background: none;
  border: 1px solid transparent;
  color: #64748b;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  text-decoration: underline;
}

.reset-btn:hover {
  color: #015081;
}


/* Deep Customizations for PrimeVue Elements */
:deep(.custom-slider.p-slider) {
  height: 6px;
  background: #cbd5e1;
  border-radius: 4px;
}

:deep(.custom-slider .p-slider-range) {
  background: #008F90;
}

:deep(.custom-slider .p-slider-handle) {
  background: white !important;
  border: 2px solid #008F90 !important;
  width: 16px;
  height: 16px;
  margin-top: -6px;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 0 2px white;
}

:deep(.p-checkbox-box) {
  border: 1.5px solid #cbd5e1;
  border-radius: 4px;
  background: white;
  width: 20px;
  height: 20px;
  transition: all 0.2s;
}

:deep(.p-checkbox-checked .p-checkbox-box) {
  background: #008F90 !important;
  border-color: #008F90 !important;
}

:deep(.p-checkbox-icon) {
  width: 12px !important;
  height: 12px !important;
  color: white !important;
}

:deep(.full-width-select.p-select) {
  width: 100%;
  background: white;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 2px 4px;
}

:deep(.full-width-select .p-select-label) {
  color: #334155;
  font-size: 14px;
  font-weight: 500;
}

:deep(.p-select-overlay) {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
  margin-top: 8px;
  overflow: hidden;
  z-index: 1000;
}

:deep(.p-select-list) {
  padding: 4px 0;
  list-style-type: none;
  margin: 0;
}

:deep(.p-select-option) {
  padding: 10px 16px;
  font-size: 14px;
  color: #475569;
  cursor: pointer;
  transition: background 0.2s;
  font-weight: 500;
}

:deep(.p-select-option:hover),
:deep(.p-select-option[data-p-focused="true"]) {
  background: #f1f5f9;
  color: #008F90;
}

:deep(.p-select-option[data-p-selected="true"]) {
  background: #e0f2fe;
  color: #015081;
  font-weight: 700;
}

/* Results Main */
.search-sort-bar {
  background: #f8fafc;
  padding: 12px 20px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.search-input-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  padding: 4px 12px;
  border-radius: 8px;
  flex: 1;
  max-width: 400px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s;
}

.search-input-wrap:focus-within {
  border-color: #008F90;
  box-shadow: 0 0 0 2px rgba(0, 143, 144, 0.1);
}

.search-input-wrap .material-symbols-outlined { color: #94a3b8; font-size: 18px; }

.search-input-wrap input {
  background: none;
  border: none;
  font-size: 14px;
  width: 100%;
  outline: none !important;
  color: #334155;
  font-weight: 500;
  box-shadow: none !important;
  padding: 4px 8px !important;
}

.search-input-wrap input:focus {
  outline: none !important;
  box-shadow: none !important;
}

.sort-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sort-label { 
  font-size: 11px; 
  font-weight: 800; 
  color: #64748b; 
  letter-spacing: 0.5px; 
}

:deep(.sort-select-small.p-select) {
  min-width: 160px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  transition: all 0.2s;
}

:deep(.sort-select-small.p-select:hover) {
  border-color: #cbd5e1;
}

:deep(.sort-select-small .p-select-label) {
  font-size: 14px;
  font-weight: 600;
  color: #015081;
  padding: 10px 16px;
}

:deep(.sort-select-small .p-select-dropdown) {
  width: 32px;
  color: #64748b;
}

.results-info {
  margin-bottom: 20px;
  font-size: 14px;
  color: #64748b;
}

.results-info strong { color: #015081; font-weight: 800; }

.hotels-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

@media (max-width: 1200px) {
  .hotels-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 800px) {
  .hotels-grid {
    grid-template-columns: 1fr;
  }
}

.empty-results-state {
  text-align: center;
  padding: 80px 0;
  color: #94a3b8;
  background: #f8fafc;
  border-radius: 12px;
}

.empty-results-state .material-symbols-outlined {
  font-size: 56px;
  margin-bottom: 16px;
  color: #cbd5e1;
}

/* Cursors */
:deep(*) { cursor: default; }

:deep(input:not([type="text"])), 
:deep(button), 
:deep(a), 
:deep(.p-slider-handle), 
:deep(.p-checkbox-box), 
:deep(.p-select), 
:deep(.p-select-item), 
:deep(.checkbox-label),
.reset-btn,
.apply-btn,
.hotel-card,
.switch,
.slider {
  cursor: pointer !important;
}

:deep(input[type="text"]),
.page-title, .page-subtitle, .filter-label, .sidebar-header, strong, p, span, label, .toggle-label {
  cursor: text;
}
</style>
