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
    const name = dto.name ?? dto.nom ?? 'Unknown Hotel'
    const address = dto.address ?? dto.adresse ?? ''
    const city = dto.city ?? dto.ville ?? ''
    const country = dto.country ?? dto.pays ?? ''
    const stars = dto.stars ?? dto.etoiles ?? 0
    const description = dto.description ?? ''
    const phone = dto.phone ?? dto.telephone ?? ''
    const active = dto.is_active ?? dto.actif ?? false

    return {
      id:          dto.id,
      name,
      address,
      city,
      country,
      stars,
      description,
      email:       dto.email,
      phone,
      active,
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
    const registrationDate = dto.created_at ?? dto.dateInscription ?? new Date().toISOString()
    const active = dto.is_active ?? dto.actif ?? true
    const role = dto.role ?? 'client'

    return {
      id:               dto.id,
      email:            dto.email,
      password:         '', // never returned from API
      registrationDate,
      active,
      role,
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
      id:                       dto.id,
      accountId:                dto.account_id,
      firstName:                dto.first_name,
      lastName:                 dto.last_name,
      address:                  dto.nationality ?? '', // DTO has no address — map nationality as fallback
      phone:                    dto.phone ?? '',
      photo:                    dto.photo ?? '',
      notificationsReservation: dto.notifications_reservation ?? true,
      notificationsPromotion:   dto.notifications_promotion ?? false,
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
    const hotelId = dto.hotel_id ?? dto.hotelId ?? 0
    const title = dto.title ?? dto.titre ?? ''
    const description = dto.description ?? ''
    const discountRate = dto.discount_rate ?? dto.tauxRemise ?? 0
    const startDate = dto.start_date ?? dto.dateDebut ?? ''
    const endDate = dto.end_date ?? dto.dateFin ?? ''
    const active = dto.is_active ?? dto.active ?? false

    return {
      id:           dto.id,
      hotelId,
      title,
      description,
      discountRate,
      startDate,
      endDate,
      active,
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
  fromDto(dto: any): Complaint {
    return {
      id:             dto.id,
      reservationId:  dto.reservationId || dto.reservation_id,
      accountId:      dto.accountId || dto.account_id || 0, // backend doesn't have accountId directly
      subject:        dto.subject || dto.sujet,
      description:    dto.description,
      complaintDate:  dto.complaint_date || dto.dateOuverture,
      resolutionDate: (dto.resolution_date || dto.dateResolution) ?? undefined,
      agencyResponse: (dto.agency_response || dto.reponseAgence) ?? undefined,
      status:         (dto.status as ComplaintStatus) ?? ComplaintStatus.OPEN,
    }
  },

  toDto(model: Omit<Complaint, 'id' | 'complaintDate'>): any {
    return {
      reservationId:  model.reservationId,
      sujet:          model.subject,
      description:    model.description,
      reponseAgence:  model.agencyResponse ?? null,
      statut:         model.status,
    }
  },
}

// ─── Room ─────────────────────────────────────────────────────────────────────
// Room model: { id, hotelId, number, floor, pricePerNight, capacity, available, photos, roomTypeId, type?, description?, amenities? }
export const RoomMapper = {
  fromDto(dto: RoomDTO): Room {
    const hotelId = dto.hotel_id ?? dto.hotelId ?? 0
    const number = dto.room_number ?? dto.numero ?? ''
    const floor = dto.floor ?? dto.etage ?? 0
    const pricePerNight = dto.price_per_night ?? dto.prixParNuit ?? 0
    const available = dto.is_available ?? dto.disponible ?? false
    const roomTypeId = dto.room_type_id ?? dto.typeChambreId ?? 0

    return {
      id:            dto.id,
      hotelId,
      number,           // DTO: room_number → Model: number
      floor,
      pricePerNight,
      capacity:      dto.capacity,
      available,          // DTO: is_available → Model: available
      photos:        dto.images ?? [],          // DTO: images → Model: photos
      roomTypeId,
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
  fromDto(dto: any): Review {
    return {
      id:              dto.id,
      reservationId:   dto.reservationId || dto.reservation?.id || 0,
      hotelId:         dto.hotel_id || dto.reservation?.hotelId || dto.reservation?.hotel_id || 0,
      accountId:       dto.account_id || dto.reservation?.accountId || dto.reservation?.account_id || 0,
      rating:          dto.rating || dto.note,
      comment:         dto.comment || dto.commentaire,
      publicationDate: dto.published_at || dto.datePublication,
      visible:         dto.is_visible || dto.valide,
    }
  },

  toDto(model: Omit<Review, 'id' | 'publicationDate'>): any {
    return {
      reservationId: model.reservationId,
      note:          model.rating,
      commentaire:   model.comment,
      valide:        model.visible,
    }
  },
}
