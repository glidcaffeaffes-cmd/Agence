/**
 * ─── ADMIN DTOs ─────────────────────────────────────────────────────────────
 *
 * DTOs represent the raw JSON shapes returned by the backend API.
 * They are intentionally different from domain Models:
 *   - snake_case keys (typical REST/Django/Laravel conventions)
 *   - no computed fields
 *   - nullable instead of optional where the API returns null
 *
 * When you plug in a real API, only the ApiRepository implementations
 * need to change. Services and pages stay untouched.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── Hotel ───────────────────────────────────────────────────────────────────
export interface HotelDTO {
  id: number
  name: string
  address: string
  city: string
  country: string
  stars: number
  description: string
  email: string
  phone: string
  is_active: boolean           // API uses snake_case + is_ prefix
  images: string[]
  amenities: string[]
  created_at: string
}

// ─── Account ─────────────────────────────────────────────────────────────────
export interface AccountDTO {
  id: number
  email: string
  role: 'client' | 'admin'
  is_active: boolean
  created_at: string           // API uses created_at instead of registrationDate
  password?: string            // never returned on GET in real APIs — only on create
}

// ─── Profile ─────────────────────────────────────────────────────────────────
export interface ProfileDTO {
  id: number
  account_id: number
  first_name: string
  last_name: string
  phone: string | null
  photo: string | null
  date_of_birth: string | null
  nationality: string | null
}

// ─── Reservation ─────────────────────────────────────────────────────────────
export interface ReservationDTO {
  id: number
  account_id: number
  room_id: number
  hotel_id: number
  reservation_date: string
  check_in_date: string
  check_out_date: string
  number_of_nights: number
  total_amount: number
  confirmation_code: string
  status: string               // raw string from API — mapper casts to enum
  block_reason: string | null
}

// ─── Offer ───────────────────────────────────────────────────────────────────
export interface OfferDTO {
  id: number
  hotel_id: number
  title: string
  description: string
  discount_rate: number
  start_date: string
  end_date: string
  is_active: boolean
  image: string | null
}

// ─── Complaint ───────────────────────────────────────────────────────────────
export interface ComplaintDTO {
  id: number
  reservation_id: number
  account_id: number
  subject: string
  description: string
  complaint_date: string
  resolution_date: string | null
  agency_response: string | null
  status: string               // raw string — mapper casts to enum
}

// ─── Room ─────────────────────────────────────────────────────────────────────
export interface RoomDTO {
  id: number
  hotel_id: number
  room_type_id: number
  room_number: string
  price_per_night: number
  is_available: boolean
  floor: number
  capacity: number
  images: string[]
  amenities: string[]
}

// ─── Notification ─────────────────────────────────────────────────────────────
export interface NotificationDTO {
  id: number
  account_id: number
  title: string
  message: string
  type: string
  is_read: boolean
  sent_at: string
}

// ─── Review ───────────────────────────────────────────────────────────────────
export interface ReviewDTO {
  id: number
  hotel_id: number
  account_id: number
  rating: number
  comment: string
  published_at: string
  is_visible: boolean
}

// ─── Paginated API envelope (standard REST pagination) ────────────────────────
export interface PaginatedDTO<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

// ─── API Error ────────────────────────────────────────────────────────────────
export interface ApiErrorDTO {
  detail?: string
  message?: string
  errors?: Record<string, string[]>
}
