import { DomainError } from '../../../common/errors/domain-error';

export class MembershipAccessDeniedError extends DomainError {
  constructor() {
    super({
      code: 'MEMBERSHIP_ACCESS_DENIED',
      message:
        'You do not have active access to this organization.',
      statusCode: 403,
      details: null,
    });

    this.name =
      'MembershipAccessDeniedError';
  }
}