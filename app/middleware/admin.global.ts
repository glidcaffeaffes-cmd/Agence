export default defineNuxtRouteMiddleware((to) => {
  if (!to.path.startsWith('/admin')) {
    return
  }

  const { isAuthenticated, currentAccount } = useAuth()

  if (!isAuthenticated.value) {
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath },
    })
  }

  if (currentAccount.value?.role !== 'admin') {
    return navigateTo('/')
  }
})
