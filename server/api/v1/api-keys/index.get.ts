import { z } from 'zod'
import { getDatabaseService } from '~~/server/services/database.service'

const querySchema = z.object({
  projectId: z.uuidv7()
})

export default defineSessionAuthenticatedEventHandler(async (event): Promise<ApiKeyApiDto[]> => {
  const queryValidationResult = await getValidatedQuery(event, querySchema.safeParse)
  if (!queryValidationResult.success) {
    throw useValidationError(zodIssuesToValidationErrors(queryValidationResult.error.issues))
  }
  const databaseService = getDatabaseService()
  const { projectId } = queryValidationResult.data
  const apiKeys = await databaseService.apiKey.findMany({
    where: { projectId }
  })
  return apiKeys.map((apiKey): ApiKeyApiDto => ({
    id: apiKey.id,
    name: apiKey.name,
    token: apiKey.token,
    projectId: apiKey.projectId
  }))
})
