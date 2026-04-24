import type { IStatsRepository } from '~/types/interfaces'
import type { DashboardStats, HotelStats } from '~/types/models'
import { AdminRepositoryFactory } from '~/repositories/factory'

/**
 * StatsService — KPI and analytics aggregation.
 */
export class StatsService {
  private repo: IStatsRepository

  constructor(repo: IStatsRepository = AdminRepositoryFactory.stats()) {
    this.repo = repo
  }

  /** Aggregated dashboard KPIs for the admin home screen */
  async getDashboardStats(): Promise<DashboardStats> {
    return this.repo.getDashboardStats()
  }

  async getReservationChart(): Promise<number[]> {
    return this.repo.getReservationChart()
  }

  /**
   * Hotel-level stats for a date range.
   * Business rule: start must be before end.
   */
  async getHotelStats(hotelId: number, start: string, end: string): Promise<HotelStats> {
    if (!start || !end) throw new Error('Date range is required')
    if (new Date(end) <= new Date(start)) {
      throw new Error('End date must be after start date')
    }
    return this.repo.getHotelStats(hotelId, start, end)
  }
}
