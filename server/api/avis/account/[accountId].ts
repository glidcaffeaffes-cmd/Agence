export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const accountId = getRouterParam(event, 'accountId')

  if (!accountId) {
    setResponseStatus(event, 400)
    return []
  }

  try {
    // Try backend filtered endpoint first (if available)
    const filtered = await $fetch<any[]>(`${config.apiServerBase}/avis/account/${accountId}`)
    return Array.isArray(filtered) ? filtered : []
  } catch {
    // Fallback: fetch all reviews and filter by reservation.accountId/account_id
    try {
      const all = await $fetch<any[]>(`${config.apiServerBase}/avis`)
      if (!Array.isArray(all)) return []

      const idNum = Number(accountId)
      return all.filter((r: any) => {
        const fromReservation = r?.reservation?.accountId ?? r?.reservation?.account_id
        const direct = r?.accountId ?? r?.account_id
        return Number(fromReservation ?? direct) === idNum
      })
    } catch {
      // Keep endpoint non-failing for client pages
      return []
    }
  }
})
