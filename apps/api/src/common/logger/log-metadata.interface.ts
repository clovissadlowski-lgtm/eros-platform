export interface LogMetadata {
  requestId?: string;
  context?: string;
  method?: string;
  path?: string;
  statusCode?: number;
  durationMs?: number;
  errorName?: string;
  stack?: string;
  [key: string]: unknown;
}
