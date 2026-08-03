import {
    Injectable,
    NestMiddleware,
  } from '@nestjs/common';
  import {
    NextFunction,
    Request,
    Response,
  } from 'express';
  import { randomUUID } from 'node:crypto';
  
  @Injectable()
  export class RequestIdMiddleware
    implements NestMiddleware
  {
    use(
      request: Request,
      response: Response,
      next: NextFunction,
    ): void {
      const requestId =
        this.getIncomingRequestId(request) ??
        randomUUID();
      request.requestId = requestId;
  
      response.setHeader(
        'x-request-id',
        requestId,
      );
  
      next();
    }
  
    private getIncomingRequestId(
      request: Request,
    ): string | null {
      const value =
        request.headers['x-request-id'];
  
      if (Array.isArray(value)) {
        return value[0]?.trim() || null;
      }
  
      if (typeof value === 'string') {
        return value.trim() || null;
      }
  
      return null;
    }
  }