import type { H3Event } from 'h3'
import { defineCustomEventHandler } from '~~/server/utils/event-handler'
import { getDatabaseService } from '~~/server/services/database.service'
import type { ApiKey } from '@prisma/client'

const getCurrentApiKey = async (event: H3Event): Promise<ApiKey | null> => {
  const authorizationHeader = getHeader(event, 'Authorization')
  if (!authorizationHeader) {
    return null
  }
  const apiKey = await getDatabaseService().apiKey.findFirst({
    where: { token: authorizationHeader }
  })
  if (!apiKey) {
    return null
  }
  return apiKey
}

export default defineCustomEventHandler(async (event) => {
  event.context.apiKey = await getCurrentApiKey(event)
})
