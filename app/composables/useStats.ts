import { ref } from 'vue'
import type { DashboardStats } from '~/types/models'
import { StatsService } from '~/services'
import { useAsyncAction } from '~/composables/useAsyncAction'

const service = new StatsService()

export function useStats() {
  const dashboardStats = ref<DashboardStats | null>(null)
  const reservationChart = ref<number[]>([])
  const { loading, error, execute } = useAsyncAction()

  async function fetchDashboard() {
    const [stats, chart] = await execute(
      () => Promise.all([service.getDashboardStats(), service.getReservationChart()]),
      [null, []] as [DashboardStats | null, number[]],
    )

    dashboardStats.value = stats
    reservationChart.value = chart
  }

  return { dashboardStats, reservationChart, loading, error, fetchDashboard }
}
