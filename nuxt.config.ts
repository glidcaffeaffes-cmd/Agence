// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@primevue/nuxt-module'],
  css: [
    'bootstrap/dist/css/bootstrap.min.css',
    '~/assets/styles/base/theme.css'
  ],
  primevue: {
    importTheme: { from: '@primeuix/themes/aura', as: 'Aura' },
    options: {
      ripple: true
    }
  },
  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap' }
      ]
    }
  }
})
