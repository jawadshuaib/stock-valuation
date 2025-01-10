interface ValidationErrorDetail {
  code: string;
  message: string;
}

class ValidationError extends Error {
  errors: ValidationErrorDetail[];

  constructor(errors: ValidationErrorDetail[]) {
    super('Validation Error');
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

export default ValidationError;
