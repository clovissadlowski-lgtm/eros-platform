import { DomainError } from '../../../common/errors/domain-error';

export class InvitationNotFoundError extends DomainError {
  constructor() {
    super({
      code: 'INVITATION_NOT_FOUND',
      message: 'Invitation not found.',
      statusCode: 404,
      details: null,
    });

    this.name = 'InvitationNotFoundError';
  }
}