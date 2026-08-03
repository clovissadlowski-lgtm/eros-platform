import {
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';

import { AuthenticatedRequestContext } from '../../domain/authentication/authenticated-request-context';
import { InvalidAccessTokenError } from '../../domain/errors/invalid-access-token.error';

export const CurrentUser =
  createParamDecorator(
    (
      _data: unknown,
      context: ExecutionContext,
    ): AuthenticatedRequestContext => {
      const request =
        context.switchToHttp().getRequest<Request>();

      if (!request.auth) {
        throw new InvalidAccessTokenError();
      }

      return request.auth;
    },
  );