/**
 * Room type classification.
 * UML: TypeChambre
 */
export interface RoomType {
  id: number
  label: string
  description: string
  basePrice: number
  areaSqm: number
  amenities: string[]
}
