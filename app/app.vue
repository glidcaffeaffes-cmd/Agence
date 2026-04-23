<script setup lang="ts">
const { initAuth } = useAuth()
// We use useAsyncData or just top-level await in Nuxt 3 app.vue to ensure auth is ready before page renders
await initAuth()
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
