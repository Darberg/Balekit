export class BaleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BaleError';
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class BaleApiError extends BaleError {
  code?: number;
  response?: Record<string, unknown>;

  constructor(
    message: string,
    code?: number,
    response?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'BaleApiError';
    this.code = code;
    this.response = response;
  }
}
