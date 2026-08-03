import {
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import {
  NextFunction,
  Request,
  Response,
} from 'express';

import { AppLogger } from '../logger/app-logger.service';

@Injectable()
export class HttpLoggingMiddleware
  implements NestMiddleware
{
  constructor(
    private readonly logger: AppLogger,
  ) {}

  use(
    request: Request,
    response: Response,
    next: NextFunction,
  ): void {
    const startedAt = Date.now();

    this.logger.log(
      'HTTP request received.',
      {
        context: HttpLoggingMiddleware.name,
        requestId: request.requestId,
        method: request.method,
        path: request.originalUrl,
      },
    );

    response.once(
      'finish',
      () => {
        const durationMs =
          Date.now() - startedAt;

        const metadata = {
          context: HttpLoggingMiddleware.name,
          requestId: request.requestId,
          method: request.method,
          path: request.originalUrl,
          statusCode: response.statusCode,
          durationMs,
        };

        if (response.statusCode >= 500) {
          this.logger.error(
            'HTTP request completed.',
            metadata,
          );

          return;
        }

        if (response.statusCode >= 400) {
          this.logger.warn(
            'HTTP request completed.',
            metadata,
          );

          return;
        }

        this.logger.log(
          'HTTP request completed.',
          metadata,
        );
      },
    );

    next();
  }
}