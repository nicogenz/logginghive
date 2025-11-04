import { z } from 'zod'
import { getDatabaseService } from '~~/server/services/database.service'

const bodySchema = z.object({
  name: z.string().min(1)
})

export default defineSessionAuthenticatedEventHandler(async (event): Promise<ProjectApiDto> => {
  const bodyValidationResult = await readValidatedBody(event, bodySchema.safeParse)
  if (!bodyValidationResult.success) {
    throw useValidationError(zodIssuesToValidationErrors(bodyValidationResult.error.issues))
  }
  const databaseService = getDatabaseService()
  const { name } = bodyValidationResult.data
  const projectModel = await databaseService.project.create({
    data: {
      name
    }
  })
  return {
    id: projectModel.id,
    name: projectModel.name
  }
})
