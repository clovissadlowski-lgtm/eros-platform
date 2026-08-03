import { DomainError } from '../../../common/errors/domain-error';

export class UserNotFoundError extends DomainError {
  constructor() {
    super({
      code: 'USER_NOT_FOUND',
      message: 'User not found.',
      statusCode: 404,
    });

    this.name = 'UserNotFoundError';
  }
}