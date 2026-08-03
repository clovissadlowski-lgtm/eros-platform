import { DomainError } from '../../../common/errors/domain-error';

export class InvitationAlreadyExistsError extends DomainError {
  constructor(
    readonly email: string,
    readonly organizationId: string,
  ) {
    super({
      code: 'INVITATION_ALREADY_EXISTS',
      message:
        'A pending invitation already exists for this email and organization.',
      statusCode: 409,
      details: {
        email,
        organizationId,
      },
    });

    this.name =
      'InvitationAlreadyExistsError';
  }
}