import { DomainError } from '../../../common/errors/domain-error';

export class MembershipAlreadyExistsError extends DomainError {
  constructor(
    readonly userId: string,
    readonly organizationId: string,
  ) {
    super({
      code: 'MEMBERSHIP_ALREADY_EXISTS',
      message:
        'The user already belongs to this organization.',
      statusCode: 409,
      details: {
        userId,
        organizationId,
      },
    });

    this.name = 'MembershipAlreadyExistsError';
  }
}