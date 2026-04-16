/**
 * Complaint/Reclamation lifecycle statuses.
 * Maps to UML: StatutReclamation
 */
export enum ComplaintStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export const ComplaintStatusLabel: Record<ComplaintStatus, string> = {
  [ComplaintStatus.OPEN]: 'Open',
  [ComplaintStatus.IN_PROGRESS]: 'In Progress',
  [ComplaintStatus.RESOLVED]: 'Resolved',
  [ComplaintStatus.CLOSED]: 'Closed',
}

export const ComplaintStatusColor: Record<ComplaintStatus, string> = {
  [ComplaintStatus.OPEN]: 'danger',
  [ComplaintStatus.IN_PROGRESS]: 'warning',
  [ComplaintStatus.RESOLVED]: 'success',
  [ComplaintStatus.CLOSED]: 'muted',
}
