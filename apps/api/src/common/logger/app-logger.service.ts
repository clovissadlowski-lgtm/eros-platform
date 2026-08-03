import {
  Injectable,
  LoggerService,
} from '@nestjs/common';

import { LogLevel } from './log-level.type';
import { LogMetadata } from './log-metadata.interface';

interface StructuredLog {
  timestamp: string;
  level: LogLevel;
  message: unknown;
  context?: string;
  metadata?: LogMetadata;
}

@Injectable()
export class AppLogger implements LoggerService {
  log(
    message: unknown,
    ...optionalParams: unknown[]
  ): void {
    this.write(
      'log',
      message,
      optionalParams,
    );
  }

  error(
    message: unknown,
    ...optionalParams: unknown[]
  ): void {
    this.write(
      'error',
      message,
      optionalParams,
    );
  }

  warn(
    message: unknown,
    ...optionalParams: unknown[]
  ): void {
    this.write(
      'warn',
      message,
      optionalParams,
    );
  }

  debug(
    message: unknown,
    ...optionalParams: unknown[]
  ): void {
    this.write(
      'debug',
      message,
      optionalParams,
    );
  }

  verbose(
    message: unknown,
    ...optionalParams: unknown[]
  ): void {
    this.write(
      'verbose',
      message,
      optionalParams,
    );
  }

  fatal(
    message: unknown,
    ...optionalParams: unknown[]
  ): void {
    this.write(
      'fatal',
      message,
      optionalParams,
    );
  }

  private write(
    level: LogLevel,
    message: unknown,
    optionalParams: unknown[],
  ): void {
    const metadata =
      this.extractMetadata(optionalParams);

    const entry: StructuredLog = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: metadata?.context,
      metadata,
    };

    const serializedEntry =
      JSON.stringify(entry);

    if (
      level === 'error' ||
      level === 'fatal'
    ) {
      console.error(serializedEntry);
      return;
    }

    if (level === 'warn') {
      console.warn(serializedEntry);
      return;
    }

    console.log(serializedEntry);
  }

  private extractMetadata(
    optionalParams: unknown[],
  ): LogMetadata | undefined {
    const firstParam = optionalParams[0];

    if (
      typeof firstParam === 'object' &&
      firstParam !== null &&
      !Array.isArray(firstParam)
    ) {
      return firstParam as LogMetadata;
    }

    if (typeof firstParam === 'string') {
      return {
        context: firstParam,
      };
    }

    return undefined;
  }
}