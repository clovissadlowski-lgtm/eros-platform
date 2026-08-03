import { DomainError } from '../../../common/errors/domain-error';

export class InvalidRefreshTokenError extends DomainError {
  constructor() {
    super({
      code: 'INVALID_REFRESH_TOKEN',
      message: 'Invalid or expired refresh token.',
      statusCode: 401,
      details: null,
    });

    this.name = 'InvalidRefreshTokenError';
  }
}