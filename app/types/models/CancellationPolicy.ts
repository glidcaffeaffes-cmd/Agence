/**
 * Cancellation policy for a hotel.
 * UML: ConditionAnnulation
 */
export interface CancellationPolicy {
  id: number
  hotelId: number
  minHoursBeforeCheckIn: number
  cancellationFee: number
  fullRefund: boolean
  description: string
}
