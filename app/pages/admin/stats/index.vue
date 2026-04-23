<template>
  <div>
    <Head>
      <title>Statistics — VoyageHub Admin</title>
      <meta name="description" content="Analytics and statistics dashboard for VoyageHub administrators." />
    </Head>

    <div class="admin-page">
      <div class="page-header">
        <div>
          <p class="page-eyebrow">Analytics</p>
          <h1 class="page-title">Statistics Dashboard</h1>
          <p class="page-desc">Key performance indicators and trends</p>
        </div>
        <div class="header-actions">
          <select v-model="period" id="stats-period" class="filter-select">
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 3 months</option>
            <option value="365">Last year</option>
          </select>
          <button class="btn-export" id="stats-export-btn">
            <span class="material-symbols-outlined">download</span> Export
          </button>
        </div>
      </div>

      <div v-if="loading" class="loading-state">
        <span class="material-symbols-outlined spin">progress_activity</span>
        <p>Loading statistics…</p>
      </div>

      <template v-else-if="stats">
        <!-- KPI Grid -->
        <div class="kpi-grid">
          <div class="kpi-card kpi-card--primary">
            <div class="kpi-top">
              <span class="kpi-label">Total Revenue</span>
              <span class="material-symbols-outlined kpi-icon">payments</span>
            </div>
            <p class="kpi-value">{{ formatCurrency(stats.totalRevenue) }}</p>
            <p class="kpi-trend trend--up">
              <span class="material-symbols-outlined">trending_up</span> +8.4% vs last period
            </p>
          </div>
          <div class="kpi-card kpi-card--teal">
            <div class="kpi-top">
              <span class="kpi-label">Total Reservations</span>
              <span class="material-symbols-outlined kpi-icon">calendar_month</span>
            </div>
            <p class="kpi-value">{{ stats.totalReservations }}</p>
            <p class="kpi-trend trend--up">
              <span class="material-symbols-outlined">trending_up</span> +12% vs last period
            </p>
          </div>
          <div class="kpi-card kpi-card--gold">
            <div class="kpi-top">
              <span class="kpi-label">Active Hotels</span>
              <span class="material-symbols-outlined kpi-icon">apartment</span>
            </div>
            <p class="kpi-value">{{ stats.totalHotels }}</p>
            <p class="kpi-trend trend--neutral">Stable</p>
          </div>
          <div class="kpi-card kpi-card--navy">
            <div class="kpi-top">
              <span class="kpi-label">Avg. Occupancy</span>
              <span class="material-symbols-outlined kpi-icon">percent</span>
            </div>
            <p class="kpi-value">{{ stats.averageOccupancy }}%</p>
            <p class="kpi-trend trend--down">
              <span class="material-symbols-outlined">trending_down</span> -2.1% vs last period
            </p>
          </div>
          <div class="kpi-card">
            <div class="kpi-top">
              <span class="kpi-label">Total Users</span>
              <span class="material-symbols-outlined kpi-icon" style="color:#006768">group</span>
            </div>
            <p class="kpi-value" style="color:#006768">{{ stats.totalUsers }}</p>
            <p class="kpi-trend trend--up"><span class="material-symbols-outlined">trending_up</span> +5 new this month</p>
          </div>
          <div class="kpi-card">
            <div class="kpi-top">
              <span class="kpi-label">Open Complaints</span>
              <span class="material-symbols-outlined kpi-icon" style="color:#ba1a1a">forum</span>
            </div>
            <p class="kpi-value" style="color:#ba1a1a">{{ stats.totalComplaints }}</p>
            <p class="kpi-trend trend--down"><span class="material-symbols-outlined">trending_down</span> -3 resolved this week</p>
          </div>
          <div class="kpi-card">
            <div class="kpi-top">
              <span class="kpi-label">Pending Reservations</span>
              <span class="material-symbols-outlined kpi-icon" style="color:#735c10">schedule</span>
            </div>
            <p class="kpi-value" style="color:#735c10">{{ stats.pendingReservations }}</p>
            <p class="kpi-trend trend--neutral">Awaiting approval</p>
          </div>
          <div class="kpi-card">
            <div class="kpi-top">
              <span class="kpi-label">Active Offers</span>
              <span class="material-symbols-outlined kpi-icon" style="color:#236294">local_offer</span>
            </div>
            <p class="kpi-value" style="color:#236294">{{ stats.activeOffers }}</p>
            <p class="kpi-trend trend--up"><span class="material-symbols-outlined">trending_up</span> +2 new offers</p>
          </div>
        </div>

        <!-- Charts section -->
        <div class="charts-grid">
          <!-- Revenue by month bar chart -->
          <div class="chart-card chart-card--wide">
            <h3 class="chart-title">Revenue by Month</h3>
            <div class="bar-chart">
              <div
                v-for="m in stats.revenueByMonth"
                :key="m.month"
                class="bar-col"
                :id="`bar-${m.month}`"
              >
                <div class="bar-label-value">{{ formatCurrencyShort(m.revenue) }}</div>
                <div
                  class="bar"
                  :style="{ height: barHeight(m.revenue, stats.revenueByMonth) + '%' }"
                ></div>
                <div class="bar-label">{{ m.month }}</div>
              </div>
            </div>
          </div>

          <!-- Reservations by status donut -->
          <div class="chart-card">
            <h3 class="chart-title">Reservations by Status</h3>
            <div class="donut-list">
              <div
                v-for="s in stats.reservationsByStatus"
                :key="s.status"
                class="donut-row"
              >
                <span class="donut-dot" :class="`dot--${s.status.toLowerCase()}`"></span>
                <span class="donut-label">{{ s.status }}</span>
                <div class="donut-bar-wrap">
                  <div class="donut-bar" :class="`bar--${s.status.toLowerCase()}`"
                    :style="{ width: donutWidth(s.count, stats.reservationsByStatus) + '%' }">
                  </div>
                </div>
                <span class="donut-count">{{ s.count }}</span>
              </div>
            </div>
          </div>

          <!-- Occupancy trend -->
          <div class="chart-card chart-card--wide">
            <h3 class="chart-title">Monthly Occupancy Rate (%)</h3>
            <div class="line-chart">
              <svg viewBox="0 0 600 160" class="line-svg">
                <defs>
                  <linearGradient id="occ-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#006768" stop-opacity="0.25"/>
                    <stop offset="100%" stop-color="#006768" stop-opacity="0"/>
                  </linearGradient>
                </defs>
                <polygon :points="areaPoints(stats.occupancyByMonth)" fill="url(#occ-grad)"/>
                <polyline :points="linePoints(stats.occupancyByMonth)" fill="none" stroke="#006768" stroke-width="2.5" stroke-linejoin="round"/>
                <circle
                  v-for="(p, i) in linePointsArray(stats.occupancyByMonth)"
                  :key="i" :cx="p.x" :cy="p.y" r="4" fill="#006768"
                />
              </svg>
              <div class="line-labels">
                <span v-for="m in stats.occupancyByMonth" :key="m.month">{{ m.month }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useStats } from '~/composables/useStats'

definePageMeta({ layout: 'admin' })

const { dashboardStats: stats, loading, fetchDashboard } = useStats()
const period = ref('30')

function formatCurrency(n: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
}
function formatCurrencyShort(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(0) + 'k€'
  return n + '€'
}
function barHeight(val: number, arr: { revenue: number }[]) {
  const max = Math.max(...arr.map(a => a.revenue))
  return max ? Math.round((val / max) * 85) : 0
}
function donutWidth(val: number, arr: { count: number }[]) {
  const total = arr.reduce((s, a) => s + a.count, 0)
  return total ? Math.round((val / total) * 100) : 0
}
function linePointsArray(arr: { month: string; rate: number }[]) {
  const w = 600, h = 160, pad = 30
  const max = Math.max(...arr.map(a => a.rate)) || 100
  return arr.map((v, i) => ({
    x: pad + (i / (arr.length - 1)) * (w - pad * 2),
    y: h - pad - (v.rate / max) * (h - pad * 2),
  }))
}
function linePoints(arr: { month: string; rate: number }[]) {
  return linePointsArray(arr).map(p => `${p.x},${p.y}`).join(' ')
}
function areaPoints(arr: { month: string; rate: number }[]) {
  const pts = linePointsArray(arr)
  const top = pts.map(p => `${p.x},${p.y}`).join(' ')
  return `${pts[0].x},160 ${top} ${pts[pts.length - 1].x},160`
}

onMounted(fetchDashboard)
</script>

<style scoped>
.admin-page { padding: 2.5rem; }
.page-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 1.5rem; margin-bottom: 2rem; flex-wrap: wrap; }
.page-eyebrow { font-size: 0.6875rem; text-transform: uppercase; letter-spacing: 0.08em; color: #6d7979; font-weight: 600; margin: 0; }
.page-title { font-size: 1.625rem; font-weight: 700; color: #015081; margin: 0.25rem 0; letter-spacing: -0.02em; }
.page-desc { font-size: 0.875rem; color: #3d4949; margin: 0; }
.header-actions { display: flex; gap: 0.75rem; align-items: center; }
.filter-select { padding: 0.5rem 0.875rem; border: 1px solid #bcc9c8; border-radius: 0.5rem; font-size: 0.875rem; background: #fff; outline: none; cursor: pointer; }
.btn-export { display: flex; align-items: center; gap: 0.375rem; padding: 0.5rem 1rem; border: 1.5px solid #CDAF5D; border-radius: 0.5rem; background: transparent; color: #735c10; font-weight: 600; font-size: 0.875rem; cursor: pointer; }
.btn-export:hover { background: #CDAF5D; color: #015081; }

.loading-state { text-align: center; padding: 4rem; color: #6d7979; }
.loading-state .material-symbols-outlined { font-size: 2.5rem; display: block; margin-bottom: 1rem; }
@keyframes spin { to { transform: rotate(360deg); } }
.spin { animation: spin 0.8s linear infinite; }

.kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2rem; }
@media (max-width: 1000px) { .kpi-grid { grid-template-columns: repeat(2, 1fr); } }

.kpi-card {
  background: #fff; border-radius: 0.875rem; padding: 1.375rem;
  box-shadow: 0 1px 4px rgba(1,80,129,0.06); overflow: hidden; position: relative;
  border-left: 4px solid transparent;
  transition: transform 0.15s, box-shadow 0.15s;
}
.kpi-card:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(1,80,129,0.10); }
.kpi-card--primary { border-left-color: #236294; }
.kpi-card--teal { border-left-color: #006768; }
.kpi-card--gold { border-left-color: #CDAF5D; }
.kpi-card--navy { border-left-color: #015081; }
.kpi-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; }
.kpi-label { font-size: 0.6875rem; text-transform: uppercase; letter-spacing: 0.06em; color: #6d7979; font-weight: 600; }
.kpi-icon { font-size: 1.25rem; color: #bcc9c8; font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
.kpi-value { font-size: 1.625rem; font-weight: 700; color: #015081; margin: 0.25rem 0 0.375rem; }
.kpi-card--primary .kpi-value { color: #236294; }
.kpi-card--teal .kpi-value { color: #006768; }
.kpi-card--gold .kpi-value { color: #735c10; }
.kpi-trend { font-size: 0.75rem; font-weight: 600; display: flex; align-items: center; gap: 0.25rem; margin: 0; }
.kpi-trend .material-symbols-outlined { font-size: 0.875rem; }
.trend--up { color: #006768; }
.trend--down { color: #ba1a1a; }
.trend--neutral { color: #6d7979; }

.charts-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; }
@media (max-width: 900px) { .charts-grid { grid-template-columns: 1fr; } }
.chart-card { background: #fff; border-radius: 0.875rem; padding: 1.5rem; box-shadow: 0 1px 4px rgba(1,80,129,0.06); }
.chart-card--wide { grid-column: span 1; }
.chart-title { font-size: 0.9375rem; font-weight: 700; color: #015081; margin: 0 0 1.5rem; }

.bar-chart { display: flex; align-items: flex-end; gap: 0.5rem; height: 160px; }
.bar-col { display: flex; flex-direction: column; align-items: center; flex: 1; gap: 0.25rem; height: 100%; justify-content: flex-end; }
.bar-label-value { font-size: 0.625rem; color: #6d7979; font-weight: 600; }
.bar { width: 100%; background: linear-gradient(180deg, #008283, #006768); border-radius: 0.25rem 0.25rem 0 0; transition: height 0.4s ease; min-height: 4px; }
.bar-label { font-size: 0.625rem; color: #6d7979; font-weight: 600; margin-top: 0.25rem; }

.donut-list { display: flex; flex-direction: column; gap: 0.875rem; }
.donut-row { display: flex; align-items: center; gap: 0.625rem; }
.donut-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.dot--confirmed { background: #006768; }
.dot--pending { background: #CDAF5D; }
.dot--cancelled { background: #ba1a1a; }
.dot--completed { background: #236294; }
.dot--blocked { background: #6d7979; }
.donut-label { font-size: 0.8125rem; color: #3d4949; font-weight: 500; width: 90px; flex-shrink: 0; }
.donut-bar-wrap { flex: 1; height: 8px; background: #e1e9f0; border-radius: 999px; overflow: hidden; }
.donut-bar { height: 100%; border-radius: 999px; transition: width 0.5s ease; }
.bar--confirmed { background: #006768; }
.bar--pending { background: #CDAF5D; }
.bar--cancelled { background: #ba1a1a; }
.bar--completed { background: #236294; }
.bar--blocked { background: #6d7979; }
.donut-count { font-size: 0.8125rem; font-weight: 700; color: #015081; min-width: 2rem; text-align: right; }

.line-chart { width: 100%; }
.line-svg { width: 100%; height: auto; display: block; }
.line-labels { display: flex; justify-content: space-between; padding: 0.25rem 2rem 0; }
.line-labels span { font-size: 0.625rem; color: #6d7979; font-weight: 600; }
</style>
