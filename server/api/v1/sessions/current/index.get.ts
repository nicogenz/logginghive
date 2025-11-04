import { getDatabaseService } from '~~/server/services/database.service'
import { useInternalServerError } from '~~/server/utils/errors'

export default defineSessionAuthenticatedEventHandler(async (event): Promise<SessionApiDto> => {
  const databaseService = getDatabaseService()
  const userModel = await databaseService.user.findUnique({ where: { id: event.context.session.userId } })
  if (!userModel) {
    throw useInternalServerError('User not found')
  }
  return {
    id: event.context.session.id,
    user: {
      id: event.context.session.userId,
      username: userModel.username
    }
  }
})
