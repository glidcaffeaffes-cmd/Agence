/**
 * Guest review for a completed reservation.
 * UML: Avis
 */
export interface Review {
  id: number
  reservationId?: number
  accountId?: number
  hotelId?: number
  authorName?: string
  rating: number
  comment: string
  publicationDate: string
  visible: boolean
}
