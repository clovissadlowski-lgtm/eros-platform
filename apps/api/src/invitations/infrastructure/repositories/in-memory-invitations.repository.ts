import { Injectable } from '@nestjs/common';

import {
  Invitation,
  InvitationStatus,
} from '../../domain/entities/invitation.entity';
import { InvitationsRepository } from '../../domain/repositories/invitations.repository';

@Injectable()
export class InMemoryInvitationsRepository
  implements InvitationsRepository
{
  private readonly invitations: Invitation[] =
    [];

  async create(
    invitation: Invitation,
  ): Promise<Invitation> {
    this.invitations.push(invitation);

    return invitation;
  }

  async findById(
    invitationId: string,
  ): Promise<Invitation | null> {
    return (
      this.invitations.find(
        (invitation) =>
          invitation.id === invitationId,
      ) ?? null
    );
  }

  async findByTokenHash(
    tokenHash: string,
  ): Promise<Invitation | null> {
    return (
      this.invitations.find(
        (invitation) =>
          invitation.tokenHash === tokenHash,
      ) ?? null
    );
  }

  async findPendingByEmailAndOrganization(
    email: string,
    organizationId: string,
  ): Promise<Invitation | null> {
    const normalizedEmail =
      email.trim().toLowerCase();

    return (
      this.invitations.find(
        (invitation) =>
          invitation.email.toLowerCase() ===
            normalizedEmail &&
          invitation.organizationId ===
            organizationId &&
          invitation.status ===
            InvitationStatus.PENDING,
      ) ?? null
    );
  }

  async listByOrganization(
    organizationId: string,
  ): Promise<Invitation[]> {
    return this.invitations.filter(
      (invitation) =>
        invitation.organizationId ===
        organizationId,
    );
  }

  async update(
    invitation: Invitation,
  ): Promise<Invitation> {
    const invitationIndex =
      this.invitations.findIndex(
        (storedInvitation) =>
          storedInvitation.id ===
          invitation.id,
      );

    if (invitationIndex === -1) {
      this.invitations.push(invitation);

      return invitation;
    }

    this.invitations[invitationIndex] =
      invitation;

    return invitation;
  }
}