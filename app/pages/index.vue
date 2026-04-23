<template>
  <div class="landing-page">
    <Head>
      <title>VoyageHub — Premium Hotel Booking</title>
      <meta name="description" content="Discover exceptional hotel stays across France. Book your perfect luxury getaway with VoyageHub." />
    </Head>

    <!-- Hero Section -->
    <section class="hero-premium">
      <div class="hero-shell">
        <img src="/images/hero.png" alt="VoyageHub luxury resort" class="hero-backdrop" />
        <div class="hero-overlay"></div>

        <div class="hero-content">
          <div class="hero-copy">
            <h1 class="hero-title">Finding your next exceptional stay is simple.</h1>
          </div>
        </div>

        <div ref="heroFilterRef" class="hero-filter-shell">
          <div class="hero-filter-bar">
            <div class="hero-filter-field hero-filter-field--destination">
              <span class="material-symbols-outlined hero-filter-field__icon">bed</span>
              <Select
                v-model="selectedCity"
                :options="cityOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Choose a city"
                filter
                showClear
                class="hero-filter-select"
              />
            </div>

            <button type="button" class="hero-filter-trigger" :class="{ 'hero-filter-trigger--open': activeFilterPanel === 'dates' }" @click="toggleFilterPanel('dates')">
              <span class="material-symbols-outlined hero-filter-trigger__icon">calendar_month</span>
              <span class="hero-filter-trigger__value">{{ dateRangeLabel }}</span>
              <span class="material-symbols-outlined hero-filter-trigger__chevron">expand_more</span>
            </button>

            <button type="button" class="hero-filter-trigger" :class="{ 'hero-filter-trigger--open': activeFilterPanel === 'guests' }" @click="toggleFilterPanel('guests')">
              <span class="material-symbols-outlined hero-filter-trigger__icon">person</span>
              <span class="hero-filter-trigger__value">{{ guestSummary }}</span>
              <span class="material-symbols-outlined hero-filter-trigger__chevron">expand_more</span>
            </button>

            <Button type="button" class="hero-filter-search" @click="submitHeroSearch">
              <span class="material-symbols-outlined">search</span>
              <span>Search</span>
            </Button>
          </div>

          <div v-if="activeFilterPanel === 'dates'" class="hero-filter-panel hero-filter-panel--dates">
            <div class="hero-filter-panel__header">
              <div>
                <strong>Stay dates</strong>
                <span>Choose exact dates for your trip.</span>
              </div>
              <span class="hero-filter-panel__nights">{{ stayLengthLabel }}</span>
            </div>

            <DatePicker
              v-model="stayDates"
              selectionMode="range"
              inline
              :minDate="today"
              :numberOfMonths="calendarMonths"
              :manualInput="false"
              class="hero-datepicker"
            />

            <div class="hero-filter-chip-row">
              <Button
                v-for="days in quickStayOptions"
                :key="days"
                type="button"
                size="small"
                severity="secondary"
                outlined
                class="hero-filter-chip"
                @click="applyQuickStay(days)"
              >
                {{ days === 1 ? '1 day' : `${days} days` }}
              </Button>
            </div>
          </div>

          <div v-if="activeFilterPanel === 'guests'" class="hero-filter-panel hero-filter-panel--guests">
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
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useHotels } from '~/composables/useHotels'
import { useOffers } from '~/composables/useOffers'
import { useRooms } from '~/composables/useRooms'

const { hotels, featured, fetchAll: fetchHotels, fetchFeatured } = useHotels()
const { offers: activeOffers, fetchActive } = useOffers()
const { rooms, fetchAll: fetchAllRooms } = useRooms()
const router = useRouter()

const benefits = [
  { icon: 'hotel', title: 'Handpicked Hotels', text: 'Every property in our collection is personally vetted for architectural merit and service excellence.' },
  { icon: 'support_agent', title: 'Concierge Service', text: 'Our travel experts are available 24/7 to handle your requests, from dinner reservations to private transfers.' },
  { icon: 'verified', title: 'Best Rate Guarantee', text: 'Book with confidence knowing you are receiving the most competitive rates available online.' }
]

const heroFilterRef = ref<HTMLElement | null>(null)
const activeFilterPanel = ref<'dates' | 'guests' | null>(null)
const today = startOfDay(new Date())
const selectedCity = ref<string | null>(null)
const stayDates = ref<(Date | null)[] | null>([today, addDays(today, 7)])
const calendarMonths = ref(2)
const adults = ref(2)
const children = ref(1)
const roomsRequested = ref(2)
const childAges = ref<number[]>([14])
const travelWithPets = ref(false)
const quickStayOptions = [1, 2, 3, 7]
const childAgeOptions = Array.from({ length: 17 }, (_, index) => ({
  label: `${index + 1} years old`,
  value: index + 1,
}))

const cityOptions = computed(() => {
  return [...new Set(hotels.value.filter((hotel) => hotel.active).map((hotel) => hotel.city))]
    .sort((a, b) => a.localeCompare(b))
    .map((city) => ({ label: city, value: city }))
})

const selectedDateRange = computed(() => {
  if (!Array.isArray(stayDates.value) || stayDates.value.length === 0) return [null, null] as const
  return [stayDates.value[0] ?? null, stayDates.value[1] ?? null] as const
})

const dateRangeLabel = computed(() => {
  const [start, end] = selectedDateRange.value
  if (!start && !end) return 'Choose your stay dates'
  if (start && !end) return `${formatDisplayDate(start)} — Add checkout`
  if (start && end) return `${formatDisplayDate(start)} — ${formatDisplayDate(end)}`
  return 'Choose your stay dates'
})

const stayLengthLabel = computed(() => {
  const [start, end] = selectedDateRange.value
  if (!start || !end) return 'Exact dates'
  const diff = Math.max(1, Math.round((startOfDay(end).getTime() - startOfDay(start).getTime()) / (1000 * 60 * 60 * 24)))
  return diff === 1 ? '1 night' : `${diff} nights`
})

const guestSummary = computed(() => {
  const adultLabel = `${adults.value} adult${adults.value > 1 ? 's' : ''}`
  const childLabel = children.value ? ` · ${children.value} child${children.value > 1 ? 'ren' : ''}` : ''
  const roomLabel = ` · ${roomsRequested.value} room${roomsRequested.value > 1 ? 's' : ''}`
  return `${adultLabel}${childLabel}${roomLabel}`
})

onMounted(async () => {
  await Promise.all([fetchHotels(), fetchFeatured(), fetchActive(), fetchAllRooms()])
  updateCalendarMonths()
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('resize', updateCalendarMonths)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('resize', updateCalendarMonths)
})

function getMinPrice(hotelId: number): number {
  const hotelRooms = rooms.value.filter(r => r.hotelId === hotelId)
  if (hotelRooms.length === 0) return 120
  return Math.min(...hotelRooms.map(r => r.pricePerNight))
}

watch(children, (count) => {
  const next = childAges.value.slice(0, count)
  while (next.length < count) next.push(14)
  childAges.value = next
}, { immediate: true })

function toggleFilterPanel(panel: 'dates' | 'guests') {
  activeFilterPanel.value = activeFilterPanel.value === panel ? null : panel
}

function updateGuestCount(type: 'adults' | 'children' | 'rooms', delta: number) {
  if (type === 'adults') adults.value = Math.max(1, adults.value + delta)
  if (type === 'children') children.value = Math.max(0, children.value + delta)
  if (type === 'rooms') roomsRequested.value = Math.max(1, roomsRequested.value + delta)
}

function applyQuickStay(days: number) {
  const [start] = selectedDateRange.value
  const checkIn = start || today
  stayDates.value = [checkIn, addDays(checkIn, days)]
}

function submitHeroSearch() {
  const [checkIn, checkOut] = selectedDateRange.value
  activeFilterPanel.value = null

  router.push({
    path: '/hotels',
    query: {
      ...(selectedCity.value ? { city: selectedCity.value, q: selectedCity.value } : {}),
      ...(checkIn ? { checkIn: formatDateForQuery(checkIn) } : {}),
      ...(checkOut ? { checkOut: formatDateForQuery(checkOut) } : {}),
      adults: String(adults.value),
      children: String(children.value),
      rooms: String(roomsRequested.value),
      ...(children.value > 0 ? { childAges: childAges.value.join(',') } : {}),
      ...(travelWithPets.value ? { pets: '1' } : {}),
    },
  })
}

function handleClickOutside(event: MouseEvent) {
  if (!heroFilterRef.value) return
  if (!heroFilterRef.value.contains(event.target as Node)) {
    activeFilterPanel.value = null
  }
}

function updateCalendarMonths() {
  if (typeof window === 'undefined') return
  calendarMonths.value = window.innerWidth <= 900 ? 1 : 2
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

function formatDisplayDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

function formatDateForQuery(date: Date) {
  return startOfDay(date).toISOString().split('T')[0]
}
</script>

<style scoped>
.landing-page {
  background: white;
}

/* Hero Premium */
.hero-premium {
  padding: 0 0 52px;
  background:
    radial-gradient(circle at top, color-mix(in srgb, var(--color-primary-100) 60%, white 40%) 0%, transparent 56%),
    linear-gradient(180deg, var(--color-surface-secondary) 0%, var(--color-surface-primary) 100%);
}

.hero-shell {
  position: relative;
  width: 100%;
  max-width: none;
  margin: 0 auto;
  min-height: 500px;
  overflow: visible;
  border: 1px solid color-mix(in srgb, var(--color-border) 45%, white 55%);
  border-top: none;
  border-left: none;
  border-right: none;
  background: var(--color-heading);
}

.hero-backdrop {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: inherit;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background:
    linear-gradient(90deg, rgba(10, 27, 44, 0.78) 0%, rgba(10, 27, 44, 0.54) 34%, rgba(10, 27, 44, 0.18) 66%, rgba(10, 27, 44, 0.24) 100%),
    linear-gradient(180deg, rgba(12, 24, 38, 0.08) 0%, rgba(12, 24, 38, 0.18) 100%);
}

.hero-content {
  position: relative;
  z-index: 1;
  min-height: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  padding: 34px 56px 92px;
}

.hero-copy {
  max-width: 44rem;
  text-align: center;
}

.hero-title {
  max-width: 12ch;
  font-size: clamp(32px, 3.6vw, 48px);
  line-height: 1.02;
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.03em;
  color: white;
  text-shadow: 0 14px 34px rgba(15, 23, 42, 0.24);
}

.hero-filter-shell {
  position: absolute;
  left: 56px;
  right: 56px;
  bottom: -24px;
  max-width: 1120px;
  margin: 0 auto;
  z-index: 2;
}

.hero-filter-bar {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr)) auto;
  gap: 0;
  align-items: stretch;
  background: white;
  border: 1px solid var(--color-border);
  border-radius: 100px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.08);
  padding: 6px 6px 6px 12px;
  overflow: visible;
}

.hero-filter-field,
.hero-filter-trigger {
  position: relative;
  min-height: 3.5rem;
  background: transparent;
  border-radius: 100px;
}

.hero-filter-trigger::before,
.hero-filter-search::before {
  content: '';
  position: absolute;
  left: 0;
  top: 15%;
  height: 70%;
  width: 1px;
  background: var(--color-divider);
  transition: opacity 0.2s;
}

.hero-filter-field:hover + .hero-filter-trigger::before,
.hero-filter-trigger:hover::before,
.hero-filter-trigger:hover + .hero-filter-trigger::before,
.hero-filter-trigger:hover + .hero-filter-search::before,
.hero-filter-trigger--open::before,
.hero-filter-trigger--open + .hero-filter-trigger::before,
.hero-filter-trigger--open + .hero-filter-search::before {
  opacity: 0;
}

.hero-filter-field__icon,
.hero-filter-trigger__icon {
  position: absolute;
  top: 50%;
  left: 1.1rem;
  transform: translateY(-50%);
  color: var(--color-text-secondary);
  font-size: 1.3rem;
}

.hero-filter-field :deep(.p-select) {
  width: 100%;
  height: 100%;
  min-height: 3.5rem;
  padding-left: 2.9rem;
  border: none !important;
  border-radius: 100px;
  background: transparent !important;
  box-shadow: none !important;
}

.hero-filter-field :deep(.p-select-label) {
  display: flex;
  align-items: center;
  min-height: 3.5rem;
  padding: 0 2.8rem 0 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--color-heading);
}

.hero-filter-field :deep(.p-placeholder) {
  color: var(--color-text-secondary);
}

.hero-filter-field :deep(.p-select-dropdown),
.hero-filter-field :deep(.p-select-clear-icon) {
  color: var(--color-text-secondary);
}

.hero-filter-field:hover {
  background: rgba(0, 0, 0, 0.04);
}

.hero-filter-field :deep(.p-select-header) {
  padding: 0.75rem;
  background: var(--color-surface-secondary);
}

.hero-filter-trigger {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  width: 100%;
  padding: 0 3rem 0 1.1rem;
  border: none;
  border-radius: 100px;
  cursor: pointer;
  text-align: left;
  transition: background 0.25s ease;
}

.hero-filter-trigger:hover,
.hero-filter-trigger--open {
  background: rgba(0, 0, 0, 0.04);
}

.hero-filter-trigger__value {
  min-width: 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--color-heading);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.hero-filter-trigger__chevron {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-secondary);
  font-size: 1.2rem;
}

.hero-filter-search {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  min-width: 9rem;
  border: none;
  border-radius: 100px;
  background: var(--color-primary-600);
  color: white;
  font-size: 1rem;
  font-weight: 700;
  margin-left: 4px;
}

.hero-filter-search:hover {
  background: var(--color-primary-800);
}

.hero-filter-search:focus-visible,
.hero-filter-trigger:focus-visible,
.guest-counter-btn:focus-visible,
.guest-done-button:focus-visible {
  outline: none;
  box-shadow: var(--input-focus-ring);
}

.hero-filter-panel {
  position: absolute;
  top: calc(100% + 0.9rem);
  background: var(--color-surface-primary);
  border: 1px solid var(--color-border);
  border-radius: 1.5rem;
  box-shadow: var(--shadow-card-hover);
  padding: 1.15rem;
}

.hero-filter-panel--dates {
  left: 50%;
  transform: translateX(-50%);
  width: min(820px, calc(100vw - 72px));
}

.hero-filter-panel--guests {
  right: 10rem;
  width: min(420px, calc(100vw - 72px));
}

.hero-filter-panel__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.hero-filter-panel__header strong,
.guest-counter-copy strong,
.guest-age-label {
  display: block;
  color: var(--color-heading);
  font-weight: 800;
}

.hero-filter-panel__header span,
.guest-counter-copy span,
.guest-age-note {
  color: var(--color-text-secondary);
  font-size: 0.93rem;
  line-height: 1.5;
}

.hero-filter-panel__nights {
  display: inline-flex;
  align-items: center;
  min-height: 2.2rem;
  padding: 0.35rem 0.8rem;
  border-radius: var(--radius-pill);
  background: var(--color-surface-secondary);
  border: 1px solid var(--color-border);
  white-space: nowrap;
}

.hero-datepicker {
  display: block;
}

.hero-datepicker :deep(.p-datepicker) {
  border: none;
  background: transparent;
}

.hero-datepicker :deep(.p-datepicker-group-container) {
  gap: 2rem;
}

.hero-datepicker :deep(.p-datepicker-header) {
  border-bottom: 1px solid var(--color-divider);
  padding: 0.6rem 0.25rem 1rem;
}

.hero-datepicker :deep(.p-datepicker-panel) {
  border: none;
}

.hero-datepicker :deep(.p-datepicker-day-selected),
.hero-datepicker :deep(.p-datepicker-day-selected-range) {
  background: var(--color-primary-600);
  color: white;
}

.hero-filter-chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  margin-top: 1rem;
}

.hero-filter-chip {
  border-radius: var(--radius-pill);
  color: var(--color-heading);
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

.guest-counter-control {
  display: grid;
  grid-template-columns: 2.2rem 2.8rem 2.2rem;
  align-items: center;
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  background: var(--color-surface-primary);
  overflow: hidden;
}

.guest-counter-control span {
  text-align: center;
  color: var(--color-heading);
  font-size: 0.95rem;
  font-weight: 800;
}

.guest-counter-btn {
  border: none;
  min-height: 2.4rem;
  color: var(--color-primary-600);
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
  border-top: 1px solid var(--color-divider);
}

.guest-done-button {
  width: 100%;
  justify-content: center;
}

.guest-pets-row :deep(.p-toggleswitch) {
  flex-shrink: 0;
}

.section-container {
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 32px;
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
  .hero-premium {
    padding: 0 0 48px;
  }

  .hero-shell {
    min-height: 460px;
    border-radius: 0 0 28px 28px;
  }

  .hero-content {
    padding: 30px 30px 92px;
  }

  .hero-title {
    max-width: 13ch;
    font-size: clamp(28px, 4.8vw, 40px);
  }

  .hero-filter-shell {
    left: 30px;
    right: 30px;
    bottom: -22px;
    max-width: none;
  }

  .hero-filter-bar {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .hero-filter-search {
    min-height: 3.5rem;
    grid-column: 1 / -1;
    border-radius: 0 0 1.2rem 1.2rem;
  }

  .hero-filter-panel--dates,
  .hero-filter-panel--guests {
    left: 0;
    right: 0;
    width: auto;
  }

  .benefits-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .hero-premium {
    padding: 0 0 24px;
  }

  .hero-shell {
    min-height: auto;
    border-radius: 0 0 24px 24px;
  }

  .hero-backdrop,
  .hero-overlay {
    border-radius: 0 0 24px 24px;
  }

  .hero-content {
    padding: 24px 20px 20px;
    gap: 20px;
  }

  .hero-copy {
    max-width: none;
  }

  .hero-title {
    max-width: 13ch;
    font-size: 1.85rem;
  }

  .section-container {
    padding: 0 18px;
  }

  .hero-filter-shell {
    position: relative;
    left: auto;
    right: auto;
    bottom: auto;
    margin: 0 20px 18px;
    max-width: none;
  }

  .hero-filter-bar {
    grid-template-columns: 1fr;
    border-radius: 1.15rem;
    padding: 0;
  }

  .hero-filter-trigger::before,
  .hero-filter-search::before {
    display: none;
  }

  .hero-filter-field + .hero-filter-trigger,
  .hero-filter-trigger + .hero-filter-trigger,
  .hero-filter-trigger + .hero-filter-search {
    border-top: 1px solid var(--color-divider);
  }

  .hero-filter-field,
  .hero-filter-trigger {
    min-height: 3.5rem;
  }

  .hero-filter-field :deep(.p-select),
  .hero-filter-field :deep(.p-select-label) {
    min-height: 3.5rem;
  }

  .hero-filter-search {
    min-width: 0;
    min-height: 3.5rem;
    border-radius: 0 0 1.15rem 1.15rem;
    margin-left: 0;
  }

  .hero-filter-panel {
    position: static;
    width: 100%;
    margin-top: 0.85rem;
    border-radius: 1.15rem;
  }

  .hero-datepicker :deep(.p-datepicker) {
    display: block;
  }

  .hero-datepicker :deep(.p-datepicker-calendar-container) {
    width: 100%;
  }

  .hero-datepicker :deep(.p-datepicker-day-view) {
    min-width: 0;
  }

  .guest-counter-row,
  .guest-pets-row {
    align-items: flex-start;
    flex-direction: column;
  }

  .hotels-grid,
  .offers-grid {
    grid-template-columns: 1fr;
  }

  .section-featured,
  .benefits-section,
  .section-offers {
    padding: 18px 0 24px;
  }

  .stats-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
