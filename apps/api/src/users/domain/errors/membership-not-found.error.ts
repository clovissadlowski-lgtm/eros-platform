import { DomainError } from '../../../common/errors/domain-error';

export class MembershipNotFoundError extends DomainError {
  constructor() {
    super({
      code: 'MEMBERSHIP_NOT_FOUND',
      message: 'Membership not found.',
      statusCode: 404,
    });

    this.name = 'MembershipNotFoundError';
  }
}