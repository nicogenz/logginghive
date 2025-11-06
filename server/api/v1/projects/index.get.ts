import { getDatabaseService } from '~~/server/services/database.service'

export default defineSessionAuthenticatedEventHandler(async (event): Promise<ProjectApiDto[]> => {
  const databaseService = getDatabaseService()
  const projectModels = await databaseService.project.findMany({
    where: {
      members: {
        every: { userId: event.context.session.userId }
      }
    }
  })
  return projectModels.map((projectModel) => ({
    id: projectModel.id,
    name: projectModel.name,
    organizationId: projectModel.organizationId
  }))
})
