import type { AuthenticatedRequestContext } from '../../access/domain/authentication/authenticated-request-context';

declare global {
  namespace Express {
    interface Request {
      requestId: string;
      auth?: AuthenticatedRequestContext;
    }
  }
}

export {};