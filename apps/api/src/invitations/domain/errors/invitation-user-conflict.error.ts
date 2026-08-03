import { DomainError } from '../../../common/errors/domain-error';

export class InvitationUserConflictError extends DomainError {
  constructor(
    readonly email: string,
    readonly organizationId: string,
  ) {
    super({
      code: 'INVITATION_USER_CONFLICT',
      message:
        'The user already belongs to this organization.',
      statusCode: 409,
      details: {
        email,
        organizationId,
      },
    });

    this.name = 'InvitationUserConflictError';
  }
}