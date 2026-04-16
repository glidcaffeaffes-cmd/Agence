import { ref } from 'vue'
import type { DashboardStats } from '~/types/models'
import { MockStatsRepository } from '~/repositories/mock'

const repo = new MockStatsRepository()

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
