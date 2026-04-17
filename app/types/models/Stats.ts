/**
 * Hotel statistics for a specific period.
 * UML: StatHotel
 */
export interface HotelStats {
  hotelId: number
  periodStart: string
  periodEnd: string
  totalReservations: number
  totalRevenue: number
  occupancyRate: number
}

/** Dashboard-level aggregated KPIs */
export interface DashboardStats {
  totalHotels: number
  totalReservations: number
  totalRevenue: number
  averageOccupancy: number
  totalUsers: number
  totalComplaints: number
  pendingReservations: number
  activeOffers: number
  revenueByMonth: { month: string; revenue: number }[]
  reservationsByStatus: { status: string; count: number }[]
  occupancyByMonth: { month: string; rate: number }[]
}
