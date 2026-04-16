<template>
  <div class="reservations-page">
    <header class="page-header">
      <div class="header-content">
        <h1 class="page-title">My Bookings</h1>
        <p class="page-subtitle">Manage your upcoming stays and review past trips</p>
      </div>
    </header>

    <div class="page-container">
      <div class="table-card">
        <AppCard variant="elevated">
          <div class="table-responsive">
            <table class="bookings-table">
              <thead>
                <tr>
                  <th>Booking Reference</th>
                  <th>Dates</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody v-if="reservations.length > 0">
                <tr v-for="res in reservations" :key="res.id">
                  <td><strong class="ref-code">#RES-{{ String(res.id).padStart(4, '0') }}</strong></td>
                  <td>
                    <div class="dates-col">
                      <span><i class="pi pi-calendar-plus"></i> {{ formatDate(res.checkIn) }}</span>
                      <span><i class="pi pi-calendar-minus"></i> {{ formatDate(res.checkOut) }}</span>
                    </div>
                  </td>
                  <td>
                    <span class="price-val">€{{ res.totalAmount }}</span>
                  </td>
                  <td>
                    <AppBadge :color="getStatusColor(res.status)" size="sm">{{ res.status }}</AppBadge>
                  </td>
                  <td>
                    <button class="action-btn" title="View Details">
                      <i class="pi pi-eye"></i>
                    </button>
                    <button class="action-btn action-btn--danger" title="Cancel" v-if="res.status === 'Confirmed' || res.status === 'Pending'" @click="handleCancel(res.id)">
                      <i class="pi pi-times"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr>
                  <td colspan="5" class="empty-cell">
                    <AppEmptyState icon="pi pi-calendar" title="No bookings yet" description="You haven't made any reservations. Discover our hotels and book your first stay!" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </AppCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useReservations } from '~/composables/useReservations'
import { useAuth } from '~/composables/useAuth'

const { currentProfile } = useAuth()
const { reservations, fetchByAccount, updateStatus } = useReservations()

onMounted(async () => {
  if (currentProfile.value) {
    if (currentProfile.value.role === 'Admin' || currentProfile.value.role === 'Agent') {
      // Mock loading all for admin view just for demo, though normally this is handled in admin pages
      await fetchByAccount(currentProfile.value.id)
    } else {
      await fetchByAccount(currentProfile.value.id)
    }
  }
})

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function getStatusColor(status: string) {
  const map: Record<string, string> = {
    'Pending': 'warning',
    'Confirmed': 'success',
    'Cancelled': 'danger',
    'Completed': 'info'
  }
  return map[status] || 'muted'
}

async function handleCancel(id: number) {
  if (confirm('Are you sure you want to cancel this booking?')) {
    await updateStatus(id, 'Cancelled')
  }
}
</script>

<style scoped>
.reservations-page { background: var(--color-bg-soft); min-height: 100vh; padding-bottom: var(--spacing-16); }

.page-header { background: var(--color-surface-primary); border-bottom: 1px solid var(--color-border); padding: var(--spacing-10) var(--spacing-6); margin-bottom: var(--spacing-8); text-align: center; }
.header-content { max-width: 800px; margin: 0 auto; }
.page-title { font-family: var(--font-family-heading); font-size: var(--font-size-2xl); font-weight: 700; margin: 0 0 var(--spacing-2); color: var(--color-text-primary); }
.page-subtitle { font-size: var(--font-size-base); color: var(--color-text-secondary); margin: 0; }

.page-container { max-width: 1024px; margin: 0 auto; padding: 0 var(--spacing-6); }

.table-responsive { overflow-x: auto; }
.bookings-table { width: 100%; border-collapse: collapse; text-align: left; }
.bookings-table th { padding: var(--spacing-4) var(--spacing-5); font-size: var(--font-size-xs); font-weight: 600; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid var(--color-border); background: var(--color-surface-secondary); }
.bookings-table td { padding: var(--spacing-4) var(--spacing-5); font-size: var(--font-size-sm); color: var(--color-text-primary); border-bottom: 1px solid var(--color-border); vertical-align: middle; }
.bookings-table tr:last-child td { border-bottom: none; }

.ref-code { font-family: monospace; font-size: var(--font-size-sm); color: var(--color-primary-600); }
.dates-col { display: flex; flex-direction: column; gap: 4px; font-size: var(--font-size-xs); color: var(--color-text-secondary); }
.price-val { font-weight: 700; color: var(--color-text-primary); }

.action-btn { background: none; border: 1px solid transparent; width: 32px; height: 32px; border-radius: var(--radius-md); color: var(--color-text-secondary); cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; justify-content: center; margin-right: 4px; }
.action-btn:hover { background: var(--color-surface-secondary); color: var(--color-primary-600); border-color: var(--color-border); }
.action-btn--danger:hover { color: var(--color-error); background: rgba(220, 38, 38, 0.08); border-color: transparent; }

.empty-cell { padding: 0 !important; }
</style>
