export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const hotelId = getRouterParam(event, 'hotelId')

  if (!hotelId) {
    setResponseStatus(event, 400)
    return []
  }

  try {
    // Try backend filtered endpoint first (if available)
    const filtered = await $fetch<any[]>(`${config.apiServerBase}/avis/hotel/${hotelId}`)
    return Array.isArray(filtered) ? filtered : []
  } catch {
    // Fallback: fetch all reviews and filter by reservation.hotelId/hotel_id
    try {
      const all = await $fetch<any[]>(`${config.apiServerBase}/avis`)
      if (!Array.isArray(all)) return []

      const idNum = Number(hotelId)
      return all.filter((r: any) => {
        const fromReservation = r?.reservation?.hotelId ?? r?.reservation?.hotel_id
        const direct = r?.hotelId ?? r?.hotel_id
        return Number(fromReservation ?? direct) === idNum
      })
    } catch {
      // Keep endpoint non-failing for client pages
      return []
    }
  }
})
