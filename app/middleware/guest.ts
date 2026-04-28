export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated, currentAccount } = useAuth()
  
  if (isAuthenticated.value) {
    const fallbackPath = currentAccount.value?.role === 'admin' ? '/admin' : '/profile'
    const redirect = typeof to.query.redirect === 'string' ? to.query.redirect : fallbackPath
    return navigateTo(redirect.startsWith('/') ? redirect : fallbackPath)
  }
})
