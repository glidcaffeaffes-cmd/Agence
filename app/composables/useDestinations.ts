import { ref } from 'vue'
import { useAsyncAction } from '~/composables/useAsyncAction'
import { apiGetCached } from '~/repositories/api/client'

export interface CityDestination {
  ville: string
  count: number
}

export function useDestinations() {
  const destinations = ref<CityDestination[]>([])
  const { loading, error, execute } = useAsyncAction()

  async function fetchDestinations() {
    destinations.value = await execute(
      () => apiGetCached<CityDestination[]>('/hotels/destinations'),
      [],
    )
  }

  return { destinations, loading, error, fetchDestinations }
}
