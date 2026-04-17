import type { IAccountRepository } from '~/types/interfaces'
import type { Account, Profile } from '~/types/models'
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
   * Register a new client account.
   * Business rule: email must be unique.
   */
  async register(email: string, password: string): Promise<Account> {
    if (!email.includes('@')) throw new Error('Invalid email address')
    if (password.length < 6) throw new Error('Password must be at least 6 characters')
    const existing = await this.repo.getByEmail(email.trim().toLowerCase())
    if (existing) throw new Error('An account with this email already exists')
    return this.repo.create({ email: email.trim().toLowerCase(), password, active: true, role: 'client' })
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
}
