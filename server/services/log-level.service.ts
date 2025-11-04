import { LogLevel } from '@prisma/client'

interface LogLevelService {
  convertToDbFormat(level: LogLevelEnum): LogLevel

  convertFromDbFormat(level: LogLevel): LogLevelEnum
}

class LogLevelServiceImpl implements LogLevelService {
  convertToDbFormat(level: LogLevelEnum): LogLevel {
    if (level === LogLevelEnum.INFO) {
      return LogLevel.INFO
    }
    throw new Error(`Unsupported log level: ${level}`)
  }

  convertFromDbFormat(level: LogLevel): LogLevelEnum {
    if (level === LogLevel.INFO) {
      return LogLevelEnum.INFO
    }
    throw new Error(`Unsupported log level: ${level}`)
  }
}

export const getLogLevelService = (): LogLevelService => {
  return new LogLevelServiceImpl()
}
