/**
 * Room entity attached to a Hotel.
 * UML: Chambre
 */
export interface Room {
  id: number
  hotelId: number
  number: string
  floor: number
  pricePerNight: number
  capacity: number
  available: boolean
  photos: string[]
  roomTypeId: number
  type?: string
  description?: string
  amenities?: string[]
  image?: string
  status?: 'AVAILABLE' | 'UNAVAILABLE'
}
