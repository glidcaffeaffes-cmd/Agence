<template>
  <div class="profile-page">
    <Head>
      <title>Reservation History — VoyageHub</title>
      <meta name="description" content="View your complete reservation history and past stays with VoyageHub." />
    </Head>

    <div class="profile-container">
      <header class="page-header">
        <div>
          <p class="page-header__label">Account</p>
          <h1 class="page-header__title">Reservation History</h1>
          <p class="page-header__sub">A complete log of all your past bookings and stays.</p>
        </div>
        <NuxtLink to="/hotels" class="btn-book">
          <span class="material-symbols-outlined">calendar_month</span>
          Make a Booking
        </NuxtLink>
      </header>

      <div class="profile-body">
        <!-- Sidebar -->
        <ProfileSidebar />


        <!-- Main -->
        <main class="profile-main">

          <!-- Filters -->
          <div class="filters-card">
            <div class="filter-search">
              <span class="material-symbols-outlined filter-search__icon">search</span>
              <input v-model="search" type="text" placeholder="Search by hotel or code…" class="filter-search__input" />
            </div>
            <div class="filter-pills">
              <button
                v-for="s in statuses" :key="s.value"
                @click="statusFilter = s.value"
                class="pill"
                :class="statusFilter === s.value ? 'pill--active' : ''"
              >{{ s.label }}</button>
            </div>
            <div class="filter-year">
              <select v-model="yearFilter" class="year-select">
                <option value="">All years</option>
                <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
              </select>
              <span class="material-symbols-outlined year-select__icon">expand_more</span>
            </div>
          </div>

          <!-- Loading -->
          <div v-if="loading" class="state-card">
            <span class="material-symbols-outlined state-card__icon spin">progress_activity</span>
            <p class="state-card__text">Loading your history…</p>
          </div>

          <!-- Empty -->
          <div v-else-if="filtered.length === 0" class="state-card">
            <span class="material-symbols-outlined state-card__icon">receipt_long</span>
            <h3 class="state-card__title">No reservations found</h3>
            <p class="state-card__sub">Try adjusting your filters or explore our hotels.</p>
            <NuxtLink to="/hotels" class="btn-primary">Explore Hotels</NuxtLink>
          </div>

          <!-- Timeline -->
          <div v-else class="timeline">
            <template v-for="(group, year) in grouped" :key="year">
              <div class="year-divider">
                <div class="year-divider__line"></div>
                <span class="year-divider__label">{{ year }}</span>
                <div class="year-divider__line"></div>
              </div>

              <div class="reservations-list">
                <div v-for="r in group" :key="r.id" class="res-card">
                  <div class="res-card__accent" :class="accentClass(r.status)"></div>
                  <div class="res-card__body">
                    <div class="res-card__left">
                      <div v-if="getHotel(r.hotelId)" class="res-card__thumb">
                        <img :src="getHotel(r.hotelId)?.images[0]" :alt="getHotel(r.hotelId)?.name" />
                      </div>
                      <div class="res-card__info">
                        <div class="res-card__top">
                          <div>
                            <p class="res-card__code">{{ r.confirmationCode }}</p>
                            <h3 class="res-card__hotel">{{ getHotel(r.hotelId)?.name || 'Hotel #' + r.hotelId }}</h3>
                            <p class="res-card__location">
                              <span class="material-symbols-outlined">location_on</span>
                              {{ getHotel(r.hotelId)?.city }}, {{ getHotel(r.hotelId)?.country }}
                            </p>
                          </div>
                          <span class="status-badge status-badge--mobile" :class="badgeClass(r.status)">
                            <span class="material-symbols-outlined">{{ statusIcon(r.status) }}</span>
                            {{ r.status }}
                          </span>
                        </div>
                        <div class="res-card__meta">
                          <span class="meta-item">
                            <span class="material-symbols-outlined">login</span>
                            Check-in: <strong>{{ formatDate(r.checkInDate) }}</strong>
                          </span>
                          <span class="meta-item">
                            <span class="material-symbols-outlined">logout</span>
                            Check-out: <strong>{{ formatDate(r.checkOutDate) }}</strong>
                          </span>
                          <span class="meta-item">
                            <span class="material-symbols-outlined">dark_mode</span>
                            {{ r.numberOfNights }} night{{ r.numberOfNights > 1 ? 's' : '' }}
                          </span>
                          <span class="meta-item meta-item--price">
                            <span class="material-symbols-outlined">payments</span>
                            {{ formatCurrency(r.totalAmount) }}
                          </span>
                        </div>
                        <div v-if="r.blockReason" class="res-card__reason">
                          <span class="material-symbols-outlined">info</span>
                          {{ r.blockReason }}
                        </div>
                      </div>
                    </div>
                    <div class="res-card__right">
                      <span class="status-badge status-badge--desktop" :class="badgeClass(r.status)">
                        <span class="material-symbols-outlined">{{ statusIcon(r.status) }}</span>
                        {{ r.status }}
                      </span>
                      <NuxtLink :to="`/hotels/${r.hotelId}`" class="btn-view-hotel">
                        <span class="material-symbols-outlined">hotel</span>
                        View Hotel
                      </NuxtLink>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>

        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useReservations } from '~/composables/useReservations'
import { useHotels } from '~/composables/useHotels'

const { accountId, currentProfile } = useAuth()
const { reservations, loading: rLoading, fetchByAccount } = useReservations()
const { hotels, fetchAll: fetchHotels, loading: hLoading } = useHotels()

const search = ref('')

const statuses = [
  { value: '', label: 'All' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'PENDING', label: 'Pending' },
]

const years = computed(() => {
  const ys = new Set(reservations.value.map(r => r.checkInDate.substring(0, 4)))
  return [...ys].sort((a, b) => b.localeCompare(a))
})

function getHotel(id: number) { return hotels.value.find(h => h.id === id) }

const filtered = computed(() =>
  reservations.value.filter(r => {
    const hotel = getHotel(r.hotelId)
    const matchSearch = !search.value ||
      r.confirmationCode.toLowerCase().includes(search.value.toLowerCase()) ||
      (hotel && hotel.name.toLowerCase().includes(search.value.toLowerCase())) ||
      String(r.hotelId).includes(search.value)
    const matchStatus = !statusFilter.value || r.status === statusFilter.value
    const matchYear = !yearFilter.value || r.checkInDate.startsWith(yearFilter.value)
    return matchSearch && matchStatus && matchYear
  })
)

const grouped = computed<Record<string, typeof filtered.value>>(() => {
  const result: Record<string, typeof filtered.value> = {}
  for (const r of [...filtered.value].sort((a, b) => b.checkInDate.localeCompare(a.checkInDate))) {
    const year = r.checkInDate.substring(0, 4)
    if (!result[year]) result[year] = []
    result[year].push(r)
  }
  return result
})

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
function formatCurrency(n: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n)
}
function statusIcon(s: string) {
  const map: Record<string, string> = { CONFIRMED: 'check_circle', CANCELLED: 'cancel', COMPLETED: 'task_alt', PENDING: 'schedule', BLOCKED: 'block' }
  return map[s] ?? 'help'
}
function accentClass(s: string) {
  const map: Record<string, string> = { CONFIRMED: 'accent--confirmed', COMPLETED: 'accent--completed', CANCELLED: 'accent--cancelled', PENDING: 'accent--pending', BLOCKED: 'accent--blocked' }
  return map[s] ?? ''
}
function badgeClass(s: string) {
  const map: Record<string, string> = { CONFIRMED: 'badge--confirmed', COMPLETED: 'badge--completed', CANCELLED: 'badge--cancelled', PENDING: 'badge--pending', BLOCKED: 'badge--blocked' }
  return map[s] ?? ''
}

onMounted(async () => {
  await Promise.all([
    accountId.value ? fetchByAccount(accountId.value) : Promise.resolve(),
    fetchHotels()
  ])
})
</script>

<style scoped>
.material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }

/* Page shell */
.profile-page { min-height: 100vh; background: var(--color-bg-soft); font-family: var(--font-family-base); }
.profile-container { max-width: 1200px; margin: 0 auto; padding: 48px 32px 80px; }

/* Header */
.page-header { margin-bottom: 40px; display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.page-header__label { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.18em; color: var(--color-primary-600); margin-bottom: 8px; }
.page-header__title { font-family: var(--font-family-heading); font-size: clamp(32px, 4vw, 44px); font-weight: 700; color: var(--color-heading); letter-spacing: -0.02em; line-height: 1.1; margin-bottom: 8px; }
.page-header__sub { font-size: var(--font-size-body-md); color: var(--color-text-muted); }

.btn-book {
  display: inline-flex; align-items: center; gap: 8px; padding: 12px 22px;
  background: var(--color-primary-600); color: #fff; border-radius: var(--radius-xl);
  text-decoration: none; font-size: 13px; font-weight: 700; white-space: nowrap;
  box-shadow: 0 6px 20px rgba(0,103,104,0.22); transition: background 0.2s, transform 0.15s;
}
.btn-book:hover { background: var(--color-primary-700); transform: translateY(-1px); }
.btn-book .material-symbols-outlined { font-size: 20px; }

/* Layout */
.profile-body { display: flex; gap: 28px; align-items: flex-start; }
.profile-main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 20px; }

/* ProfileSidebar.vue handles sidebar styles */

/* Filters */
.filters-card { background: var(--color-card); border: 1px solid var(--color-border-soft); border-radius: var(--radius-2xl); box-shadow: var(--shadow-card); padding: 20px 24px; display: flex; flex-wrap: wrap; gap: 16px; align-items: center; }
.filter-search { position: relative; width: 240px; flex-shrink: 0; }
.filter-search__icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--color-text-muted); font-size: 20px; pointer-events: none; }
.filter-search__input { width: 100%; padding: 10px 14px 10px 42px; background: var(--color-bg-soft); border: 1.5px solid var(--color-border); border-radius: var(--radius-xl); font-family: var(--font-family-base); font-size: var(--font-size-body-sm); color: var(--color-text); outline: none; box-sizing: border-box; transition: border-color 0.2s, box-shadow 0.2s; }
.filter-search__input:focus { border-color: var(--color-primary-500); box-shadow: 0 0 0 3px rgba(0,103,104,0.1); }
.filter-pills { display: flex; flex-wrap: wrap; gap: 8px; flex: 1; }
.pill { padding: 7px 16px; border-radius: 999px; border: 1.5px solid var(--color-border); background: transparent; font-family: var(--font-family-base); font-size: 13px; font-weight: 600; color: var(--color-text-muted); cursor: pointer; transition: all 0.2s; }
.pill:hover { border-color: var(--color-primary-400); color: var(--color-primary-600); }
.pill--active { background: var(--color-primary-600); border-color: var(--color-primary-600); color: #fff; }
.filter-year { position: relative; }
.year-select { appearance: none; padding: 10px 36px 10px 14px; background: var(--color-bg-soft); border: 1.5px solid var(--color-border); border-radius: var(--radius-xl); font-family: var(--font-family-base); font-size: var(--font-size-body-sm); color: var(--color-text); cursor: pointer; outline: none; }
.year-select__icon { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); color: var(--color-text-muted); pointer-events: none; font-size: 20px; }

/* State cards */
.state-card { background: var(--color-card); border: 1px solid var(--color-border-soft); border-radius: var(--radius-2xl); box-shadow: var(--shadow-card); padding: 64px 24px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 12px; }
.state-card__icon { font-size: 48px; color: var(--color-text-muted); }
.state-card__title { font-family: var(--font-family-heading); font-size: var(--font-size-title-lg); font-weight: 700; color: var(--color-heading); }
.state-card__text { font-size: var(--font-size-body-md); color: var(--color-text-muted); }
.state-card__sub { font-size: var(--font-size-body-sm); color: var(--color-text-muted); max-width: 340px; }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.btn-primary { display: inline-block; padding: 11px 24px; background: var(--color-primary-600); color: #fff; border-radius: var(--radius-xl); text-decoration: none; font-size: 13px; font-weight: 700; transition: background 0.2s; }
.btn-primary:hover { background: var(--color-primary-700); }

/* Timeline */
.timeline { display: flex; flex-direction: column; gap: 20px; }
.year-divider { display: flex; align-items: center; gap: 12px; }
.year-divider__line { flex: 1; height: 1px; background: var(--color-border); }
.year-divider__label { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.14em; color: var(--color-text-muted); white-space: nowrap; }
.reservations-list { display: flex; flex-direction: column; gap: 12px; }

/* Reservation card */
.res-card { background: var(--color-card); border: 1px solid var(--color-border-soft); border-radius: var(--radius-2xl); box-shadow: var(--shadow-card); overflow: hidden; display: flex; flex-direction: row; transition: box-shadow 0.2s, transform 0.2s; }
.res-card:hover { box-shadow: var(--shadow-card-hover); transform: translateY(-1px); }
.res-card__accent { width: 5px; flex-shrink: 0; }
.accent--confirmed { background: var(--color-primary-500); }
.accent--completed { background: var(--color-success-500); }
.accent--cancelled { background: var(--color-danger-500); }
.accent--pending   { background: var(--color-warning-500); }
.accent--blocked   { background: var(--color-gray-400); }

.res-card__body { flex: 1; padding: 20px 24px; display: flex; flex-direction: row; align-items: center; justify-content: space-between; gap: 20px; }
.res-card__left { display: flex; gap: 16px; align-items: flex-start; flex: 1; }
.res-card__thumb { width: 100px; height: 100px; border-radius: var(--radius-xl); overflow: hidden; flex-shrink: 0; border: 1px solid var(--color-border-soft); }
.res-card__thumb img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
.res-card:hover .res-card__thumb img { transform: scale(1.08); }
.res-card__info { flex: 1; display: flex; flex-direction: column; gap: 10px; }
.res-card__top { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
.res-card__code { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.14em; color: var(--color-text-muted); margin-bottom: 3px; }
.res-card__hotel { font-family: var(--font-family-heading); font-size: var(--font-size-title-md); font-weight: 700; color: var(--color-heading); line-height: 1.2; }
.res-card__location { display: flex; align-items: center; gap: 4px; font-size: var(--font-size-body-sm); color: var(--color-text-muted); margin-top: 2px; }
.res-card__location .material-symbols-outlined { font-size: 14px; }
.res-card__meta { display: flex; flex-wrap: wrap; gap: 12px 20px; }
.meta-item { display: flex; align-items: center; gap: 6px; font-size: var(--font-size-body-sm); color: var(--color-text-soft); }
.meta-item .material-symbols-outlined { font-size: 16px; color: var(--color-text-muted); }
.meta-item strong { color: var(--color-text); font-weight: 600; }
.meta-item--price { color: var(--color-primary-600); font-weight: 700; }
.meta-item--price .material-symbols-outlined { color: var(--color-primary-500); }
.res-card__reason { display: flex; align-items: center; gap: 8px; padding: 8px 12px; background: var(--color-danger-50); border: 1px solid var(--color-danger-200); color: var(--color-danger-700); border-radius: var(--radius-lg); font-size: var(--font-size-body-sm); }
.res-card__reason .material-symbols-outlined { font-size: 16px; }

.res-card__right { display: flex; flex-direction: column; align-items: flex-end; gap: 12px; padding-left: 20px; border-left: 1px solid var(--color-border-soft); flex-shrink: 0; }

/* Status badges */
.status-badge { display: inline-flex; align-items: center; gap: 5px; padding: 4px 12px; border-radius: 999px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; white-space: nowrap; }
.status-badge .material-symbols-outlined { font-size: 13px; }
.status-badge--mobile { display: none; }
.badge--confirmed { background: var(--color-primary-25); color: var(--color-primary-700); border: 1px solid var(--color-primary-200); }
.badge--completed { background: var(--color-success-25); color: var(--color-success-700); border: 1px solid var(--color-success-200); }
.badge--cancelled { background: var(--color-danger-25); color: var(--color-danger-700); border: 1px solid var(--color-danger-200); }
.badge--pending   { background: var(--color-warning-25); color: var(--color-warning-700); border: 1px solid var(--color-warning-200); }
.badge--blocked   { background: var(--color-gray-100); color: var(--color-gray-600); border: 1px solid var(--color-gray-300); }

.btn-view-hotel { display: inline-flex; align-items: center; gap: 6px; padding: 9px 16px; border: 1.5px solid var(--color-border); border-radius: var(--radius-xl); text-decoration: none; font-size: 12px; font-weight: 700; color: var(--color-primary-600); transition: all 0.2s; white-space: nowrap; }
.btn-view-hotel:hover { background: var(--color-primary-600); border-color: var(--color-primary-600); color: #fff; }
.btn-view-hotel .material-symbols-outlined { font-size: 18px; }

/* Responsive */
@media (max-width: 900px) {
  .profile-body { flex-direction: column; }
  .status-badge--desktop { display: none; }
  .status-badge--mobile { display: inline-flex; }
}
@media (max-width: 640px) {
  .history-container { padding: 28px 16px 60px; }
  .res-card__body { flex-direction: column; }
  .res-card__right { padding-left: 0; border-left: none; border-top: 1px solid var(--color-border-soft); padding-top: 12px; flex-direction: row; width: 100%; justify-content: space-between; align-items: center; }
  .res-card__thumb { display: none; }
  .filter-search { width: 100%; }
  .page-header { flex-direction: column; align-items: flex-start; }
}
</style>
