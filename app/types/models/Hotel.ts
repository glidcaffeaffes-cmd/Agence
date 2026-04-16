/**
 * Hotel entity — the central business object.
 * UML: Hotel
 */
export interface Hotel {
  id: number
  name: string
  address: string
  city: string
  country: string
  stars: number
  description: string
  email: string
  phone: string
  active: boolean
  images: string[]
  amenities: string[]
}
