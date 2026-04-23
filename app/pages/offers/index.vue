<template>
  <div class="offers-page">
    <header class="page-header">
      <div class="header-content">
        <h1 class="page-title">Exclusive Offers</h1>
        <p class="page-subtitle">Discover our latest seasonal deals and special packages</p>
      </div>
    </header>

    <div class="page-container">
      <div v-if="offers.length > 0" class="offers-grid">
        <OfferCard 
          v-for="offer in offers" 
          :key="offer.id" 
          :offer="offer" 
        />
      </div>

      <AppEmptyState 
        v-else 
        icon="pi pi-ticket" 
        title="No active offers" 
        description="We don't have any special offers at the moment. Please check back later."
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useOffers } from '~/composables/useOffers'

const { offers, fetchActive } = useOffers()

onMounted(() => {
  fetchActive()
})
</script>

<style scoped>
.offers-page { background: var(--color-bg-soft); min-height: 100vh; padding-bottom: var(--spacing-16); }

.page-header { background: var(--color-surface-primary); border-bottom: 1px solid var(--color-border); padding: var(--spacing-10) var(--spacing-6); margin-bottom: var(--spacing-8); text-align: center; }
.header-content { max-width: 800px; margin: 0 auto; }
.page-title { font-size: var(--font-size-2xl); font-weight: 700; margin: 0 0 var(--spacing-2); color: var(--color-text-primary); }
.page-subtitle { font-size: var(--font-size-base); color: var(--color-text-secondary); margin: 0; }

.page-container { max-width: 1280px; margin: 0 auto; padding: 0 var(--spacing-6); }

.offers-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: var(--spacing-6); }
</style>
