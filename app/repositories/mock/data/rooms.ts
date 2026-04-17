import type { Room } from '~/types/models'

export const mockRooms: Room[] = [
  // Hotel 1 — Grand Azure Resort (Cannes)
  { id: 1, hotelId: 1, number: '101', floor: 1, pricePerNight: 220, capacity: 2, available: true, photos: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600'], roomTypeId: 1 },
  { id: 2, hotelId: 1, number: '202', floor: 2, pricePerNight: 320, capacity: 2, available: true, photos: ['https://images.unsplash.com/photo-1590490360182-c33d955e42f4?w=600'], roomTypeId: 2 },
  { id: 3, hotelId: 1, number: '305', floor: 3, pricePerNight: 480, capacity: 3, available: false, photos: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600'], roomTypeId: 3 },
  { id: 4, hotelId: 1, number: '501', floor: 5, pricePerNight: 750, capacity: 4, available: true, photos: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600'], roomTypeId: 4 },
  { id: 5, hotelId: 1, number: '601', floor: 6, pricePerNight: 1500, capacity: 4, available: true, photos: ['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600'], roomTypeId: 5 },

  // Hotel 2 — Le Pavillon Doré (Paris)
  { id: 6, hotelId: 2, number: '101', floor: 1, pricePerNight: 180, capacity: 2, available: true, photos: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600'], roomTypeId: 1 },
  { id: 7, hotelId: 2, number: '202', floor: 2, pricePerNight: 260, capacity: 2, available: true, photos: ['https://images.unsplash.com/photo-1590490360182-c33d955e42f4?w=600'], roomTypeId: 2 },
  { id: 8, hotelId: 2, number: '303', floor: 3, pricePerNight: 380, capacity: 3, available: true, photos: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600'], roomTypeId: 3 },
  { id: 9, hotelId: 2, number: '401', floor: 4, pricePerNight: 600, capacity: 4, available: false, photos: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600'], roomTypeId: 4 },

  // Hotel 3 — Côte Royale (Nice)
  { id: 10, hotelId: 3, number: '101', floor: 1, pricePerNight: 250, capacity: 2, available: true, photos: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600'], roomTypeId: 1 },
  { id: 11, hotelId: 3, number: '205', floor: 2, pricePerNight: 350, capacity: 2, available: true, photos: ['https://images.unsplash.com/photo-1590490360182-c33d955e42f4?w=600'], roomTypeId: 2 },
  { id: 12, hotelId: 3, number: '310', floor: 3, pricePerNight: 500, capacity: 3, available: true, photos: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600'], roomTypeId: 3 },
  { id: 13, hotelId: 3, number: '501', floor: 5, pricePerNight: 900, capacity: 4, available: true, photos: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600'], roomTypeId: 4 },
  { id: 14, hotelId: 3, number: '701', floor: 7, pricePerNight: 2000, capacity: 6, available: true, photos: ['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600'], roomTypeId: 5 },

  // Hotel 4 — Montagne Étoilée (Chamonix)
  { id: 15, hotelId: 4, number: 'A1', floor: 1, pricePerNight: 160, capacity: 2, available: true, photos: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600'], roomTypeId: 1 },
  { id: 16, hotelId: 4, number: 'B2', floor: 2, pricePerNight: 240, capacity: 2, available: false, photos: ['https://images.unsplash.com/photo-1590490360182-c33d955e42f4?w=600'], roomTypeId: 2 },
  { id: 17, hotelId: 4, number: 'C3', floor: 3, pricePerNight: 380, capacity: 4, available: true, photos: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600'], roomTypeId: 3 },

  // Hotel 5 — Villa Méditerranée (Marseille)
  { id: 18, hotelId: 5, number: '101', floor: 1, pricePerNight: 140, capacity: 2, available: true, photos: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600'], roomTypeId: 1 },
  { id: 19, hotelId: 5, number: '203', floor: 2, pricePerNight: 220, capacity: 2, available: true, photos: ['https://images.unsplash.com/photo-1590490360182-c33d955e42f4?w=600'], roomTypeId: 2 },
  { id: 20, hotelId: 5, number: '304', floor: 3, pricePerNight: 340, capacity: 3, available: true, photos: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600'], roomTypeId: 3 },

  // Hotel 6 — Château de Lumière (Bordeaux)
  { id: 21, hotelId: 6, number: '101', floor: 1, pricePerNight: 280, capacity: 2, available: true, photos: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600'], roomTypeId: 2 },
  { id: 22, hotelId: 6, number: '201', floor: 2, pricePerNight: 450, capacity: 3, available: true, photos: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600'], roomTypeId: 3 },
  { id: 23, hotelId: 6, number: '301', floor: 3, pricePerNight: 800, capacity: 4, available: true, photos: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600'], roomTypeId: 4 },
  { id: 24, hotelId: 6, number: '401', floor: 4, pricePerNight: 1800, capacity: 6, available: true, photos: ['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600'], roomTypeId: 5 },
]
