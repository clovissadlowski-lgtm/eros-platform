import { DomainError } from '../../../common/errors/domain-error';

export class InvalidCredentialsError extends DomainError {
  constructor() {
    super({
      code: 'INVALID_CREDENTIALS',
      message: 'Invalid email or password.',
      statusCode: 401,
      details: null,
    });

    this.name = 'InvalidCredentialsError';
  }
}