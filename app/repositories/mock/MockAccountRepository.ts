import type { IAccountRepository } from '~/types/interfaces'
import type { Account, Profile } from '~/types/models'
import { mockAccounts } from './data/accounts'
import { mockProfiles } from './data/profiles'

export class MockAccountRepository implements IAccountRepository {
  private accounts: Account[] = [...mockAccounts]
  private profiles: Profile[] = [...mockProfiles]

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

  async updateProfile(accountId: number, data: Partial<Profile>): Promise<Profile> {
    const index = this.profiles.findIndex(p => p.accountId === accountId)
    if (index === -1) throw new Error(`Profile for account ${accountId} not found`)
    this.profiles[index] = { ...this.profiles[index], ...data }
    return this.profiles[index]
  }
}
