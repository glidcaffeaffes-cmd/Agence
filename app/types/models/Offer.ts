export interface Offer {
  id: number
  hotelId: number
  hotelName?: string
  title: string
  description: string
  discountRate: number
  startDate: string
  endDate: string
  active: boolean
  image?: string
}
