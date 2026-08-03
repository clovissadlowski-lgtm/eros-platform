import { DomainError } from '../../../common/errors/domain-error';

export class InsufficientRoleError extends DomainError {
  constructor() {
    super({
      code: 'INSUFFICIENT_ROLE',
      message:
        'You do not have permission to perform this action.',
      statusCode: 403,
      details: null,
    });

    this.name = 'InsufficientRoleError';
  }
}