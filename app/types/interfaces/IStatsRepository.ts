import type { DashboardStats, HotelStats } from '../models'

export interface IStatsRepository {
  getDashboardStats(): Promise<DashboardStats>
  getHotelStats(hotelId: number, start: string, end: string): Promise<HotelStats>
}
