import type { Review } from '~/types/models'

export const mockReviews: Review[] = [
  { id: 1, reservationId: 4, accountId: 1, hotelId: 4, rating: 5, comment: 'Absolutely magical! The mountain views from our room were breathtaking, and the spa was world-class. Will definitely return for ski season.', publicationDate: '2026-03-10', visible: true },
  { id: 2, reservationId: 10, accountId: 2, hotelId: 2, rating: 4, comment: 'Beautiful hotel in a perfect location. The room was elegant and the staff was very attentive. Breakfast could have more variety.', publicationDate: '2026-02-20', visible: true },
  { id: 3, reservationId: 4, accountId: 1, hotelId: 1, rating: 5, comment: 'The Grand Azure lives up to its name. The private beach is pristine, the spa treatments are divine, and the Michelin restaurant was unforgettable.', publicationDate: '2026-03-12', visible: true },
  { id: 4, reservationId: 10, accountId: 3, hotelId: 3, rating: 4, comment: 'Stunning views of the Baie des Anges. The infinity pool at sunset was incredible. Room service was prompt and delicious.', publicationDate: '2026-02-25', visible: true },
  { id: 5, reservationId: 6, accountId: 2, hotelId: 5, rating: 3, comment: 'Good hotel with a great rooftop, but the room was smaller than expected. The cocktail bar is excellent though.', publicationDate: '2026-02-10', visible: true },
  { id: 6, reservationId: 4, accountId: 4, hotelId: 6, rating: 5, comment: 'A fairy tale experience. The château is magnificent, the wine tasting was a highlight, and the grounds are simply gorgeous.', publicationDate: '2026-03-15', visible: true },
]
