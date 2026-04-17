<template>
  <div>
    <Head>
      <title>Offers & Promotions — VoyageHub Admin</title>
      <meta name="description" content="Manage seasonal offers and promotional discounts for VoyageHub." />
    </Head>

    <div class="admin-page">
      <div class="page-header">
        <div>
          <p class="page-eyebrow">Marketing</p>
          <h1 class="page-title">Offers & Promotions</h1>
          <p class="page-desc">Manage seasonal discounts, spotlighted hotels and packages</p>
        </div>
        <button id="add-offer-btn" class="btn-primary" @click="showNewModal = true">
          <span class="material-symbols-outlined">add</span> Create Offer
        </button>
      </div>

      <!-- Filters & KPI -->
      <div class="header-tools">
        <div class="search-box">
          <span class="material-symbols-outlined">search</span>
          <input v-model="search" type="text" placeholder="Search offers..." />
        </div>
        <select v-model="statusFilter" class="filter-select">
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="scheduled">Scheduled</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      <div class="offers-grid">
        <div v-if="loading" class="loading-state">
          <span class="material-symbols-outlined spin">progress_activity</span>
        </div>
        <div v-else-if="filtered.length === 0" class="empty-state">
          No offers found matching your criteria.
        </div>
        <div v-for="offer in filtered" :key="offer.id" class="offer-card" :id="`offer-${offer.id}`">
          <div class="offer-img-box">
            <!-- Simulated image using gradients for offers without real assets yet -->
            <div class="offer-img-placeholder">
              <span class="material-symbols-outlined">{{ offer.type === 'PERCENTAGE' ? 'percent' : 'sell' }}</span>
            </div>
            <div class="offer-status" :class="getStatusClass(offer)">
              {{ getStatusLabel(offer) }}
            </div>
          </div>
          <div class="offer-content">
            <h3 class="offer-title">{{ offer.title }}</h3>
            <p class="offer-desc">{{ offer.description }}</p>
            <div class="offer-meta">
              <span class="meta-badge meta-badge--brand">
                <span class="material-symbols-outlined">loyalty</span>
                {{ offer.discountValue }}{{ offer.type === 'PERCENTAGE' ? '%' : '€' }} OFF
              </span>
              <span class="meta-date">Until {{ formatDate(offer.endDate) }}</span>
            </div>
            <div class="offer-actions">
              <button class="btn-ghost-sm"><span class="material-symbols-outlined">edit</span> Edit</button>
              <button class="btn-ghost-sm text-danger"><span class="material-symbols-outlined">delete</span> Drop</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useOffers } from '~/composables/useOffers'

definePageMeta({ layout: 'admin' })

const { offers, fetchOffers, loading } = useOffers()

const search = ref('')
const statusFilter = ref('')
const showNewModal = ref(false)

onMounted(fetchOffers)

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

function getStatus(offer: any) {
  const now = new Date()
  const start = new Date(offer.startDate)
  const end = new Date(offer.endDate)
  if (now < start) return 'scheduled'
  if (now > end) return 'expired'
  return 'active'
}

function getStatusLabel(offer: any) {
  const s = getStatus(offer)
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function getStatusClass(offer: any) {
  const s = getStatus(offer)
  if (s === 'active') return 'status--active'
  if (s === 'scheduled') return 'status--scheduled'
  return 'status--expired'
}

const filtered = computed(() => {
  return offers.value.filter(o => {
    const q = search.value.toLowerCase()
    const matchSearch = !q || o.title.toLowerCase().includes(q) || o.description.toLowerCase().includes(q)
    const matchStatus = !statusFilter.value || getStatus(o) === statusFilter.value
    return matchSearch && matchStatus
  })
})
</script>

<style scoped>
.admin-page { padding: 2.5rem; font-family: 'Inter', sans-serif; }
.page-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 1.5rem; margin-bottom: 2rem; flex-wrap: wrap; }
.page-eyebrow { font-size: 0.6875rem; text-transform: uppercase; letter-spacing: 0.08em; color: #6d7979; font-weight: 600; margin: 0; }
.page-title { font-size: 1.625rem; font-weight: 700; color: #015081; margin: 0.25rem 0; letter-spacing: -0.02em; }
.page-desc { font-size: 0.875rem; color: #3d4949; margin: 0; }
.btn-primary { display: flex; align-items: center; gap: 0.375rem; padding: 0.625rem 1.25rem; background: linear-gradient(135deg,#006768,#008283); color: #fff; border: none; border-radius: 0.5rem; font-weight: 700; font-size: 0.875rem; cursor: pointer; }

.header-tools { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
.search-box { display: flex; align-items: center; gap: 0.5rem; background: #fff; border: 1px solid #bcc9c8; border-radius: 0.5rem; padding: 0.5rem 0.875rem; min-width: 250px; }
.search-box input { border: none; outline: none; font-size: 0.875rem; width: 100%; }
.filter-select { padding: 0.5rem 0.875rem; border: 1px solid #bcc9c8; border-radius: 0.5rem; font-size: 0.875rem; background: #fff; outline: none; cursor: pointer; }

.loading-state, .empty-state { text-align: center; padding: 3rem; color: #6d7979; grid-column: 1 / -1; }
@keyframes spin { to { transform: rotate(360deg); } }
.spin { animation: spin 0.8s linear infinite; font-size: 2rem; }

.offers-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; }
.offer-card { background: #fff; border-radius: 0.875rem; overflow: hidden; box-shadow: 0 1px 4px rgba(1,80,129,0.06); display: flex; flex-direction: column; transition: transform 0.15s; }
.offer-card:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(1,80,129,0.1); }

.offer-img-box { height: 160px; position: relative; }
.offer-img-placeholder { width: 100%; height: 100%; background: linear-gradient(135deg, #015081, #236294); display: flex; align-items: center; justify-content: center; }
.offer-img-placeholder .material-symbols-outlined { font-size: 3rem; color: rgba(255,255,255,0.2); }
.offer-status { position: absolute; top: 1rem; right: 1rem; padding: 0.25rem 0.75rem; border-radius: 999px; font-size: 0.6875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; backdrop-filter: blur(4px); }
.status--active { background: rgba(0,103,104,0.9); color: #fff; }
.status--scheduled { background: rgba(205,175,93,0.9); color: #015081; }
.status--expired { background: rgba(21,29,34,0.8); color: #fff; }

.offer-content { padding: 1.25rem; flex: 1; display: flex; flex-direction: column; }
.offer-title { font-size: 1.0625rem; font-weight: 700; color: #015081; margin: 0 0 0.5rem; }
.offer-desc { font-size: 0.8125rem; color: #3d4949; margin: 0 0 1.25rem; line-height: 1.5; flex: 1; }

.offer-meta { display: flex; justify-content: space-between; align-items: center; padding-bottom: 1.25rem; border-bottom: 1px solid #e1e9f0; margin-bottom: 1.25rem; }
.meta-badge { display: flex; align-items: center; gap: 0.375rem; padding: 0.375rem 0.75rem; border-radius: 0.375rem; font-size: 0.8125rem; font-weight: 700; }
.meta-badge--brand { background: #e0f2f1; color: #006768; }
.meta-badge .material-symbols-outlined { font-size: 1.125rem; }
.meta-date { font-size: 0.75rem; font-weight: 600; color: #6d7979; }

.offer-actions { display: flex; justify-content: flex-end; gap: 0.5rem; }
.btn-ghost-sm { display: flex; align-items: center; gap: 0.25rem; padding: 0.375rem 0.75rem; border: 1px solid #bcc9c8; border-radius: 0.375rem; background: transparent; color: #3d4949; font-size: 0.8125rem; font-weight: 600; cursor: pointer; transition: background 0.15s; }
.btn-ghost-sm:hover { background: #f5faff; }
.text-danger { color: #ba1a1a; border-color: #fca5a5; }
.text-danger:hover { background: #ffdad6; }
</style>
