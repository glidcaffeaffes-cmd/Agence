export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated, isVerified } = useAuth()
  
  if (!isAuthenticated.value) {
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath },
    })
  }

  if (!isVerified.value) {
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath, unverified: '1' },
    })
  }
})
