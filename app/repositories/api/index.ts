import type { IHotelRepository, HotelAvailabilityFilters } from '~/types/interfaces/IHotelRepository'
import type { IAccountRepository } from '~/types/interfaces/IAccountRepository'
import type { IReservationRepository } from '~/types/interfaces/IReservationRepository'
import type { IOfferRepository } from '~/types/interfaces/IOfferRepository'
import type { IComplaintRepository } from '~/types/interfaces/IComplaintRepository'
import type { IRoomRepository } from '~/types/interfaces/IRoomRepository'
import type { IReviewRepository } from '~/types/interfaces/IReviewRepository'
import type { INotificationRepository } from '~/types/interfaces/INotificationRepository'
import type { ISystemConfigRepository } from '~/types/interfaces/ISystemConfigRepository'
import type { IStatsRepository } from '~/types/interfaces/IStatsRepository'
import type {
  Hotel,
  Account,
  Profile,
  Reservation,
  Offer,
  Complaint,
  Room,
  RoomType,
  AppNotification,
  Review,
  SystemConfig,
  DashboardStats,
  HotelStats,
} from '~/types/models'
import type {
  HotelDTO,
  AccountDTO,
  ProfileDTO,
  ReservationDTO,
  OfferDTO,
  ComplaintDTO,
  RoomDTO,
  RoomTypeDTO,
  NotificationDTO,
  ReviewDTO,
  ApiErrorDTO,
} from '~/types/dto'
import type { ReservationStatus } from '~/types/enums/ReservationStatus'
import type { ComplaintStatus } from '~/types/enums/ComplaintStatus'
import {
  HotelMapper,
  AccountMapper,
  ProfileMapper,
  ReservationMapper,
  OfferMapper,
  ComplaintMapper,
  RoomMapper,
  RoomTypeMapper,
  ReviewMapper,
  NotificationMapper,
} from '~/mappers'
import { ReservationStatus as ReservationStatusEnum } from '~/types/enums/ReservationStatus'

function useBase() {
  return useRuntimeConfig().public.apiBase || '/api'
}

function extractErrorMessage(error: unknown, fallback: string) {
  const data = (error as { data?: ApiErrorDTO }).data
  if (!data) {
    return (error as Error)?.message || fallback
  }

  if (Array.isArray(data.message)) {
    return data.message.join(', ')
  }

  return data.message || data.error || fallback
}

async function apiFetch<T>(path: string, options?: Parameters<typeof $fetch<T>>[1]) {
  try {
    return await $fetch<T>(`${useBase()}${path}`, options)
  } catch (error: any) {
    if (error.status === 401) {
      const { logout } = useAuth()
      logout()
      navigateTo('/login')
    }
    throw new Error(extractErrorMessage(error, `Request failed: ${path}`))
  }
}

function normalizeDate(value: string) {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid date value: ${value}`)
  }
  return parsed.toISOString()
}

function differenceInNights(checkIn: string, checkOut: string) {
  const start = new Date(checkIn)
  const end = new Date(checkOut)
  const diff = end.getTime() - start.getTime()
  return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)))
}

function monthKey(date: string) {
  return date.slice(0, 7)
}

function monthLabel(key: string) {
  return new Date(`${key}-01T00:00:00.000Z`).toLocaleDateString('en-US', {
    month: 'short',
  })
}

function buildRecentMonthKeys(count: number) {
  const keys: string[] = []
  const cursor = new Date()
  cursor.setUTCDate(1)
  for (let i = count - 1; i >= 0; i -= 1) {
    const copy = new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth() - i, 1))
    keys.push(copy.toISOString().slice(0, 7))
  }
  return keys
}

export class ApiHotelRepository implements IHotelRepository {
  async getAll(): Promise<Hotel[]> {
    const dtos = await apiFetch<HotelDTO[]>('/hotels')
    return dtos.map(HotelMapper.fromDto)
  }

  async getById(id: number): Promise<Hotel | null> {
    try {
      const dto = await apiFetch<HotelDTO>(`/hotels/${id}`)
      return HotelMapper.fromDto(dto)
    } catch {
      return null
    }
  }

  async getActive(): Promise<Hotel[]> {
    const hotels = await this.getAll()
    return hotels.filter((hotel) => hotel.active)
  }

  async getFeatured(): Promise<Hotel[]> {
    const hotels = await this.getActive()
    return hotels.filter((hotel) => hotel.stars >= 5)
  }

  async getByCity(city: string): Promise<Hotel[]> {
    const hotels = await this.getAll()
    return hotels.filter((hotel) => hotel.city.toLowerCase() === city.toLowerCase())
  }

  async search(query: string): Promise<Hotel[]> {
    const needle = query.trim().toLowerCase()
    const hotels = await this.getAll()
    if (!needle) {
      return hotels
    }

    return hotels.filter((hotel) =>
      [hotel.name, hotel.city, hotel.country, hotel.description]
        .join(' ')
        .toLowerCase()
        .includes(needle),
    )
  }

  async searchAvailability(filters: HotelAvailabilityFilters): Promise<Hotel[]> {
    const params = new URLSearchParams()

    if (filters.city) params.set('city', filters.city)
    if (filters.checkIn) params.set('checkIn', filters.checkIn)
    if (filters.checkOut) params.set('checkOut', filters.checkOut)
    if (filters.guests) params.set('guests', String(filters.guests))
    if (filters.rooms) params.set('rooms', String(filters.rooms))

    const suffix = params.toString() ? `?${params.toString()}` : ''
    const dtos = await apiFetch<HotelDTO[]>(`/hotels/search/availability${suffix}`)
    return dtos.map(HotelMapper.fromDto)
  }

  async create(hotel: Omit<Hotel, 'id'>): Promise<Hotel> {
    const dto = await apiFetch<HotelDTO>('/hotels', {
      method: 'POST',
      body: HotelMapper.toCreateDto(hotel),
    })
    return HotelMapper.fromDto(dto)
  }

  async update(id: number, data: Partial<Hotel>): Promise<Hotel> {
    const dto = await apiFetch<HotelDTO>(`/hotels/${id}`, {
      method: 'PATCH',
      body: HotelMapper.toUpdateDto(data),
    })
    return HotelMapper.fromDto(dto)
  }

  async delete(id: number): Promise<void> {
    await apiFetch(`/hotels/${id}`, { method: 'DELETE' })
  }
}

export class ApiAccountRepository implements IAccountRepository {
  async getAll(): Promise<Account[]> {
    const dtos = await apiFetch<AccountDTO[]>('/accounts')
    return dtos.map(AccountMapper.fromDto)
  }

  async getById(id: number): Promise<Account | null> {
    try {
      const dto = await apiFetch<AccountDTO>(`/accounts/${id}`)
      return AccountMapper.fromDto(dto)
    } catch {
      return null
    }
  }

  async getByEmail(email: string): Promise<Account | null> {
    const accounts = await this.getAll()
    return accounts.find((account) => account.email.toLowerCase() === email.toLowerCase()) ?? null
  }

  async authenticate(email: string, password: string): Promise<Account | null> {
    try {
      const dto = await apiFetch<AccountDTO>('/auth/login', {
        method: 'POST',
        body: { email, password },
      })
      return AccountMapper.fromDto(dto)
    } catch {
      return null
    }
  }

  async create(account: Omit<Account, 'id' | 'registrationDate'>): Promise<Account> {
    const dto = await apiFetch<AccountDTO>('/auth/register', {
      method: 'POST',
      body: AccountMapper.toCreateDto(account),
    })
    return AccountMapper.fromDto(dto)
  }

  async update(id: number, data: Partial<Account>): Promise<Account> {
    const dto = await apiFetch<AccountDTO>(`/accounts/${id}`, {
      method: 'PATCH',
      body: AccountMapper.toUpdateDto(data),
    })
    return AccountMapper.fromDto(dto)
  }

  async deactivate(id: number): Promise<void> {
    await apiFetch(`/accounts/${id}`, {
      method: 'PATCH',
      body: { actif: false },
    })
  }

  async getProfile(accountId: number): Promise<Profile | null> {
    try {
      const account = await this.getById(accountId)
      const dto = await apiFetch<ProfileDTO>(`/accounts/${accountId}/profile`)
      return ProfileMapper.fromDto(dto, account ?? undefined)
    } catch {
      return null
    }
  }

  async createProfile(accountId: number, data: Partial<Profile>): Promise<Profile> {
    const account = await this.getById(accountId)
    const dto = await apiFetch<ProfileDTO>('/profiles', {
      method: 'POST',
      body: ProfileMapper.toCreateDto(accountId, data),
    })
    return ProfileMapper.fromDto(dto, account ?? undefined)
  }

  async updateProfile(accountId: number, data: Partial<Profile>): Promise<Profile> {
    const current = await this.getProfile(accountId)
    const account = await this.getById(accountId)
    if (!current) {
      return this.createProfile(accountId, data)
    }

    const dto = await apiFetch<ProfileDTO>(`/accounts/${accountId}/profile`, {
      method: 'PATCH',
      body: ProfileMapper.toUpdateDto(data),
    })
    return ProfileMapper.fromDto(dto, account ?? undefined)
  }

  async changePassword(accountId: number, oldPassword: string, newPassword: string): Promise<void> {
    await apiFetch(`/accounts/${accountId}/change-password`, {
      method: 'PATCH',
      body: { oldPassword, newPassword },
    })
  }
}

export class ApiReservationRepository implements IReservationRepository {
  async getAll(): Promise<Reservation[]> {
    const dtos = await apiFetch<ReservationDTO[]>('/reservations')
    return dtos.map(ReservationMapper.fromDto)
  }

  async getById(id: number): Promise<Reservation | null> {
    try {
      const dto = await apiFetch<ReservationDTO>(`/reservations/${id}`)
      return ReservationMapper.fromDto(dto)
    } catch {
      return null
    }
  }

  async getByAccount(accountId: number): Promise<Reservation[]> {
    const dtos = await apiFetch<ReservationDTO[]>(`/reservations?accountId=${accountId}`)
    return dtos.map(ReservationMapper.fromDto)
  }

  async getByHotel(hotelId: number): Promise<Reservation[]> {
    const reservations = await this.getAll()
    return reservations.filter((reservation) => reservation.hotelId === hotelId)
  }

  async getByStatus(status: ReservationStatus): Promise<Reservation[]> {
    const reservations = await this.getAll()
    return reservations.filter((reservation) => reservation.status === status)
  }

  async create(data: Omit<Reservation, 'id' | 'confirmationCode'>): Promise<Reservation> {
    const dto = await apiFetch<ReservationDTO>('/reservations', {
      method: 'POST',
      body: ReservationMapper.toCreateDto(data),
    })
    return ReservationMapper.fromDto(dto)
  }

  async updateStatus(id: number, status: ReservationStatus, reason?: string): Promise<Reservation> {
    const dto = await apiFetch<ReservationDTO>(`/reservations/${id}`, {
      method: 'PATCH',
      body: ReservationMapper.toUpdateDto(status, reason),
    })
    return ReservationMapper.fromDto(dto)
  }

  async delete(id: number): Promise<void> {
    await apiFetch(`/reservations/${id}`, { method: 'DELETE' })
  }
}

export class ApiSystemConfigRepository implements ISystemConfigRepository {
  async getAll(): Promise<SystemConfig[]> {
    const dtos = await apiFetch<Array<{ id: number; cle: string; valeur: string; description: string | null }>>(
      '/system-config',
    )
    return dtos.map((dto) => ({
      id: dto.id,
      key: dto.cle,
      value: dto.valeur,
      description: dto.description ?? '',
    }))
  }

  async getByKey(key: string): Promise<SystemConfig | null> {
    try {
      const dto = await apiFetch<{ id: number; cle: string; valeur: string; description: string | null }>(
        `/system-config/${encodeURIComponent(key)}`,
      )
      return {
        id: dto.id,
        key: dto.cle,
        value: dto.valeur,
        description: dto.description ?? '',
      }
    } catch {
      return null
    }
  }

  async update(key: string, value: string): Promise<SystemConfig> {
    const current = await this.getByKey(key)
    if (!current) {
      throw new Error(`System config "${key}" not found`)
    }

    const dto = await apiFetch<{ id: number; cle: string; valeur: string; description: string | null }>(
      `/system-config/${current.id}`,
      {
        method: 'PATCH',
        body: { valeur: value },
      },
    )

    return {
      id: dto.id,
      key: dto.cle,
      value: dto.valeur,
      description: dto.description ?? '',
    }
  }
}

export class ApiReviewRepository implements IReviewRepository {
  async getAll(): Promise<Review[]> {
    const dtos = await apiFetch<ReviewDTO[]>('/avis')
    return dtos.map(ReviewMapper.fromDto)
  }

  async getByHotel(hotelId: number): Promise<Review[]> {
    const dtos = await apiFetch<ReviewDTO[]>(`/avis/hotel/${hotelId}`)
    return dtos.map(ReviewMapper.fromDto)
  }

  async getByAccount(accountId: number): Promise<Review[]> {
    const dtos = await apiFetch<ReviewDTO[]>(`/avis/account/${accountId}`)
    return dtos.map(ReviewMapper.fromDto)
  }

  async create(review: Omit<Review, 'id' | 'publicationDate'>): Promise<Review> {
    const dto = await apiFetch<ReviewDTO>('/avis', {
      method: 'POST',
      body: ReviewMapper.toCreateDto(review),
    })
    return ReviewMapper.fromDto(dto)
  }

  async update(id: number, data: Partial<Review>): Promise<Review> {
    const dto = await apiFetch<ReviewDTO>(`/avis/${id}`, {
      method: 'PATCH',
      body: ReviewMapper.toUpdateDto(data),
    })
    return ReviewMapper.fromDto(dto)
  }

  async delete(id: number): Promise<void> {
    await apiFetch(`/avis/${id}`, { method: 'DELETE' })
  }
}

export class ApiNotificationRepository implements INotificationRepository {
  async getAll(): Promise<AppNotification[]> {
    const accounts = await apiFetch<AccountDTO[]>('/accounts')
    const notifications = await Promise.all(
      accounts.map((account) =>
        apiFetch<NotificationDTO[]>(`/notifications/account/${account.id}`).catch(() => []),
      ),
    )
    return notifications.flat().map(NotificationMapper.fromDto)
  }

  async getByAccount(accountId: number): Promise<AppNotification[]> {
    const dtos = await apiFetch<NotificationDTO[]>(`/notifications/account/${accountId}`)
    return dtos.map(NotificationMapper.fromDto)
  }

  async getUnread(accountId: number): Promise<AppNotification[]> {
    const notifications = await this.getByAccount(accountId)
    return notifications.filter((notification) => !notification.read)
  }

  async markAsRead(id: number): Promise<void> {
    await apiFetch(`/notifications/${id}/read`, {
      method: 'PATCH',
    })
  }

  async markAllAsRead(accountId: number): Promise<void> {
    const unread = await this.getUnread(accountId)
    await Promise.all(unread.map((notification) => this.markAsRead(notification.id)))
  }

  async create(notification: Omit<AppNotification, 'id'>): Promise<AppNotification> {
    const dto = await apiFetch<NotificationDTO>('/notifications', {
      method: 'POST',
      body: NotificationMapper.toCreateDto(notification),
    })
    return NotificationMapper.fromDto(dto)
  }

  async delete(id: number): Promise<void> {
    await apiFetch(`/notifications/${id}`, { method: 'DELETE' })
  }
}

export class ApiOfferRepository implements IOfferRepository {
  async getAll(): Promise<Offer[]> {
    const dtos = await apiFetch<OfferDTO[]>('/offres')
    return dtos.map(OfferMapper.fromDto)
  }

  async getById(id: number): Promise<Offer | null> {
    try {
      const dto = await apiFetch<OfferDTO>(`/offres/${id}`)
      return OfferMapper.fromDto(dto)
    } catch {
      return null
    }
  }

  async getActive(): Promise<Offer[]> {
    const now = new Date().toISOString()
    const offers = await this.getAll()
    return offers.filter(
      (offer) => offer.active && offer.startDate <= now && offer.endDate >= now,
    )
  }

  async getByHotel(hotelId: number): Promise<Offer[]> {
    const offers = await this.getAll()
    return offers.filter((offer) => offer.hotelId === hotelId)
  }

  async create(offer: Omit<Offer, 'id'>): Promise<Offer> {
    const dto = await apiFetch<OfferDTO>('/offres', {
      method: 'POST',
      body: OfferMapper.toCreateDto(offer),
    })
    return OfferMapper.fromDto(dto)
  }

  async update(id: number, data: Partial<Offer>): Promise<Offer> {
    const dto = await apiFetch<OfferDTO>(`/offres/${id}`, {
      method: 'PATCH',
      body: OfferMapper.toUpdateDto(data),
    })
    return OfferMapper.fromDto(dto)
  }

  async delete(id: number): Promise<void> {
    await apiFetch(`/offres/${id}`, { method: 'DELETE' })
  }
}

export class ApiComplaintRepository implements IComplaintRepository {
  async getAll(): Promise<Complaint[]> {
    const dtos = await apiFetch<ComplaintDTO[]>('/reclamations')
    return dtos.map(ComplaintMapper.fromDto)
  }

  async getById(id: number): Promise<Complaint | null> {
    try {
      const dto = await apiFetch<ComplaintDTO>(`/reclamations/${id}`)
      return ComplaintMapper.fromDto(dto)
    } catch {
      return null
    }
  }

  async getByAccount(accountId: number): Promise<Complaint[]> {
    const complaints = await this.getAll()
    return complaints.filter((complaint) => complaint.accountId === accountId)
  }

  async getByStatus(status: ComplaintStatus): Promise<Complaint[]> {
    const complaints = await this.getAll()
    return complaints.filter((complaint) => complaint.status === status)
  }

  async create(data: Omit<Complaint, 'id' | 'complaintDate'>): Promise<Complaint> {
    const dto = await apiFetch<ComplaintDTO>('/reclamations', {
      method: 'POST',
      body: ComplaintMapper.toCreateDto(data),
    })
    return ComplaintMapper.fromDto(dto)
  }

  async updateStatus(id: number, status: ComplaintStatus, response?: string): Promise<Complaint> {
    const dto = await apiFetch<ComplaintDTO>(`/reclamations/${id}`, {
      method: 'PATCH',
      body: ComplaintMapper.toUpdateDto(status, response),
    })
    return ComplaintMapper.fromDto(dto)
  }

  async delete(id: number): Promise<void> {
    await apiFetch(`/reclamations/${id}`, { method: 'DELETE' })
  }
}

export class ApiRoomRepository implements IRoomRepository {
  async getAll(): Promise<Room[]> {
    const dtos = await apiFetch<RoomDTO[]>('/chambres')
    return dtos.map(RoomMapper.fromDto)
  }

  async getByHotel(hotelId: number): Promise<Room[]> {
    const dtos = await apiFetch<RoomDTO[]>(`/chambres?hotelId=${hotelId}`)
    return dtos.map(RoomMapper.fromDto)
  }

  async getById(id: number): Promise<Room | null> {
    try {
      const dto = await apiFetch<RoomDTO>(`/chambres/${id}`)
      return RoomMapper.fromDto(dto)
    } catch {
      return null
    }
  }

  async getAvailable(hotelId: number, _checkIn: string, _checkOut: string): Promise<Room[]> {
    const rooms = await this.getByHotel(hotelId)
    return rooms.filter((room) => room.available)
  }

  async getRoomTypes(): Promise<RoomType[]> {
    const dtos = await apiFetch<RoomTypeDTO[]>('/types-chambre')
    return dtos.map(RoomTypeMapper.fromDto)
  }

  async create(room: Omit<Room, 'id'>): Promise<Room> {
    const dto = await apiFetch<RoomDTO>('/chambres', {
      method: 'POST',
      body: RoomMapper.toCreateDto(room),
    })
    return RoomMapper.fromDto(dto)
  }

  async update(id: number, data: Partial<Room>): Promise<Room> {
    const dto = await apiFetch<RoomDTO>(`/chambres/${id}`, {
      method: 'PATCH',
      body: RoomMapper.toUpdateDto(data),
    })
    return RoomMapper.fromDto(dto)
  }

  async delete(id: number): Promise<void> {
    await apiFetch(`/chambres/${id}`, { method: 'DELETE' })
  }
}

export class ApiStatsRepository implements IStatsRepository {
  async getDashboardStats(): Promise<DashboardStats> {
    const [dashboard, hotels, reservations, offers, accounts, complaints] = await Promise.all([
      apiFetch<{ totalReservations: number; totalRevenue: number; activeHotels: number }>('/stats/dashboard'),
      apiFetch<HotelDTO[]>('/hotels'),
      apiFetch<ReservationDTO[]>('/reservations'),
      apiFetch<OfferDTO[]>('/offres'),
      apiFetch<AccountDTO[]>('/accounts'),
      apiFetch<ComplaintDTO[]>('/reclamations').catch(() => []),
    ])

    const rooms = hotels.flatMap((hotel) => hotel.chambres ?? [])
    const monthKeys = buildRecentMonthKeys(6)
    const revenueByMonth = monthKeys.map((key) => {
      const revenue = reservations
        .filter((reservation) => monthKey(reservation.dateCreation) === key)
        .reduce((sum, reservation) => sum + reservation.montantTotal, 0)

      return { month: monthLabel(key), revenue }
    })

    const reservationStatusMap = new Map<string, number>()
    reservations.forEach((reservation) => {
      const status = ReservationMapper.fromDto(reservation).status
      reservationStatusMap.set(status, (reservationStatusMap.get(status) ?? 0) + 1)
    })

    const reservationsByStatus = Array.from(reservationStatusMap.entries()).map(([status, count]) => ({
      status,
      count,
    }))

    const occupancyByMonth = monthKeys.map((key) => {
      const bookedNights = reservations
        .filter((reservation) => monthKey(reservation.dateArrivee) === key)
        .reduce((sum, reservation) => sum + reservation.nombreNuits, 0)

      const date = new Date(`${key}-01T00:00:00.000Z`)
      const daysInMonth = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate()
      const totalRoomNights = Math.max(rooms.length, 1) * daysInMonth
      const rate = Math.min(100, Math.round((bookedNights / totalRoomNights) * 100))

      return { month: monthLabel(key), rate }
    })

    const averageOccupancy =
      occupancyByMonth.length > 0
        ? Math.round(
            occupancyByMonth.reduce((sum, month) => sum + month.rate, 0) / occupancyByMonth.length,
          )
        : 0

    const now = new Date().toISOString()
    const activeOffers = offers.filter(
      (offer) => offer.active && offer.dateDebut <= now && offer.dateFin >= now,
    ).length
    const pendingReservations = reservations.filter(
      (reservation) => reservation.statut === 'EN_ATTENTE',
    ).length

    return {
      totalHotels: dashboard.activeHotels || hotels.filter((hotel) => hotel.actif).length,
      totalReservations: dashboard.totalReservations,
      totalRevenue: dashboard.totalRevenue,
      averageOccupancy,
      totalUsers: accounts.length,
      totalComplaints: complaints.length,
      pendingReservations,
      activeOffers,
      revenueByMonth,
      reservationsByStatus,
      occupancyByMonth,
    }
  }

  async getHotelStats(hotelId: number, start: string, end: string): Promise<HotelStats> {
    const [reservations, rooms] = await Promise.all([
      apiFetch<ReservationDTO[]>('/reservations'),
      apiFetch<RoomDTO[]>(`/chambres?hotelId=${hotelId}`),
    ])

    const startIso = normalizeDate(start)
    const endIso = normalizeDate(end)
    const filtered = reservations.filter(
      (reservation) =>
        reservation.chambre?.hotelId === hotelId &&
        reservation.dateArrivee >= startIso &&
        reservation.dateDepart <= endIso,
    )

    const totalRevenue = filtered.reduce((sum, reservation) => sum + reservation.montantTotal, 0)
    const totalReservations = filtered.length
    const totalBookedNights = filtered.reduce((sum, reservation) => sum + reservation.nombreNuits, 0)
    const availableNights = Math.max(rooms.length, 1) * Math.max(differenceInNights(startIso, endIso), 1)
    const occupancyRate = Math.min(100, Math.round((totalBookedNights / availableNights) * 100))

    return {
      hotelId,
      periodStart: startIso,
      periodEnd: endIso,
      totalReservations,
      totalRevenue,
      occupancyRate,
    }
  }
}
