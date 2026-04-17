/**
 * Reservation lifecycle statuses.
 * Maps to UML: StatutReservation
 */
export enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  BLOCKED = 'BLOCKED',
  CANCELLED = 'CANCELLED',
  REFUSED = 'REFUSED',
  COMPLETED = 'COMPLETED',
}

/** Human-readable labels for each status */
export const ReservationStatusLabel: Record<ReservationStatus, string> = {
  [ReservationStatus.PENDING]: 'Pending',
  [ReservationStatus.CONFIRMED]: 'Confirmed',
  [ReservationStatus.BLOCKED]: 'Blocked',
  [ReservationStatus.CANCELLED]: 'Cancelled',
  [ReservationStatus.REFUSED]: 'Refused',
  [ReservationStatus.COMPLETED]: 'Completed',
}

/** CSS color token mapping for badges */
export const ReservationStatusColor: Record<ReservationStatus, string> = {
  [ReservationStatus.PENDING]: 'warning',
  [ReservationStatus.CONFIRMED]: 'success',
  [ReservationStatus.BLOCKED]: 'danger',
  [ReservationStatus.CANCELLED]: 'muted',
  [ReservationStatus.REFUSED]: 'danger',
  [ReservationStatus.COMPLETED]: 'info',
}
