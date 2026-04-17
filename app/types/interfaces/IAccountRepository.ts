import type { Account, Profile } from '../models'

export interface IAccountRepository {
  getAll(): Promise<Account[]>
  getById(id: number): Promise<Account | null>
  getByEmail(email: string): Promise<Account | null>
  authenticate(email: string, password: string): Promise<Account | null>
  create(account: Omit<Account, 'id' | 'registrationDate'>): Promise<Account>
  update(id: number, data: Partial<Account>): Promise<Account>
  deactivate(id: number): Promise<void>
  getProfile(accountId: number): Promise<Profile | null>
  updateProfile(accountId: number, data: Partial<Profile>): Promise<Profile>
}
