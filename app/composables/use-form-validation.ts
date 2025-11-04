export function useFormValidation() {
  return {
    mapApiErrorsToFormErrors: (errors: ValidationErrorApiDto[]) => errors.map((error) => ({
      name: error.property,
      message: error.message
    }))
  }
}
