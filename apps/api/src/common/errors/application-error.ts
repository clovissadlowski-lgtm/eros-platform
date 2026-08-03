export interface ApplicationErrorOptions {
  code: string;
  message: string;
  statusCode: number;
  details?: unknown;
  cause?: unknown;
}

export class ApplicationError extends Error {
  readonly code: string;
  readonly statusCode: number;
  readonly details: unknown;
  override readonly cause?: unknown;

  constructor(options: ApplicationErrorOptions) {
    super(options.message);

    this.name = 'ApplicationError';
    this.code = options.code;
    this.statusCode = options.statusCode;
    this.details = options.details ?? null;
    this.cause = options.cause;

    Error.captureStackTrace(this, this.constructor);
  }
}
