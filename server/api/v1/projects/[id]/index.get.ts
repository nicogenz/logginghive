import { z } from 'zod'
import { getDatabaseService } from '~~/server/services/database.service'

const routerParamSchema = z.object({
  id: z.uuidv7()
})

export default defineSessionAuthenticatedEventHandler(async (event): Promise<ProjectApiDto> => {
  const routerParamValidation = await getValidatedRouterParams(event, routerParamSchema.safeParse)
  if (!routerParamValidation.success) {
    throw useValidationError(zodIssuesToValidationErrors(routerParamValidation.error.issues))
  }
  const databaseService = getDatabaseService()
  const { id } = routerParamValidation.data
  const projectModel = await databaseService.project.findUnique({
    where: {
      id,
      members: { every: { userId: event.context.session.userId } }
    }
  })
  if (!projectModel) {
    throw useNotFoundError('Project not found')
  }
  return {
    id: projectModel.id,
    name: projectModel.name,
    organizationId: projectModel.organizationId
  }
})
