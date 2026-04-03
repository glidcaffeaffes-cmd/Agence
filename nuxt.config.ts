// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@primevue/nuxt-module'],
  css: ['bootstrap/dist/css/bootstrap.min.css'],
  primevue: {
    importTheme: { from: '@primeuix/themes/aura', as: 'Aura' },
    options: {
      ripple: true
    }
  }
})
