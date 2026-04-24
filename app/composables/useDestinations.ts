import { ref } from 'vue'
import { useAsyncAction } from '~/composables/useAsyncAction'
import { HotelService } from '~/services/HotelService'

export interface CityDestination {
  ville: string
  count: number
}

const service = new HotelService()

export function useDestinations() {
  const destinations = ref<CityDestination[]>([])
  const { loading, error, execute } = useAsyncAction()

  async function fetchDestinations() {
    const hotels = await execute(() => service.getAll(), [])
    const counts = new Map<string, number>()

    hotels
      .filter((hotel) => hotel.active)
      .forEach((hotel) => {
        counts.set(hotel.city, (counts.get(hotel.city) ?? 0) + 1)
      })

    destinations.value = Array.from(counts.entries())
      .map(([ville, count]) => ({ ville, count }))
      .sort((a, b) => a.ville.localeCompare(b.ville))
  }

  return { destinations, loading, error, fetchDestinations }
}
