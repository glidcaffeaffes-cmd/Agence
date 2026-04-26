type ContactPayload = {
  accountId?: number
  reservationId?: number
  subject?: string
  message?: string
}

type ReservationDto = {
  id: number
  accountId: number
}

type ComplaintDto = {
  id: number
  sujet: string
  statut: string
  dateOuverture: string
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const body = await readBody<ContactPayload>(event)

  const accountId = Number(body?.accountId)
  const reservationId = Number(body?.reservationId)
  const subject = body?.subject?.trim() || ''
  const message = body?.message?.trim() || ''

  if (!Number.isFinite(accountId) || accountId <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'A valid account is required.',
    })
  }

  if (!Number.isFinite(reservationId) || reservationId <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'A valid booking must be selected.',
    })
  }

  if (!subject) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Subject is required.',
    })
  }

  if (message.length < 20) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Message must be at least 20 characters.',
    })
  }

  let reservation: ReservationDto | null = null
  try {
    reservation = await $fetch<ReservationDto>(
      `${config.apiServerBase}/reservations/${reservationId}`,
    )
  } catch {
    throw createError({
      statusCode: 404,
      statusMessage: 'Booking not found.',
    })
  }

  if (!reservation || Number(reservation.accountId) !== accountId) {
    throw createError({
      statusCode: 403,
      statusMessage: 'This booking does not belong to your account.',
    })
  }

  let complaint: ComplaintDto
  try {
    complaint = await $fetch<ComplaintDto>(`${config.apiServerBase}/reclamations`, {
      method: 'POST',
      body: {
        reservationId,
        agenceVoyageId: 1,
        sujet: subject,
        description: message,
        statut: 'OUVERTE',
      },
    })
  } catch (error: any) {
    throw createError({
      statusCode: error?.statusCode || 500,
      statusMessage:
        error?.data?.message ||
        error?.message ||
        'Unable to submit your support request.',
    })
  }

  return {
    success: true,
    ticketId: complaint.id,
    subject: complaint.sujet,
    status: complaint.statut,
    openedAt: complaint.dateOuverture,
  }
})
