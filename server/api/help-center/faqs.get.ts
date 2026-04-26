type ReservationDto = {
  id: number
  statut?: string | null
}

type ComplaintDto = {
  id: number
  statut?: string | null
}

type HelpCenterFaq = {
  id: string
  question: string
  answer: string
  category: 'Booking' | 'Payments' | 'Cancellation' | 'Support'
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const base = config.apiServerBase

  let reservations: ReservationDto[] = []
  let complaints: ComplaintDto[] = []

  try {
    const [reservationData, complaintData] = await Promise.all([
      $fetch<ReservationDto[]>(`${base}/reservations`),
      $fetch<ComplaintDto[]>(`${base}/reclamations`).catch(() => []),
    ])

    reservations = Array.isArray(reservationData) ? reservationData : []
    complaints = Array.isArray(complaintData) ? complaintData : []
  } catch {
    // Keep endpoint resilient: front page should still render even if backend is down.
    reservations = []
    complaints = []
  }

  const totalReservations = reservations.length
  const pendingReservations = reservations.filter((item) => item.statut === 'EN_ATTENTE').length
  const cancelledReservations = reservations.filter((item) => item.statut === 'ANNULEE').length

  const openTickets = complaints.filter(
    (item) => item.statut === 'OUVERTE' || item.statut === 'EN_COURS',
  ).length
  const resolvedTickets = complaints.filter(
    (item) => item.statut === 'RESOLUE' || item.statut === 'FERMEE',
  ).length

  const cancellationRate =
    totalReservations > 0
      ? Math.round((cancelledReservations / totalReservations) * 100)
      : 0

  const faqs: HelpCenterFaq[] = [
    {
      id: 'track-bookings',
      category: 'Booking',
      question: 'How can I see my active and past bookings?',
      answer:
        'Use the My Bookings page to see your reservation timeline, status updates, and booking references in one place.',
    },
    {
      id: 'update-payment',
      category: 'Payments',
      question: 'Can I update my payment information before check-in?',
      answer:
        'Yes. Update your payment details from your account profile before your arrival date to avoid booking disruptions.',
    },
    {
      id: 'cancellation-window',
      category: 'Cancellation',
      question: 'How do cancellation rules apply to my reservation?',
      answer: `Current cancellation trend is ${cancellationRate}% across recorded bookings. Your exact refund and deadline depend on the policy attached to your booking.`,
    },
    {
      id: 'support-response',
      category: 'Support',
      question: 'How long does support take to respond?',
      answer: `We are currently handling ${openTickets} open support tickets and have resolved ${resolvedTickets} tickets recently.`,
    },
    {
      id: 'pending-bookings',
      category: 'Booking',
      question: 'What does "Pending" mean on a booking?',
      answer: `Pending means the reservation is still being validated. Right now, ${pendingReservations} bookings are in pending state.`,
    },
  ]

  return {
    updatedAt: new Date().toISOString(),
    stats: {
      totalReservations,
      pendingReservations,
      openTickets,
      resolvedTickets,
    },
    faqs,
  }
})
