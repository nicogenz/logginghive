import { getDatabaseService } from '~~/server/services/database.service'
import { z } from 'zod'

const routerParamSchema = z.object({
  id: z.uuidv7()
})

export default defineSessionAuthenticatedEventHandler(async (event): Promise<OrganizationApiDto> => {
  const routerParamValidation = await getValidatedRouterParams(event, routerParamSchema.safeParse)
  if (!routerParamValidation.success) {
    throw useValidationError(zodIssuesToValidationErrors(routerParamValidation.error.issues))
  }
  const { id } = routerParamValidation.data
  const databaseService = getDatabaseService()
  const organizationModel = await databaseService.organization.findUnique({
    where: {
      id,
      members: {
        some: { userId: event.context.session.userId }
      }
    },
    include: { members: true, projects: true },
  })
  if (!organizationModel) {
    throw useNotFoundError('Organization not found')
  }
  return {
    id: organizationModel.id,
    name: organizationModel.name,
    members: organizationModel.members.map((member) => member.id),
    projects: organizationModel.projects.map((project) => project.id)
  }
})
