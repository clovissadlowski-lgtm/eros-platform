import { Invitation } from '../entities/invitation.entity';

export abstract class InvitationsRepository {
  abstract create(
    invitation: Invitation,
  ): Promise<Invitation>;

  abstract findById(
    invitationId: string,
  ): Promise<Invitation | null>;

  abstract findByTokenHash(
    tokenHash: string,
  ): Promise<Invitation | null>;

  abstract findPendingByEmailAndOrganization(
    email: string,
    organizationId: string,
  ): Promise<Invitation | null>;

  abstract listByOrganization(
    organizationId: string,
  ): Promise<Invitation[]>;

  abstract update(
    invitation: Invitation,
  ): Promise<Invitation>;
}