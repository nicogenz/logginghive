import type { LogLevelEnum } from './log-level'

export interface LogEntryApiDto {
  id: string
  timestamp: string
  level: LogLevelEnum
  message: string
  metadata: any | null // eslint-disable-line @typescript-eslint/no-explicit-any
}
