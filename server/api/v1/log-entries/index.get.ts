import { z } from 'zod'
import { getDatabaseService } from '~~/server/services/database.service'
import { getLogLevelService } from '~~/server/services/log-level.service'

const querySchema = z.object({
  projectId: z.uuidv7()
})

export default defineSessionAuthenticatedEventHandler(async (event): Promise<LogEntryApiDto[]> => {
  const queryValidationResult = await getValidatedQuery(event, querySchema.safeParse)
  if (!queryValidationResult.success) {
    throw useValidationError(zodIssuesToValidationErrors(queryValidationResult.error.issues))
  }
  const databaseService = getDatabaseService()
  const logLevelService = getLogLevelService()
  const { projectId } = queryValidationResult.data
  const logEntries = await databaseService.logEntry.findMany({
    where: { projectId },
    orderBy: { timestamp: 'desc' },
    take: 100
  })
  return logEntries.map((logEntry): LogEntryApiDto => ({
    id: logEntry.id,
    timestamp: logEntry.timestamp.toISOString(),
    level: logLevelService.convertFromDbFormat(logEntry.level),
    message: logEntry.message,
    metadata: logEntry.metadata || null
  }))
})
