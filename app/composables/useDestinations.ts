import { ref } from 'vue'
import { useAsyncAction } from '~/composables/useAsyncAction'
import { apiRequest } from '~/repositories/api/client'

export interface CityDestination {
  ville: string
  count: number
}

export function useDestinations() {
  const destinations = ref<CityDestination[]>([])
  const { loading, error, execute } = useAsyncAction()

  async function fetchDestinations() {
    const data = await execute(
      () => apiRequest<CityDestination[]>('/hotels/destinations'),
      [],
    )

    destinations.value = [...data].sort((a, b) => a.ville.localeCompare(b.ville))
  }

  return { destinations, loading, error, fetchDestinations }
}
