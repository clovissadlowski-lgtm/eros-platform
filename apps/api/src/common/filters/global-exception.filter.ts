import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { ApplicationError } from '../errors/application-error';
import { ErrorResponse } from '../errors/error-response.interface';

interface HttpExceptionBody {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(
    GlobalExceptionFilter.name,
  );

  catch(
    exception: unknown,
    host: ArgumentsHost,
  ): void {
    const httpContext = host.switchToHttp();
    const request =
      httpContext.getRequest<Request>();
    const response =
      httpContext.getResponse<Response>();

    const errorResponse = this.mapException(
      exception,
      request,
    );

    this.logException(
      exception,
      request,
      errorResponse,
    );

    response
      .status(errorResponse.statusCode)
      .json(errorResponse);
  }

  private mapException(
    exception: unknown,
    request: Request,
  ): ErrorResponse {
    const timestamp =
      new Date().toISOString();

    const requestId =
      request.requestId ??
      this.getRequestIdFromHeader(request);

    if (exception instanceof ApplicationError) {
      return {
        statusCode: exception.statusCode,
        code: exception.code,
        message: exception.message,
        details: exception.details,
        requestId,
        timestamp,
        path: request.originalUrl,
      };
    }

    if (exception instanceof HttpException) {
      return this.mapHttpException(
        exception,
        request,
        requestId,
        timestamp,
      );
    }

    return {
      statusCode:
        HttpStatus.INTERNAL_SERVER_ERROR,
      code: 'INTERNAL_ERROR',
      message:
        'An unexpected error occurred.',
      details: null,
      requestId,
      timestamp,
      path: request.originalUrl,
    };
  }

  private mapHttpException(
    exception: HttpException,
    request: Request,
    requestId: string | null,
    timestamp: string,
  ): ErrorResponse {
    const statusCode =
      exception.getStatus();

    const exceptionResponse =
      exception.getResponse();

    if (
      typeof exceptionResponse === 'string'
    ) {
      return {
        statusCode,
        code: this.getDefaultCode(statusCode),
        message: exceptionResponse,
        details: null,
        requestId,
        timestamp,
        path: request.originalUrl,
      };
    }

    const body =
      exceptionResponse as HttpExceptionBody;

    const rawMessage = body.message;

    return {
      statusCode,
      code: this.getDefaultCode(statusCode),
      message: Array.isArray(rawMessage)
        ? 'Request validation failed.'
        : rawMessage ?? exception.message,
      details: Array.isArray(rawMessage)
        ? rawMessage
        : null,
      requestId,
      timestamp,
      path: request.originalUrl,
    };
  }

  private getDefaultCode(
    statusCode: number,
  ): string {
    const codes: Record<number, string> = {
      400: 'VALIDATION_ERROR',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'RESOURCE_NOT_FOUND',
      409: 'CONFLICT',
      422: 'BUSINESS_RULE_VIOLATION',
      429: 'TOO_MANY_REQUESTS',
    };

    return (
      codes[statusCode] ??
      'HTTP_ERROR'
    );
  }

  private getRequestIdFromHeader(
    request: Request,
  ): string | null {
    const value =
      request.headers['x-request-id'];

    if (Array.isArray(value)) {
      return value[0] ?? null;
    }

    return value ?? null;
  }

  private logException(
    exception: unknown,
    request: Request,
    errorResponse: ErrorResponse,
  ): void {
    const context = JSON.stringify({
      method: request.method,
      path: request.originalUrl,
      statusCode:
        errorResponse.statusCode,
      code: errorResponse.code,
      requestId:
        errorResponse.requestId,
    });

    if (
      errorResponse.statusCode >= 500
    ) {
      const stack =
        exception instanceof Error
          ? exception.stack
          : undefined;

      this.logger.error(
        context,
        stack,
      );

      return;
    }

    this.logger.warn(context);
  }
}