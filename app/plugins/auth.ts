export default defineNuxtPlugin(async (nuxtApp) => {
  const { initAuth } = useAuth()
  
  // Initialize auth before route middleware runs
  await initAuth()
})
