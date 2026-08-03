import { DomainError } from '../../../common/errors/domain-error';

export class WeakPasswordError extends DomainError {
  constructor(
    readonly violations: string[],
  ) {
    super({
      code: 'WEAK_PASSWORD',
      message:
        'The password does not meet the security requirements.',
      statusCode: 422,
      details: {
        violations,
      },
    });

    this.name = 'WeakPasswordError';
  }
}