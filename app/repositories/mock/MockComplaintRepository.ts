import type { IComplaintRepository } from '~/types/interfaces'
import type { Complaint } from '~/types/models'
import type { ComplaintStatus } from '~/types/enums'
import { mockComplaints } from './data/complaints'

export class MockComplaintRepository implements IComplaintRepository {
  private complaints: Complaint[] = [...mockComplaints]

  async getAll(): Promise<Complaint[]> { return this.complaints }

  async getById(id: number): Promise<Complaint | null> {
    return this.complaints.find(c => c.id === id) ?? null
  }

  async getByAccount(accountId: number): Promise<Complaint[]> {
    return this.complaints.filter(c => c.accountId === accountId)
  }

  async getByStatus(status: ComplaintStatus): Promise<Complaint[]> {
    return this.complaints.filter(c => c.status === status)
  }

  async create(complaint: Omit<Complaint, 'id' | 'complaintDate'>): Promise<Complaint> {
    const newComplaint: Complaint = { ...complaint, id: Date.now(), complaintDate: new Date().toISOString().split('T')[0] }
    this.complaints.push(newComplaint)
    return newComplaint
  }

  async updateStatus(id: number, status: ComplaintStatus, response?: string): Promise<Complaint> {
    const index = this.complaints.findIndex(c => c.id === id)
    if (index === -1) throw new Error(`Complaint ${id} not found`)
    this.complaints[index] = {
      ...this.complaints[index],
      status,
      ...(response ? { agencyResponse: response } : {}),
      ...(status === 'RESOLVED' || status === 'CLOSED' ? { resolutionDate: new Date().toISOString().split('T')[0] } : {}),
    }
    return this.complaints[index]
  }

  async delete(id: number): Promise<void> {
    this.complaints = this.complaints.filter(c => c.id !== id)
  }
}
