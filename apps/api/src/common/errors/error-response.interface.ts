export interface ErrorResponse {
  statusCode: number;
  code: string;
  message: string;
  details: unknown;
  requestId: string | null;
  timestamp: string;
  path: string;
}
