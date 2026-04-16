import type { Complaint } from '../models'
import type { ComplaintStatus } from '../enums'

export interface IComplaintRepository {
  getAll(): Promise<Complaint[]>
  getById(id: number): Promise<Complaint | null>
  getByAccount(accountId: number): Promise<Complaint[]>
  getByStatus(status: ComplaintStatus): Promise<Complaint[]>
  create(complaint: Omit<Complaint, 'id' | 'complaintDate'>): Promise<Complaint>
  updateStatus(id: number, status: ComplaintStatus, response?: string): Promise<Complaint>
  delete(id: number): Promise<void>
}
