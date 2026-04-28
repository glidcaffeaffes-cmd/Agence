import type { IAccountRepository } from '~/types/interfaces'
import type { Account, PaymentMethod, Profile } from '~/types/models'
import { mockAccounts } from './data/accounts'
import { mockProfiles } from './data/profiles'

export class MockAccountRepository implements IAccountRepository {
  private accounts: Account[] = [...mockAccounts]
  private profiles: Profile[] = [...mockProfiles]
  private paymentMethods: PaymentMethod[] = []

  async requestPasswordReset(_email: string): Promise<{ success: boolean; message: string }> {
    return {
      success: true,
      message: 'If an account exists for this email, a reset link has been sent.',
    }
  }

  async resetPassword(_token: string, _newPassword: string): Promise<{ success: boolean; message: string }> {
    return {
      success: true,
      message: 'Password updated successfully.',
    }
  }

  async getAll(): Promise<Account[]> {
    return this.accounts
  }

  async getById(id: number): Promise<Account | null> {
    return this.accounts.find(a => a.id === id) ?? null
  }

  async getByEmail(email: string): Promise<Account | null> {
    return this.accounts.find(a => a.email === email) ?? null
  }

  async authenticate(email: string, _password: string): Promise<Account | null> {
    // Mock: accept any password for existing accounts
    return this.accounts.find(a => a.email === email && a.active) ?? null
  }

  async authenticateGoogle(data: { email: string; firstName: string; lastName: string; uid: string }): Promise<Account | null> {
    const existing = this.accounts.find(a => a.email === data.email && a.active)
    if (existing) return existing
    
    // Create mock account if it doesn't exist
    return this.create({ email: data.email, password: data.uid, active: true, role: 'client' })
  }

  async create(account: Omit<Account, 'id' | 'registrationDate'>): Promise<Account> {
    const newAccount: Account = {
      ...account,
      id: Date.now(),
      registrationDate: new Date().toISOString().split('T')[0],
    }
    this.accounts.push(newAccount)
    return newAccount
  }

  async update(id: number, data: Partial<Account>): Promise<Account> {
    const index = this.accounts.findIndex(a => a.id === id)
    if (index === -1) throw new Error(`Account ${id} not found`)
    this.accounts[index] = { ...this.accounts[index], ...data }
    return this.accounts[index]
  }

  async deactivate(id: number): Promise<void> {
    const index = this.accounts.findIndex(a => a.id === id)
    if (index !== -1) this.accounts[index].active = false
  }

  async getProfile(accountId: number): Promise<Profile | null> {
    return this.profiles.find(p => p.accountId === accountId) ?? null
  }

  async createProfile(accountId: number, data: Partial<Profile>): Promise<Profile> {
    const newProfile: Profile = {
      id: Date.now(),
      accountId,
      firstName: data.firstName ?? '',
      lastName: data.lastName ?? '',
      address: data.address ?? '',
      phone: data.phone ?? '',
      photo: data.photo ?? '',
      notificationsReservation: data.notificationsReservation ?? true,
      notificationsPromotion: data.notificationsPromotion ?? false,
      dateOfBirth: data.dateOfBirth,
      passportNumber: data.passportNumber,
      preferredDestinations: data.preferredDestinations ?? [],
      travelPreferences: data.travelPreferences ?? [],
      bio: data.bio ?? '',
      paymentMethod: data.paymentMethod,
      paymentMethods: data.paymentMethods ?? [],
      email: data.email,
      role: data.role,
    }
    this.profiles.push(newProfile)
    return newProfile
  }

  async updateProfile(accountId: number, data: Partial<Profile>): Promise<Profile> {
    const index = this.profiles.findIndex(p => p.accountId === accountId)
    if (index === -1) throw new Error(`Profile for account ${accountId} not found`)
    this.profiles[index] = { ...this.profiles[index], ...data }
    return this.profiles[index]
  }

  async listPaymentMethods(accountId: number): Promise<PaymentMethod[]> {
    return this.paymentMethods
      .filter(method => method.accountId === accountId)
      .sort((a, b) => Number(b.isDefault) - Number(a.isDefault))
  }

  async createPaymentMethod(
    accountId: number,
    data: {
      isDefault?: boolean
    },
  ): Promise<{ sessionId: string; url: string }> {
    const sessionId = `mock_session_${Date.now()}`
    const syntheticCard: PaymentMethod = {
      id: Date.now(),
      accountId,
      brand: 'visa',
      last4: '4242',
      expiryMonth: 8,
      expiryYear: new Date().getFullYear() + 4,
      isDefault: data.isDefault ?? !this.paymentMethods.some(method => method.accountId === accountId),
      createdAt: new Date().toISOString(),
    }

    this.paymentMethods = this.paymentMethods.filter(method => method.accountId !== accountId || !syntheticCard.isDefault)
      .concat(syntheticCard)
    this.syncProfilePaymentState(accountId)

    return {
      sessionId,
      url: `/profile?tab=Billing&setup=success&session_id=${sessionId}`,
    }
  }

  async confirmPaymentMethodSession(
    accountId: number,
    _sessionId: string,
  ): Promise<PaymentMethod> {
    const existing = this.paymentMethods
      .filter(method => method.accountId === accountId)
      .sort((a, b) => Number(b.isDefault) - Number(a.isDefault))[0]

    if (!existing) {
      throw new Error('No payment method found for this session')
    }

    return existing
  }

  async updatePaymentMethod(
    accountId: number,
    paymentMethodId: number,
    data: Partial<{
      isDefault: boolean
    }>,
  ): Promise<PaymentMethod> {
    const index = this.paymentMethods.findIndex(
      method => method.id === paymentMethodId && method.accountId === accountId,
    )
    if (index === -1) throw new Error(`Payment method ${paymentMethodId} not found`)

    if (data.isDefault) {
      this.paymentMethods = this.paymentMethods.map(method =>
        method.accountId === accountId ? { ...method, isDefault: false } : method,
      )
    }

    const current = this.paymentMethods[index]
    this.paymentMethods[index] = {
      ...current,
      ...(data.isDefault !== undefined && { isDefault: data.isDefault }),
    }

    this.syncProfilePaymentState(accountId)
    return this.paymentMethods[index]
  }

  async removePaymentMethod(accountId: number, paymentMethodId: number): Promise<void> {
    const existing = this.paymentMethods.find(
      method => method.id === paymentMethodId && method.accountId === accountId,
    )
    this.paymentMethods = this.paymentMethods.filter(
      method => !(method.id === paymentMethodId && method.accountId === accountId),
    )

    if (existing?.isDefault) {
      const nextDefault = this.paymentMethods.find(method => method.accountId === accountId)
      if (nextDefault) nextDefault.isDefault = true
    }

    this.syncProfilePaymentState(accountId)
  }

  async changePassword(_accountId: number, _oldPassword: string, _newPassword: string): Promise<void> {
    return
  }

  private syncProfilePaymentState(accountId: number) {
    const profileIndex = this.profiles.findIndex(profile => profile.accountId === accountId)
    if (profileIndex === -1) return

    const methods = this.paymentMethods
      .filter(method => method.accountId === accountId)
      .sort((a, b) => Number(b.isDefault) - Number(a.isDefault))
    const primary = methods[0]

    this.profiles[profileIndex] = {
      ...this.profiles[profileIndex],
      paymentMethods: methods,
      paymentMethod: primary ? `${primary.brand.toUpperCase()} ending in ${primary.last4}` : '',
    }
  }
}
