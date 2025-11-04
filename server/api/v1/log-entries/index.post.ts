import { z } from 'zod'
import { LogLevelEnum } from '#shared/types/log-level'
import { getDatabaseService } from '~~/server/services/database.service'
import { getLogLevelService } from '~~/server/services/log-level.service'

const bodySchema = z.object({
  projectId: z.uuidv7(),
  level: z.enum(LogLevelEnum),
  message: z.string().min(1),
  timestamp: z.number().min(1),
  metadata: z.object({}).passthrough().optional()
})

export default defineApiKeyAuthenticatedEventHandler(async (event) => {
  const bodyValidationResult = await readValidatedBody(event, bodySchema.safeParse)
  if (!bodyValidationResult.success) {
    throw useValidationError(zodIssuesToValidationErrors(bodyValidationResult.error.issues))
  }
  const databaseService = getDatabaseService()
  const logLevelService = getLogLevelService()
  const { projectId, level, message, timestamp, metadata } = bodyValidationResult.data
  if (event.context.apiKey.projectId !== projectId) {
    throw useNotFoundError('Project not found')
  }
  await databaseService.logEntry.create({
    data: {
      message,
      level: logLevelService.convertToDbFormat(level),
      timestamp: new Date(timestamp),
      metadata: metadata ? metadata as object : undefined,
      projectId
    }
  })
})
