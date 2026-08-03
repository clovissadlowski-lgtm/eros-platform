import { DomainError } from '../../../common/errors/domain-error';

export class InvitationDataConflictError extends DomainError {
  constructor(
    readonly invitationId: string,
  ) {
    super({
      code: 'INVITATION_DATA_CONFLICT',
      message:
        'The invitation data is inconsistent with the associated account.',
      statusCode: 409,
      details: {
        invitationId,
      },
    });

    this.name = 'InvitationDataConflictError';
  }
}