import type { SystemConfig } from '../models'

export interface ISystemConfigRepository {
  getAll(): Promise<SystemConfig[]>
  getByKey(key: string): Promise<SystemConfig | null>
  update(key: string, value: string): Promise<SystemConfig>
}
