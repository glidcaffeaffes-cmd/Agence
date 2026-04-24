import type { DashboardStats, HotelStats } from '../models'

export interface IStatsRepository {
  getDashboardStats(): Promise<DashboardStats>
  getReservationChart(): Promise<number[]>
  getHotelStats(hotelId: number, start: string, end: string): Promise<HotelStats>
}
