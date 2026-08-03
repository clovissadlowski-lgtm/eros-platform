import { DomainError } from '../../../common/errors/domain-error';

export class InvalidAccessTokenError extends DomainError {
  constructor() {
    super({
      code: 'INVALID_ACCESS_TOKEN',
      message: 'Invalid or expired access token.',
      statusCode: 401,
      details: null,
    });

    this.name = 'InvalidAccessTokenError';
  }
}