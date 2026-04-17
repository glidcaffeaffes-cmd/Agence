import type { Complaint } from '~/types/models'
import { ComplaintStatus } from '~/types/enums'

export const mockComplaints: Complaint[] = [
  { id: 1, reservationId: 4, accountId: 1, subject: 'Noisy room', description: 'Our room was adjacent to the elevator and the noise was quite disruptive during the night. We had to request earplugs from reception.', complaintDate: '2026-03-02', resolutionDate: '2026-03-05', agencyResponse: 'We sincerely apologize for the inconvenience. A 15% discount has been applied to your next booking as compensation.', status: ComplaintStatus.RESOLVED },
  { id: 2, reservationId: 6, accountId: 2, subject: 'Room not as described', description: 'The room photos showed a sea view but our room faced the parking lot. Very disappointed with the misleading listing.', complaintDate: '2026-02-06', status: ComplaintStatus.IN_PROGRESS },
  { id: 3, reservationId: 10, accountId: 2, subject: 'Late check-in delay', description: 'Despite arriving at the confirmed check-in time, we waited 45 minutes at reception. Staff seemed understaffed and overwhelmed.', complaintDate: '2026-02-15', resolutionDate: '2026-02-18', agencyResponse: 'Thank you for your patience. We have addressed this with our front desk team and offered a complimentary breakfast voucher.', status: ComplaintStatus.CLOSED },
  { id: 4, reservationId: 7, accountId: 3, subject: 'Pool maintenance issue', description: 'The main pool was closed for maintenance during our entire stay without prior notice. This was a key reason for choosing this hotel.', complaintDate: '2026-04-05', status: ComplaintStatus.OPEN },
]
