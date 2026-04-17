/**
 * ─── Admin Mappers ────────────────────────────────────────────────────────────
 * Pure functions: DTO (API JSON) ↔ Domain Model
 * No side-effects. No imports from services/composables.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type {
  HotelDTO, AccountDTO, ProfileDTO, ReservationDTO,
  OfferDTO, ComplaintDTO, RoomDTO, NotificationDTO, ReviewDTO
} from '~/types/dto'
import type {
  Hotel, Account, Profile, Reservation,
  Offer, Complaint, Room, AppNotification, Review
} from '~/types/models'
import { ReservationStatus } from '~/types/enums/ReservationStatus'
import { ComplaintStatus } from '~/types/enums/ComplaintStatus'

// ─── Hotel ────────────────────────────────────────────────────────────────────
export const HotelMapper = {
  fromDto(dto: HotelDTO): Hotel {
    return {
      id:          dto.id,
      name:        dto.name,
      address:     dto.address,
      city:        dto.city,
      country:     dto.country,
      stars:       dto.stars,
      description: dto.description,
      email:       dto.email,
      phone:       dto.phone,
      active:      dto.is_active,
      images:      dto.images ?? [],
      amenities:   dto.amenities ?? [],
    }
  },

  toDto(model: Omit<Hotel, 'id'>): Omit<HotelDTO, 'id' | 'created_at'> {
    return {
      name:        model.name,
      address:     model.address,
      city:        model.city,
      country:     model.country,
      stars:       model.stars,
      description: model.description,
      email:       model.email,
      phone:       model.phone,
      is_active:   model.active,
      images:      model.images,
      amenities:   model.amenities,
    }
  },
}

// ─── Account ──────────────────────────────────────────────────────────────────
export const AccountMapper = {
  fromDto(dto: AccountDTO): Account {
    return {
      id:               dto.id,
      email:            dto.email,
      password:         '', // never returned from API
      registrationDate: dto.created_at,
      active:           dto.is_active,
      role:             dto.role,
    }
  },

  toDto(model: Omit<Account, 'id' | 'registrationDate'>): Omit<AccountDTO, 'id' | 'created_at'> {
    return {
      email:     model.email,
      role:      model.role,
      is_active: model.active,
      password:  model.password,
    }
  },
}

// ─── Profile ──────────────────────────────────────────────────────────────────
// Profile model: { id, accountId, firstName, lastName, address, phone, photo }
export const ProfileMapper = {
  fromDto(dto: ProfileDTO): Profile {
    return {
      id:        dto.id,
      accountId: dto.account_id,
      firstName: dto.first_name,
      lastName:  dto.last_name,
      address:   dto.nationality ?? '', // DTO has no address — map nationality as fallback
      phone:     dto.phone ?? '',
      photo:     dto.photo ?? '',
    }
  },

  toDto(model: Partial<Profile>): Partial<ProfileDTO> {
    return {
      ...(model.id        !== undefined && { id:          model.id }),
      ...(model.accountId !== undefined && { account_id: model.accountId }),
      ...(model.firstName !== undefined && { first_name: model.firstName }),
      ...(model.lastName  !== undefined && { last_name:  model.lastName }),
      ...(model.phone     !== undefined && { phone:      model.phone }),
      ...(model.photo     !== undefined && { photo:      model.photo }),
    }
  },
}

// ─── Reservation ──────────────────────────────────────────────────────────────
export const ReservationMapper = {
  fromDto(dto: ReservationDTO): Reservation {
    return {
      id:               dto.id,
      accountId:        dto.account_id,
      roomId:           dto.room_id,
      hotelId:          dto.hotel_id,
      reservationDate:  dto.reservation_date,
      checkInDate:      dto.check_in_date,
      checkOutDate:     dto.check_out_date,
      numberOfNights:   dto.number_of_nights,
      totalAmount:      dto.total_amount,
      confirmationCode: dto.confirmation_code,
      status:           (dto.status as ReservationStatus) ?? ReservationStatus.PENDING,
      blockReason:      dto.block_reason ?? undefined,
    }
  },

  toDto(model: Omit<Reservation, 'id' | 'confirmationCode'>): Partial<ReservationDTO> {
    return {
      account_id:       model.accountId,
      room_id:          model.roomId,
      hotel_id:         model.hotelId,
      check_in_date:    model.checkInDate,
      check_out_date:   model.checkOutDate,
      number_of_nights: model.numberOfNights,
      total_amount:     model.totalAmount,
      status:           model.status,
      block_reason:     model.blockReason ?? null,
    }
  },
}

// ─── Offer ────────────────────────────────────────────────────────────────────
export const OfferMapper = {
  fromDto(dto: OfferDTO): Offer {
    return {
      id:           dto.id,
      hotelId:      dto.hotel_id,
      title:        dto.title,
      description:  dto.description,
      discountRate: dto.discount_rate,
      startDate:    dto.start_date,
      endDate:      dto.end_date,
      active:       dto.is_active,
      image:        dto.image ?? undefined,
    }
  },

  toDto(model: Omit<Offer, 'id'>): Omit<OfferDTO, 'id'> {
    return {
      hotel_id:      model.hotelId,
      title:         model.title,
      description:   model.description,
      discount_rate: model.discountRate,
      start_date:    model.startDate,
      end_date:      model.endDate,
      is_active:     model.active,
      image:         model.image ?? null,
    }
  },
}

// ─── Complaint ────────────────────────────────────────────────────────────────
export const ComplaintMapper = {
  fromDto(dto: ComplaintDTO): Complaint {
    return {
      id:             dto.id,
      reservationId:  dto.reservation_id,
      accountId:      dto.account_id,
      subject:        dto.subject,
      description:    dto.description,
      complaintDate:  dto.complaint_date,
      resolutionDate: dto.resolution_date ?? undefined,
      agencyResponse: dto.agency_response ?? undefined,
      status:         (dto.status as ComplaintStatus) ?? ComplaintStatus.OPEN,
    }
  },

  toDto(model: Omit<Complaint, 'id' | 'complaintDate'>): Partial<ComplaintDTO> {
    return {
      reservation_id:  model.reservationId,
      account_id:      model.accountId,
      subject:         model.subject,
      description:     model.description,
      agency_response: model.agencyResponse ?? null,
      status:          model.status,
    }
  },
}

// ─── Room ─────────────────────────────────────────────────────────────────────
// Room model: { id, hotelId, number, floor, pricePerNight, capacity, available, photos, roomTypeId, type?, description?, amenities? }
export const RoomMapper = {
  fromDto(dto: RoomDTO): Room {
    return {
      id:            dto.id,
      hotelId:       dto.hotel_id,
      number:        dto.room_number,           // DTO: room_number → Model: number
      floor:         dto.floor,
      pricePerNight: dto.price_per_night,
      capacity:      dto.capacity,
      available:     dto.is_available,          // DTO: is_available → Model: available
      photos:        dto.images ?? [],          // DTO: images → Model: photos
      roomTypeId:    dto.room_type_id,
      amenities:     dto.amenities ?? [],
    }
  },

  toDto(model: Omit<Room, 'id'>): Omit<RoomDTO, 'id'> {
    return {
      hotel_id:        model.hotelId,
      room_type_id:    model.roomTypeId,
      room_number:     model.number,
      price_per_night: model.pricePerNight,
      is_available:    model.available,
      floor:           model.floor,
      capacity:        model.capacity,
      images:          model.photos,
      amenities:       model.amenities ?? [],
    }
  },
}

// ─── Notification ─────────────────────────────────────────────────────────────
// AppNotification model: { id, accountId, message, type, sentDate, read }
export const NotificationMapper = {
  fromDto(dto: NotificationDTO): AppNotification {
    return {
      id:        dto.id,
      accountId: dto.account_id,
      message:   dto.message,                  // DTO has title+message; model has only message
      type:      dto.type as AppNotification['type'],
      sentDate:  dto.sent_at,                  // DTO: sent_at → Model: sentDate
      read:      dto.is_read,                  // DTO: is_read → Model: read
    }
  },
}

// ─── Review ───────────────────────────────────────────────────────────────────
// Review model: { id, reservationId, accountId, hotelId, rating, comment, publicationDate, visible }
export const ReviewMapper = {
  fromDto(dto: ReviewDTO): Review {
    return {
      id:              dto.id,
      reservationId:   0,                      // API DTO doesn't carry reservationId — default 0 until backend adds it
      hotelId:         dto.hotel_id,
      accountId:       dto.account_id,
      rating:          dto.rating,
      comment:         dto.comment,
      publicationDate: dto.published_at,
      visible:         dto.is_visible,
    }
  },

  toDto(model: Omit<Review, 'id' | 'publicationDate'>): Omit<ReviewDTO, 'id' | 'published_at'> {
    return {
      hotel_id:   model.hotelId,
      account_id: model.accountId,
      rating:     model.rating,
      comment:    model.comment,
      is_visible: model.visible,
    }
  },
}
