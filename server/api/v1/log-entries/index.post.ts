import { z } from 'zod'
import { LogLevelEnum } from '#shared/types/log-level'
import { getDatabaseService } from '~~/server/services/database.service'
import { getLogLevelService } from '~~/server/services/log-level.service'

const bodySchema = z.object({
  level: z.enum(LogLevelEnum),
  message: z.string().min(1),
  timestamp: z.number().min(1).optional(),
  metadata: z.object({}).passthrough().optional()
})

export default defineApiKeyAuthenticatedEventHandler(async (event): Promise<LogEntryApiDto> => {
  const bodyValidationResult = await readValidatedBody(event, bodySchema.safeParse)
  if (!bodyValidationResult.success) {
    throw useValidationError(zodIssuesToValidationErrors(bodyValidationResult.error.issues))
  }
  const databaseService = getDatabaseService()
  const logLevelService = getLogLevelService()
  const { level, message, timestamp, metadata } = bodyValidationResult.data
  const logEntryModel = await databaseService.logEntry.create({
    data: {
      message,
      level: logLevelService.convertToDbFormat(level),
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      metadata: metadata ? metadata as object : undefined,
      projectId: event.context.apiKey.projectId
    }
  })
  return {
    id: logEntryModel.id,
    timestamp: logEntryModel.timestamp.toISOString(),
    level: logLevelService.convertFromDbFormat(logEntryModel.level),
    message: logEntryModel.message,
    metadata: logEntryModel.metadata || null
  }
})
