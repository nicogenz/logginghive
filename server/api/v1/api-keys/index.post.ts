import { z } from 'zod'
import { getDatabaseService } from '~~/server/services/database.service'

const bodySchema = z.object({
  projectId: z.uuidv7(),
  name: z.string().min(1)
})

export default defineSessionAuthenticatedEventHandler(async (event): Promise<ApiKeyApiDto> => {
  const bodyValidationResult = await readValidatedBody(event, bodySchema.safeParse)
  if (!bodyValidationResult.success) {
    throw useValidationError(zodIssuesToValidationErrors(bodyValidationResult.error.issues))
  }
  const databaseService = getDatabaseService()
  const { projectId, name } = bodyValidationResult.data
  const apiKeyModel = await databaseService.apiKey.create({
    data: {
      name,
      projectId
    }
  })
  return {
    id: apiKeyModel.id,
    name: apiKeyModel.name,
    token: apiKeyModel.token,
    projectId: apiKeyModel.projectId
  }
})
