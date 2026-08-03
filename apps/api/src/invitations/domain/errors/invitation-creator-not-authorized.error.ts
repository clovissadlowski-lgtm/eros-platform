import { DomainError } from '../../../common/errors/domain-error';

export class InvitationCreatorNotAuthorizedError extends DomainError {
  constructor(
    readonly membershipId: string,
  ) {
    super({
      code:
        'INVITATION_CREATOR_NOT_AUTHORIZED',
      message:
        'The membership is not authorized to create invitations.',
      statusCode: 403,
      details: {
        membershipId,
      },
    });

    this.name =
      'InvitationCreatorNotAuthorizedError';
  }
}