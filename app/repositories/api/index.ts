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
 * BASE_URL is read from runtime config — set NUXT_PUBLIC_API_BASE in .env
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type { IHotelRepository } from '~/types/interfaces/IHotelRepository'
import type { IAccountRepository } from '~/types/interfaces/IAccountRepository'
import type { IReservationRepository } from '~/types/interfaces/IReservationRepository'
import type { IOfferRepository } from '~/types/interfaces/IOfferRepository'
import type { IComplaintRepository } from '~/types/interfaces/IComplaintRepository'
import type { IRoomRepository } from '~/types/interfaces/IRoomRepository'

import type { Hotel, Account, Profile, Reservation, Offer, Complaint, Room, RoomType } from '~/types/models'
import type { HotelDTO, AccountDTO, ReservationDTO, OfferDTO, ComplaintDTO, RoomDTO } from '~/types/dto'
import type { ReservationStatus } from '~/types/enums/ReservationStatus'
import type { ComplaintStatus } from '~/types/enums/ComplaintStatus'

import {
  HotelMapper, AccountMapper, ProfileMapper,
  ReservationMapper, OfferMapper, ComplaintMapper, RoomMapper
} from '~/mappers'

// ---------------------------------------------------------------------------
// Helper — resolve base URL from Nuxt runtime config
// ---------------------------------------------------------------------------
function useBase(): string {
  // Configured to point to the shared ngrok endpoint
  return 'https://4126-41-224-5-209.ngrok-free.app/api'
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
      const dtos = await $fetch<AccountDTO[]>(`${this.base}?email=${encodeURIComponent(email)}`)
      const list = Array.isArray(dtos) ? dtos : []
      return list.length > 0 ? AccountMapper.fromDto(list[0]!) : null
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
    const dto = await $fetch<AccountDTO>(`${useBase()}/auth/register`, {
      method: 'POST',
      body: AccountMapper.toDto(account),
    })
    return AccountMapper.fromDto(dto)
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
// ApiOfferRepository
// ============================================================================
export class ApiOfferRepository implements IOfferRepository {
  private get base() { return `${useBase()}/offers` }

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
    const dtos = await $fetch<OfferDTO[]>(`${this.base}?is_active=true`)
    return dtos.map(OfferMapper.fromDto)
  }

  async getByHotel(hotelId: number): Promise<Offer[]> {
    const dtos = await $fetch<OfferDTO[]>(`${this.base}?hotel_id=${hotelId}`)
    return dtos.map(OfferMapper.fromDto)
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
  private get base() { return `${useBase()}/complaints` }

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
  private get base() { return `${useBase()}/rooms` }

  async getAll(): Promise<Room[]> {
    const dtos = await $fetch<RoomDTO[]>(this.base)
    return dtos.map(RoomMapper.fromDto)
  }

  async getByHotel(hotelId: number): Promise<Room[]> {
    const dtos = await $fetch<RoomDTO[]>(`${this.base}?hotel_id=${hotelId}`)
    return dtos.map(RoomMapper.fromDto)
  }

  async getById(id: number): Promise<Room | null> {
    try {
      const dto = await $fetch<RoomDTO>(`${this.base}/${id}`)
      return RoomMapper.fromDto(dto)
    } catch { return null }
  }

  async getAvailable(hotelId: number, checkIn: string, checkOut: string): Promise<Room[]> {
    const dtos = await $fetch<RoomDTO[]>(`${this.base}?hotel_id=${hotelId}&available=true`)
    return dtos.map(RoomMapper.fromDto)
  }

  async getRoomTypes(): Promise<RoomType[]> {
    try {
      return await $fetch<RoomType[]>(`${useBase()}/room-types`)
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
