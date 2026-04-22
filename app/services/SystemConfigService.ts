import type { ISystemConfigRepository } from '~/types/interfaces'
import type { SystemConfig } from '~/types/models'
import { ApiSystemConfigRepository } from '~/repositories/api'

/**
 * SystemConfigService — Application settings and configuration management.
 */
export class SystemConfigService {
  private repo: ISystemConfigRepository

  constructor(repo: ISystemConfigRepository = new ApiSystemConfigRepository()) {
    this.repo = repo
  }

  /** All configuration entries (admin) */
  async getAll(): Promise<SystemConfig[]> {
    return this.repo.getAll()
  }

  /** Fetch a single config value by key */
  async getByKey(key: string): Promise<SystemConfig> {
    const config = await this.repo.getByKey(key)
    if (!config) throw new Error(`System config key "${key}" not found`)
    return config
  }

  /**
   * Update a config value.
   * Business rule: value must not be empty.
   */
  async update(key: string, value: string): Promise<SystemConfig> {
    if (!value.trim()) throw new Error(`Config value for key "${key}" cannot be empty`)
    return this.repo.update(key, value.trim())
  }
}
