<script setup lang="ts">
import Toast from "primevue/toast";

const { locale, currentLocale, dir } = useAppI18n();
const { mode, resolvedTheme } = useThemeMode();

useHead(() => ({
  htmlAttrs: {
    lang: currentLocale.value.htmlLang,
    dir: dir.value,
    class: resolvedTheme.value === "dark" ? "dark" : "light",
    "data-locale": locale.value,
    "data-theme-preference": mode.value,
    "data-theme-resolved": resolvedTheme.value,
  },
}));
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
