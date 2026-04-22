import { ref } from 'vue'
import type { DashboardStats } from '~/types/models'
import { StatsService } from '~/services'

const service = new StatsService()

export function useStats() {
  const dashboardStats = ref<DashboardStats | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchDashboard() {
    loading.value = true
    error.value = null
    try {
      dashboardStats.value = await service.getDashboardStats()
    } catch (e: any) {
      error.value = e.message
      dashboardStats.value = null
    } finally {
      loading.value = false
    }
  }

  return { dashboardStats, loading, error, fetchDashboard }
}
