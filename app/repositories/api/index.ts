/**
 * ─── API Repositories (Admin) ────────────────────────────────────────────────
 *
 * These implement the exact same IRepository interfaces as the Mock repos.
 * They use DTOs + Mappers to convert API responses to domain models.
 *
 * To switch from Mock → API:
 *   new HotelService(new ApiHotelRepository())
 *   or set NUXT_PUBLIC_USE_API=true and the factory picks the right impl.
 *
 * All methods use $fetch (Nuxt's isomorphic HTTP client).
 * BASE_URL points to the local Nuxt proxy to avoid browser CORS issues.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type { IHotelRepository } from '~/types/interfaces/IHotelRepository'
import type { IAccountRepository } from '~/types/interfaces/IAccountRepository'
import type { IReservationRepository } from '~/types/interfaces/IReservationRepository'
import type { IOfferRepository } from '~/types/interfaces/IOfferRepository'
import type { IComplaintRepository } from '~/types/interfaces/IComplaintRepository'
import type { IRoomRepository } from '~/types/interfaces/IRoomRepository'
import type { IReviewRepository } from '~/types/interfaces/IReviewRepository'
import type { INotificationRepository } from '~/types/interfaces/INotificationRepository'
import type { ISystemConfigRepository } from '~/types/interfaces/ISystemConfigRepository'
import type { SystemConfig } from '~/types/models'

import type { Hotel, Account, Profile, Reservation, Offer, Complaint, Room, RoomType, Review, AppNotification } from '~/types/models'
import type { HotelDTO, AccountDTO, ReservationDTO, OfferDTO, ComplaintDTO, RoomDTO, ReviewDTO, NotificationDTO } from '~/types/dto'
import type { ReservationStatus } from '~/types/enums/ReservationStatus'
import type { ComplaintStatus } from '~/types/enums/ComplaintStatus'

import {
  HotelMapper, AccountMapper, ProfileMapper,
  ReservationMapper, OfferMapper, ComplaintMapper, RoomMapper,
  ReviewMapper, NotificationMapper
} from '~/mappers'

// ---------------------------------------------------------------------------
// Helper — resolve the same-origin API base from Nuxt runtime config
// ---------------------------------------------------------------------------
function useBase(): string {
  return useRuntimeConfig().public.apiBase || '/api'
}

// ============================================================================
// ApiHotelRepository
// ============================================================================
export class ApiHotelRepository implements IHotelRepository {
  private get base() { return `${useBase()}/hotels` }

  async getAll(): Promise<Hotel[]> {
    const dtos = await $fetch<HotelDTO[]>(this.base)
    return dtos.map(HotelMapper.fromDto)
  }

  async getById(id: number): Promise<Hotel | null> {
    try {
      const dto = await $fetch<HotelDTO>(`${this.base}/${id}`)
      return HotelMapper.fromDto(dto)
    } catch { return null }
  }

  async getActive(): Promise<Hotel[]> {
    const dtos = await $fetch<HotelDTO[]>(`${this.base}?is_active=true`)
    return dtos.map(HotelMapper.fromDto)
  }

  async getFeatured(): Promise<Hotel[]> {
    const dtos = await $fetch<HotelDTO[]>(`${this.base}?stars=5&is_active=true`)
    return dtos.map(HotelMapper.fromDto)
  }

  async getByCity(city: string): Promise<Hotel[]> {
    const dtos = await $fetch<HotelDTO[]>(`${this.base}?city=${encodeURIComponent(city)}`)
    return dtos.map(HotelMapper.fromDto)
  }

  async search(query: string): Promise<Hotel[]> {
    const dtos = await $fetch<HotelDTO[]>(`${this.base}?search=${encodeURIComponent(query)}`)
    return dtos.map(HotelMapper.fromDto)
  }

  async create(hotel: Omit<Hotel, 'id'>): Promise<Hotel> {
    const dto = await $fetch<HotelDTO>(this.base, {
      method: 'POST',
      body: HotelMapper.toDto(hotel),
    })
    return HotelMapper.fromDto(dto)
  }

  async update(id: number, data: Partial<Hotel>): Promise<Hotel> {
    const dto = await $fetch<HotelDTO>(`${this.base}/${id}`, {
      method: 'PATCH',
      body: HotelMapper.toDto(data as Hotel),
    })
    return HotelMapper.fromDto(dto)
  }

  async delete(id: number): Promise<void> {
    await $fetch(`${this.base}/${id}`, { method: 'DELETE' })
  }
}

// ============================================================================
// ApiAccountRepository
// ============================================================================
export class ApiAccountRepository implements IAccountRepository {
  private get base() { return `${useBase()}/accounts` }

  async getAll(): Promise<Account[]> {
    const dtos = await $fetch<AccountDTO[]>(this.base)
    return dtos.map(AccountMapper.fromDto)
  }

  async getById(id: number): Promise<Account | null> {
    try {
      const dto = await $fetch<AccountDTO>(`${this.base}/${id}`)
      return AccountMapper.fromDto(dto)
    } catch { return null }
  }

  async getByEmail(email: string): Promise<Account | null> {
    try {
      const raw = await $fetch<AccountDTO[] | AccountDTO>(`${this.base}?email=${encodeURIComponent(email)}`)
      const list = Array.isArray(raw) ? raw : [raw]
      const found = list.find(acc => acc?.email?.toLowerCase() === email.toLowerCase())
      return found ? AccountMapper.fromDto(found) : null
    } catch { return null }
  }

  async authenticate(email: string, password: string): Promise<Account | null> {
    try {
      const dto = await $fetch<AccountDTO>(`${useBase()}/auth/login`, {
        method: 'POST',
        body: { email, password },
      })
      return AccountMapper.fromDto(dto)
    } catch { return null }
  }

  async create(account: Omit<Account, 'id' | 'registrationDate'>): Promise<Account> {
    // Backend currently expects French field names (motDePasse, actif)
    // while legacy frontend payload uses (password, is_active, role).
    // Try backend-native payload first, then fallback for compatibility.
    try {
      const dto = await $fetch<AccountDTO>(`${useBase()}/auth/register`, {
        method: 'POST',
        body: {
          email: account.email,
          motDePasse: account.password,
          actif: account.active,
        },
      })
      return AccountMapper.fromDto(dto)
    }
    catch {
      const dto = await $fetch<AccountDTO>(`${useBase()}/auth/register`, {
        method: 'POST',
        body: AccountMapper.toDto(account),
      })
      return AccountMapper.fromDto(dto)
    }
  }

  async update(id: number, data: Partial<Account>): Promise<Account> {
    const dto = await $fetch<AccountDTO>(`${this.base}/${id}`, {
      method: 'PATCH',
      body: data,
    })
    return AccountMapper.fromDto(dto)
  }

  async deactivate(id: number): Promise<void> {
    await $fetch(`${this.base}/${id}`, {
      method: 'PATCH',
      body: { is_active: false },
    })
  }

  async getProfile(accountId: number): Promise<Profile | null> {
    try {
      const dto = await $fetch(`${this.base}/${accountId}/profile`)
      return ProfileMapper.fromDto(dto as any)
    } catch { return null }
  }

  async updateProfile(accountId: number, data: Partial<Profile>): Promise<Profile> {
    const dto = await $fetch(`${this.base}/${accountId}/profile`, {
      method: 'PATCH',
      body: ProfileMapper.toDto(data),
    })
    return ProfileMapper.fromDto(dto as any)
  }
}

// ============================================================================
// ApiReservationRepository
// ============================================================================
export class ApiReservationRepository implements IReservationRepository {
  private get base() { return `${useBase()}/reservations` }

  async getAll(): Promise<Reservation[]> {
    const dtos = await $fetch<ReservationDTO[]>(this.base)
    return dtos.map(ReservationMapper.fromDto)
  }

  async getById(id: number): Promise<Reservation | null> {
    try {
      const dto = await $fetch<ReservationDTO>(`${this.base}/${id}`)
      return ReservationMapper.fromDto(dto)
    } catch { return null }
  }

  async getByAccount(accountId: number): Promise<Reservation[]> {
    const dtos = await $fetch<ReservationDTO[]>(`${this.base}?account_id=${accountId}`)
    return dtos.map(ReservationMapper.fromDto)
  }

  async getByHotel(hotelId: number): Promise<Reservation[]> {
    const dtos = await $fetch<ReservationDTO[]>(`${this.base}?hotel_id=${hotelId}`)
    return dtos.map(ReservationMapper.fromDto)
  }

  async getByStatus(status: ReservationStatus): Promise<Reservation[]> {
    const dtos = await $fetch<ReservationDTO[]>(`${this.base}?status=${status}`)
    return dtos.map(ReservationMapper.fromDto)
  }

  async create(data: Omit<Reservation, 'id' | 'confirmationCode'>): Promise<Reservation> {
    const dto = await $fetch<ReservationDTO>(this.base, {
      method: 'POST',
      body: ReservationMapper.toDto(data),
    })
    return ReservationMapper.fromDto(dto)
  }

  async updateStatus(id: number, status: ReservationStatus, reason?: string): Promise<Reservation> {
    const dto = await $fetch<ReservationDTO>(`${this.base}/${id}/status`, {
      method: 'PATCH',
      body: { status, block_reason: reason ?? null },
    })
    return ReservationMapper.fromDto(dto)
  }

  async delete(id: number): Promise<void> {
    await $fetch(`${this.base}/${id}`, { method: 'DELETE' })
  }
}

// ============================================================================
// ApiSystemConfigRepository
// ============================================================================
export class ApiSystemConfigRepository implements ISystemConfigRepository {
  private get base() { return `${useBase()}/system-config` }

  async getAll(): Promise<SystemConfig[]> {
    const dtos = await $fetch<any[]>(this.base)
    return dtos.map(d => ({ id: d.id, key: d.cle, value: d.valeur, description: d.description }))
  }

  async getByKey(key: string): Promise<SystemConfig | null> {
    try {
      const dto = await $fetch<any>(`${this.base}/${key}`)
      return { id: dto.id, key: dto.cle, value: dto.valeur, description: dto.description }
    } catch { return null }
  }

  async update(key: string, value: string): Promise<SystemConfig> {
    // Backend updates by id, but since key is unique, perhaps find by key first
    // For simplicity, assume update by key works if backend supports it
    const dto = await $fetch<any>(`${this.base}/${key}`, {
      method: 'PATCH',
      body: { valeur: value },
    })
    return { id: dto.id, key: dto.cle, value: dto.valeur, description: dto.description }
  }
}

// ============================================================================
// ApiReviewRepository
// ============================================================================
export class ApiReviewRepository implements IReviewRepository {
  private get base() { return `${useBase()}/avis` }

  async getAll(): Promise<Review[]> {
    const dtos = await $fetch<any[]>(this.base)
    return dtos.map(ReviewMapper.fromDto)
  }

  async getByHotel(hotelId: number): Promise<Review[]> {
    try {
      const dtos = await $fetch<any[]>(`${this.base}/hotel/${hotelId}`)
      return dtos.map(ReviewMapper.fromDto)
    } catch {
      // Some backend builds don't expose /avis/hotel/:id.
      // Fallback to all reviews and filter locally.
      const all = await this.getAll()
      return all.filter(r => r.hotelId === hotelId)
    }
  }

  async getByAccount(accountId: number): Promise<Review[]> {
    try {
      const dtos = await $fetch<any[]>(`${this.base}/account/${accountId}`)
      return dtos.map(ReviewMapper.fromDto)
    } catch {
      const all = await this.getAll()
      return all.filter(r => r.accountId === accountId)
    }
  }

  async create(review: Omit<Review, 'id' | 'publicationDate'>): Promise<Review> {
    const dto = await $fetch<any>(this.base, {
      method: 'POST',
      body: ReviewMapper.toDto(review),
    })
    return ReviewMapper.fromDto(dto)
  }

  async update(id: number, data: Partial<Review>): Promise<Review> {
    const dto = await $fetch<any>(`${this.base}/${id}`, {
      method: 'PATCH',
      body: ReviewMapper.toDto(data as Review),
    })
    return ReviewMapper.fromDto(dto)
  }

  async delete(id: number): Promise<void> {
    await $fetch(`${this.base}/${id}`, { method: 'DELETE' })
  }
}

// ============================================================================
// ApiNotificationRepository
// ============================================================================
export class ApiNotificationRepository implements INotificationRepository {
  private get base() { return `${useBase()}/notifications` }

  async getAll(): Promise<AppNotification[]> {
    const dtos = await $fetch<NotificationDTO[]>(this.base)
    return dtos.map(NotificationMapper.fromDto)
  }

  async getByAccount(accountId: number): Promise<AppNotification[]> {
    const dtos = await $fetch<NotificationDTO[]>(`${this.base}/account/${accountId}`)
    return dtos.map(NotificationMapper.fromDto)
  }

  async getUnread(accountId: number): Promise<AppNotification[]> {
    // TODO: backend doesn't have this endpoint, filter on frontend
    const all = await this.getByAccount(accountId)
    return all.filter(n => !n.read)
  }

  async markAsRead(id: number): Promise<void> {
    await $fetch(`${this.base}/${id}/read`, {
      method: 'PATCH',
    })
  }

  async markAllAsRead(accountId: number): Promise<void> {
    // TODO: backend doesn't have this endpoint
    // For now, get unread and mark each
    const unread = await this.getUnread(accountId)
    await Promise.all(unread.map(n => this.markAsRead(n.id)))
  }

  async create(notification: Omit<AppNotification, 'id'>): Promise<AppNotification> {
    // TODO: backend doesn't have create endpoint
    throw new Error('Create notification not implemented')
  }

  async delete(id: number): Promise<void> {
    await $fetch(`${this.base}/${id}`, { method: 'DELETE' })
  }
}

// ============================================================================
// ApiOfferRepository
// ============================================================================
export class ApiOfferRepository implements IOfferRepository {
  private get base() { return `${useBase()}/offres` }

  async getAll(): Promise<Offer[]> {
    const dtos = await $fetch<OfferDTO[]>(this.base)
    return dtos.map(OfferMapper.fromDto)
  }

  async getById(id: number): Promise<Offer | null> {
    try {
      const dto = await $fetch<OfferDTO>(`${this.base}/${id}`)
      return OfferMapper.fromDto(dto)
    } catch { return null }
  }

  async getActive(): Promise<Offer[]> {
    const dtos = await $fetch<OfferDTO[]>(this.base)
    return dtos.map(OfferMapper.fromDto).filter(o => o.active)
  }

  async getByHotel(hotelId: number): Promise<Offer[]> {
    const dtos = await $fetch<OfferDTO[]>(`${this.base}?hotelId=${hotelId}`)
    return dtos.map(OfferMapper.fromDto).filter(o => o.hotelId === hotelId)
  }

  async create(offer: Omit<Offer, 'id'>): Promise<Offer> {
    const dto = await $fetch<OfferDTO>(this.base, {
      method: 'POST',
      body: OfferMapper.toDto(offer),
    })
    return OfferMapper.fromDto(dto)
  }

  async update(id: number, data: Partial<Offer>): Promise<Offer> {
    const dto = await $fetch<OfferDTO>(`${this.base}/${id}`, {
      method: 'PATCH',
      body: OfferMapper.toDto(data as Offer),
    })
    return OfferMapper.fromDto(dto)
  }

  async delete(id: number): Promise<void> {
    await $fetch(`${this.base}/${id}`, { method: 'DELETE' })
  }
}

// ============================================================================
// ApiComplaintRepository
// ============================================================================
export class ApiComplaintRepository implements IComplaintRepository {
  private get base() { return `${useBase()}/reclamations` }

  async getAll(): Promise<Complaint[]> {
    const dtos = await $fetch<ComplaintDTO[]>(this.base)
    return dtos.map(ComplaintMapper.fromDto)
  }

  async getById(id: number): Promise<Complaint | null> {
    try {
      const dto = await $fetch<ComplaintDTO>(`${this.base}/${id}`)
      return ComplaintMapper.fromDto(dto)
    } catch { return null }
  }

  async getByAccount(accountId: number): Promise<Complaint[]> {
    const dtos = await $fetch<ComplaintDTO[]>(`${this.base}?account_id=${accountId}`)
    return dtos.map(ComplaintMapper.fromDto)
  }

  async getByStatus(status: ComplaintStatus): Promise<Complaint[]> {
    const dtos = await $fetch<ComplaintDTO[]>(`${this.base}?status=${status}`)
    return dtos.map(ComplaintMapper.fromDto)
  }

  async create(data: Omit<Complaint, 'id' | 'complaintDate'>): Promise<Complaint> {
    const dto = await $fetch<ComplaintDTO>(this.base, {
      method: 'POST',
      body: ComplaintMapper.toDto(data),
    })
    return ComplaintMapper.fromDto(dto)
  }

  async updateStatus(id: number, status: ComplaintStatus, agencyResponse?: string): Promise<Complaint> {
    const dto = await $fetch<ComplaintDTO>(`${this.base}/${id}/status`, {
      method: 'PATCH',
      body: { status, agency_response: agencyResponse ?? null },
    })
    return ComplaintMapper.fromDto(dto)
  }

  async delete(id: number): Promise<void> {
    await $fetch(`${this.base}/${id}`, { method: 'DELETE' })
  }
}

// ============================================================================
// ApiRoomRepository
// ============================================================================
export class ApiRoomRepository implements IRoomRepository {
  private get base() { return `${useBase()}/chambres` }

  async getAll(): Promise<Room[]> {
    const dtos = await $fetch<RoomDTO[]>(this.base)
    return dtos.map(RoomMapper.fromDto)
  }

  async getByHotel(hotelId: number): Promise<Room[]> {
    const dtos = await $fetch<RoomDTO[]>(`${this.base}?hotelId=${hotelId}`)
    return dtos.map(RoomMapper.fromDto)
  }

  async getById(id: number): Promise<Room | null> {
    try {
      const dto = await $fetch<RoomDTO>(`${this.base}/${id}`)
      return RoomMapper.fromDto(dto)
    } catch { return null }
  }

  async getAvailable(hotelId: number, checkIn: string, checkOut: string): Promise<Room[]> {
    const rooms = await this.getByHotel(hotelId)
    return rooms.filter(r => r.available)
  }

  async getRoomTypes(): Promise<RoomType[]> {
    try {
      return await $fetch<RoomType[]>(`${useBase()}/types-chambre`)
    } catch { return [] }
  }

  async create(room: Omit<Room, 'id'>): Promise<Room> {
    const dto = await $fetch<RoomDTO>(this.base, {
      method: 'POST',
      body: RoomMapper.toDto(room),
    })
    return RoomMapper.fromDto(dto)
  }

  async update(id: number, data: Partial<Room>): Promise<Room> {
    const dto = await $fetch<RoomDTO>(`${this.base}/${id}`, {
      method: 'PATCH',
      body: data as Partial<RoomDTO>,
    })
    return RoomMapper.fromDto(dto)
  }

  async delete(id: number): Promise<void> {
    await $fetch(`${this.base}/${id}`, { method: 'DELETE' })
  }
}
