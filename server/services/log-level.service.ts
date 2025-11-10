import { LogLevel } from '@prisma/client'

interface LogLevelService {
  convertToDbFormat(level: LogLevelEnum): LogLevel

  convertFromDbFormat(level: LogLevel): LogLevelEnum
}

class LogLevelServiceImpl implements LogLevelService {
  convertToDbFormat(level: LogLevelEnum): LogLevel {
    if (level === LogLevelEnum.DEBUG) {
      return LogLevel.DEBUG
    } else if (level === LogLevelEnum.INFO) {
      return LogLevel.INFO
    } else if (level === LogLevelEnum.WARN) {
      return LogLevel.WARN
    } else if (level === LogLevelEnum.ERROR) {
      return LogLevel.ERROR
    } else if (level === LogLevelEnum.FATAL) {
      return LogLevel.FATAL
    }
    throw new Error(`Unsupported log level: ${level}`)
  }

  convertFromDbFormat(level: LogLevel): LogLevelEnum {
    if (level === LogLevel.DEBUG) {
      return LogLevelEnum.DEBUG
    } else if (level === LogLevel.INFO) {
      return LogLevelEnum.INFO
    } else if (level === LogLevel.WARN) {
      return LogLevelEnum.WARN
    } else if (level === LogLevel.ERROR) {
      return LogLevelEnum.ERROR
    } else if (level === LogLevel.FATAL) {
      return LogLevelEnum.FATAL
    }
    throw new Error(`Unsupported log level: ${level}`)
  }
}

export const getLogLevelService = (): LogLevelService => {
  return new LogLevelServiceImpl()
}
