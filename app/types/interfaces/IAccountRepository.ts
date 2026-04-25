import type { Account, PaymentMethod, Profile } from '../models'

export interface IAccountRepository {
  getAll(): Promise<Account[]>
  getById(id: number): Promise<Account | null>
  getByEmail(email: string): Promise<Account | null>
  authenticate(email: string, password: string): Promise<Account | null>
  authenticateGoogle(data: { email: string; firstName: string; lastName: string; uid: string }): Promise<Account | null>
  create(account: Omit<Account, 'id' | 'registrationDate'>): Promise<Account>
  update(id: number, data: Partial<Account>): Promise<Account>
  deactivate(id: number): Promise<void>
  getProfile(accountId: number): Promise<Profile | null>
  createProfile(accountId: number, data: Partial<Profile>): Promise<Profile>
  updateProfile(accountId: number, data: Partial<Profile>): Promise<Profile>
  listPaymentMethods(accountId: number): Promise<PaymentMethod[]>
  createPaymentMethod(
    accountId: number,
    data: {
      cardholderName: string
      brand: PaymentMethod['brand']
      cardNumber: string
      expiryMonth: number
      expiryYear: number
      isDefault?: boolean
    },
  ): Promise<PaymentMethod>
  updatePaymentMethod(
    accountId: number,
    paymentMethodId: number,
    data: Partial<{
      cardholderName: string
      brand: PaymentMethod['brand']
      cardNumber: string
      expiryMonth: number
      expiryYear: number
      isDefault: boolean
    }>,
  ): Promise<PaymentMethod>
  removePaymentMethod(accountId: number, paymentMethodId: number): Promise<void>
  changePassword(accountId: number, oldPassword: string, newPassword: string): Promise<void>
}
