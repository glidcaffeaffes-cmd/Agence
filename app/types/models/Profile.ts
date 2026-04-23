/**
 * User profile details linked to an Account.
 * UML: Profile
 */
export interface Profile {
  id: number
  accountId: number
  firstName: string
  lastName: string
  address: string
  phone: string
  photo: string
  notificationsReservation: boolean
  notificationsPromotion: boolean
  email?: string
  role?: 'client' | 'admin'
  // Extended completion fields
  dateOfBirth?: string
  passportNumber?: string
  preferredDestinations?: string[]
  travelPreferences?: string[]
  bio?: string
  paymentMethod?: string
}
