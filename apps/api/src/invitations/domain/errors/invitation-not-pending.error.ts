import { DomainError } from '../../../common/errors/domain-error';
import { InvitationStatus } from '../entities/invitation.entity';

export class InvitationNotPendingError extends DomainError {
  constructor(
    readonly invitationId: string,
    readonly currentStatus: InvitationStatus,
  ) {
    super({
      code: 'INVITATION_NOT_PENDING',
      message:
        'The invitation can no longer be accepted.',
      statusCode: 409,
      details: {
        invitationId,
        currentStatus,
      },
    });

    this.name = 'InvitationNotPendingError';
  }
}