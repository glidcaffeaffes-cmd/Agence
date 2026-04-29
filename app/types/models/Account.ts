/**
 * User account for authentication.
 * UML: Account
 */
export interface Account {
  id: number
  email: string
  password: string
  registrationDate: string
  active: boolean
  emailVerified: boolean
  authProvider: 'local' | 'google'
  role: 'client' | 'admin'
}
