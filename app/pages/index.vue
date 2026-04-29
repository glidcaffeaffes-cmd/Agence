<template>
  <div class="landing-page">
    <Head>
      <title>VoyageHub — Premium Hotel Booking</title>
      <meta
        name="description"
        content="Discover exceptional hotel stays across France. Book your perfect luxury getaway with VoyageHub."
      />
    </Head>

    <!-- Hero Section -->
    <section class="hero-premium">
      <div class="hero-shell">
        <video
          ref="heroVideo"
          src="https://res.cloudinary.com/dncfxydui/video/upload/v1777499673/WhatsApp_Video_2026-04-29_at_22.52.04_hdgoer.mp4"
          poster="/images/hero.png"
          autoplay
          loop
          muted
          playsinline
          preload="auto"
          class="hero-backdrop"
        ></video>
        <div class="hero-overlay"></div>

        <div class="hero-content">
          <div class="hero-copy">
            <h1 class="hero-title">
              Finding your next exceptional stay is simple.
            </h1>
          </div>
        </div>

        <div
          ref="heroFilterRef"
          class="hero-filter-shell"
          :class="{
            'hero-filter-shell--panel-open': activeFilterPanel !== null,
          }"
        >
          <div class="hero-filter-bar">
            <button
              type="button"
              class="hero-filter-trigger"
              :class="{
                'hero-filter-trigger--open':
                  activeFilterPanel === 'destination',
              }"
              @click="toggleFilterPanel('destination')"
            >
              <span class="material-symbols-outlined hero-filter-trigger__icon"
                >bed</span
              >
              <span class="hero-filter-trigger__copy">
                <span class="hero-filter-trigger__label">Destination</span>
                <span class="hero-filter-trigger__value">{{
                  selectedCity || "Choose a city"
                }}</span>
              </span>
              <span
                class="material-symbols-outlined hero-filter-trigger__chevron"
                >expand_more</span
              >
            </button>

            <button
              type="button"
              class="hero-filter-trigger"
              :class="{
                'hero-filter-trigger--open': activeFilterPanel === 'dates',
              }"
              @click="toggleFilterPanel('dates')"
            >
              <span class="material-symbols-outlined hero-filter-trigger__icon"
                >calendar_month</span
              >
              <span class="hero-filter-trigger__copy">
                <span class="hero-filter-trigger__label">Dates</span>
                <span class="hero-filter-trigger__value">{{
                  dateRangeLabel
                }}</span>
              </span>
              <span
                class="material-symbols-outlined hero-filter-trigger__chevron"
                >expand_more</span
              >
            </button>

            <button
              type="button"
              class="hero-filter-trigger"
              :class="{
                'hero-filter-trigger--open': activeFilterPanel === 'guests',
              }"
              @click="toggleFilterPanel('guests')"
            >
              <span class="material-symbols-outlined hero-filter-trigger__icon"
                >person</span
              >
              <span class="hero-filter-trigger__copy">
                <span class="hero-filter-trigger__label">Guests & rooms</span>
                <span class="hero-filter-trigger__value">{{
                  guestSummary
                }}</span>
              </span>
              <span
                class="material-symbols-outlined hero-filter-trigger__chevron"
                >expand_more</span
              >
            </button>

            <Button
              type="button"
              class="hero-filter-search"
              @click="submitHeroSearch"
            >
              <span class="material-symbols-outlined">search</span>
              <span>Search</span>
            </Button>
          </div>

          <div
            v-if="activeFilterPanel === 'destination'"
            class="hero-filter-panel hero-filter-panel--destination"
          >
            <div class="destination-search-wrap">
              <span class="material-symbols-outlined">search</span>
              <input
                type="text"
                v-model="citySearchQuery"
                placeholder="Choose a city"
                class="destination-search-input"
                autofocus
              />
            </div>
            <div class="destination-list">
              <button
                v-for="city in filteredCities"
                :key="city.value"
                class="destination-list-item"
                :class="{
                  'destination-list-item--selected':
                    selectedCity === city.value,
                }"
                @click="selectCity(city.value)"
              >
                {{ city.label }}
              </button>
              <div
                v-if="filteredCities.length === 0"
                class="destination-list-empty"
              >
                No cities found
              </div>
            </div>
          </div>

          <div
            v-if="activeFilterPanel === 'dates'"
            class="hero-filter-panel hero-filter-panel--dates"
          >
            <div class="hero-filter-panel__header">
              <div>
                <strong>Stay dates</strong>
                <span>Choose exact dates for your trip.</span>
              </div>
              <span class="hero-filter-panel__nights">{{
                stayLengthLabel
              }}</span>
            </div>

            <DatePicker
              v-model="stayDates"
              selectionMode="range"
              inline
              :minDate="today"
              :numberOfMonths="calendarMonths"
              :manualInput="false"
              :class="[
                'hero-datepicker',
                { 'hero-datepicker--two-months': calendarMonths === 2 },
              ]"
            />

            <div class="hero-filter-dates-footer">
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
                  {{ days === 1 ? "1 day" : `${days} days` }}
                </Button>
              </div>
              <Button
                type="button"
                class="hero-filter-apply-btn"
                @click="applyDateSelection"
              >
                Apply
              </Button>
            </div>
          </div>

          <div
            v-if="activeFilterPanel === 'guests'"
            class="hero-filter-panel hero-filter-panel--guests"
          >
            <div class="guest-counter-row">
              <div class="guest-counter-copy">
                <strong>Adults</strong>
                <span>Ages 18 or above</span>
              </div>
              <div class="guest-counter-control">
                <Button
                  type="button"
                  text
                  class="guest-counter-btn"
                  @click="updateGuestCount('adults', -1)"
                  :disabled="adults <= 1"
                  >−</Button
                >
                <span>{{ adults }}</span>
                <Button
                  type="button"
                  text
                  class="guest-counter-btn"
                  @click="updateGuestCount('adults', 1)"
                  >+</Button
                >
              </div>
            </div>

            <div class="guest-counter-row">
              <div class="guest-counter-copy">
                <strong>Children</strong>
                <span>Age 0 to 17 years</span>
              </div>
              <div class="guest-counter-control">
                <Button
                  type="button"
                  text
                  class="guest-counter-btn"
                  @click="updateGuestCount('children', -1)"
                  :disabled="children <= 0"
                  >−</Button
                >
                <span>{{ children }}</span>
                <Button
                  type="button"
                  text
                  class="guest-counter-btn"
                  @click="updateGuestCount('children', 1)"
                  >+</Button
                >
              </div>
            </div>

            <div v-if="children > 0" class="guest-age-grid">
              <div
                v-for="(_, index) in childAges"
                :key="`child-age-${index}`"
                class="guest-age-item"
              >
                <label class="guest-age-label">Child {{ index + 1 }} age</label>
                <Select
                  v-model="childAges[index]"
                  :options="childAgeOptions"
                  optionLabel="label"
                  optionValue="value"
                  overlayClass="guest-age-overlay"
                  class="guest-age-select"
                />
              </div>
            </div>

            <p v-if="children > 0" class="guest-age-note">
              We use each child age to estimate the correct room options and
              rates for your stay.
            </p>

            <div class="guest-counter-row">
              <div class="guest-counter-copy">
                <strong>Rooms</strong>
                <span>Choose what you need</span>
              </div>
              <div class="guest-counter-control">
                <Button
                  type="button"
                  text
                  class="guest-counter-btn"
                  @click="updateGuestCount('rooms', -1)"
                  :disabled="roomsRequested <= 1"
                  >−</Button
                >
                <span>{{ roomsRequested }}</span>
                <Button
                  type="button"
                  text
                  class="guest-counter-btn"
                  @click="updateGuestCount('rooms', 1)"
                  >+</Button
                >
              </div>
            </div>

            <Button
              type="button"
              label="Apply"
              class="guest-apply-button"
              @click="activeFilterPanel = null"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Top Destinations -->
    <TopDestinations />

    <!-- Featured Hotels: Tonal Background -->
    <section class="section-featured">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">Featured Collections</h2>
          <p class="section-subtitle">
            Handpicked 5-star destinations for an exceptional experience
          </p>
        </div>
        <div class="hotels-grid">
          <HotelCard
            v-for="hotel in featuredHotels"
            :key="hotel.id"
            :hotel="hotel"
            :min-price="getMinPrice(hotel.id)"
          />
        </div>
        <div class="section-action">
          <NuxtLink to="/hotels" class="view-all-link">
            Explore All Hotels
            <span class="material-symbols-outlined">arrow_forward</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Why VoyageHub: Benefits -->
    <section class="benefits-section">
      <div class="section-container">
        <div class="benefits-grid">
          <div
            v-for="benefit in benefits"
            :key="benefit.title"
            class="benefit-item"
          >
            <div class="flex items-center gap-4">
              <div class="benefit-icon-wrap">
                <span class="material-symbols-outlined">{{
                  benefit.icon
                }}</span>
              </div>
              <h4 class="benefit-title">{{ benefit.title }}</h4>
            </div>
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
          <p class="section-subtitle">
            Exclusive deals and seasonal packages for unforgettable journeys
          </p>
        </div>
        <div class="offers-grid">
          <OfferCard
            v-for="offer in limitedOffers"
            :key="offer.id"
            :offer="offer"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useHotels } from "~/composables/useHotels";
import { useOffers } from "~/composables/useOffers";
import { useRooms } from "~/composables/useRooms";

const { hotels, featured, fetchAll: fetchHotels, fetchFeatured } = useHotels();
const { offers: activeOffers, fetchActive } = useOffers();
const { rooms, fetchAll: fetchAllRooms } = useRooms();
const router = useRouter();
const FEATURED_HOTELS_LIMIT = 8;
const featuredHotels = computed(() =>
  featured.value.slice(0, FEATURED_HOTELS_LIMIT),
);

const OFFERS_LIMIT = 4;
const limitedOffers = computed(() =>
  activeOffers.value.slice(0, OFFERS_LIMIT),
);

const benefits = [
  {
    icon: "hotel",
    title: "Handpicked Hotels",
    text: "Every property in our collection is personally vetted for architectural merit and service excellence.",
  },
  {
    icon: "support_agent",
    title: "Concierge Service",
    text: "Our travel experts are available 24/7 to handle your requests, from dinner reservations to private transfers.",
  },
  {
    icon: "verified",
    title: "Best Rate Guarantee",
    text: "Book with confidence knowing you are receiving the most competitive rates available online.",
  },
];

const heroFilterRef = ref<HTMLElement | null>(null);
const heroVideo = ref<HTMLVideoElement | null>(null);
const activeFilterPanel = ref<"dates" | "guests" | "destination" | null>(null);
const today = startOfDay(new Date());
const selectedCity = ref<string | null>(null);
const stayDates = ref<(Date | null)[] | null>([today, addDays(today, 7)]);
const calendarMonths = ref(2);
const adults = ref(2);
const children = ref(1);
const roomsRequested = ref(2);
const childAges = ref<number[]>([14]);
const quickStayOptions = [1, 2, 3, 7];
const childAgeOptions = Array.from({ length: 17 }, (_, index) => ({
  label: `${index + 1}`,
  value: index + 1,
}));

// Static 24 Tunisian governorates — always available regardless of DB content
const TUNISIA_CITIES = [
  "Ariana",
  "Béja",
  "Ben Arous",
  "Bizerte",
  "Gabès",
  "Gafsa",
  "Jendouba",
  "Kairouan",
  "Kasserine",
  "Kébili",
  "La Manouba",
  "Le Kef",
  "Mahdia",
  "Médenine",
  "Monastir",
  "Nabeul",
  "Sfax",
  "Sidi Bouzid",
  "Siliana",
  "Sousse",
  "Tataouine",
  "Tozeur",
  "Tunis",
  "Zaghouan",
];

const cityOptions = TUNISIA_CITIES.map((city) => ({
  label: city,
  value: city,
}));

const citySearchQuery = ref("");
const filteredCities = computed(() => {
  const q = citySearchQuery.value.toLowerCase();
  return cityOptions.filter((c) => c.label.toLowerCase().includes(q));
});

function selectCity(city: string) {
  selectedCity.value = city;
  activeFilterPanel.value = null;
}

const selectedDateRange = computed(() => {
  if (!Array.isArray(stayDates.value) || stayDates.value.length === 0)
    return [null, null] as const;
  return [stayDates.value[0] ?? null, stayDates.value[1] ?? null] as const;
});

const dateRangeLabel = computed(() => {
  const [start, end] = selectedDateRange.value;
  if (!start && !end) return "Choose your stay dates";
  if (start && !end) return `${formatDisplayDate(start)} — Add checkout`;
  if (start && end)
    return `${formatDisplayDate(start)} — ${formatDisplayDate(end)}`;
  return "Choose your stay dates";
});

const stayLengthLabel = computed(() => {
  const [start, end] = selectedDateRange.value;
  if (!start || !end) return "Exact dates";
  const diff = Math.max(
    1,
    Math.round(
      (startOfDay(end).getTime() - startOfDay(start).getTime()) /
        (1000 * 60 * 60 * 24),
    ),
  );
  return diff === 1 ? "1 night" : `${diff} nights`;
});

const guestSummary = computed(() => {
  const adultLabel = `${adults.value} adult${adults.value > 1 ? "s" : ""}`;
  const childLabel = children.value
    ? ` · ${children.value} child${children.value > 1 ? "ren" : ""}`
    : "";
  const roomLabel = ` · ${roomsRequested.value} room${roomsRequested.value > 1 ? "s" : ""}`;
  return `${adultLabel}${childLabel}${roomLabel}`;
});

onMounted(async () => {
  await Promise.all([
    fetchHotels(),
    fetchFeatured(),
    fetchActive(),
    fetchAllRooms(),
  ]);
  updateCalendarMonths();
  document.addEventListener("click", handleClickOutside);
  window.addEventListener("resize", updateCalendarMonths);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
  window.removeEventListener("resize", updateCalendarMonths);
});

function getMinPrice(hotelId: number): number {
  const hotelRooms = rooms.value.filter((r) => r.hotelId === hotelId);
  if (hotelRooms.length === 0) return 120;
  return Math.min(...hotelRooms.map((r) => r.pricePerNight));
}

watch(
  children,
  (count) => {
    const next = childAges.value.slice(0, count);
    while (next.length < count) next.push(14);
    childAges.value = next;
  },
  { immediate: true },
);

function toggleFilterPanel(panel: "dates" | "guests" | "destination") {
  activeFilterPanel.value = activeFilterPanel.value === panel ? null : panel;
}

function updateGuestCount(
  type: "adults" | "children" | "rooms",
  delta: number,
) {
  if (type === "adults") adults.value = Math.max(1, adults.value + delta);
  if (type === "children") children.value = Math.max(0, children.value + delta);
  if (type === "rooms")
    roomsRequested.value = Math.max(1, roomsRequested.value + delta);
}

function applyQuickStay(days: number) {
  const [start] = selectedDateRange.value;
  const checkIn = start || today;
  stayDates.value = [checkIn, addDays(checkIn, days)];
}

function applyDateSelection() {
  activeFilterPanel.value = null;
}

function submitHeroSearch() {
  const [checkIn, checkOut] = selectedDateRange.value;
  activeFilterPanel.value = null;

  router.push({
    path: "/hotels",
    query: {
      ...(selectedCity.value
        ? { city: selectedCity.value, q: selectedCity.value }
        : {}),
      ...(checkIn ? { checkIn: formatDateForQuery(checkIn) } : {}),
      ...(checkOut ? { checkOut: formatDateForQuery(checkOut) } : {}),
      adults: String(adults.value),
      children: String(children.value),
      rooms: String(roomsRequested.value),
      ...(children.value > 0 ? { childAges: childAges.value.join(",") } : {}),
    },
  });
}

function handleClickOutside(event: MouseEvent) {
  if (!heroFilterRef.value) return;
  if (!heroFilterRef.value.contains(event.target as Node)) {
    activeFilterPanel.value = null;
  }
}

function updateCalendarMonths() {
  if (typeof window === "undefined") return;
  calendarMonths.value = window.innerWidth <= 900 ? 1 : 2;
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function formatDisplayDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date);
}

function formatDateForQuery(date: Date) {
  return startOfDay(date).toISOString().split("T")[0];
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
    radial-gradient(
      circle at top,
      color-mix(in srgb, var(--color-primary-100) 60%, white 40%) 0%,
      transparent 56%
    ),
    linear-gradient(
      180deg,
      var(--color-surface-secondary) 0%,
      var(--color-surface-primary) 100%
    );
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
    linear-gradient(
      90deg,
      rgba(10, 27, 44, 0.78) 0%,
      rgba(10, 27, 44, 0.54) 34%,
      rgba(10, 27, 44, 0.18) 66%,
      rgba(10, 27, 44, 0.24) 100%
    ),
    linear-gradient(
      180deg,
      rgba(12, 24, 38, 0.08) 0%,
      rgba(12, 24, 38, 0.18) 100%
    );
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
  z-index: 12;
  isolation: isolate;
  font-family: var(--font-family-base);
}

.hero-filter-shell--panel-open::after {
  content: "";
  position: fixed;
  inset: 0;
  background: rgba(11, 22, 34, 0.18);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  pointer-events: none;
  z-index: 24;
}

.hero-filter-bar {
  position: relative;
  z-index: 26;
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) repeat(2, minmax(0, 1fr)) auto;
  gap: 0;
  align-items: center;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.98) 0%,
    rgba(250, 253, 255, 0.98) 100%
  );
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid color-mix(in srgb, var(--color-border) 88%, white 12%);
  border-radius: 1.6rem;
  box-shadow:
    0 20px 42px rgba(15, 23, 42, 0.16),
    inset 0 1px 0 rgba(255, 255, 255, 0.55);
  padding: 0.6rem;
  overflow: visible;
  transition: all 0.3s ease;
}

.hero-filter-shell--panel-open .hero-filter-bar {
  filter: blur(2px);
  pointer-events: none;
}

.hero-filter-trigger {
  display: flex;
  align-items: center;
  gap: 0.82rem;
  min-height: 4.18rem;
  padding: 0 1.18rem;
  background: transparent;
  border: 0;
  border-right: 1px solid var(--color-divider);
  border-radius: 1.2rem;
  transition:
    background 0.25s ease,
    box-shadow 0.25s ease;
  width: 100%;
  cursor: pointer;
  text-align: left;
}

.hero-filter-trigger:hover,
.hero-filter-trigger--open {
  background: color-mix(in srgb, var(--color-primary-25) 70%, white 30%);
}

.hero-filter-trigger__icon {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.45rem;
  height: 1.45rem;
  color: var(--color-primary-600);
  font-size: 1.28rem;
}

.hero-filter-trigger__copy {
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.16rem;
}

.hero-filter-trigger__label {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-secondary);
}

.hero-filter-trigger__value {
  min-width: 0;
  display: block;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.3;
  color: var(--color-heading);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.hero-filter-trigger__chevron {
  flex-shrink: 0;
  margin-left: auto;
  color: var(--color-text-secondary);
  font-size: 1.16rem;
  transition: transform 0.24s ease;
}

.hero-filter-trigger--open .hero-filter-trigger__chevron {
  transform: rotate(180deg);
}

.hero-filter-search {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.52rem;
  min-width: 10.65rem;
  min-height: 4.1rem;
  padding: 0 1.55rem;
  border: 1px solid var(--color-primary-600);
  border-radius: 1.2rem;
  margin-left: 0.3rem;
  background: var(--color-primary-600);
  color: white;
  font-size: 0.98rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  box-shadow: 0 14px 28px rgba(0, 80, 81, 0.32);
  transition:
    transform 0.24s ease,
    box-shadow 0.24s ease,
    filter 0.24s ease;
}

.hero-filter-search:hover {
  transform: translateY(-1px);
  background: var(--color-primary-700);
  color: #fff !important;
  box-shadow: 0 18px 32px rgba(0, 80, 81, 0.38);
}

.hero-filter-search:hover :deep(.p-button-label),
.hero-filter-search:hover :deep(.p-button-icon),
.hero-filter-search:hover .material-symbols-outlined {
  color: #fff !important;
}

.hero-filter-search :deep(.p-button-label),
.hero-filter-search :deep(.p-button-icon),
.hero-filter-search .material-symbols-outlined {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.hero-filter-search .material-symbols-outlined {
  font-size: 1.16rem;
}

.hero-filter-search:active {
  transform: translateY(0);
}

.hero-filter-search:focus-visible,
.hero-filter-trigger:focus-visible,
.guest-counter-btn:focus-visible,
.guest-done-button:focus-visible {
  outline: none;
  box-shadow: var(--input-focus-ring);
}

.hero-filter-panel {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 27;
  background: var(--color-surface-primary);
  border: 1px solid color-mix(in srgb, var(--color-border) 88%, white 12%);
  border-radius: 1.5rem;
  box-shadow: 0 34px 62px rgba(5, 17, 32, 0.28);
  padding: 1.45rem;
  max-height: calc(100vh - 72px);
  overflow: auto;
}

.hero-filter-panel--dates {
  width: min(760px, calc(100vw - 72px));
}

.hero-filter-panel--guests {
  width: min(420px, calc(100vw - 72px));
}

.hero-filter-panel--destination {
  width: min(420px, calc(100vw - 72px));
}

.destination-search-wrap {
  position: relative;
  margin-bottom: 0.75rem;
}

.destination-search-input {
  width: 100%;
  padding: 0.85rem 1rem 0.85rem 2.8rem;
  border: 1px solid color-mix(in srgb, var(--color-border) 80%, transparent);
  border-radius: 0.8rem;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-heading);
  background: var(--color-surface-secondary);
  outline: none;
  transition:
    border-color 0.2s,
    background 0.2s;
}

.destination-search-input:focus {
  background: white;
  border-color: var(--color-primary-400);
}

.destination-search-wrap .material-symbols-outlined {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-secondary);
  font-size: 1.2rem;
  pointer-events: none;
}

.destination-list {
  max-height: 320px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding-right: 0.5rem;
  margin-right: -0.5rem;
}

.destination-list::-webkit-scrollbar {
  width: 4px;
}
.destination-list::-webkit-scrollbar-track {
  background: transparent;
}
.destination-list::-webkit-scrollbar-thumb {
  background: var(--color-divider);
  border-radius: 4px;
}

.destination-list-item {
  width: 100%;
  text-align: left;
  padding: 0.8rem 1rem;
  border: none;
  background: transparent;
  border-radius: 0.6rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-heading);
  cursor: pointer;
  transition: background 0.2s;
}

.destination-list-item:hover {
  background: var(--color-surface-secondary);
}

.destination-list-item--selected {
  background: color-mix(in srgb, var(--color-primary-100) 40%, white 60%);
  color: var(--color-primary-700);
}

.destination-list-empty {
  padding: 1rem;
  text-align: center;
  color: var(--color-text-secondary);
  font-size: 0.95rem;
}

.hero-filter-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.15rem;
}

.hero-filter-panel__header strong,
.guest-counter-copy strong,
.guest-age-label {
  display: block;
  color: var(--color-heading);
  font-size: 14px;
  font-weight: 600;
}

.hero-filter-panel__header span,
.guest-counter-copy span,
.guest-age-note {
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 500;
  line-height: 1.5;
}

.hero-filter-panel__nights {
  display: inline-flex;
  align-items: center;
  min-height: 2.2rem;
  padding: 0.32rem 0.82rem;
  border-radius: var(--radius-pill);
  background: color-mix(in srgb, var(--color-primary-25) 75%, white 25%);
  border: 1px solid color-mix(in srgb, var(--color-primary-200) 70%, white 30%);
  color: var(--color-primary-700);
  font-weight: 700;
  white-space: nowrap;
}

.hero-datepicker {
  display: block;
}

.hero-datepicker :deep(.p-datepicker) {
  border: none;
  background: transparent;
  padding: 0;
}

.hero-datepicker :deep(.p-datepicker-group-container) {
  position: relative;
  gap: 1.65rem;
  align-items: flex-start;
}

.hero-datepicker :deep(.p-datepicker-group) {
  display: grid;
  gap: 0.24rem;
  min-width: 0;
}

.hero-datepicker--two-months :deep(.p-datepicker-group-container) {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 0;
  align-items: stretch;
}

.hero-datepicker--two-months
  :deep(
    .p-datepicker-group-container
      > .p-datepicker-calendar-container:first-of-type
  ),
.hero-datepicker--two-months
  :deep(.p-datepicker-group-container > .p-datepicker-group:first-of-type) {
  padding-right: 22px !important;
}

.hero-datepicker--two-months
  :deep(
    .p-datepicker-group-container
      > .p-datepicker-calendar-container:first-of-type
      .p-datepicker-calendar
  ),
.hero-datepicker--two-months
  :deep(
    .p-datepicker-group-container
      > .p-datepicker-group:first-of-type
      .p-datepicker-calendar
  ) {
  border-right: 1px solid #cbd5e1 !important;
}

.hero-datepicker--two-months
  :deep(
    .p-datepicker-group-container
      > .p-datepicker-calendar-container:last-of-type
  ),
.hero-datepicker--two-months
  :deep(.p-datepicker-group-container > .p-datepicker-group:last-of-type) {
  padding-left: 22px !important;
}

.hero-datepicker :deep(.p-datepicker-calendar-container) {
  min-width: 0;
  flex: 1;
}

.hero-datepicker
  :deep(.p-datepicker-calendar-container .p-datepicker-calendar:first-child) {
  border-right: 1px solid #cbd5e1 !important;
}

.hero-datepicker :deep(.p-datepicker-header) {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 2rem;
  border-bottom: 1px solid var(--color-divider);
  padding: 0.42rem 2.05rem 0.7rem;
  margin-bottom: 0.24rem;
}

.hero-datepicker :deep(.p-datepicker-header > *) {
  min-width: 0;
}

.hero-datepicker :deep(.p-datepicker-title) {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  font-size: 0.93rem;
  font-weight: 700;
  line-height: 1;
  white-space: nowrap;
  color: var(--color-heading);
  margin: 0 auto;
  text-align: center;
}

.hero-datepicker :deep(.p-datepicker-prev-button),
.hero-datepicker :deep(.p-datepicker-next-button) {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  line-height: 0;
  width: 1.72rem;
  height: 1.72rem;
  border-radius: 999px;
  color: var(--color-text-secondary);
  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.hero-datepicker :deep(.p-datepicker-prev-button .p-icon),
.hero-datepicker :deep(.p-datepicker-next-button .p-icon),
.hero-datepicker :deep(.p-datepicker-prev-button svg),
.hero-datepicker :deep(.p-datepicker-next-button svg) {
  width: 0.96rem;
  height: 0.96rem;
  display: block;
  margin: 0;
}

.hero-datepicker :deep(.p-datepicker-prev-button) {
  left: 0.2rem;
}

.hero-datepicker :deep(.p-datepicker-next-button) {
  right: 0.2rem;
}

.hero-datepicker :deep(.p-datepicker-prev-button:hover),
.hero-datepicker :deep(.p-datepicker-next-button:hover) {
  background: color-mix(in srgb, var(--color-primary-50) 70%, white 30%);
  color: var(--color-primary-700);
}

.hero-datepicker :deep(.p-datepicker-day-view) {
  width: 100%;
  table-layout: fixed;
  border-collapse: separate;
  border-spacing: 0;
}

.hero-datepicker :deep(.p-datepicker-weekday-cell),
.hero-datepicker :deep(.p-datepicker-day-cell) {
  width: 14.2857%;
}

.hero-datepicker :deep(.p-datepicker-weekday) {
  display: inline-flex;
  width: 100%;
  justify-content: center;
}

.hero-datepicker :deep(.p-datepicker-day-view th) {
  padding: 0.14rem 0 0.28rem;
  text-align: center;
  font-size: 0.69rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--color-text-secondary);
}

.hero-datepicker :deep(.p-datepicker-day-view td) {
  padding: 0.08rem 0;
  text-align: center;
  vertical-align: middle;
}

.hero-datepicker :deep(.p-datepicker-day) {
  width: 2.06rem;
  height: 2.06rem;
  border-radius: 0.66rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.88rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease;
}

.hero-datepicker
  :deep(.p-datepicker-day-cell.p-datepicker-other-month .p-datepicker-day) {
  color: color-mix(in srgb, var(--color-text-secondary) 72%, white 28%);
}

.hero-datepicker :deep(.p-datepicker-day:not(.p-disabled):hover) {
  background: color-mix(in srgb, var(--color-primary-50) 72%, white 28%);
  color: var(--color-primary-700);
}

.hero-datepicker :deep(.p-datepicker-day-selected-range) {
  background: color-mix(in srgb, var(--color-primary-200) 55%, white 45%);
  color: var(--color-primary-700);
  border-radius: 0.68rem;
}

.hero-datepicker :deep(.p-datepicker-day-selected),
.hero-datepicker :deep(.p-datepicker-day-selected-start),
.hero-datepicker :deep(.p-datepicker-day-selected-end) {
  background: linear-gradient(
    145deg,
    #0a7677 0%,
    var(--color-primary-600) 100%
  );
  color: white;
  box-shadow: 0 8px 18px rgba(0, 80, 81, 0.34);
}

.hero-filter-dates-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.9rem;
  margin-top: 1.25rem;
}

.hero-filter-chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  padding: 0.34rem;
  border-radius: 0.95rem;
}

.hero-filter-chip {
  min-height: 2rem;
  padding: 0.42rem 0.88rem;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--color-primary-200) 52%, white 48%) !important;
  background: white !important;
  color: var(--color-primary-700) !important;
  font-size: 0.89rem;
  font-weight: 700;
  line-height: 1;
  box-shadow: 0 3px 10px rgba(0, 80, 81, 0.08);
  transition:
    transform 0.2s ease,
    background 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease;
}

.hero-filter-chip:hover {
  transform: translateY(-1px);
  background: color-mix(
    in srgb,
    var(--color-primary-50) 66%,
    white 34%
  ) !important;
  color: var(--color-primary-800) !important;
  box-shadow: 0 6px 14px rgba(0, 80, 81, 0.14);
}

.hero-filter-chip:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px
    color-mix(in srgb, var(--color-primary-100) 62%, transparent 38%);
}

.hero-filter-chip :deep(.p-button-label) {
  font-weight: 700;
}

.hero-filter-apply-btn {
  border: 1px solid var(--color-primary-600) !important;
  border-radius: 0.8rem !important;
  padding: 8px 16px !important;
  font-size: 14px !important;
  font-weight: 800 !important;
  color: #fff !important;
  background: var(--color-primary-600) !important;
  box-shadow: 0 8px 18px rgba(0, 80, 81, 0.3) !important;
}

.hero-filter-apply-btn:hover {
  transform: translateY(-1px);
  background: var(--color-primary-700) !important;
  box-shadow: 0 12px 22px rgba(0, 80, 81, 0.36) !important;
}

.hero-filter-apply-btn:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 3px color-mix(in srgb, var(--color-primary-100) 62%, transparent 38%),
    0 10px 20px rgba(0, 80, 81, 0.34) !important;
}

.hero-filter-field--destination {
  position: relative;
}

.hero-filter-field--destination :deep(.p-select-overlay) {
  position: fixed !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  width: min(560px, calc(100vw - 72px)) !important;
  min-width: min(560px, calc(100vw - 72px)) !important;
  max-width: calc(100vw - 72px) !important;
  margin-top: 0 !important;
  border-radius: 1.5rem !important;
  border: 1px solid color-mix(in srgb, var(--color-border) 88%, white 12%) !important;
  background: var(--color-surface-primary) !important;
  box-shadow: 0 34px 62px rgba(5, 17, 32, 0.28) !important;
  padding: 1.45rem !important;
  max-height: calc(100vh - 72px) !important;
  overflow: hidden !important;
  z-index: 40;
}

.hero-filter-field--destination :deep(.p-select-header) {
  padding: 0 0 1rem !important;
  margin: 0 !important;
  border: none !important;
  background: transparent !important;
}

.hero-filter-field--destination :deep(.p-select-filter-container) {
  position: relative;
}

.hero-filter-field--destination :deep(.p-select-filter) {
  width: 100%;
  min-height: 2.4rem;
  border: 1px solid color-mix(in srgb, var(--color-primary-200) 55%, white 45%);
  border-radius: 0.75rem;
  background: white;
  color: var(--color-heading);
  font-size: 0.92rem;
  font-weight: 600;
  padding: 0.5rem 0.75rem 0.5rem 2.15rem;
  outline: none;
  box-shadow: none;
}

.hero-filter-field--destination :deep(.p-select-filter:focus) {
  border-color: var(--color-primary-400);
  box-shadow: 0 0 0 3px
    color-mix(in srgb, var(--color-primary-100) 60%, transparent 40%);
}

.hero-filter-field--destination :deep(.p-select-filter-icon) {
  top: 50%;
  transform: translateY(-50%);
  left: 0.7rem;
  color: var(--color-primary-600);
  font-size: 0.93rem;
}

.hero-filter-field--destination :deep(.p-select-list-container) {
  max-height: min(18rem, calc(100vh - 220px)) !important;
  padding: 0 !important;
  border-radius: 1rem;
}

.hero-filter-field--destination :deep(.p-select-list) {
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.2rem;
}

.hero-filter-field--destination :deep(.p-select-option) {
  padding: 0.85rem 0.95rem;
  border-radius: 0.8rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-heading);
  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.hero-filter-field--destination :deep(.p-select-option.p-focus) {
  background: color-mix(in srgb, var(--color-primary-50) 70%, white 30%);
  color: var(--color-primary-700);
}

.hero-filter-field--destination
  :deep(.p-select-option.p-select-option-selected) {
  background: color-mix(in srgb, var(--color-primary-100) 58%, white 42%);
  color: var(--color-primary-800);
}

.guest-counter-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.guest-counter-row + .guest-counter-row,
.guest-age-grid,
.guest-apply-button {
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
  font-size: 13px;
  font-weight: 500;
}

.guest-counter-btn {
  border: none;
  min-height: 2.4rem;
  color: var(--color-primary-600);
  font-size: 13px !important;
  font-weight: 500 !important;
}

.guest-counter-btn:disabled {
  opacity: 0.35;
}

.guest-age-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.85rem;
  padding-bottom: 8px;
}

.guest-age-item {
  display: grid;
  gap: 0.45rem;
}

.guest-age-select :deep(.p-select) {
  width: 100%;
  border-radius: 0.95rem;
}

.guest-age-select :deep(.p-select-label),
.guest-age-select :deep(.p-select-dropdown),
.guest-age-select :deep(.p-select-dropdown-icon) {
  font-size: 13px !important;
  font-weight: 500 !important;
}

.guest-age-select :deep(.p-select-label) {
  padding: 4px 8px !important;
}

.guest-age-select :deep(.p-select-dropdown) {
  padding: 4px !important;
}

.guest-age-select :deep(.guest-age-overlay) {
  width: 100% !important;
  min-width: 100% !important;
}

.guest-age-note {
  margin: 0;
  padding-bottom: 16px;
}

.guest-apply-button {
  width: 100% !important;
  display: flex !important;
  justify-content: center;
  border: 1px solid var(--color-primary-600) !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
  font-size: 14px;
  font-weight: 700 !important;
  color: #fff !important;
  background: var(--color-primary-600) !important;
  box-shadow: 0 10px 20px rgba(0, 80, 81, 0.28) !important;
}

.guest-apply-button :deep(.p-button-label),
.guest-apply-button :deep(.p-button-icon),
.guest-apply-button .material-symbols-outlined {
  color: #fff !important;
}

.guest-apply-button:hover {
  transform: translateY(-1px);
  background: var(--color-primary-700) !important;
  color: #fff !important;
  box-shadow: 0 14px 24px rgba(0, 80, 81, 0.34) !important;
}

.guest-apply-button:hover :deep(.p-button-label),
.guest-apply-button:hover :deep(.p-button-icon),
.guest-apply-button:hover .material-symbols-outlined {
  color: #fff !important;
}

.guest-apply-button:focus-visible :deep(.p-button-label),
.guest-apply-button:focus-visible :deep(.p-button-icon),
.guest-apply-button:focus-visible .material-symbols-outlined {
  color: #fff !important;
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

.hotels-grid,
.offers-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  align-items: stretch;
}

.section-action {
  text-align: center;
  margin-top: 16px;
}
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
.view-all-link:hover {
  gap: 12px;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.benefit-item {
  padding: 32px 24px;
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
.stat-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
}
.stat-number {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: white;
}
.stat-label {
  font-size: var(--font-size-sm);
  color: rgba(255, 255, 255, 0.75);
}

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
    gap: 0.5rem;
    border-radius: 1.4rem;
    padding: 0.6rem;
  }

  .hero-filter-field,
  .hero-filter-trigger {
    min-height: 3.92rem;
    border: 1px solid color-mix(in srgb, var(--color-border) 82%, white 18%);
    border-right: 1px solid
      color-mix(in srgb, var(--color-border) 82%, white 18%);
  }

  .hero-filter-search {
    min-height: 3.92rem;
    grid-column: 1 / -1;
    border-radius: 1rem;
    margin-left: 0;
  }

  .hero-filter-panel--dates {
    width: min(760px, calc(100vw - 48px));
  }

  .hero-filter-panel--guests {
    width: min(420px, calc(100vw - 48px));
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
    gap: 0.46rem;
    border-radius: 1.15rem;
    padding: 0.56rem;
  }

  .hero-filter-field,
  .hero-filter-trigger {
    min-height: 3.55rem;
    padding: 0 0.95rem;
    border: 1px solid color-mix(in srgb, var(--color-border) 80%, white 20%);
    border-right: 1px solid
      color-mix(in srgb, var(--color-border) 80%, white 20%);
    border-radius: 0.95rem;
  }

  .hero-filter-field__label,
  .hero-filter-trigger__label {
    font-size: 0.64rem;
  }

  .hero-filter-field :deep(.p-select-label),
  .hero-filter-trigger__value {
    font-size: 0.92rem;
  }

  .hero-filter-field__chevron {
    font-size: 1.05rem;
  }

  .hero-filter-trigger__chevron {
    font-size: 1.05rem;
  }

  .hero-filter-search {
    min-width: 0;
    min-height: 3.55rem;
    border-radius: 0.95rem;
    margin-left: 0;
  }

  .hero-filter-panel {
    width: calc(100vw - 32px);
    max-height: calc(100vh - 32px);
    border-radius: 1.15rem;
    padding: 1rem;
  }

  .hero-filter-panel--dates,
  .hero-filter-panel--guests {
    width: calc(100vw - 32px);
  }

  .hero-filter-field--destination :deep(.p-select-overlay) {
    width: calc(100vw - 32px) !important;
    min-width: calc(100vw - 32px) !important;
    max-width: calc(100vw - 32px) !important;
    max-height: calc(100vh - 32px) !important;
    border-radius: 1.15rem !important;
    padding: 1rem !important;
  }

  .hero-datepicker :deep(.p-datepicker) {
    display: block;
    padding: 0;
  }

  .hero-datepicker :deep(.p-datepicker-calendar-container) {
    width: 100%;
  }

  .hero-datepicker :deep(.p-datepicker-day-view) {
    min-width: 0;
  }

  .hero-datepicker :deep(.p-datepicker-day) {
    width: 1.96rem;
    height: 1.96rem;
    border-radius: 0.62rem;
  }

  .guest-counter-row{
    align-items: flex-start;
    flex-direction: column;
    padding-bottom: 16px;
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

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>

<!-- Global: PrimeVue Select overlay must be styled without scoping since it teleports to <body> -->
<style>
/* ── Hero city-select overlay ────────────────────────────── */
.p-select-overlay {
  margin-top: 4px !important;
  border-radius: 8px !important;
  border: 1px solid var(--color-border) !important;
  box-shadow: 0 16px 48px rgba(15, 23, 42, 0.14) !important;
  overflow: hidden;
  min-width: 280px !important;
  background: var(--color-surface-primary) !important;
  padding: 0.35rem 0 0.5rem !important;
}

.guest-age-overlay {
  width: var(--p-anchor-width) !important;
  min-width: 100px !important;
}

.guest-age-overlay .p-select-option {
  padding: 4px !important;
}

/* Search input inside the overlay header */
.p-select-overlay .p-select-header {
  padding: 0.9rem 1rem 0.75rem !important;
  background: var(--color-surface-primary) !important;
  border-bottom: 1px solid var(--color-divider) !important;
}

.p-select-overlay .p-select-filter {
  width: 100%;
  border: 1.5px solid var(--color-border) !important;
  border-radius: 0.85rem !important;
  padding: 0.55rem 2.4rem 0.55rem 0.9rem !important;
  font-size: 0.9rem !important;
  font-weight: 600 !important;
  color: var(--color-heading) !important;
  background: var(--color-surface-secondary) !important;
  outline: none;
  transition: border-color 0.2s;
}

.p-select-overlay .p-select-filter:focus {
  border-color: var(--color-primary-400) !important;
}

/* List items */
.p-select-overlay .p-select-list-container {
  max-height: 280px !important;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--color-border) transparent;
}

.p-select-overlay .p-select-option {
  padding: 0.68rem 1.1rem !important;
  font-size: 0.93rem !important;
  font-weight: 600 !important;
  color: var(--color-heading) !important;
  border-radius: 0 !important;
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s;
}

.p-select-overlay .p-select-option:hover,
.p-select-overlay .p-select-option.p-focus {
  background: var(--color-primary-50, #e6f4f4) !important;
  color: var(--color-primary-700) !important;
}

.p-select-overlay .p-select-option.p-selected {
  background: var(--color-primary-100) !important;
  color: var(--color-primary-700) !important;
  font-weight: 700 !important;
}
</style>
