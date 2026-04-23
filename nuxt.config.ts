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
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700&display=swap' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap' }
      ],
      script: [
        { src: 'https://cdn.tailwindcss.com?plugins=forms,container-queries' },
        { innerHTML: `
          tailwind.config = {
            darkMode: "class",
            theme: {
              extend: {
                colors: { "on-tertiary-fixed": "#241a00", "on-tertiary-fixed-variant": "#584400", "surface-container": "#e7eff6", "on-tertiary": "#ffffff", "on-primary-fixed": "#002020", "secondary-container": "#8fc6fe", "primary-fixed-dim": "#6cd7d7", "primary-container": "#008283", "on-primary-fixed-variant": "#004f50", "tertiary-container": "#c6a857", "inverse-primary": "#6cd7d7", "surface-container-low": "#edf5fc", "on-primary-container": "#f3fffe", "on-secondary-container": "#065283", "secondary-fixed-dim": "#99cbff", "on-tertiary-container": "#4f3d00", "on-secondary-fixed": "#001d34", "error-container": "#ffdad6", "on-secondary": "#ffffff", "surface-container-lowest": "#ffffff", "surface-tint": "#00696a", "tertiary": "#735c10", "surface-bright": "#f5faff", "secondary": "#236294", "on-error-container": "#93000a", "primary": "#006768", "surface-dim": "#d3dbe2", "surface-container-highest": "#dce3eb", "on-primary": "#ffffff", "surface-container-high": "#e1e9f0", "secondary-fixed": "#cfe5ff", "on-surface-variant": "#3d4949", "on-surface": "#151d22", "background": "#f5faff", "outline": "#6d7979", "inverse-surface": "#2a3137", "tertiary-fixed": "#ffe08e", "outline-variant": "#bcc9c8", "on-secondary-fixed-variant": "#004a78", "surface-variant": "#dce3eb", "primary-fixed": "#8af3f4", "surface": "#f5faff", "inverse-on-surface": "#eaf2f9", "tertiary-fixed-dim": "#e3c36f", "on-error": "#ffffff", "error": "#ba1a1a", "on-background": "#151d22" },
                borderRadius: { DEFAULT: "0.25rem", lg: "0.5rem", xl: "0.75rem", full: "9999px" }
              }
            }
          }
        `, type: 'text/javascript' }
      ]
    }
  }
})
