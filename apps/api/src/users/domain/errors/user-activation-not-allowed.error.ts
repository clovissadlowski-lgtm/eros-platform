import { DomainError } from '../../../common/errors/domain-error';
import { UserStatus } from '../entities/user.entity';

export class UserActivationNotAllowedError extends DomainError {
  constructor(
    readonly userId: string,
    readonly currentStatus: UserStatus,
  ) {
    super({
      code: 'USER_ACTIVATION_NOT_ALLOWED',
      message:
        'The user cannot be activated from the current status.',
      statusCode: 409,
      details: {
        userId,
        currentStatus,
      },
    });

    this.name =
      'UserActivationNotAllowedError';
  }
}