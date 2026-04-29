export interface HotelDTO {
  id: number
  nom: string
  adresse: string
  ville: string
  pays: string
  etoiles: number
  description: string | null
  email: string
  telephone: string
  actif: boolean
  estPartenaire?: boolean
  agenceVoyageId?: number
  chambres?: RoomDTO[]
  offres?: OfferDTO[]
}

export interface AccountDTO {
  id: number
  email: string
  motDePasse?: string
  dateInscription: string
  actif?: boolean
  emailVerified?: boolean
  role?: 'client' | 'admin' | 'CLIENT' | 'ADMIN'
  profile?: ProfileDTO | null
}

export interface ProfileDTO {
  id: number
  accountId: number
  nom: string
  prenom: string
  telephone?: string | null
  adresse?: string | null
  nationalite?: string | null
  photo?: string | null
  dateNaissance?: string | null
  numeroPasseport?: string | null
  bio?: string | null
  destinationsPreferees?: string[] | null
  preferencesVoyage?: string[] | null
  notificationsReservation?: boolean | null
  notificationsPromotion?: boolean | null
  account?: {
    paymentMethods?: PaymentMethodDTO[] | null
  } | null
}

export interface PaymentMethodDTO {
  id: number
  accountId: number
  cardholderName?: string | null
  brand: 'visa' | 'mastercard' | 'amex' | 'discover' | 'other'
  last4: string
  expiryMonth: number
  expiryYear: number
  isDefault: boolean
  createdAt: string
}

export interface ReservationDTO {
  id: number
  accountId: number
  chambreId: number
  dateCreation: string
  dateArrivee: string
  dateDepart: string
  nombrePersonnes: number
  nombreNuits: number
  montantTotal: number
  codeConfirmation: string
  statut: string
  motifBlocage: string | null
  account?: AccountDTO
  chambre?: RoomDTO
}

export interface OfferDTO {
  id: number
  titre: string
  description: string | null
  photo: string | null
  tauxRemise: number
  dateDebut: string
  dateFin: string
  active: boolean
  hotelId: number
  hotel?: HotelDTO & { nom?: string }
}


export interface ComplaintDTO {
  id: number
  reservationId: number
  agenceVoyageId: number
  sujet: string
  description: string
  dateOuverture: string
  dateResolution: string | null
  reponseAgence: string | null
  statut: string
  reservation?: ReservationDTO
}

export interface RoomTypeDTO {
  id: number
  libelle: string
  description: string | null
  superficieM2: number
  equipements: string[]
}

export interface RoomDTO {
  id: number
  numero: string
  etage: number
  prixParNuit: number
  capacite: number
  disponible: boolean
  photos: string[]
  hotelId: number
  typeChambreId: number
  typeChambre?: RoomTypeDTO
  hotel?: HotelDTO
}

export interface NotificationDTO {
  id: number
  accountId: number
  message: string
  type: string
  dateEnvoi: string
  lu: boolean
}

export interface ReviewDTO {
  id: number
  reservationId?: number | null
  hotelId?: number | null
  accountId?: number | null
  authorName?: string | null
  note: number
  commentaire: string | null
  datePublication: string
  valide: boolean
  reservation?: ReservationDTO
}

export interface ApiErrorDTO {
  message?: string | string[]
  error?: string
  statusCode?: number
}
