<script setup lang="ts">
import Toast from "primevue/toast";
</script>

<template>
  <Toast
    position="top-right"
    :pt="{
      root: { class: 'app-toast' },
      message: { class: 'app-toast__message' },
      messageContent: { class: 'app-toast__content' },
      messageText: { class: 'app-toast__text' },
      summary: { class: 'app-toast__summary' },
      detail: { class: 'app-toast__detail' },
      closeButton: { class: 'app-toast__close' },
    }"
  />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
