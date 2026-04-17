<template>
  <div class="client-layout">
    <ClientNavbar />
    <main class="client-main">
      <slot />
    </main>
    <ClientFooter v-if="!hideFooter" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const hideFooter = computed(() => ['/login', '/register'].includes(route.path))
</script>

<style scoped>
.client-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.client-main {
  flex: 1;
}
</style>
