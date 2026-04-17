<template>
  <div>
    <Head>
      <title>Reservation History — VoyageHub</title>
      <meta name="description" content="View your complete reservation history and past stays with VoyageHub." />
    </Head>

    <!-- Page Header -->
    <section class="page-hero">
      <div class="hero-inner">
        <div class="hero-text">
          <span class="hero-eyebrow">
            <span class="material-symbols-outlined">history</span> My Account
          </span>
          <h1 class="hero-title">Reservation History</h1>
          <p class="hero-subtitle">A complete log of all your past bookings and stays</p>
        </div>
        <NuxtLink to="/reservations" class="cta-btn">
          <span class="material-symbols-outlined">calendar_month</span> Active Bookings
        </NuxtLink>
      </div>
    </section>

    <div class="page-body">
      <!-- Filters bar -->
      <div class="filter-bar">
        <div class="filter-search">
          <span class="material-symbols-outlined">search</span>
          <input v-model="search" type="text" placeholder="Search by hotel, code…" id="history-search" />
        </div>
        <div class="filter-pills">
          <button
            v-for="s in statuses"
            :key="s.value"
            :class="['pill', { 'pill--active': statusFilter === s.value }]"
            @click="statusFilter = s.value"
          >{{ s.label }}</button>
        </div>
        <select v-model="yearFilter" class="year-select" id="history-year-filter">
          <option value="">All years</option>
          <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
        </select>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="loading-state">
        <span class="material-symbols-outlined spin">progress_activity</span>
        <p>Loading history…</p>
      </div>

      <!-- Empty -->
      <div v-else-if="filtered.length === 0" class="empty-state">
        <span class="material-symbols-outlined empty-icon">receipt_long</span>
        <h3>No reservations found</h3>
        <p>Try adjusting your filters or explore our hotels to make a booking.</p>
        <NuxtLink to="/hotels" class="cta-btn">Explore Hotels</NuxtLink>
      </div>

      <!-- Timeline -->
      <div v-else class="timeline">
        <template v-for="(group, year) in grouped" :key="year">
          <div class="year-divider">
            <span class="year-label">{{ year }}</span>
          </div>
          <div class="timeline-card" v-for="r in group" :key="r.id" :id="`reservation-${r.id}`">
            <div class="card-accent" :class="`accent--${r.status.toLowerCase()}`"></div>
            <div class="card-body">
              <div class="card-top">
                <div>
                  <p class="card-code">{{ r.confirmationCode }}</p>
                  <h3 class="card-hotel">Hotel #{{ r.hotelId }}</h3>
                </div>
                <span class="status-badge" :class="`badge--${r.status.toLowerCase()}`">
                  <span class="material-symbols-outlined">{{ statusIcon(r.status) }}</span>
                  {{ r.status }}
                </span>
              </div>
              <div class="card-meta">
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
                <span class="meta-item meta-amount">
                  <span class="material-symbols-outlined">payments</span>
                  {{ formatCurrency(r.totalAmount) }}
                </span>
              </div>
              <div v-if="r.blockReason" class="block-reason">
                <span class="material-symbols-outlined">info</span>
                {{ r.blockReason }}
              </div>
            </div>
            <div class="card-actions">
              <NuxtLink :to="`/hotels/${r.hotelId}`" class="action-btn action-btn--ghost">
                <span class="material-symbols-outlined">hotel</span> View Hotel
              </NuxtLink>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useReservations } from '~/composables/useReservations'

const { accountId } = useAuth()
const { reservations, loading, fetchByAccount } = useReservations()

const search = ref('')
const statusFilter = ref('')
const yearFilter = ref('')

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

const filtered = computed(() =>
  reservations.value.filter(r => {
    const matchSearch = !search.value ||
      r.confirmationCode.toLowerCase().includes(search.value.toLowerCase()) ||
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
  const map: Record<string, string> = {
    CONFIRMED: 'check_circle', CANCELLED: 'cancel',
    COMPLETED: 'task_alt', PENDING: 'schedule', BLOCKED: 'block',
  }
  return map[s] ?? 'help'
}

onMounted(() => fetchByAccount(accountId.value || 1))
</script>

<style scoped>
.page-hero {
  background: linear-gradient(135deg, #015081 0%, #006768 100%);
  padding: 3rem 2rem 2.5rem;
}
.hero-inner {
  max-width: 1200px; margin: 0 auto;
  display: flex; align-items: center; justify-content: space-between; gap: 1rem;
  flex-wrap: wrap;
}
.hero-eyebrow {
  display: inline-flex; align-items: center; gap: 0.375rem;
  font-size: 0.75rem; font-weight: 600; color: rgba(255,255,255,0.6);
  text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.5rem;
}
.hero-eyebrow .material-symbols-outlined { font-size: 0.875rem; }
.hero-title { font-size: 2rem; font-weight: 700; color: #fff; margin: 0 0 0.25rem; letter-spacing: -0.02em; }
.hero-subtitle { font-size: 0.9375rem; color: rgba(255,255,255,0.7); margin: 0; }
.cta-btn {
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.65rem 1.25rem; background: #CDAF5D; color: #015081;
  font-weight: 700; font-size: 0.875rem; border-radius: 0.5rem;
  text-decoration: none; transition: opacity 0.15s;
}
.cta-btn:hover { opacity: 0.9; }

.page-body { max-width: 1200px; margin: 0 auto; padding: 2rem; }

.filter-bar {
  display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem;
  flex-wrap: wrap;
}
.filter-search {
  display: flex; align-items: center; gap: 0.5rem;
  background: #fff; border: 1px solid #bcc9c8; border-radius: 0.5rem;
  padding: 0.5rem 0.75rem; flex: 1; min-width: 180px;
}
.filter-search .material-symbols-outlined { color: #6d7979; font-size: 1.125rem; }
.filter-search input {
  border: none; outline: none; background: transparent;
  font-size: 0.875rem; color: #151d22; width: 100%;
  font-family: 'Inter', sans-serif;
}
.filter-pills { display: flex; gap: 0.375rem; flex-wrap: wrap; }
.pill {
  padding: 0.375rem 0.75rem; border-radius: 999px;
  border: 1px solid #bcc9c8; background: #fff; color: #3d4949;
  font-size: 0.75rem; font-weight: 600; cursor: pointer;
  transition: all 0.15s; font-family: 'Inter', sans-serif;
}
.pill:hover { border-color: #006768; color: #006768; }
.pill--active { background: #006768; border-color: #006768; color: #fff; }
.year-select {
  padding: 0.5rem 0.75rem; border: 1px solid #bcc9c8; border-radius: 0.5rem;
  background: #fff; font-size: 0.875rem; color: #151d22; outline: none;
  cursor: pointer; font-family: 'Inter', sans-serif;
}

.loading-state, .empty-state {
  text-align: center; padding: 4rem 2rem; color: #6d7979;
}
.loading-state .material-symbols-outlined, .empty-state .empty-icon {
  font-size: 3rem; margin-bottom: 1rem; display: block;
}
.empty-state h3 { font-size: 1.125rem; font-weight: 700; color: #151d22; margin: 0 0 0.5rem; }
.empty-state p { font-size: 0.875rem; margin: 0 0 1.5rem; }
@keyframes spin { to { transform: rotate(360deg); } }
.spin { animation: spin 0.8s linear infinite; }

.year-divider {
  display: flex; align-items: center; gap: 0.75rem; margin: 1.5rem 0 1rem;
}
.year-divider::before, .year-divider::after {
  content: ''; flex: 1; height: 1px; background: #bcc9c8;
}
.year-label { font-size: 0.8125rem; font-weight: 700; color: #6d7979; text-transform: uppercase; letter-spacing: 0.06em; }

.timeline { display: flex; flex-direction: column; gap: 0.875rem; }
.timeline-card {
  background: #fff; border-radius: 0.75rem;
  box-shadow: 0 1px 4px rgba(1,80,129,0.06);
  display: flex; overflow: hidden;
  transition: transform 0.15s, box-shadow 0.15s;
}
.timeline-card:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(1,80,129,0.10); }

.card-accent { width: 4px; flex-shrink: 0; }
.accent--confirmed { background: #006768; }
.accent--completed { background: #236294; }
.accent--cancelled { background: #ba1a1a; }
.accent--pending { background: #CDAF5D; }
.accent--blocked { background: #6d7979; }

.card-body { flex: 1; padding: 1.25rem 1.5rem; }
.card-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; margin-bottom: 0.875rem; }
.card-code { font-size: 0.6875rem; color: #6d7979; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; margin: 0; }
.card-hotel { font-size: 1.0625rem; font-weight: 700; color: #151d22; margin: 0.125rem 0 0; }

.status-badge {
  display: inline-flex; align-items: center; gap: 0.25rem;
  padding: 0.25rem 0.625rem; border-radius: 999px;
  font-size: 0.6875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em;
  white-space: nowrap;
}
.status-badge .material-symbols-outlined { font-size: 0.875rem; }
.badge--confirmed { background: #e0f2f1; color: #006768; }
.badge--completed { background: #e3f2fd; color: #236294; }
.badge--cancelled { background: #ffdad6; color: #ba1a1a; }
.badge--pending { background: #fff8e1; color: #735c10; }
.badge--blocked { background: #e7eff6; color: #6d7979; }

.card-meta { display: flex; flex-wrap: wrap; gap: 0.75rem 1.5rem; }
.meta-item {
  display: flex; align-items: center; gap: 0.375rem;
  font-size: 0.8125rem; color: #3d4949;
}
.meta-item .material-symbols-outlined { font-size: 1rem; color: #6d7979; }
.meta-item strong { color: #151d22; }
.meta-amount { color: #015081; font-weight: 700; }

.block-reason {
  display: flex; align-items: center; gap: 0.375rem;
  margin-top: 0.75rem; padding: 0.5rem 0.75rem;
  background: #ffdad6; border-radius: 0.375rem;
  font-size: 0.8125rem; color: #93000a;
}
.block-reason .material-symbols-outlined { font-size: 1rem; }

.card-actions {
  display: flex; flex-direction: column; justify-content: center;
  padding: 1rem; border-left: 1px solid #e1e9f0; gap: 0.5rem;
}
.action-btn {
  display: inline-flex; align-items: center; gap: 0.375rem;
  padding: 0.5rem 0.875rem; border-radius: 0.5rem;
  font-size: 0.8125rem; font-weight: 600; text-decoration: none;
  transition: all 0.15s; white-space: nowrap;
}
.action-btn--ghost { border: 1px solid #bcc9c8; color: #006768; background: transparent; }
.action-btn--ghost:hover { background: #006768; color: #fff; border-color: #006768; }
</style>
