import type { IAccountRepository } from '~/types/interfaces'
import type { Account, PaymentMethod, Profile } from '~/types/models'
import { AdminRepositoryFactory } from '~/repositories/factory'

/**
 * AccountService — Auth & user profile business logic.
 */
export class AccountService {
  private repo: IAccountRepository

  constructor(repo: IAccountRepository = AdminRepositoryFactory.account()) {
    this.repo = repo
  }

  /** All accounts (admin) */
  async getAll(): Promise<Account[]> {
    return this.repo.getAll()
  }

  async requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
    if (!email.trim() || !email.includes('@')) {
      throw new Error('Enter a valid email address')
    }

    return this.repo.requestPasswordReset(email.trim().toLowerCase())
  }

  async syncEmailVerification(accountId: number | null, idToken: string): Promise<{ verified: boolean }> {
    return this.repo.syncEmailVerification(accountId, idToken)
  }

  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    if (!token.trim()) {
      throw new Error('Reset token is missing')
    }

    if (newPassword.length < 8) {
      throw new Error('Password must be at least 8 characters')
    }

    return this.repo.resetPassword(token.trim(), newPassword)
  }

  /** Single account by ID */
  async getById(id: number): Promise<Account> {
    const acc = await this.repo.getById(id)
    if (!acc) throw new Error(`Account ${id} not found`)
    return acc
  }

  /**
   * Authenticate user.
   * Returns the account on success, null on invalid credentials.
   */
  async login(email: string, password: string): Promise<Account | null> {
    if (!email.trim() || !password.trim()) return null
    return this.repo.authenticate(email.trim().toLowerCase(), password)
  }

  /**
   * Authenticate user via Google.
   */
  async loginGoogle(data: { email: string; firstName: string; lastName: string; uid: string }): Promise<Account | null> {
    return this.repo.authenticateGoogle(data)
  }

  /**
   * Register a new client account.
   * Business rule: email must be unique.
   */
  async register(email: string, password: string): Promise<Account> {
    if (!email.includes('@')) throw new Error('Invalid email address')
    if (password.length < 8) throw new Error('Password must be at least 8 characters')
    const existing = await this.repo.getByEmail(email.trim().toLowerCase())
    if (existing) throw new Error('An account with this email already exists')
    return this.repo.create({
      email: email.trim().toLowerCase(),
      password,
      active: true,
      emailVerified: false,
      authProvider: 'local',
      role: 'client',
    })
  }

  /** Update account fields */
  async update(id: number, data: Partial<Account>): Promise<Account> {
    return this.repo.update(id, data)
  }

  /** Deactivate (soft-delete) an account */
  async deactivate(id: number): Promise<void> {
    return this.repo.deactivate(id)
  }

  /** Fetch the profile linked to an account */
  async getProfile(accountId: number): Promise<Profile | null> {
    return this.repo.getProfile(accountId)
  }

  /** Update profile fields */
  async updateProfile(accountId: number, data: Partial<Profile>): Promise<Profile> {
    return this.repo.updateProfile(accountId, data)
  }

  async createProfile(accountId: number, data: Partial<Profile>): Promise<Profile> {
    return this.repo.createProfile(accountId, data)
  }

  async listPaymentMethods(accountId: number): Promise<PaymentMethod[]> {
    return this.repo.listPaymentMethods(accountId)
  }

  async createPaymentMethod(
    accountId: number,
    data: {
      isDefault?: boolean
    },
  ): Promise<{ sessionId: string; url: string }> {
    return this.repo.createPaymentMethod(accountId, data)
  }

  async confirmPaymentMethodSession(
    accountId: number,
    sessionId: string,
  ): Promise<PaymentMethod> {
    return this.repo.confirmPaymentMethodSession(accountId, sessionId)
  }

  async updatePaymentMethod(
    accountId: number,
    paymentMethodId: number,
    data: Partial<{
      isDefault: boolean
    }>,
  ): Promise<PaymentMethod> {
    return this.repo.updatePaymentMethod(accountId, paymentMethodId, data)
  }

  async removePaymentMethod(accountId: number, paymentMethodId: number): Promise<void> {
    return this.repo.removePaymentMethod(accountId, paymentMethodId)
  }

  async changePassword(accountId: number, oldPassword: string, newPassword: string): Promise<void> {
    if (!oldPassword.trim() || !newPassword.trim()) {
      throw new Error('Both current and new passwords are required')
    }

    if (newPassword.length < 8) {
      throw new Error('Password must be at least 8 characters')
    }

    return this.repo.changePassword(accountId, oldPassword, newPassword)
  }
}
