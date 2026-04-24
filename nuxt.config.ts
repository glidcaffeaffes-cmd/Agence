import { tailwindRuntimeConfigScript } from './config/tailwind-theme'

const googleFontHref = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'
const runtimeStylesheets = [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
  { rel: 'stylesheet', href: googleFontHref }
] as const

const runtimeScripts = [
  { src: 'https://cdn.tailwindcss.com?plugins=forms,container-queries' },
  { innerHTML: tailwindRuntimeConfigScript, type: 'text/javascript' }
] as const

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  buildDir: '.nuxt-build',
  devtools: { enabled: true },
  vite: {
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
      ]
    }
  },
  runtimeConfig: {
    apiServerBase: process.env.NUXT_SERVER_API_BASE || 'http://127.0.0.1:3001/api',
    public: {
      apiBase: '/api'
    }
  },
  routeRules: {
    // Local Nitro handlers for review filters (avoid backend 404 on /avis/hotel/:id)
    '/api/avis/hotel/**': {},
    '/api/avis/account/**': {},
    '/api/**': {
      proxy: {
        // Point API calls to local Nest backend by default to avoid ngrok loop/403.
        // Override with NUXT_API_PROXY_TARGET when you really need a remote target.
        to: process.env.NUXT_API_PROXY_TARGET || 'http://127.0.0.1:3001/api/**',
        changeOrigin: true
      }
    }
  },
  modules: ['@primevue/nuxt-module'],
  components: [
    { path: '~/components', pathPrefix: false },
  ],
  imports: {
    dirs: ['app/repositories/mock', 'app/repositories']
  },
  css: [
    '~~/assets/styles/base/theme.css'
  ],
  primevue: {
    importTheme: { from: '@primeuix/themes/aura', as: 'Aura' },
    options: {
      ripple: true
    }
  },
  app: {
    head: {
      link: [...runtimeStylesheets],
      script: [...runtimeScripts]
    }
  }
})
