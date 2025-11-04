import { getDatabaseService } from '~~/server/services/database.service'

export default defineSessionAuthenticatedEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig(event)
  const value = getCookie(event, runtimeConfig.cookie.session.name)
  if (value) {
    await getDatabaseService().session.delete({ where: { token: value } })
    deleteCookie(event, runtimeConfig.cookie.session.name)
  }
  return sendNoContent(event)
})
