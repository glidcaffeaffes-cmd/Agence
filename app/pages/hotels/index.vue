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
      <aside ref="filtersSidebarRef" class="filters-sidebar">
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
              <label :for="`star-${star}`" class="checkbox-label checkbox-label--rating">
                <Rating :modelValue="star" readonly :cancel="false" class="filter-rating" />
              </label>
            </div>
          </div>
        </div>

        <div class="filter-section filter-section--destination">
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

        <div class="filter-section filter-section--date">
          <label class="filter-label">Check-in</label>
          <div class="date-picker-shell">
            <DatePicker
              v-model="checkInDate"
              showIcon
              iconDisplay="input"
              :manualInput="false"
              :minDate="today"
              appendTo="self"
              placeholder="Choose check-in"
              dateFormat="D, MMM d"
              class="filter-date-picker"
            />
            <span class="material-symbols-outlined date-picker-shell__chevron">expand_more</span>
          </div>
        </div>

        <div class="filter-section filter-section--date">
          <label class="filter-label">Check-out</label>
          <div class="date-picker-shell">
            <DatePicker
              v-model="checkOutDate"
              showIcon
              iconDisplay="input"
              :manualInput="false"
              :minDate="checkOutMinDate"
              appendTo="self"
              placeholder="Choose check-out"
              dateFormat="D, MMM d"
              class="filter-date-picker"
            />
            <span class="material-symbols-outlined date-picker-shell__chevron">expand_more</span>
          </div>
        </div>

        <div class="filter-section filter-section--guests">
          <label class="filter-label">Guests & rooms</label>
          <button
            type="button"
            class="guest-trigger"
            :class="{ 'guest-trigger--open': activeFilterPanel === 'guests' }"
            @click="toggleGuestPanel"
          >
            <span class="material-symbols-outlined guest-trigger__icon">person</span>
            <span class="guest-trigger__copy">
              <strong>{{ guestSummary }}</strong>
              <span>Adults, children, rooms</span>
            </span>
            <span class="material-symbols-outlined guest-trigger__chevron">expand_more</span>
          </button>

          <div v-if="activeFilterPanel === 'guests'" class="guest-panel">
            <div class="guest-counter-row">
              <div class="guest-counter-copy">
                <strong>Adults</strong>
                <span>Ages 18 or above</span>
              </div>
              <div class="guest-counter-control">
                <Button type="button" text class="guest-counter-btn" @click="updateGuestCount('adults', -1)" :disabled="adults <= 1">−</Button>
                <span>{{ adults }}</span>
                <Button type="button" text class="guest-counter-btn" @click="updateGuestCount('adults', 1)">+</Button>
              </div>
            </div>

            <div class="guest-counter-row">
              <div class="guest-counter-copy">
                <strong>Children</strong>
                <span>Age 0 to 17 years</span>
              </div>
              <div class="guest-counter-control">
                <Button type="button" text class="guest-counter-btn" @click="updateGuestCount('children', -1)" :disabled="children <= 0">−</Button>
                <span>{{ children }}</span>
                <Button type="button" text class="guest-counter-btn" @click="updateGuestCount('children', 1)">+</Button>
              </div>
            </div>

            <div v-if="children > 0" class="guest-age-grid">
              <div v-for="(_, index) in childAges" :key="`child-age-${index}`" class="guest-age-item">
                <label class="guest-age-label">Child {{ index + 1 }} age</label>
                <Select
                  v-model="childAges[index]"
                  :options="childAgeOptions"
                  optionLabel="label"
                  optionValue="value"
                  class="guest-age-select"
                />
              </div>
            </div>

            <p v-if="children > 0" class="guest-age-note">
              We use each child age to estimate the correct room options and rates for your stay.
            </p>

            <div class="guest-counter-row">
              <div class="guest-counter-copy">
                <strong>Rooms</strong>
                <span>Choose what you need</span>
              </div>
              <div class="guest-counter-control">
                <Button type="button" text class="guest-counter-btn" @click="updateGuestCount('rooms', -1)" :disabled="roomsRequested <= 1">−</Button>
                <span>{{ roomsRequested }}</span>
                <Button type="button" text class="guest-counter-btn" @click="updateGuestCount('rooms', 1)">+</Button>
              </div>
            </div>

            <div class="guest-pets-row">
              <div class="guest-counter-copy">
                <strong>Traveling with pets?</strong>
                <span>We will keep that in your search details.</span>
              </div>
              <ToggleSwitch v-model="travelWithPets" />
            </div>

            <Button type="button" label="Done" outlined class="guest-done-button" @click="activeFilterPanel = null" />
          </div>
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
import { ref, computed, onBeforeUnmount, onMounted, watch } from 'vue'
import { useDestinations } from '~/composables/useDestinations'
import { useHotels } from '~/composables/useHotels'
import { useRooms } from '~/composables/useRooms'

// Props/Data
const { hotels, fetchAll: fetchHotels, fetchAvailable: fetchAvailableHotels } = useHotels()
const { rooms, fetchAll: fetchRooms } = useRooms()
const { destinations, fetchDestinations } = useDestinations()
const route = useRoute()
const router = useRouter()

// State
const filtersSidebarRef = ref<HTMLElement | null>(null)
const today = startOfDay(new Date())
const priceRange = ref([0, 1000])
const selectedStars = ref<number[]>([3, 4, 5])
const selectedCity = ref<string | null>(null)
const searchQuery = ref('')
const sortBy = ref('note')
const activeFilterPanel = ref<'guests' | null>(null)
const checkInDate = ref<Date | null>(null)
const checkOutDate = ref<Date | null>(null)
const adults = ref(2)
const children = ref(1)
const roomsRequested = ref(2)
const childAges = ref<number[]>([14])
const travelWithPets = ref(false)
const childAgeOptions = Array.from({ length: 17 }, (_, index) => ({
  label: `${index + 1} years old`,
  value: index + 1,
}))
const checkOutMinDate = computed(() => {
  if (!checkInDate.value) {
    return today
  }

  return addDays(startOfDay(checkInDate.value), 1)
})

// Static 24 Tunisian governorates — always shown regardless of DB content
const TUNISIA_CITIES = [
  'Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabès', 'Gafsa',
  'Jendouba', 'Kairouan', 'Kasserine', 'Kébili', 'La Manouba', 'Le Kef',
  'Mahdia', 'Médenine', 'Monastir', 'Nabeul', 'Sfax', 'Sidi Bouzid',
  'Siliana', 'Sousse', 'Tataouine', 'Tozeur', 'Tunis', 'Zaghouan',
]

const cityOptions = [
  { label: 'Toutes les villes', value: null },
  ...TUNISIA_CITIES.map((city) => ({ label: city, value: city })),
]


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
    if (searchQuery.value && !h.name.toLowerCase().includes(searchQuery.value.toLowerCase()) && !h.city.toLowerCase().includes(searchQuery.value.toLowerCase())) return false

    if (selectedStars.value.length > 0 && !selectedStars.value.includes(h.stars)) return false

    if (selectedCity.value && h.city !== selectedCity.value) return false

    const minP = getHotelMinPrice(h.id)
    if (minP < priceRange.value[0] || minP > priceRange.value[1]) return false

    return true
  })

  if (sortBy.value === 'note') list.sort((a, b) => b.stars - a.stars)
  else if (sortBy.value === 'price_asc') list.sort((a, b) => getHotelMinPrice(a.id) - getHotelMinPrice(b.id))
  else if (sortBy.value === 'price_desc') list.sort((a, b) => getHotelMinPrice(b.id) - getHotelMinPrice(a.id))

  return list
})

function applyFilters() {
  normalizeStayDates()
  activeFilterPanel.value = null

  router.replace({
    path: '/hotels',
    query: buildRouteQuery(),
  })
}

function resetFilters() {
  priceRange.value = [0, 1000]
  selectedStars.value = [3, 4, 5]
  selectedCity.value = null
  searchQuery.value = ''
  sortBy.value = 'note'
  checkInDate.value = null
  checkOutDate.value = null
  adults.value = 2
  children.value = 1
  roomsRequested.value = 2
  childAges.value = [14]
  travelWithPets.value = false
  activeFilterPanel.value = null

  router.replace({ path: '/hotels' })
}

function applyRouteFilters() {
  const city = typeof route.query.city === 'string' ? route.query.city : null
  const query = typeof route.query.q === 'string' ? route.query.q : ''
  const checkIn = typeof route.query.checkIn === 'string' ? parseDate(route.query.checkIn) : null
  const checkOut = typeof route.query.checkOut === 'string' ? parseDate(route.query.checkOut) : null
  const adultsQuery = Number.parseInt(typeof route.query.adults === 'string' ? route.query.adults : '2', 10)
  const childrenQuery = Number.parseInt(typeof route.query.children === 'string' ? route.query.children : '1', 10)
  const roomCount = Number.parseInt(typeof route.query.rooms === 'string' ? route.query.rooms : '2', 10)
  const childAgesQuery = typeof route.query.childAges === 'string' ? route.query.childAges : ''

  selectedCity.value = city
  searchQuery.value = query
  checkInDate.value = checkIn
  checkOutDate.value = checkOut
  adults.value = Math.max(1, Number.isNaN(adultsQuery) ? 2 : adultsQuery)
  children.value = Math.max(0, Number.isNaN(childrenQuery) ? 1 : childrenQuery)
  roomsRequested.value = Math.max(1, Number.isNaN(roomCount) ? 2 : roomCount)
  childAges.value = parseChildAges(childAgesQuery, children.value)
  travelWithPets.value = typeof route.query.pets === 'string' && route.query.pets === '1'

  normalizeStayDates()
}

async function loadHotelsFromRoute() {
  const city = typeof route.query.city === 'string' ? route.query.city : null
  const checkIn = typeof route.query.checkIn === 'string' ? route.query.checkIn : undefined
  const checkOut = typeof route.query.checkOut === 'string' ? route.query.checkOut : undefined
  const adults = Number.parseInt(typeof route.query.adults === 'string' ? route.query.adults : '0', 10)
  const children = Number.parseInt(typeof route.query.children === 'string' ? route.query.children : '0', 10)
  const roomCount = Number.parseInt(typeof route.query.rooms === 'string' ? route.query.rooms : '1', 10)
  const guests = Math.max(0, (Number.isNaN(adults) ? 0 : adults) + (Number.isNaN(children) ? 0 : children))
  const hasDateQuery = Boolean(checkIn && checkOut)
  const hasAvailabilityQuery = Boolean(city || hasDateQuery || guests > 0 || roomCount > 1)

  if (hasAvailabilityQuery) {
    await fetchAvailableHotels({
      city,
      checkIn,
      checkOut,
      guests: guests || undefined,
      rooms: Number.isNaN(roomCount) ? 1 : roomCount,
    })
    return
  }

  await fetchHotels()
}

function buildRouteQuery() {
  const query: Record<string, string> = {}

  if (selectedCity.value) {
    query.city = selectedCity.value
  }

  if (checkInDate.value && checkOutDate.value) {
    query.checkIn = formatDateForQuery(checkInDate.value)
    query.checkOut = formatDateForQuery(checkOutDate.value)
  }

  query.adults = String(adults.value)
  query.children = String(children.value)
  query.rooms = String(roomsRequested.value)

  if (children.value > 0 && childAges.value.length > 0) {
    query.childAges = childAges.value.join(',')
  }

  if (travelWithPets.value) {
    query.pets = '1'
  }

  return query
}

function parseDate(value: string) {
  const parsed = new Date(`${value}T00:00:00`)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function parseChildAges(value: string, count: number) {
  const parsed = value
    .split(',')
    .map((entry) => Number.parseInt(entry, 10))
    .filter((entry) => Number.isFinite(entry) && entry > 0)

  const next = parsed.slice(0, count)
  while (next.length < count) {
    next.push(14)
  }

  return next
}

function normalizeStayDates() {
  if (checkInDate.value && checkOutDate.value && checkOutDate.value <= checkInDate.value) {
    checkOutDate.value = addDays(checkInDate.value, 1)
  }

  if (checkInDate.value && !checkOutDate.value) {
    checkOutDate.value = addDays(checkInDate.value, 1)
  }

  if (!checkInDate.value && checkOutDate.value) {
    checkInDate.value = addDays(checkOutDate.value, -1)
  }
}

function formatDateForQuery(date: Date) {
  return startOfDay(date).toISOString().split('T')[0]
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

function toggleGuestPanel() {
  activeFilterPanel.value = activeFilterPanel.value === 'guests' ? null : 'guests'
}

function updateGuestCount(type: 'adults' | 'children' | 'rooms', delta: number) {
  if (type === 'adults') adults.value = Math.max(1, adults.value + delta)
  if (type === 'children') children.value = Math.max(0, children.value + delta)
  if (type === 'rooms') roomsRequested.value = Math.max(1, roomsRequested.value + delta)
}

const guestSummary = computed(() => {
  const adultLabel = `${adults.value} adult${adults.value > 1 ? 's' : ''}`
  const childLabel = children.value ? ` · ${children.value} child${children.value > 1 ? 'ren' : ''}` : ''
  const roomLabel = ` · ${roomsRequested.value} room${roomsRequested.value > 1 ? 's' : ''}`
  return `${adultLabel}${childLabel}${roomLabel}`
})

watch(children, (count) => {
  const next = childAges.value.slice(0, count)
  while (next.length < count) {
    next.push(14)
  }
  childAges.value = next
}, { immediate: true })

watch([checkInDate, checkOutDate], () => {
  if (checkInDate.value || checkOutDate.value) {
    normalizeStayDates()
  }
})

function handleClickOutside(event: MouseEvent) {
  if (!filtersSidebarRef.value) return
  if (!filtersSidebarRef.value.contains(event.target as Node)) {
    activeFilterPanel.value = null
  }
}

onMounted(async () => {
  document.addEventListener('click', handleClickOutside)
  await fetchDestinations()
  await fetchRooms()
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

watch(() => route.query, async () => {
  applyRouteFilters()
  await loadHotelsFromRoute()
}, { deep: true, immediate: true })
</script>

<style scoped>
.hotels-page {
  background:
    radial-gradient(circle at top, color-mix(in srgb, var(--color-primary-50) 72%, white 28%) 0%, transparent 45%),
    linear-gradient(180deg, var(--color-gray-50) 0%, white 100%);
  min-height: 100vh;
}

.page-header {
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  padding: 32px 0 16px;
  border-bottom: 1px solid var(--color-gray-200);
}

.page-header__content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.page-title {
  font-size: 32px;
  font-weight: 800;
  color: var(--color-navy-500);
  margin: 0 0 4px 0;
}

.page-subtitle {
  font-size: 15px;
  color: var(--color-gray-500);
  margin: 0;
}

.main-container {
  max-width: 1320px;
  margin: 32px auto;
  padding: 0 24px;
  display: grid;
  grid-template-columns: 306px 1fr;
  gap: 28px;
}

@media (max-width: 1024px) {
  .main-container {
    grid-template-columns: 1fr;
  }
}

/* Filters Sidebar matched to User Mockup */
.filters-sidebar {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, var(--color-gray-50) 100%);
  padding: 24px;
  border-radius: 24px;
  border: 1px solid color-mix(in srgb, var(--color-gray-200) 76%, white 24%);
  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.08);
  height: fit-content;
  position: sticky;
  top: 24px;
  overflow: visible;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--color-navy-500);
  font-weight: 700;
  font-size: 20px;
  margin-bottom: 28px;
}

.sidebar-header .material-symbols-outlined {
  font-size: 24px;
}

.filter-section {
  margin-bottom: 22px;
  position: relative;
}

.filter-section--destination {
  z-index: 20;
}

.filter-section--date {
  z-index: 18;
}

.filter-section--date:focus-within {
  z-index: 70;
}

.date-picker-shell {
  position: relative;
}

.date-picker-shell__chevron {
  position: absolute;
  top: 50%;
  right: 18px;
  transform: translateY(-50%);
  color: var(--color-gray-500);
  font-size: 20px;
  pointer-events: none;
  transition: transform 0.2s ease, color 0.2s ease;
}

.date-picker-shell:focus-within .date-picker-shell__chevron {
  transform: translateY(-50%) rotate(180deg);
  color: var(--color-primary-600);
}

.filter-section--guests {
  z-index: 15;
}

.filter-label {
  display: block;
  font-size: 14px;
  font-weight: 700;
  color: var(--color-gray-700);
  margin-bottom: 16px;
  cursor: pointer;
}

.slider-wrapper {
  padding-top: 8px;
  cursor: pointer;
}

.slider-values {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-gray-500);
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
  cursor: pointer;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-gray-600);
  cursor: pointer;
}

.checkbox-label--rating {
  gap: 0;
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
  background: linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-600) 100%);
  color: white;
  border: none;
  border-radius: 14px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s, filter 0.2s;
  box-shadow: 0 14px 26px rgba(0, 79, 81, 0.22);
}

.apply-btn:hover {
  transform: translateY(-1px);
  filter: brightness(1.02);
}

.apply-btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary-100) 60%, transparent 40%), 0 14px 26px rgba(0, 79, 81, 0.22);
}

.reset-btn {
  width: 100%;
  padding: 10px;
  background: none;
  border: 1px solid transparent;
  color: var(--color-gray-500);
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  text-decoration: underline;
}

.reset-btn:hover {
  color: var(--color-navy-500);
}


/* Deep Customizations for PrimeVue Elements */
:deep(.custom-slider.p-slider) {
  height: 6px;
  background: var(--color-gray-300);
  border-radius: 4px;
  cursor: pointer;
}

:deep(.custom-slider .p-slider-range) {
  background: var(--color-primary-500);
}

:deep(.custom-slider .p-slider-handle) {
  background: white !important;
  border: 2px solid var(--color-primary-500) !important;
  width: 16px;
  height: 16px;
  top: 50%;
  margin-left: 0;
  margin-top: 0;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 0 2px white;
}

:deep(.p-checkbox-box) {
  border: 1.5px solid var(--color-gray-300);
  border-radius: 4px;
  background: white;
  width: 18px;
  height: 18px;
  transition: all 0.2s;
  cursor: pointer;
}

:deep(.p-checkbox-checked .p-checkbox-box) {
  background: var(--color-primary-500) !important;
  border-color: var(--color-primary-500) !important;
}

:deep(.p-checkbox-icon) {
  width: 10px !important;
  height: 10px !important;
  color: white !important;
}

:deep(.filter-rating.p-rating) {
  gap: 10px;
}

:deep(.filter-rating .p-rating-option) {
  width: 16px;
  height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

:deep(.filter-rating .p-rating-icon) {
  color: var(--color-gray-400);
  width: 16px !important;
  height: 16px !important;
  display: block;
}

:deep(.filter-rating .p-rating-on-icon) {
  color: var(--color-accent-600);
}

:deep(.full-width-select.p-select) {
  width: 100%;
  background: white;
  border: 1px solid var(--color-gray-200);
  border-radius: 16px;
  padding: 2px 4px;
  cursor: pointer;
}

:deep(.full-width-select .p-select-label) {
  color: var(--color-gray-700);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

:deep(.destination-dropdown.p-select) {
  position: relative;
  z-index: 20;
}

:deep(.destination-dropdown .p-select-label) {
  padding: 8px 12px;
}

:deep(.destination-dropdown .p-select-dropdown) {
  width: 36px;
  color: var(--color-gray-500);
  cursor: pointer;
}

:deep(.p-select-overlay) {
  background: white;
  border: 1px solid color-mix(in srgb, var(--color-gray-200) 76%, white 24%);
  border-radius: 20px;
  box-shadow: 0 28px 54px rgba(15, 23, 42, 0.18);
  margin-top: 8px;
  overflow: hidden;
  z-index: 1000;
}

:deep(.destination-dropdown .p-select-overlay) {
  top: 100% !important;
  left: 0 !important;
  min-width: 100%;
  margin-top: 0;
  z-index: 1100;
}

:deep(.p-select-list) {
  padding: 4px 0;
  list-style-type: none;
  margin: 0;
}

:deep(.p-select-option) {
  padding: 10px 16px;
  font-size: 14px;
  color: var(--color-gray-600);
  cursor: pointer;
  transition: background 0.2s;
  font-weight: 500;
}

:deep(.p-select-option:hover),
:deep(.p-select-option[data-p-focused="true"]) {
  background: var(--color-gray-100);
  color: var(--color-primary-600);
}

:deep(.p-select-option[data-p-selected="true"]) {
  background: var(--color-primary-50);
  color: var(--color-navy-500);
  font-weight: 700;
}

:deep(.filter-date-picker.p-datepicker) {
  width: 100%;
  background: linear-gradient(180deg, white 0%, color-mix(in srgb, var(--color-gray-50) 72%, white 28%) 100%);
  border: 1px solid color-mix(in srgb, var(--color-gray-200) 74%, white 26%);
  border-radius: 16px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.78);
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
  cursor: pointer;
}

:deep(.filter-date-picker.p-datepicker:hover),
:deep(.filter-date-picker.p-datepicker.p-focus) {
  border-color: color-mix(in srgb, var(--color-primary-200) 68%, white 32%);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary-50) 60%, transparent 40%), inset 0 1px 0 rgba(255, 255, 255, 0.78);
}

:deep(.filter-date-picker .p-inputtext) {
  width: 100%;
  min-height: 3.15rem;
  border: 0;
  background: transparent;
  color: var(--color-navy-500);
  font-size: 0.95rem;
  font-weight: 700;
  padding: 0.95rem 3.45rem 0.95rem 2.65rem;
  cursor: pointer;
}

:deep(.filter-date-picker .p-inputtext::placeholder) {
  color: var(--color-gray-500);
  font-weight: 600;
}

:deep(.filter-date-picker .p-datepicker-input-icon-container),
:deep(.filter-date-picker .p-datepicker-dropdown) {
  color: var(--color-primary-600);
  cursor: pointer;
}

:deep(.filter-date-picker .p-datepicker-input-icon-container) {
  left: 0.9rem;
  right: auto;
}

:deep(.filter-date-picker .p-datepicker-dropdown) {
  width: 2.25rem;
}

:deep(.filter-date-picker .p-datepicker),
:deep(.filter-date-picker .p-datepicker-panel),
:deep(.p-select-overlay) {
  background: white;
  border: 1px solid color-mix(in srgb, var(--color-gray-200) 76%, white 24%);
  border-radius: 20px;
  box-shadow: 0 28px 54px rgba(15, 23, 42, 0.18);
  margin-top: 8px;
  overflow: hidden;
  z-index: 1000;
}

:deep(.filter-date-picker .p-datepicker-panel) {
  z-index: 1100;
  padding: 0.9rem;
}

:deep(.filter-date-picker .p-datepicker-header) {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 2rem;
  border-bottom: 1px solid var(--color-gray-200);
  padding: 0.2rem 2rem 0.7rem;
  margin-bottom: 0.24rem;
}

:deep(.filter-date-picker .p-datepicker-title) {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  font-size: 0.95rem;
  font-weight: 800;
  line-height: 1;
  color: var(--color-navy-500);
  margin: 0 auto;
  text-align: center;
}

:deep(.filter-date-picker .p-datepicker-prev-button),
:deep(.filter-date-picker .p-datepicker-next-button) {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.72rem;
  height: 1.72rem;
  padding: 0;
  line-height: 0;
  border-radius: 999px;
  color: var(--color-gray-500);
  transition: background 0.2s ease, color 0.2s ease;
  cursor: pointer;
}

:deep(.filter-date-picker .p-datepicker-prev-button) {
  left: 0.1rem;
}

:deep(.filter-date-picker .p-datepicker-next-button) {
  right: 0.1rem;
}

:deep(.filter-date-picker .p-datepicker-prev-button:hover),
:deep(.filter-date-picker .p-datepicker-next-button:hover) {
  background: color-mix(in srgb, var(--color-primary-50) 72%, white 28%);
  color: var(--color-primary-700);
}

:deep(.filter-date-picker .p-datepicker-day-view) {
  width: 100%;
  table-layout: fixed;
  border-collapse: separate;
  border-spacing: 0;
}

:deep(.filter-date-picker .p-datepicker-weekday-cell),
:deep(.filter-date-picker .p-datepicker-day-cell) {
  width: 14.2857%;
}

:deep(.filter-date-picker .p-datepicker-weekday) {
  display: inline-flex;
  width: 100%;
  justify-content: center;
}

:deep(.filter-date-picker .p-datepicker-day-view th) {
  padding: 0.14rem 0 0.28rem;
  text-align: center;
  font-size: 0.69rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--color-gray-500);
}

:deep(.filter-date-picker .p-datepicker-day-view td) {
  padding: 0.08rem 0;
  text-align: center;
  vertical-align: middle;
}

:deep(.filter-date-picker .p-datepicker-day) {
  width: 2.06rem;
  height: 2.06rem;
  border-radius: 0.66rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.88rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  transition: background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

:deep(.filter-date-picker .p-datepicker-day-cell.p-datepicker-other-month .p-datepicker-day) {
  color: color-mix(in srgb, var(--color-gray-500) 72%, white 28%);
}

:deep(.filter-date-picker .p-datepicker-day:not(.p-disabled):hover) {
  background: color-mix(in srgb, var(--color-primary-50) 72%, white 28%);
  color: var(--color-primary-700);
}

:deep(.filter-date-picker .p-datepicker-day-selected-range) {
  background: color-mix(in srgb, var(--color-primary-200) 55%, white 45%);
  color: var(--color-primary-700);
  border-radius: 0.68rem;
}

:deep(.filter-date-picker .p-datepicker-day-selected),
:deep(.filter-date-picker .p-datepicker-day-selected-start),
:deep(.filter-date-picker .p-datepicker-day-selected-end) {
  background: linear-gradient(145deg, #0a7677 0%, var(--color-primary-600) 100%);
  color: white;
  box-shadow: 0 8px 18px rgba(0, 80, 81, 0.34);
}

:deep(.destination-dropdown.p-select) {
  position: relative;
  z-index: 20;
}

:deep(.destination-dropdown .p-select-label) {
  padding: 8px 12px;
}

:deep(.destination-dropdown .p-select-dropdown) {
  width: 36px;
  color: var(--color-gray-500);
}

:deep(.destination-dropdown .p-select-overlay) {
  top: 100% !important;
  left: 0 !important;
  min-width: 100%;
  margin-top: 0;
  z-index: 1100;
}

:deep(.p-select-list) {
  padding: 4px 0;
  list-style-type: none;
  margin: 0;
}

:deep(.p-select-option) {
  padding: 10px 16px;
  font-size: 14px;
  color: var(--color-gray-600);
  cursor: pointer;
  transition: background 0.2s;
  font-weight: 500;
}

:deep(.p-select-option:hover),
:deep(.p-select-option[data-p-focused="true"]) {
  background: var(--color-gray-100);
  color: var(--color-primary-600);
}

.guest-trigger {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.95rem 1rem;
  background: white;
  border: 1px solid color-mix(in srgb, var(--color-gray-200) 76%, white 24%);
  border-radius: 16px;
  text-align: left;
  transition: background 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
  cursor: pointer;
}

.guest-trigger:hover,
.guest-trigger--open {
  background: color-mix(in srgb, var(--color-primary-25) 62%, white 38%);
  border-color: color-mix(in srgb, var(--color-primary-200) 64%, white 36%);
  box-shadow: 0 10px 22px rgba(0, 79, 81, 0.08);
}

.guest-trigger__icon {
  flex-shrink: 0;
  color: var(--color-primary-600);
  font-size: 1.2rem;
}

.guest-trigger__copy {
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.guest-trigger__copy strong {
  display: block;
  color: var(--color-gray-700);
  font-size: 0.95rem;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.guest-trigger__copy span {
  color: var(--color-gray-500);
  font-size: 0.82rem;
  line-height: 1.35;
}

.guest-trigger__chevron {
  flex-shrink: 0;
  margin-left: auto;
  color: var(--color-gray-500);
  transition: transform 0.24s ease;
}

.guest-trigger--open .guest-trigger__chevron {
  transform: rotate(180deg);
}

.guest-panel {
  margin-top: 0.9rem;
  padding: 1rem;
  background: white;
  border: 1px solid color-mix(in srgb, var(--color-gray-200) 76%, white 24%);
  border-radius: 20px;
  box-shadow: 0 24px 42px rgba(15, 23, 42, 0.12);
}

.guest-counter-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.guest-counter-row + .guest-counter-row,
.guest-age-grid,
.guest-pets-row,
.guest-done-button {
  margin-top: 1rem;
}

.guest-counter-copy {
  flex: 1;
}

.guest-counter-copy strong,
.guest-age-label {
  display: block;
  color: var(--color-gray-800);
  font-weight: 800;
}

.guest-counter-copy span,
.guest-age-note {
  color: var(--color-gray-500);
  font-size: 0.93rem;
  line-height: 1.5;
}

.guest-counter-control {
  display: grid;
  grid-template-columns: 2.2rem 2.8rem 2.2rem;
  align-items: center;
  border: 1px solid var(--color-gray-200);
  border-radius: 0.9rem;
  background: var(--color-gray-50);
  overflow: hidden;
}

.guest-counter-control span {
  text-align: center;
  color: var(--color-gray-800);
  font-size: 0.95rem;
  font-weight: 800;
}

.guest-counter-btn {
  border: none;
  min-height: 2.4rem;
  color: var(--color-primary-600);
  cursor: pointer;
}

.guest-counter-btn:disabled {
  opacity: 0.35;
}

.guest-age-grid {
  display: grid;
  gap: 0.85rem;
}

.guest-age-item {
  display: grid;
  gap: 0.45rem;
}

.guest-age-select :deep(.p-select) {
  width: 100%;
  border-radius: 0.95rem;
  cursor: pointer;
}

.guest-age-note {
  margin: 0;
}

.guest-pets-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-gray-200);
}

.guest-done-button {
  width: 100%;
  justify-content: center;
  cursor: pointer;
}

.guest-pets-row :deep(.p-toggleswitch) {
  flex-shrink: 0;
  cursor: pointer;
}

/* Results Main */
.search-sort-bar {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, var(--color-gray-50) 100%);
  padding: 12px 20px;
  border-radius: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  border: 1px solid color-mix(in srgb, var(--color-gray-200) 76%, white 24%);
}

.search-input-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  padding: 4px 12px;
  border-radius: 14px;
  flex: 1;
  max-width: 400px;
  border: 1px solid var(--color-gray-200);
  transition: all 0.2s;
}

.search-input-wrap:focus-within {
  border-color: var(--color-primary-400);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary-100) 62%, transparent 38%);
}

.search-input-wrap .material-symbols-outlined { color: var(--color-gray-400); font-size: 18px; }

.search-input-wrap input {
  background: none;
  border: none;
  font-size: 14px;
  width: 100%;
  outline: none !important;
  color: var(--color-gray-700);
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
  position: relative;
  z-index: 20;
}

.sort-label { 
  font-size: 11px; 
  font-weight: 800; 
  color: var(--color-gray-500); 
  letter-spacing: 0.5px; 
}

:deep(.sort-select-small.p-select) {
  min-width: 160px;
  border: 1px solid var(--color-gray-200);
  border-radius: 14px;
  background: white;
  transition: all 0.2s;
}

:deep(.sort-select-small.p-select:hover) {
  border-color: var(--color-gray-300);
}

:deep(.sort-select-small .p-select-label) {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-navy-500);
  padding: 10px 16px;
}

:deep(.sort-select-small .p-select-dropdown) {
  width: 32px;
  color: var(--color-gray-500);
}

:deep(.sort-select-small .p-select-overlay) {
  top: 100% !important;
  left: 0 !important;
  min-width: 100%;
  margin-top: 0;
  border-radius: 8px;
  box-shadow: 0 16px 30px rgba(15, 23, 42, 0.12);
  z-index: 1100;
}

.results-info {
  margin-bottom: 20px;
  font-size: 14px;
  color: var(--color-gray-500);
}

.results-info strong { color: var(--color-navy-500); font-weight: 800; }

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
  color: var(--color-gray-400);
  background: var(--color-gray-50);
  border-radius: 20px;
}

.empty-results-state .material-symbols-outlined {
  font-size: 56px;
  margin-bottom: 16px;
  color: var(--color-gray-300);
}

/* Cursors */
.filters-sidebar :deep(button),
.filters-sidebar :deep(.p-slider),
.filters-sidebar :deep(.p-slider-handle),
.filters-sidebar :deep(.p-checkbox),
.filters-sidebar :deep(.p-checkbox-box),
.filters-sidebar :deep(.p-rating-option),
.filters-sidebar :deep(.p-select),
.filters-sidebar :deep(.p-select-label),
.filters-sidebar :deep(.p-select-dropdown),
.filters-sidebar :deep(.p-select-option),
.filters-sidebar :deep(.p-datepicker),
.filters-sidebar :deep(.p-datepicker input),
.filters-sidebar :deep(.p-datepicker-day),
.filters-sidebar :deep(.p-datepicker-prev-button),
.filters-sidebar :deep(.p-datepicker-next-button),
.filters-sidebar :deep(.p-toggleswitch),
.filter-label,
.checkbox-field,
.checkbox-label,
.guest-trigger,
.apply-btn,
.reset-btn {
  cursor: pointer !important;
}

.search-input-wrap input {
  cursor: text;
}
</style>
