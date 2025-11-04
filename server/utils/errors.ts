import type { $ZodIssue } from 'zod/v4/core'

export const zodIssuesToValidationErrors = (issues: $ZodIssue[]): ValidationErrorApiDto[] => {
  return issues.map(zodIssueToValidationError)
}

const zodIssueToValidationError = (issue: $ZodIssue): ValidationErrorApiDto => {
  return {
    property: issue.path[0].toString(),
    message: issue.message
  }
}

export const useValidationError = (errors: ValidationErrorApiDto[]) => {
  return createError({ statusCode: 400, data: errors })
}

export const useNotFoundError = (message: string) => {
  return createError({ statusCode: 404, statusMessage: message })
}

export const useUnauthorizedError = () => {
  return createError({ statusCode: 401, statusMessage: 'Unauthorized' })
}

export const useForbiddenError = () => {
  return createError({ statusCode: 403, statusMessage: 'Forbidden' })
}

export const useInternalServerError = (message: string) => {
  return createError({ statusCode: 500, statusMessage: message })
}
