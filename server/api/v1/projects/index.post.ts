import { z } from 'zod'
import { getDatabaseService } from '~~/server/services/database.service'
import { ProjectMemberRole } from '@prisma/client'

const bodySchema = z.object({
  name: z.string().min(1),
  organizationId: z.uuidv7()
})

export default defineSessionAuthenticatedEventHandler(async (event): Promise<ProjectApiDto> => {
  const bodyValidationResult = await readValidatedBody(event, bodySchema.safeParse)
  if (!bodyValidationResult.success) {
    throw useValidationError(zodIssuesToValidationErrors(bodyValidationResult.error.issues))
  }
  const databaseService = getDatabaseService()
  const { name, organizationId } = bodyValidationResult.data
  const projectModel = await databaseService.project.create({
    data: {
      name,
      organizationId,
      members: {
        create: {
          userId: event.context.session.userId,
          role: ProjectMemberRole.OWNER
        }
      }
    }
  })
  return {
    id: projectModel.id,
    name: projectModel.name,
    organizationId: projectModel.organizationId
  }
})
