import type { ISystemConfigRepository } from '~/types/interfaces'
import type { SystemConfig } from '~/types/models'
import { mockSystemConfig } from './data/systemConfig'

export class MockSystemConfigRepository implements ISystemConfigRepository {
  private configs: SystemConfig[] = [...mockSystemConfig]

  async getAll(): Promise<SystemConfig[]> { return this.configs }

  async getByKey(key: string): Promise<SystemConfig | null> {
    return this.configs.find(c => c.key === key) ?? null
  }

  async update(key: string, value: string): Promise<SystemConfig> {
    const index = this.configs.findIndex(c => c.key === key)
    if (index === -1) throw new Error(`Config key "${key}" not found`)
    this.configs[index] = { ...this.configs[index], value }
    return this.configs[index]
  }
}
