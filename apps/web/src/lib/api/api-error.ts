export interface ApiErrorResponse {
  statusCode: number;
  code: string;
  message: string;
  details: unknown;
  requestId: string | null;
  timestamp: string;
  path: string;
}

export class ApiError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly details: unknown;
  readonly requestId: string | null;
  readonly path: string;

  constructor(
    response: ApiErrorResponse,
  ) {
    super(response.message);

    this.name = 'ApiError';
    this.statusCode =
      response.statusCode;
    this.code =
      response.code;
    this.details =
      response.details;
    this.requestId =
      response.requestId;
    this.path =
      response.path;
  }
}