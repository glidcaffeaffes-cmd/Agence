/**
 * Special offer / promotion for a hotel.
 * UML: Offre
 */
export interface Offer {
  id: number
  hotelId: number
  title: string
  description: string
  discountRate: number
  startDate: string
  endDate: string
  active: boolean
  image?: string
}
