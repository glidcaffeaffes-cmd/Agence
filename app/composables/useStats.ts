import { ref } from 'vue'
import type { DashboardStats } from '~/types/models'
import { $fetch } from 'ofetch'

const repo = {
  getDashboardStats: () => $fetch<DashboardStats>('/api/stats/dashboard')
}

export function useStats() {
  const dashboardStats = ref<DashboardStats | null>(null)
  const loading = ref(false)

  async function fetchDashboard() {
    loading.value = true
    try { dashboardStats.value = await repo.getDashboardStats() }
    finally { loading.value = false }
  }

  return { dashboardStats, loading, fetchDashboard }
}
