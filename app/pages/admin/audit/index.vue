<template>
  <div>
    <Head>
      <title>Audit Logs — VoyageHub Admin</title>
      <meta name="description" content="System audit logs and activity history for VoyageHub." />
    </Head>

    <div class="admin-page">
      <div class="page-header">
        <div>
          <p class="page-eyebrow">Security</p>
          <h1 class="page-title">System Audit Logs</h1>
          <p class="page-desc">Complete record of system activity and user actions</p>
        </div>
        <div class="header-actions">
          <div class="search-box">
            <span class="material-symbols-outlined">search</span>
            <input v-model="search" id="audit-search" type="text" placeholder="Search logs…" />
          </div>
          <select v-model="actionFilter" id="audit-action-filter" class="filter-select">
            <option value="">All actions</option>
            <option value="LOGIN">Login</option>
            <option value="CREATE">Create</option>
            <option value="UPDATE">Update</option>
            <option value="DELETE">Delete</option>
            <option value="EXPORT">Export</option>
          </select>
          <button class="btn-refresh" @click="loadLogs">
            <span class="material-symbols-outlined">refresh</span>
          </button>
        </div>
      </div>

      <!-- Stats row -->
      <div class="stats-row">
        <div class="stat-pill">
          <span class="material-symbols-outlined" style="color:#006768">list_alt</span>
          <span>{{ logs.length }} total events</span>
        </div>
        <div class="stat-pill">
          <span class="material-symbols-outlined" style="color:#ba1a1a">warning</span>
          <span>{{ logs.filter(l => l.level === 'ERROR').length }} errors</span>
        </div>
        <div class="stat-pill">
          <span class="material-symbols-outlined" style="color:#CDAF5D">info</span>
          <span>{{ logs.filter(l => l.level === 'WARNING').length }} warnings</span>
        </div>
      </div>

      <!-- Log table -->
      <div class="table-card">
        <table class="data-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>User</th>
              <th>Action</th>
              <th>Resource</th>
              <th>Details</th>
              <th>Level</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="log in filtered" :key="log.id" :id="`log-${log.id}`">
              <td class="td-time">{{ log.timestamp }}</td>
              <td class="td-user">
                <span class="user-chip">{{ log.user }}</span>
              </td>
              <td>
                <span class="action-badge" :class="`action--${log.action.toLowerCase()}`">
                  {{ log.action }}
                </span>
              </td>
              <td class="td-resource">{{ log.resource }}</td>
              <td class="td-details">{{ log.details }}</td>
              <td>
                <span class="level-badge" :class="`level--${log.level.toLowerCase()}`">
                  {{ log.level }}
                </span>
              </td>
            </tr>
            <tr v-if="filtered.length === 0">
              <td colspan="6" class="empty-row">No logs match your criteria</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

definePageMeta({ layout: 'admin' })

interface AuditLog {
  id: number
  timestamp: string
  user: string
  action: string
  resource: string
  details: string
  level: 'INFO' | 'WARNING' | 'ERROR'
}

const search = ref('')
const actionFilter = ref('')

const logs = ref<AuditLog[]>([
  { id: 1, timestamp: '2026-04-17 17:42:01', user: 'admin@voyagehub.com', action: 'LOGIN', resource: 'Auth', details: 'Successful login from 192.168.1.1', level: 'INFO' },
  { id: 2, timestamp: '2026-04-17 17:38:14', user: 'admin@voyagehub.com', action: 'UPDATE', resource: 'Hotel #3', details: 'Updated hotel name and description', level: 'INFO' },
  { id: 3, timestamp: '2026-04-17 17:25:53', user: 'admin@voyagehub.com', action: 'DELETE', resource: 'Offer #7', details: 'Removed expired seasonal offer', level: 'WARNING' },
  { id: 4, timestamp: '2026-04-17 16:59:22', user: 'jean.dupont@email.com', action: 'CREATE', resource: 'Reservation #89', details: 'New booking for hotel #2, room #14', level: 'INFO' },
  { id: 5, timestamp: '2026-04-17 16:30:11', user: 'system', action: 'EXPORT', resource: 'Reports', details: 'Monthly financial report generated', level: 'INFO' },
  { id: 6, timestamp: '2026-04-17 15:47:00', user: 'unknown', action: 'LOGIN', resource: 'Auth', details: 'Failed login attempt for admin@voyagehub.com', level: 'ERROR' },
  { id: 7, timestamp: '2026-04-17 14:22:38', user: 'admin@voyagehub.com', action: 'UPDATE', resource: 'Config: booking_advance_days', details: 'Changed value from 30 to 60', level: 'INFO' },
  { id: 8, timestamp: '2026-04-17 13:10:45', user: 'marie.lefevre@email.com', action: 'CREATE', resource: 'Complaint #12', details: 'Submitted complaint for reservation #77', level: 'INFO' },
  { id: 9, timestamp: '2026-04-17 12:05:33', user: 'admin@voyagehub.com', action: 'UPDATE', resource: 'User #5', details: 'Account deactivated', level: 'WARNING' },
  { id: 10, timestamp: '2026-04-17 11:00:00', user: 'system', action: 'CREATE', resource: 'Backup', details: 'Automated daily backup completed', level: 'INFO' },
])

const filtered = computed(() =>
  logs.value.filter(l => {
    const q = search.value.toLowerCase()
    const matchSearch = !q || l.user.toLowerCase().includes(q) || l.details.toLowerCase().includes(q) || l.resource.toLowerCase().includes(q)
    const matchAction = !actionFilter.value || l.action === actionFilter.value
    return matchSearch && matchAction
  })
)

function loadLogs() {
  // In production: refetch from API
}
</script>

<style scoped>
.admin-page { padding: 2.5rem; }
.page-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 1.5rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
.page-eyebrow { font-size: 0.6875rem; text-transform: uppercase; letter-spacing: 0.08em; color: #6d7979; font-weight: 600; margin: 0; }
.page-title { font-size: 1.625rem; font-weight: 700; color: #015081; margin: 0.25rem 0; letter-spacing: -0.02em; }
.page-desc { font-size: 0.875rem; color: #3d4949; margin: 0; }
.header-actions { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
.search-box { display: flex; align-items: center; gap: 0.5rem; background: #fff; border: 1px solid #bcc9c8; border-radius: 0.5rem; padding: 0.5rem 0.875rem; min-width: 200px; }
.search-box .material-symbols-outlined { font-size: 1.125rem; color: #6d7979; }
.search-box input { border: none; outline: none; background: transparent; font-size: 0.875rem; color: #151d22; width: 100%; }
.filter-select { padding: 0.5rem 0.875rem; border: 1px solid #bcc9c8; border-radius: 0.5rem; font-size: 0.875rem; background: #fff; outline: none; cursor: pointer; }
.btn-refresh { width: 2.25rem; height: 2.25rem; border: 1px solid #bcc9c8; border-radius: 0.5rem; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #3d4949; transition: all 0.15s; }
.btn-refresh:hover { background: #edf5fc; color: #006768; }
.btn-refresh .material-symbols-outlined { font-size: 1.125rem; }

.stats-row { display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
.stat-pill { display: flex; align-items: center; gap: 0.5rem; background: #fff; border: 1px solid #e1e9f0; border-radius: 999px; padding: 0.375rem 0.875rem; font-size: 0.8125rem; font-weight: 600; color: #3d4949; }
.stat-pill .material-symbols-outlined { font-size: 1rem; }

.table-card { background: #fff; border-radius: 0.875rem; box-shadow: 0 1px 4px rgba(1,80,129,0.06); overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; min-width: 700px; }
.data-table th { text-align: left; padding: 0.875rem 1.25rem; font-size: 0.6875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #6d7979; background: #f5faff; border-bottom: 1px solid #e1e9f0; }
.data-table td { padding: 0.875rem 1.25rem; border-bottom: 1px solid #e1e9f0; font-size: 0.8125rem; color: #151d22; vertical-align: middle; }
.data-table tr:last-child td { border-bottom: none; }
.data-table tr:hover td { background: #f5faff; }
.empty-row { text-align: center; color: #6d7979; padding: 2rem; }

.td-time { font-family: var(--font-family-mono); font-size: 0.75rem; color: #6d7979; white-space: nowrap; }
.td-resource { font-weight: 600; color: #015081; }
.td-details { color: #3d4949; max-width: 260px; }
.user-chip { background: #edf5fc; color: #006768; padding: 0.2rem 0.5rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }

.action-badge { display: inline-block; padding: 0.2rem 0.5rem; border-radius: 0.25rem; font-size: 0.6875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; }
.action--login { background: #e0f2f1; color: #006768; }
.action--create { background: #e3f2fd; color: #236294; }
.action--update { background: #fff8e1; color: #735c10; }
.action--delete { background: #ffdad6; color: #ba1a1a; }
.action--export { background: #e8eaf6; color: #3949ab; }

.level-badge { display: inline-block; padding: 0.2rem 0.5rem; border-radius: 999px; font-size: 0.6875rem; font-weight: 700; text-transform: uppercase; }
.level--info { background: #e0f2f1; color: #006768; }
.level--warning { background: #fff8e1; color: #735c10; }
.level--error { background: #ffdad6; color: #ba1a1a; }
</style>
