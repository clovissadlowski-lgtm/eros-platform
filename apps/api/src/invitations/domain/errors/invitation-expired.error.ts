import { DomainError } from '../../../common/errors/domain-error';

export class InvitationExpiredError extends DomainError {
  constructor(
    readonly invitationId: string,
    readonly expiresAt: string,
  ) {
    super({
      code: 'INVITATION_EXPIRED',
      message: 'The invitation has expired.',
      statusCode: 410,
      details: {
        invitationId,
        expiresAt,
      },
    });

    this.name = 'InvitationExpiredError';
  }
}