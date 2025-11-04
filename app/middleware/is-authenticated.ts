export default defineNuxtRouteMiddleware(() => {
  const { $session } = useNuxtApp()
  const hasSession = $session.hasValidSession.value
  if (!hasSession) {
    return navigateTo('/login')
  }
})
