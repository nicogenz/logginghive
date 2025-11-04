import { getDatabaseService } from '~~/server/services/database.service'

export default defineSessionAuthenticatedEventHandler(async (): Promise<ProjectApiDto[]> => {
  const databaseService = getDatabaseService()
  const projectModels = await databaseService.project.findMany()
  return projectModels.map((projectModel) => ({
    id: projectModel.id,
    name: projectModel.name
  }))
})
