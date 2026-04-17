import type { RoomType } from '~/types/models'

export const mockRoomTypes: RoomType[] = [
  { id: 1, label: 'Standard', description: 'Comfortable room with essential amenities for a pleasant stay.', basePrice: 120, areaSqm: 25, amenities: ['Wi-Fi', 'TV', 'Mini Bar', 'Air Conditioning'] },
  { id: 2, label: 'Superior', description: 'Spacious room with premium bedding and city/garden views.', basePrice: 180, areaSqm: 35, amenities: ['Wi-Fi', 'TV', 'Mini Bar', 'Air Conditioning', 'Balcony', 'Safe'] },
  { id: 3, label: 'Deluxe', description: 'Elegantly appointed room with lounge area and panoramic views.', basePrice: 280, areaSqm: 45, amenities: ['Wi-Fi', 'TV', 'Mini Bar', 'Air Conditioning', 'Balcony', 'Safe', 'Bathrobe', 'Nespresso'] },
  { id: 4, label: 'Suite', description: 'Luxurious suite with separate living area, premium amenities and butler service.', basePrice: 450, areaSqm: 65, amenities: ['Wi-Fi', 'TV', 'Mini Bar', 'Air Conditioning', 'Terrace', 'Safe', 'Bathrobe', 'Nespresso', 'Butler Service', 'Jacuzzi'] },
  { id: 5, label: 'Presidential Suite', description: 'The pinnacle of luxury. A private penthouse with dining room, panoramic terrace, and 24/7 butler.', basePrice: 950, areaSqm: 120, amenities: ['Wi-Fi', 'TV', 'Mini Bar', 'Air Conditioning', 'Private Terrace', 'Safe', 'Bathrobe', 'Nespresso', 'Butler Service', 'Jacuzzi', 'Dining Room', 'Private Pool'] },
]
