import { z } from 'zod'
import { getDatabaseService } from '~~/server/services/database.service'

const routerParamSchema = z.object({
  id: z.uuidv7()
})

export default defineSessionAuthenticatedEventHandler(async (event) => {
  const routerParamValidation = await getValidatedRouterParams(event, routerParamSchema.safeParse)
  if (!routerParamValidation.success) {
    throw useValidationError(zodIssuesToValidationErrors(routerParamValidation.error.issues))
  }
  const databaseService = getDatabaseService()
  const { id } = routerParamValidation.data
  await databaseService.project.delete({ where: { id } })
  return sendNoContent(event)
})
