import type { IComplaintRepository } from '~/types/interfaces'
import type { Complaint } from '~/types/models'
import { ComplaintStatus } from '~/types/enums'
import { AdminRepositoryFactory } from '~/repositories/factory'

/**
 * ComplaintService — Customer complaint management.
 */
export class ComplaintService {
  private repo: IComplaintRepository

  constructor(repo: IComplaintRepository = AdminRepositoryFactory.complaint()) {
    this.repo = repo
  }

  /** All complaints (admin) */
  async getAll(): Promise<Complaint[]> {
    return this.repo.getAll()
  }

  /** Single complaint by ID */
  async getById(id: number): Promise<Complaint> {
    const c = await this.repo.getById(id)
    if (!c) throw new Error(`Complaint ${id} not found`)
    return c
  }

  /** Complaints filed by a given user account */
  async getByAccount(accountId: number): Promise<Complaint[]> {
    return this.repo.getByAccount(accountId)
  }

  /** Filter complaints by status (admin) */
  async getByStatus(status: ComplaintStatus): Promise<Complaint[]> {
    return this.repo.getByStatus(status)
  }

  /**
   * Submit a new complaint.
   * Business rule: description must not be empty.
   */
  async submit(data: Omit<Complaint, 'id' | 'complaintDate'>): Promise<Complaint> {
    if (!data.description?.trim()) throw new Error('Complaint description is required')
    return this.repo.create(data)
  }

  /** Open a complaint (re-open or initial) */
  async open(id: number): Promise<Complaint> {
    return this.repo.updateStatus(id, ComplaintStatus.OPEN)
  }

  /** Mark a complaint as in progress (admin) */
  async inProgress(id: number): Promise<Complaint> {
    return this.repo.updateStatus(id, ComplaintStatus.IN_PROGRESS)
  }

  /**
   * Resolve a complaint (admin) with a mandatory response.
   */
  async resolve(id: number, response: string): Promise<Complaint> {
    if (!response.trim()) throw new Error('A response is required to resolve a complaint')
    return this.repo.updateStatus(id, ComplaintStatus.RESOLVED, response)
  }

  /** Close a complaint (admin) */
  async close(id: number, response?: string): Promise<Complaint> {
    return this.repo.updateStatus(id, ComplaintStatus.CLOSED, response)
  }

  /** Delete a complaint record (admin) */
  async delete(id: number): Promise<void> {
    return this.repo.delete(id)
  }
}
