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
  devtools: { enabled: false },
  devServer: {
    port: 3000
  },
  vite: {
    optimizeDeps: {
      include: [
        'firebase/app',
        'firebase/auth',
        'libphonenumber-js',
        'libphonenumber-js/examples.mobile',
      ]
    }
  },
  runtimeConfig: {
    apiServerBase: process.env.NUXT_SERVER_API_BASE || 'http://127.0.0.1:3001/api',
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '',
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || '',
    public: {
      apiBase: '/api',
      firebaseApiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyCUaicexGRjgBftHdU69pcgvoCKn9ePnXM',
      firebaseAuthDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'agence-2a560.firebaseapp.com',
      firebaseProjectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID || 'agence-2a560',
      firebaseStorageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'agence-2a560.firebasestorage.app',
      firebaseMessagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '502442263010',
      firebaseAppId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID || '1:502442263010:web:58cb205bf2ef26dd2f79bb',
    }
  },
  routeRules: {
    // Local Nitro handlers for review filters (avoid backend 404 on /avis/hotel/:id)
    '/api/avis/hotel/**': {},
    '/api/avis/account/**': {},
    '/api/cloudinary/**': {},
    '/api/help-center/**': {},
    '/api/support/**': {},
    '/api/**': {
      proxy: {
        // Point API calls to local Nest backend by default to avoid ngrok loop/403.
        // Override with NUXT_API_PROXY_TARGET when you really need a remote target.
        to: process.env.NUXT_API_PROXY_TARGET || 'http://127.0.0.1:3001/api/**',
        changeOrigin: true
      }
    }
  },
  modules: ['@primevue/nuxt-module', '@nuxt/ui'],
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
      ripple: true,
    },
    composables: {
      exclude: ['useToast']
    }
  },
   app: {
     head: {
       link: [...runtimeStylesheets],
       script: [...runtimeScripts]
     },
     pageTransition: false
   }
})
