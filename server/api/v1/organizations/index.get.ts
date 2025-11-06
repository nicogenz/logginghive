import { getDatabaseService } from '~~/server/services/database.service'

export default defineSessionAuthenticatedEventHandler(async (event): Promise<OrganizationApiDto[]> => {
  const databaseService = getDatabaseService()
  const organizationModels = await databaseService.organization.findMany({
    where: {
      members: {
        some: { userId: event.context.session.userId }
      }
    },
    include: { members: true, projects: true }
  })
  return organizationModels.map((organizationModel): OrganizationApiDto => ({
    id: organizationModel.id,
    name: organizationModel.name,
    members: organizationModel.members.map((member) => member.id),
    projects: organizationModel.projects.map((project) => project.id)
  }))
})
