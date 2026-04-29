import type {
  HotelDTO,
  AccountDTO,
  PaymentMethodDTO,
  ProfileDTO,
  ReservationDTO,
  OfferDTO,
  ComplaintDTO,
  RoomDTO,
  RoomTypeDTO,
  NotificationDTO,
  ReviewDTO,
} from '~/types/dto'
import type {
  Hotel,
  Account,
  PaymentMethod,
  Profile,
  Reservation,
  Offer,
  Complaint,
  Room,
  RoomType,
  AppNotification,
  Review,
} from '~/types/models'
import { ReservationStatus } from '~/types/enums/ReservationStatus'
import { ComplaintStatus } from '~/types/enums/ComplaintStatus'
import { NotificationType } from '~/types/enums/NotificationType'

const hotelFallbackImages = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200',
]

function mapAccountRole(role?: string | null): 'client' | 'admin' {
  return String(role || '').toUpperCase() === 'ADMIN' ? 'admin' : 'client'
}

function mapAuthProvider(provider?: string | null): 'local' | 'google' {
  return String(provider || '').toUpperCase() === 'GOOGLE' ? 'google' : 'local'
}

function normalizeDateInput(date?: string | null) {
  if (!date) return ''
  return date.slice(0, 10)
}

function summarizePaymentMethod(methods?: PaymentMethod[]) {
  const primary = methods?.find(method => method.isDefault) ?? methods?.[0]
  return primary ? `${primary.brand.toUpperCase()} ending in ${primary.last4}` : ''
}

function normalizeAuthorName(authorName?: string | null) {
  const value = (authorName ?? '').trim()
  if (!value) return undefined

  const lowered = value.toLowerCase()
  if (
    lowered === 'undefined' ||
    lowered === 'undefined undefined' ||
    lowered === 'null' ||
    lowered === 'null null'
  ) {
    return undefined
  }

  return value
}

function fallbackHotelImages(id: number) {
  return [hotelFallbackImages[id % hotelFallbackImages.length]]
}

function defaultHotelAmenities(): string[] {
  return ['Wi-Fi', 'Breakfast', 'Room service', 'Air conditioning']
}

function mapReservationStatus(status?: string | null): ReservationStatus {
  switch (status) {
    case 'CONFIRMEE':
      return ReservationStatus.CONFIRMED
    case 'BLOQUEE':
      return ReservationStatus.BLOCKED
    case 'ANNULEE':
      return ReservationStatus.CANCELLED
    case 'REFUSEE':
      return ReservationStatus.REFUSED
    case 'TERMINEE':
      return ReservationStatus.COMPLETED
    case 'EN_ATTENTE':
    default:
      return ReservationStatus.PENDING
  }
}

function toReservationStatus(status?: ReservationStatus) {
  switch (status) {
    case ReservationStatus.CONFIRMED:
      return 'CONFIRMEE'
    case ReservationStatus.BLOCKED:
      return 'BLOQUEE'
    case ReservationStatus.CANCELLED:
      return 'ANNULEE'
    case ReservationStatus.REFUSED:
      return 'REFUSEE'
    case ReservationStatus.COMPLETED:
      return 'TERMINEE'
    case ReservationStatus.PENDING:
    default:
      return 'EN_ATTENTE'
  }
}

function mapComplaintStatus(status?: string | null): ComplaintStatus {
  switch (status) {
    case 'EN_COURS':
      return ComplaintStatus.IN_PROGRESS
    case 'RESOLUE':
      return ComplaintStatus.RESOLVED
    case 'FERMEE':
      return ComplaintStatus.CLOSED
    case 'OUVERTE':
    default:
      return ComplaintStatus.OPEN
  }
}

function toComplaintStatus(status?: ComplaintStatus) {
  switch (status) {
    case ComplaintStatus.IN_PROGRESS:
      return 'EN_COURS'
    case ComplaintStatus.RESOLVED:
      return 'RESOLUE'
    case ComplaintStatus.CLOSED:
      return 'FERMEE'
    case ComplaintStatus.OPEN:
    default:
      return 'OUVERTE'
  }
}

function mapNotificationType(type?: string | null): NotificationType {
  switch (type) {
    case 'ANNULATION_RESERVATION':
      return NotificationType.RESERVATION_CANCELLATION
    case 'CONFIRMATION_ANNULATION':
      return NotificationType.MODIFICATION_CONFIRMATION
    case 'RAPPEL':
      return NotificationType.REMINDER
    case 'PROMOTION':
      return NotificationType.PROMOTION
    case 'RECLAMATION':
      return NotificationType.COMPLAINT
    case 'CONFIRMATION_RESERVATION':
    default:
      return NotificationType.RESERVATION_CONFIRMATION
  }
}

function toNotificationType(type?: NotificationType) {
  switch (type) {
    case NotificationType.RESERVATION_CANCELLATION:
      return 'ANNULATION_RESERVATION'
    case NotificationType.MODIFICATION_CONFIRMATION:
      return 'CONFIRMATION_ANNULATION'
    case NotificationType.REMINDER:
      return 'RAPPEL'
    case NotificationType.PROMOTION:
      return 'PROMOTION'
    case NotificationType.COMPLAINT:
      return 'RECLAMATION'
    case NotificationType.RESERVATION_CONFIRMATION:
    default:
      return 'CONFIRMATION_RESERVATION'
  }
}

export const HotelMapper = {
  fromDto(dto: HotelDTO): Hotel {
    const images =
      dto.chambres?.flatMap((room) => room.photos ?? []).filter(Boolean) ?? []
    const amenities =
      dto.chambres?.flatMap((room) => room.typeChambre?.equipements ?? []) ?? []

    return {
      id: dto.id,
      name: dto.nom,
      address: dto.adresse,
      city: dto.ville,
      country: dto.pays,
      stars: dto.etoiles,
      description: dto.description ?? '',
      email: dto.email,
      phone: dto.telephone,
      active: dto.actif,
      latitude: dto.latitude,
      longitude: dto.longitude,
      partner: dto.estPartenaire ?? false,
      agencyVoyageId: dto.agenceVoyageId,
      images: images.length > 0 ? images : fallbackHotelImages(dto.id),
      amenities: amenities.length > 0 ? [...new Set(amenities)] : defaultHotelAmenities(),
    }
  },

  toCreateDto(model: Omit<Hotel, 'id'>) {
    return {
      nom: model.name,
      adresse: model.address,
      ville: model.city,
      pays: model.country,
      etoiles: model.stars,
      description: model.description || undefined,
      email: model.email,
      telephone: model.phone,
      latitude: model.latitude,
      longitude: model.longitude,
      actif: model.active,
      estPartenaire: model.partner ?? false,
      agenceVoyageId: model.agencyVoyageId ?? 1,
    }
  },

  toUpdateDto(model: Partial<Hotel>) {
    return {
      ...(model.name !== undefined && { nom: model.name }),
      ...(model.address !== undefined && { adresse: model.address }),
      ...(model.city !== undefined && { ville: model.city }),
      ...(model.country !== undefined && { pays: model.country }),
      ...(model.stars !== undefined && { etoiles: model.stars }),
      ...(model.description !== undefined && { description: model.description }),
      ...(model.email !== undefined && { email: model.email }),
      ...(model.phone !== undefined && { telephone: model.phone }),
      ...(model.latitude !== undefined && { latitude: model.latitude }),
      ...(model.longitude !== undefined && { longitude: model.longitude }),
      ...(model.active !== undefined && { actif: model.active }),
      ...(model.partner !== undefined && { estPartenaire: model.partner }),
      ...(model.agencyVoyageId !== undefined && { agenceVoyageId: model.agencyVoyageId }),
    }
  },
}

export const AccountMapper = {
  fromDto(dto: AccountDTO): Account {
    return {
      id: dto.id,
      email: dto.email,
      password: '',
      registrationDate: dto.dateInscription,
      active: dto.actif ?? true,
      emailVerified: dto.emailVerified ?? false,
      authProvider: mapAuthProvider(dto.authProvider),
      role: mapAccountRole(dto.role),
    }
  },

  toCreateDto(model: Omit<Account, 'id' | 'registrationDate'>) {
    return {
      email: model.email,
      motDePasse: model.password,
      ...(model.active !== undefined && { actif: model.active }),
      role: model.role === 'admin' ? 'ADMIN' : 'CLIENT',
    }
  },

  toUpdateDto(model: Partial<Account>) {
    return {
      ...(model.email !== undefined && { email: model.email }),
      ...(model.password !== undefined && { motDePasse: model.password }),
      ...(model.active !== undefined && { actif: model.active }),
      ...(model.role !== undefined && { role: model.role === 'admin' ? 'ADMIN' : 'CLIENT' }),
    }
  },
}

export const ProfileMapper = {
  fromDto(dto: ProfileDTO, account?: Pick<Account, 'email' | 'role'>): Profile {
    const paymentMethods = dto.account?.paymentMethods?.map(PaymentMethodMapper.fromDto) ?? []

    return {
      id: dto.id,
      accountId: dto.accountId,
      firstName: dto.prenom,
      lastName: dto.nom,
      address: dto.adresse ?? '',
      phone: dto.telephone ?? '',
      photo: dto.photo ?? '',
      dateOfBirth: normalizeDateInput(dto.dateNaissance),
      passportNumber: dto.numeroPasseport ?? '',
      preferredDestinations: dto.destinationsPreferees ?? [],
      travelPreferences: dto.preferencesVoyage ?? [],
      bio: dto.bio ?? '',
      paymentMethod: summarizePaymentMethod(paymentMethods),
      paymentMethods,
      notificationsReservation: dto.notificationsReservation ?? true,
      notificationsPromotion: dto.notificationsPromotion ?? false,
      email: account?.email,
      role: account?.role,
    }
  },

  toCreateDto(accountId: number, model: Partial<Profile>) {
    return {
      accountId,
      nom: model.lastName?.trim() || 'User',
      prenom: model.firstName?.trim() || 'Guest',
      ...(model.phone !== undefined && { telephone: model.phone }),
      ...(model.address !== undefined && { adresse: model.address }),
      ...(model.photo !== undefined && { photo: model.photo }),
      ...(model.dateOfBirth !== undefined && { dateNaissance: model.dateOfBirth || null }),
      ...(model.passportNumber !== undefined && { numeroPasseport: model.passportNumber }),
      ...(model.bio !== undefined && { bio: model.bio }),
      ...(model.preferredDestinations !== undefined && {
        destinationsPreferees: model.preferredDestinations,
      }),
      ...(model.travelPreferences !== undefined && {
        preferencesVoyage: model.travelPreferences,
      }),
      ...(model.notificationsReservation !== undefined && {
        notificationsReservation: model.notificationsReservation,
      }),
      ...(model.notificationsPromotion !== undefined && {
        notificationsPromotion: model.notificationsPromotion,
      }),
    }
  },

  toUpdateDto(model: Partial<Profile>) {
    return {
      ...(model.firstName !== undefined && { prenom: model.firstName }),
      ...(model.lastName !== undefined && { nom: model.lastName }),
      ...(model.phone !== undefined && { telephone: model.phone }),
      ...(model.address !== undefined && { adresse: model.address }),
      ...(model.photo !== undefined && { photo: model.photo }),
      ...(model.dateOfBirth !== undefined && { dateNaissance: model.dateOfBirth || null }),
      ...(model.passportNumber !== undefined && { numeroPasseport: model.passportNumber }),
      ...(model.bio !== undefined && { bio: model.bio }),
      ...(model.preferredDestinations !== undefined && {
        destinationsPreferees: model.preferredDestinations,
      }),
      ...(model.travelPreferences !== undefined && {
        preferencesVoyage: model.travelPreferences,
      }),
      ...(model.notificationsReservation !== undefined && {
        notificationsReservation: model.notificationsReservation,
      }),
      ...(model.notificationsPromotion !== undefined && {
        notificationsPromotion: model.notificationsPromotion,
      }),
    }
  },

  merge(profile: Profile | null, account: Account | null): Profile | null {
    if (!profile && !account) {
      return null
    }

    return {
      id: profile?.id ?? 0,
      accountId: profile?.accountId ?? account?.id ?? 0,
      firstName: profile?.firstName ?? '',
      lastName: profile?.lastName ?? '',
      address: profile?.address ?? '',
      phone: profile?.phone ?? '',
      photo: profile?.photo ?? '',
      dateOfBirth: profile?.dateOfBirth ?? '',
      passportNumber: profile?.passportNumber ?? '',
      preferredDestinations: profile?.preferredDestinations ?? [],
      travelPreferences: profile?.travelPreferences ?? [],
      bio: profile?.bio ?? '',
      paymentMethod: profile?.paymentMethod ?? summarizePaymentMethod(profile?.paymentMethods),
      paymentMethods: profile?.paymentMethods ?? [],
      notificationsReservation: profile?.notificationsReservation ?? true,
      notificationsPromotion: profile?.notificationsPromotion ?? false,
      email: account?.email ?? profile?.email,
      role: account?.role ?? profile?.role,
    }
  },
}

export const PaymentMethodMapper = {
  fromDto(dto: PaymentMethodDTO): PaymentMethod {
    return {
      id: dto.id,
      accountId: dto.accountId,
      brand: dto.brand,
      last4: dto.last4,
      expiryMonth: dto.expiryMonth,
      expiryYear: dto.expiryYear,
      isDefault: dto.isDefault,
      createdAt: dto.createdAt,
    }
  },
}

export const ReservationMapper = {
  fromDto(dto: ReservationDTO): Reservation {
    return {
      id: dto.id,
      accountId: dto.accountId,
      roomId: dto.chambreId,
      hotelId: dto.chambre?.hotelId ?? 0,
      reservationDate: dto.dateCreation,
      checkInDate: dto.dateArrivee,
      checkOutDate: dto.dateDepart,
      numberOfNights: dto.nombreNuits,
      totalAmount: dto.montantTotal,
      confirmationCode: dto.codeConfirmation,
      status: mapReservationStatus(dto.statut),
      blockReason: dto.motifBlocage ?? undefined,
    }
  },

  toCreateDto(
    model: Omit<Reservation, 'id' | 'confirmationCode'> & { numberOfGuests?: number },
  ) {
    return {
      accountId: model.accountId,
      chambreId: model.roomId,
      dateArrivee: model.checkInDate,
      dateDepart: model.checkOutDate,
      nombrePersonnes: model.numberOfGuests ?? 1,
      nombreNuits: model.numberOfNights,
      montantTotal: model.totalAmount,
      codeConfirmation: `VH-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      statut: toReservationStatus(model.status),
      ...(model.blockReason ? { motifBlocage: model.blockReason } : {}),
    }
  },

  toUpdateDto(status: ReservationStatus, reason?: string) {
    return {
      statut: toReservationStatus(status),
      ...(reason !== undefined ? { motifBlocage: reason } : {}),
    }
  },
}

export const OfferMapper = {
  fromDto(dto: OfferDTO): Offer {
    // Attempt to find a fallback image from the hotel rooms if the offer doesn't have one
    const fallbackImage = dto.hotel?.chambres?.[0]?.photos?.[0] || 
                          hotelFallbackImages[dto.hotelId % hotelFallbackImages.length]

    return {
      id: dto.id,
      hotelId: dto.hotelId,
      hotelName: dto.hotel?.nom,
      hotelCity: dto.hotel?.ville,
      title: dto.titre,
      description: dto.description ?? '',
      discountRate: dto.tauxRemise,
      startDate: dto.dateDebut,
      endDate: dto.dateFin,
      active: dto.active,
      image: dto.photo || fallbackImage,
    }
  },

  toCreateDto(model: Omit<Offer, 'id'>) {
    return {
      titre: model.title,
      description: model.description || undefined,
      photo: model.image || undefined,
      tauxRemise: model.discountRate,
      dateDebut: model.startDate,
      dateFin: model.endDate,
      active: model.active,
      hotelId: model.hotelId,
    }
  },

  toUpdateDto(model: Partial<Offer>) {
    return {
      ...(model.title !== undefined && { titre: model.title }),
      ...(model.description !== undefined && { description: model.description }),
      ...(model.image !== undefined && { photo: model.image }),
      ...(model.discountRate !== undefined && { tauxRemise: model.discountRate }),
      ...(model.startDate !== undefined && { dateDebut: model.startDate }),
      ...(model.endDate !== undefined && { dateFin: model.endDate }),
      ...(model.active !== undefined && { active: model.active }),
      ...(model.hotelId !== undefined && { hotelId: model.hotelId }),
    }
  },
}


export const ComplaintMapper = {
  fromDto(dto: ComplaintDTO): Complaint {
    return {
      id: dto.id,
      reservationId: dto.reservationId,
      accountId: dto.reservation?.accountId ?? 0,
      subject: dto.sujet,
      description: dto.description,
      complaintDate: dto.dateOuverture,
      resolutionDate: dto.dateResolution ?? undefined,
      agencyResponse: dto.reponseAgence ?? undefined,
      status: mapComplaintStatus(dto.statut),
    }
  },

  toCreateDto(model: Omit<Complaint, 'id' | 'complaintDate'> & { agencyVoyageId?: number }) {
    return {
      reservationId: model.reservationId,
      agenceVoyageId: model.agencyVoyageId ?? 1,
      sujet: model.subject,
      description: model.description,
      statut: toComplaintStatus(model.status),
    }
  },

  toUpdateDto(status: ComplaintStatus, response?: string) {
    return {
      statut: toComplaintStatus(status),
      ...(response !== undefined ? { reponseAgence: response } : {}),
    }
  },
}

export const RoomTypeMapper = {
  fromDto(dto: RoomTypeDTO): RoomType {
    return {
      id: dto.id,
      label: dto.libelle,
      description: dto.description ?? '',
      basePrice: 0,
      areaSqm: dto.superficieM2,
      amenities: dto.equipements ?? [],
    }
  },
}

export const RoomMapper = {
  fromDto(dto: RoomDTO): Room {
    const amenities = dto.typeChambre?.equipements ?? []
    const photos = dto.photos?.length ? dto.photos : fallbackHotelImages(dto.hotelId)
    const type = dto.typeChambre?.libelle ?? `Room ${dto.numero}`

    return {
      id: dto.id,
      hotelId: dto.hotelId,
      number: dto.numero,
      floor: dto.etage,
      pricePerNight: dto.prixParNuit,
      capacity: dto.capacite,
      available: dto.disponible,
      photos,
      roomTypeId: dto.typeChambreId,
      type,
      description: dto.typeChambre?.description ?? '',
      amenities,
      image: photos[0],
      status: dto.disponible ? 'AVAILABLE' : 'UNAVAILABLE',
    }
  },

  toCreateDto(model: Omit<Room, 'id'>) {
    return {
      numero: model.number,
      etage: model.floor,
      prixParNuit: model.pricePerNight,
      capacite: model.capacity,
      disponible: model.available,
      photos: model.photos,
      hotelId: model.hotelId,
      typeChambreId: model.roomTypeId,
    }
  },

  toUpdateDto(model: Partial<Room>) {
    return {
      ...(model.number !== undefined && { numero: model.number }),
      ...(model.floor !== undefined && { etage: model.floor }),
      ...(model.pricePerNight !== undefined && { prixParNuit: model.pricePerNight }),
      ...(model.capacity !== undefined && { capacite: model.capacity }),
      ...(model.available !== undefined && { disponible: model.available }),
      ...(model.photos !== undefined && { photos: model.photos }),
      ...(model.hotelId !== undefined && { hotelId: model.hotelId }),
      ...(model.roomTypeId !== undefined && { typeChambreId: model.roomTypeId }),
    }
  },
}

export const NotificationMapper = {
  fromDto(dto: NotificationDTO): AppNotification {
    return {
      id: dto.id,
      accountId: dto.accountId,
      message: dto.message,
      type: mapNotificationType(dto.type),
      sentDate: dto.dateEnvoi,
      read: dto.lu,
    }
  },

  toCreateDto(model: Omit<AppNotification, 'id'>) {
    return {
      accountId: model.accountId,
      message: model.message,
      type: toNotificationType(model.type),
    }
  },
}

export const ReviewMapper = {
  fromDto(dto: ReviewDTO): Review {
    const reservationProfile = dto.reservation?.account?.profile
    const reservationName = reservationProfile ? `${reservationProfile.prenom} ${reservationProfile.nom}` : undefined
    const authorName = normalizeAuthorName(dto.authorName) || normalizeAuthorName(reservationName)

    return {
      id: dto.id,
      reservationId: dto.reservationId ?? undefined,
      accountId: dto.accountId ?? dto.reservation?.accountId ?? 0,
      hotelId: dto.reservation?.chambre?.hotelId ?? dto.hotelId ?? 0,
      authorName,
      rating: dto.note,
      comment: dto.commentaire ?? '',
      publicationDate: dto.datePublication,
      visible: dto.valide,
    }
  },

  toCreateDto(model: Omit<Review, 'id' | 'publicationDate'>) {
    return {
      ...(model.reservationId ? { reservationId: model.reservationId } : {}),
      ...(model.hotelId ? { hotelId: model.hotelId } : {}),
      ...(model.accountId ? { accountId: model.accountId } : {}),
      ...(model.authorName ? { authorName: model.authorName } : {}),
      note: model.rating,
      commentaire: model.comment,
      valide: model.visible,
    }
  },

  toUpdateDto(model: Partial<Review>) {
    return {
      ...(model.reservationId !== undefined && { reservationId: model.reservationId }),
      ...(model.rating !== undefined && { note: model.rating }),
      ...(model.comment !== undefined && { commentaire: model.comment }),
      ...(model.visible !== undefined && { valide: model.visible }),
    }
  },
}
