import { Injectable } from '@nestjs/common';

import { PasswordHasher } from '../../../auth/domain/services/password-hasher';
import { PasswordPolicy } from '../../../auth/domain/services/password-policy';
import {
  Membership,
  MembershipStatus,
} from '../../../users/domain/entities/membership.entity';
import {
  User,
  UserStatus,
} from '../../../users/domain/entities/user.entity';
import { MembershipNotFoundError } from '../../../users/domain/errors/membership-not-found.error';
import { UserNotFoundError } from '../../../users/domain/errors/user-not-found.error';
import { WeakPasswordError } from '../../../users/domain/errors/weak-password.error';
import { MembershipsRepository } from '../../../users/domain/repositories/memberships.repository';
import { UsersRepository } from '../../../users/domain/repositories/users.repository';
import {
  Invitation,
  InvitationStatus,
} from '../../domain/entities/invitation.entity';
import { InvitationDataConflictError } from '../../domain/errors/invitation-data-conflict.error';
import { InvitationExpiredError } from '../../domain/errors/invitation-expired.error';
import { InvitationNotFoundError } from '../../domain/errors/invitation-not-found.error';
import { InvitationNotPendingError } from '../../domain/errors/invitation-not-pending.error';
import { InvitationsRepository } from '../../domain/repositories/invitations.repository';
import { InvitationTokenHasher } from '../../domain/services/invitation-token-hasher';
import { InvitationAcceptanceTransaction } from '../../domain/transactions/invitation-acceptance.transaction';

export interface AcceptInvitationInput {
  invitationToken: string;
  plainPassword: string;
  name?: string;
}

export interface AcceptInvitationResult {
  invitation: Invitation;
  user: User;
  membership: Membership;
}

@Injectable()
export class AcceptInvitationService {
  constructor(
    private readonly invitationsRepository: InvitationsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly membershipsRepository: MembershipsRepository,
    private readonly invitationTokenHasher: InvitationTokenHasher,
    private readonly passwordPolicy: PasswordPolicy,
    private readonly passwordHasher: PasswordHasher,
    private readonly acceptanceTransaction: InvitationAcceptanceTransaction,
  ) {}

  async execute(
    input: AcceptInvitationInput,
  ): Promise<AcceptInvitationResult> {
    const tokenHash =
      this.invitationTokenHasher.hash(
        input.invitationToken,
      );

    const invitation =
      await this.invitationsRepository.findByTokenHash(
        tokenHash,
      );

    if (!invitation) {
      throw new InvitationNotFoundError();
    }

    if (
      invitation.status !==
      InvitationStatus.PENDING
    ) {
      throw new InvitationNotPendingError(
        invitation.id,
        invitation.status,
      );
    }

    const now = new Date();

    if (
      new Date(invitation.expiresAt).getTime() <=
      now.getTime()
    ) {
      throw new InvitationExpiredError(
        invitation.id,
        invitation.expiresAt,
      );
    }

    const user =
      await this.usersRepository.findById(
        invitation.userId,
      );

    if (!user) {
      throw new UserNotFoundError();
    }

    const membership =
      await this.membershipsRepository.findById(
        invitation.membershipId,
      );

    if (!membership) {
      throw new MembershipNotFoundError();
    }

    this.ensureInvitationConsistency(
      invitation,
      user,
      membership,
    );

    const passwordValidation =
      this.passwordPolicy.validate(
        input.plainPassword,
      );

    if (!passwordValidation.valid) {
      throw new WeakPasswordError(
        passwordValidation.violations,
      );
    }

    const passwordHash =
      await this.passwordHasher.hash(
        input.plainPassword,
      );

    const timestamp = now.toISOString();

    const activatedUser: User = {
      ...user,
      name:
        input.name?.trim() ||
        user.name,
      passwordHash,
      status: UserStatus.ACTIVE,
      updatedAt: timestamp,
    };

    const activatedMembership: Membership = {
      ...membership,
      status: MembershipStatus.ACTIVE,
      updatedAt: timestamp,
    };

    const acceptedInvitation: Invitation = {
      ...invitation,
      status: InvitationStatus.ACCEPTED,
      acceptedAt: timestamp,
      updatedAt: timestamp,
    };

    return this.acceptanceTransaction.execute({
      user: activatedUser,
      membership: activatedMembership,
      invitation: acceptedInvitation,
    });
  }

  private ensureInvitationConsistency(
    invitation: Invitation,
    user: User,
    membership: Membership,
  ): void {
    const consistent =
      invitation.userId === user.id &&
      invitation.email.toLowerCase() ===
        user.email.toLowerCase() &&
      invitation.membershipId ===
        membership.id &&
      invitation.userId ===
        membership.userId &&
      invitation.organizationId ===
        membership.organizationId &&
      invitation.role === membership.role &&
      membership.status ===
        MembershipStatus.INVITED;

    if (!consistent) {
      throw new InvitationDataConflictError(
        invitation.id,
      );
    }

    if (
      user.status !== UserStatus.INVITED &&
      user.status !== UserStatus.ACTIVE
    ) {
      throw new InvitationDataConflictError(
        invitation.id,
      );
    }

    if (
      user.status === UserStatus.INVITED &&
      user.passwordHash !== null
    ) {
      throw new InvitationDataConflictError(
        invitation.id,
      );
    }
  }
}