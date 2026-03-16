const publicPages = ['/login']

export default defineNuxtRouteMiddleware(async (to) => {
  if (publicPages.includes(to.path))
    return

  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) {
    await authStore.fetchUser()
  }

  if (!authStore.isAuthenticated) {
    return navigateTo('/login', { replace: true })
  }
})
