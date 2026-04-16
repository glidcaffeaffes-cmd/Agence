import type { IStatsRepository } from '~/types/interfaces'
import type { DashboardStats, HotelStats } from '~/types/models'
import { mockDashboardStats } from './data/stats'

export class MockStatsRepository implements IStatsRepository {
  async getDashboardStats(): Promise<DashboardStats> {
    return mockDashboardStats
  }

  async getHotelStats(hotelId: number, start: string, end: string): Promise<HotelStats> {
    return {
      hotelId,
      periodStart: start,
      periodEnd: end,
      totalReservations: Math.floor(Math.random() * 50) + 10,
      totalRevenue: Math.floor(Math.random() * 50000) + 5000,
      occupancyRate: Math.floor(Math.random() * 40) + 50,
    }
  }
}
