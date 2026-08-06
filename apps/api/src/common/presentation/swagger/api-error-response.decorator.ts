import {
  applyDecorators,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';

import { ErrorResponseDto } from '../dto/error-response.dto';

export interface ApiErrorResponseOptions {
  status: number;
  description: string;
  code: string;
  message: string;
  path: string;
  details?: unknown;
}

export function ApiErrorResponse(
  options: ApiErrorResponseOptions,
): MethodDecorator {
  return applyDecorators(
    ApiExtraModels(ErrorResponseDto),
    ApiResponse({
      status: options.status,
      description:
        options.description,
      content: {
        'application/json': {
          schema: {
            allOf: [
              {
                $ref: getSchemaPath(
                  ErrorResponseDto,
                ),
              },
            ],
            example: {
              statusCode:
                options.status,
              code:
                options.code,
              message:
                options.message,
              details:
                options.details ??
                null,
              requestId:
                'b56a021d-a8aa-4e37-8cba-cc8c9ff91d63',
              timestamp:
                '2026-08-04T13:44:08.849Z',
              path:
                options.path,
            },
          },
        },
      },
    }),
  );
}