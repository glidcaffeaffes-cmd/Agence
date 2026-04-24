export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated } = useAuth()
  
  if (isAuthenticated.value) {
    const redirect = typeof to.query.redirect === 'string' ? to.query.redirect : '/profile'
    return navigateTo(redirect.startsWith('/') ? redirect : '/profile')
  }
})
