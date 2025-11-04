import { z } from 'zod'
import { getDatabaseService } from '~~/server/services/database.service'
import { getPasswordService } from '~~/server/services/password.service'

const bodySchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6)
})

export default defineSessionAuthenticatedEventHandler(async (event) => {
  const bodyValidationResult = await readValidatedBody(event, bodySchema.safeParse)
  if (!bodyValidationResult.success) {
    throw useValidationError(zodIssuesToValidationErrors(bodyValidationResult.error.issues))
  }
  const { currentPassword, newPassword } = bodyValidationResult.data
  const databaseService = getDatabaseService()
  const passwordService = getPasswordService()
  const userModel = await databaseService.user.findUnique({
    where: { id: event.context.session.userId }
  })
  if (!userModel) {
    throw useNotFoundError('User not found')
  }
  const isCurrentPasswordValid = passwordService.comparePasswords(currentPassword, userModel.password)
  if (!isCurrentPasswordValid) {
    throw useValidationError([{
      property: 'currentPassword',
      message: 'Current password is incorrect'
    }])
  }
  const newHashedPassword = passwordService.hashPassword(newPassword)
  await databaseService.user.update({
    where: { id: userModel.id },
    data: { password: newHashedPassword }
  })
  return sendNoContent(event)
})
