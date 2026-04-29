import type { Account, PaymentMethod, Profile } from '../models'

export interface IAccountRepository {
  requestPasswordReset(email: string): Promise<{ success: boolean; message: string }>
  resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }>
  syncEmailVerification(accountId: number | null, idToken: string): Promise<{ verified: boolean }>
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
      isDefault?: boolean
    },
  ): Promise<{ sessionId: string; url: string }>
  confirmPaymentMethodSession(
    accountId: number,
    sessionId: string,
  ): Promise<PaymentMethod>
  updatePaymentMethod(
    accountId: number,
    paymentMethodId: number,
    data: Partial<{
      isDefault: boolean
    }>,
  ): Promise<PaymentMethod>
  removePaymentMethod(accountId: number, paymentMethodId: number): Promise<void>
  changePassword(accountId: number, oldPassword: string, newPassword: string): Promise<void>
}
