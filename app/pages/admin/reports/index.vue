<template>
  <div>
    <Head>
      <title>Financial Reports — VoyageHub Admin</title>
      <meta name="description" content="Financial reporting and revenue analysis for VoyageHub." />
    </Head>

    <div class="admin-page">
      <div class="page-header">
        <div>
          <p class="page-eyebrow">Finance</p>
          <h1 class="page-title">Financial Reports</h1>
          <p class="page-desc">Revenue analysis, bookings turnover and financial summaries</p>
        </div>
        <div class="header-actions">
          <select v-model="year" id="report-year" class="filter-select">
            <option value="2025">2025</option>
            <option value="2026">2026</option>
          </select>
          <button class="btn-export" id="report-export-btn">
            <span class="material-symbols-outlined">download</span> Export CSV
          </button>
        </div>
      </div>

      <div v-if="loading" class="loading-state">
        <span class="material-symbols-outlined spin">progress_activity</span>
      </div>

      <template v-else-if="stats">
        <!-- Summary cards -->
        <div class="summary-row">
          <div class="sum-card">
            <span class="material-symbols-outlined sum-icon" style="color:#006768">payments</span>
            <div>
              <p class="sum-label">Total Revenue</p>
              <p class="sum-value">{{ formatCurrency(stats.totalRevenue) }}</p>
            </div>
          </div>
          <div class="sum-card">
            <span class="material-symbols-outlined sum-icon" style="color:#236294">receipt</span>
            <div>
              <p class="sum-label">Confirmed Bookings</p>
              <p class="sum-value">{{ stats.totalReservations }}</p>
            </div>
          </div>
          <div class="sum-card">
            <span class="material-symbols-outlined sum-icon" style="color:#CDAF5D">calculate</span>
            <div>
              <p class="sum-label">Avg. Booking Value</p>
              <p class="sum-value">{{ stats.totalReservations ? formatCurrency(stats.totalRevenue / stats.totalReservations) : '—' }}</p>
            </div>
          </div>
          <div class="sum-card">
            <span class="material-symbols-outlined sum-icon" style="color:#015081">trending_up</span>
            <div>
              <p class="sum-label">YoY Growth</p>
              <p class="sum-value trend-up">+8.4%</p>
            </div>
          </div>
        </div>

        <!-- Monthly breakdown table -->
        <div class="report-card">
          <h3 class="section-title">Monthly Revenue Breakdown</h3>
          <div class="table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th class="text-right">Revenue</th>
                  <th class="text-right">% of Total</th>
                  <th>Trend</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(m, i) in stats.revenueByMonth" :key="m.month" :id="`row-${m.month}`">
                  <td class="td-month">{{ m.month }}</td>
                  <td class="text-right td-value">{{ formatCurrency(m.revenue) }}</td>
                  <td class="text-right td-pct">{{ pct(m.revenue) }}%</td>
                  <td>
                    <div class="mini-bar-wrap">
                      <div class="mini-bar" :style="{ width: barW(m.revenue) + '%' }"></div>
                    </div>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="tfoot-total">
                  <td><strong>Total</strong></td>
                  <td class="text-right"><strong>{{ formatCurrency(stats.totalRevenue) }}</strong></td>
                  <td class="text-right"><strong>100%</strong></td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <!-- Occupancy breakdown -->
        <div class="report-card">
          <h3 class="section-title">Monthly Occupancy Rate</h3>
          <div class="occ-grid">
            <div v-for="m in stats.occupancyByMonth" :key="m.month" class="occ-cell">
              <div class="occ-ring" :style="{ '--pct': m.rate }">
                <span class="occ-val">{{ m.rate }}%</span>
              </div>
              <p class="occ-month">{{ m.month }}</p>
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
const year = ref('2025')

function formatCurrency(n: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
}
function pct(v: number) {
  if (!stats.value) return 0
  return Math.round((v / stats.value.totalRevenue) * 100)
}
function barW(v: number) {
  if (!stats.value) return 0
  const max = Math.max(...stats.value.revenueByMonth.map(m => m.revenue))
  return max ? Math.round((v / max) * 100) : 0
}

onMounted(fetchDashboard)
</script>

<style scoped>
.admin-page { padding: 2.5rem; }
.page-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 1.5rem; margin-bottom: 2rem; flex-wrap: wrap; }
.page-eyebrow { font-size: 0.6875rem; text-transform: uppercase; letter-spacing: 0.08em; color: #6d7979; font-weight: 600; margin: 0; }
.page-title { font-size: 1.625rem; font-weight: 700; color: #015081; margin: 0.25rem 0; letter-spacing: -0.02em; }
.page-desc { font-size: 0.875rem; color: #3d4949; margin: 0; }
.header-actions { display: flex; gap: 0.75rem; }
.filter-select { padding: 0.5rem 0.875rem; border: 1px solid #bcc9c8; border-radius: 0.5rem; font-size: 0.875rem; background: #fff; outline: none; cursor: pointer; }
.btn-export { display: flex; align-items: center; gap: 0.375rem; padding: 0.5rem 1rem; background: linear-gradient(135deg,#CDAF5D,#b89a48); color: #015081; border: none; border-radius: 0.5rem; font-weight: 700; font-size: 0.875rem; cursor: pointer; }
.btn-export:hover { opacity: 0.9; }

.loading-state { text-align: center; padding: 3rem; color: #6d7979; }
@keyframes spin { to { transform: rotate(360deg); } }
.spin { animation: spin 0.8s linear infinite; font-size: 2rem; }

.summary-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
@media (max-width: 900px) { .summary-row { grid-template-columns: repeat(2, 1fr); } }
.sum-card { background: #fff; border-radius: 0.875rem; padding: 1.375rem; box-shadow: 0 1px 4px rgba(1,80,129,0.06); display: flex; align-items: center; gap: 1rem; }
.sum-icon { font-size: 2rem; font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
.sum-label { font-size: 0.6875rem; text-transform: uppercase; letter-spacing: 0.06em; color: #6d7979; font-weight: 600; margin: 0; }
.sum-value { font-size: 1.375rem; font-weight: 700; color: #015081; margin: 0.125rem 0 0; }
.trend-up { color: #006768; }

.report-card { background: #fff; border-radius: 0.875rem; padding: 1.5rem; box-shadow: 0 1px 4px rgba(1,80,129,0.06); margin-bottom: 1.5rem; }
.section-title { font-size: 0.9375rem; font-weight: 700; color: #015081; margin: 0 0 1.25rem; }
.table-wrap { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; }
.data-table th { text-align: left; padding: 0.75rem 1rem; font-size: 0.6875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #6d7979; background: #f5faff; border-bottom: 1px solid #e1e9f0; }
.data-table th.text-right { text-align: right; }
.data-table td { padding: 0.75rem 1rem; border-bottom: 1px solid #e1e9f0; font-size: 0.875rem; color: #151d22; }
.data-table tr:hover td { background: #f5faff; }
.td-month { font-weight: 600; color: #015081; }
.td-value { font-weight: 600; color: #006768; }
.td-pct { color: #6d7979; }
.text-right { text-align: right; }
.tfoot-total td { padding: 0.875rem 1rem; font-size: 0.9375rem; border-top: 2px solid #bcc9c8; background: #f5faff; }
.mini-bar-wrap { height: 8px; background: #e1e9f0; border-radius: 999px; overflow: hidden; min-width: 100px; }
.mini-bar { height: 100%; background: linear-gradient(90deg,#006768,#008283); border-radius: 999px; }

.occ-grid { display: flex; flex-wrap: wrap; gap: 1rem; }
.occ-cell { text-align: center; }
.occ-ring {
  width: 64px; height: 64px; border-radius: 50%;
  background: conic-gradient(#006768 calc(var(--pct) * 1%), #e1e9f0 0);
  display: flex; align-items: center; justify-content: center;
  position: relative; margin-bottom: 0.375rem;
}
.occ-ring::after { content: ''; position: absolute; width: 48px; height: 48px; border-radius: 50%; background: #fff; }
.occ-val { position: relative; z-index: 1; font-size: 0.6875rem; font-weight: 700; color: #015081; }
.occ-month { font-size: 0.6875rem; color: #6d7979; font-weight: 600; margin: 0; }
</style>
