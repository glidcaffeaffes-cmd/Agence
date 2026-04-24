<template>
  <main class="wishlist-page">
    <Head>
      <title>Wishlist - VoyageHub</title>
      <meta name="description" content="Review your saved VoyageHub hotels." />
    </Head>

    <section class="wishlist-shell">
      <header class="wishlist-header">
        <div>
          <p class="wishlist-header__eyebrow">Saved hotels</p>
          <h1 class="wishlist-header__title">My Wishlist</h1>
        </div>
        <span class="wishlist-header__count">{{ wishlistHotels.length }} saved</span>
      </header>

      <div v-if="wishlistHotels.length > 0" class="wishlist-grid">
        <HotelCard
          v-for="hotel in wishlistHotels"
          :key="hotel.id"
          :hotel="hotel"
          :min-price="getHotelMinPrice(hotel.id)"
        />
      </div>

      <div v-else class="wishlist-empty">
        <span class="material-symbols-outlined">favorite</span>
        <h2>Your wishlist is empty</h2>
        <p>Save hotels from the hotel list and they will appear here.</p>
        <NuxtLink to="/hotels" class="wishlist-empty__link">
          Browse hotels
        </NuxtLink>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useAuthPrompt } from '~/composables/useAuthPrompt'
import { useHotels } from '~/composables/useHotels'
import { useRooms } from '~/composables/useRooms'
import { useWishlist } from '~/composables/useWishlist'

const { isAuthenticated } = useAuth()
const { open: openAuthPrompt } = useAuthPrompt()
const { hotels, fetchAll: fetchHotels } = useHotels()
const { rooms, fetchAll: fetchRooms } = useRooms()
const { hotelIds, hydrate } = useWishlist()

const wishlistHotels = computed(() => {
  const savedIds = new Set(hotelIds.value)
  return hotels.value.filter((hotel) => savedIds.has(hotel.id))
})

function getHotelMinPrice(hotelId: number) {
  const hotelRooms = rooms.value.filter((room) => room.hotelId === hotelId)
  if (hotelRooms.length === 0) {
    return 0
  }

  return Math.min(...hotelRooms.map((room) => room.pricePerNight))
}

onMounted(async () => {
  hydrate()
  if (!isAuthenticated.value) {
    openAuthPrompt({
      redirectTo: '/wishlist',
    })
  }
  await Promise.all([fetchHotels(), fetchRooms()])
})
</script>

<style scoped>
.wishlist-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top, color-mix(in srgb, var(--color-primary-50) 72%, white 28%) 0%, transparent 45%),
    linear-gradient(180deg, var(--color-gray-50) 0%, white 100%);
}

.wishlist-shell {
  width: min(1200px, calc(100% - 48px));
  margin: 0 auto;
  padding: 48px 0 72px;
}

.wishlist-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 28px;
}

.wishlist-header__eyebrow {
  margin: 0 0 6px;
  color: var(--color-primary-600);
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.wishlist-header__title {
  margin: 0;
  color: var(--color-navy-500);
  font-size: 2.1rem;
  line-height: 1.1;
  font-weight: 800;
}

.wishlist-header__count {
  display: inline-flex;
  align-items: center;
  min-height: 2.35rem;
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  background: white;
  border: 1px solid color-mix(in srgb, var(--color-gray-200) 78%, white 22%);
  color: var(--color-gray-600);
  font-size: 0.9rem;
  font-weight: 800;
  white-space: nowrap;
}

.wishlist-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

.wishlist-empty {
  display: grid;
  justify-items: center;
  gap: 12px;
  padding: 72px 24px;
  border: 1px solid color-mix(in srgb, var(--color-gray-200) 78%, white 22%);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.88);
  text-align: center;
  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.06);
}

.wishlist-empty .material-symbols-outlined {
  width: 56px;
  height: 56px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-primary-50) 78%, white 22%);
  color: var(--color-primary-600);
  font-size: 28px;
  font-variation-settings: 'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 28;
}

.wishlist-empty h2 {
  margin: 0;
  color: var(--color-navy-500);
  font-size: 1.45rem;
  font-weight: 800;
}

.wishlist-empty p {
  max-width: 420px;
  margin: 0;
  color: var(--color-gray-500);
  font-size: 0.96rem;
  line-height: 1.55;
}

.wishlist-empty__link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.85rem;
  margin-top: 8px;
  padding: 0 1.15rem;
  border-radius: 14px;
  background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600));
  color: white;
  font-size: 0.92rem;
  font-weight: 800;
  text-decoration: none;
  box-shadow: 0 12px 24px rgba(0, 103, 104, 0.18);
}

@media (max-width: 1024px) {
  .wishlist-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .wishlist-shell {
    width: min(100% - 32px, 1200px);
    padding-top: 32px;
  }

  .wishlist-header {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
  }

  .wishlist-grid {
    grid-template-columns: 1fr;
  }
}
</style>
