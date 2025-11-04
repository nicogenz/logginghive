import { z } from 'zod'
import { getPasswordService } from '~~/server/services/password.service'
import { getDatabaseService } from '~~/server/services/database.service'
import { addSeconds } from 'date-fns'

const bodySchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
})

export default defineUnauthenticatedEventHandler(async (event): Promise<SessionApiDto> => {
  const bodyValidationResult = await readValidatedBody(event, bodySchema.safeParse)
  if (!bodyValidationResult.success) {
    throw useValidationError(zodIssuesToValidationErrors(bodyValidationResult.error.issues))
  }
  const passwordService = getPasswordService()
  const databaseService = getDatabaseService()
  const { username, password } = bodyValidationResult.data
  const userModel = await databaseService.user.findUnique({ where: { username } })
  if (!userModel) {
    throw useValidationError([{ property: 'username', message: 'Invalid username or password' }])
  }
  const isPasswordValid = passwordService.comparePasswords(password, userModel.password)
  if (!isPasswordValid) {
    throw useValidationError([{ property: 'username', message: 'Invalid username or password' }])
  }
  const runtimeConfig = useRuntimeConfig(event)
  const sessionModel = await databaseService.session.create({
    data: {
      userId: userModel.id,
      expiresAt: addSeconds(new Date(), parseInt(runtimeConfig.cookie.session.expirationInSeconds))
    }
  })
  setCookie(event, runtimeConfig.cookie.session.name, sessionModel.token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    expires: sessionModel.expiresAt
  })
  return {
    id: sessionModel.id,
    user: {
      id: sessionModel.userId,
      username
    }
  }
})
