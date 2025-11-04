import type { H3Event } from 'h3'
import { defineCustomEventHandler } from '~~/server/utils/event-handler'
import { getDatabaseService } from '~~/server/services/database.service'
import type { Session } from '@prisma/client'

const getCurrentSession = async (event: H3Event): Promise<Session | null> => {
  const runtimeConfig = useRuntimeConfig(event)
  const value = getCookie(event, runtimeConfig.cookie.session.name)
  if (!value) {
    return null
  }
  const session = await getDatabaseService().session.findFirst({
    where: { token: value, expiresAt: { gt: new Date() } }
  })
  if (!session) {
    return null
  }
  return session
}

export default defineCustomEventHandler(async (event) => {
  event.context.session = await getCurrentSession(event)
})
