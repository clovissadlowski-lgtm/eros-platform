import { DomainError } from '../../../common/errors/domain-error';

export class UserEmailAlreadyExistsError extends DomainError {
  constructor(readonly email: string) {
    super({
      code: 'USER_EMAIL_ALREADY_EXISTS',
      message:
        'A user with this email already exists.',
      statusCode: 409,
      details: {
        email,
      },
    });

    this.name =
      'UserEmailAlreadyExistsError';
  }
}