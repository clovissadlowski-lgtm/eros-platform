import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import { OrganizationNotFoundError } from '../../../organizations/domain/errors/organization-not-found.error';
import { OrganizationsRepository } from '../../../organizations/domain/repositories/organizations.repository';
import {
  Membership,
  MembershipRole,
  MembershipStatus,
} from '../../../users/domain/entities/membership.entity';
import {
  User,
  UserStatus,
} from '../../../users/domain/entities/user.entity';
import { MembershipNotFoundError } from '../../../users/domain/errors/membership-not-found.error';
import { MembershipsRepository } from '../../../users/domain/repositories/memberships.repository';
import { UsersRepository } from '../../../users/domain/repositories/users.repository';
import {
  Invitation,
  InvitationStatus,
} from '../../domain/entities/invitation.entity';
import { InvitationAlreadyExistsError } from '../../domain/errors/invitation-already-exists.error';
import { InvitationCreatorNotAuthorizedError } from '../../domain/errors/invitation-creator-not-authorized.error';
import { InvitationUserConflictError } from '../../domain/errors/invitation-user-conflict.error';
import { InvitationsRepository } from '../../domain/repositories/invitations.repository';
import { InvitationTokenGenerator } from '../../domain/services/invitation-token-generator';
import { InvitationTokenHasher } from '../../domain/services/invitation-token-hasher';

export interface CreateInvitationInput {
  organizationId: string;
  email: string;
  name: string;
  role: MembershipRole;
  createdByMembershipId: string;
}

export interface CreateInvitationResult {
  invitation: Invitation;
  invitationToken: string;
  user: User;
  membership: Membership;
}

@Injectable()
export class CreateInvitationService {
  private static readonly EXPIRATION_HOURS =
    72;

  constructor(
    private readonly invitationsRepository: InvitationsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly membershipsRepository: MembershipsRepository,
    private readonly organizationsRepository: OrganizationsRepository,
    private readonly tokenGenerator: InvitationTokenGenerator,
    private readonly tokenHasher: InvitationTokenHasher,
  ) {}

  async execute(
    input: CreateInvitationInput,
  ): Promise<CreateInvitationResult> {
    const email = this.normalizeEmail(
      input.email,
    );

    const name = input.name.trim();

    const organization =
      await this.organizationsRepository.findById(
        input.organizationId,
      );

    if (!organization) {
      throw new OrganizationNotFoundError();
    }

    const creatorMembership =
      await this.membershipsRepository.findById(
        input.createdByMembershipId,
      );

    if (!creatorMembership) {
      throw new MembershipNotFoundError();
    }

    this.ensureCreatorIsAuthorized(
      creatorMembership,
      input.organizationId,
    );

    const pendingInvitation =
      await this.invitationsRepository.findPendingByEmailAndOrganization(
        email,
        input.organizationId,
      );

    if (pendingInvitation) {
      throw new InvitationAlreadyExistsError(
        email,
        input.organizationId,
      );
    }

    let user =
      await this.usersRepository.findByEmail(
        email,
      );

    if (user) {
      const existingMembership =
        await this.membershipsRepository.findByUserAndOrganization(
          user.id,
          input.organizationId,
        );

      if (existingMembership) {
        throw new InvitationUserConflictError(
          email,
          input.organizationId,
        );
      }
    } else {
      user = await this.createInvitedUser(
        name,
        email,
      );
    }

    const membership =
      await this.createInvitedMembership(
        user.id,
        input.organizationId,
        input.role,
      );

    const invitationToken =
      this.tokenGenerator.generate();

    const tokenHash =
      this.tokenHasher.hash(
        invitationToken,
      );

    const invitation =
      await this.createInvitation({
        organizationId:
          input.organizationId,
        userId: user.id,
        membershipId: membership.id,
        email,
        role: input.role,
        tokenHash,
        createdByMembershipId:
          input.createdByMembershipId,
      });

    return {
      invitation,
      invitationToken,
      user,
      membership,
    };
  }

  private ensureCreatorIsAuthorized(
    membership: Membership,
    organizationId: string,
  ): void {
    const authorizedRoles: MembershipRole[] =
      [
        MembershipRole.OWNER,
        MembershipRole.ADMIN,
      ];

    const authorized =
      membership.organizationId ===
        organizationId &&
      membership.status ===
        MembershipStatus.ACTIVE &&
      authorizedRoles.includes(
        membership.role,
      );

    if (!authorized) {
      throw new InvitationCreatorNotAuthorizedError(
        membership.id,
      );
    }
  }

  private async createInvitedUser(
    name: string,
    email: string,
  ): Promise<User> {
    const timestamp =
      new Date().toISOString();

    const user: User = {
      id: randomUUID(),
      name,
      email,
      passwordHash: null,
      status: UserStatus.INVITED,
      lastLoginAt: null,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    return this.usersRepository.create(user);
  }

  private async createInvitedMembership(
    userId: string,
    organizationId: string,
    role: MembershipRole,
  ): Promise<Membership> {
    const timestamp =
      new Date().toISOString();

    const membership: Membership = {
      id: randomUUID(),
      userId,
      organizationId,
      role,
      status: MembershipStatus.INVITED,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    return this.membershipsRepository.create(
      membership,
    );
  }

  private async createInvitation(
    input: {
      organizationId: string;
      userId: string;
      membershipId: string;
      email: string;
      role: MembershipRole;
      tokenHash: string;
      createdByMembershipId: string;
    },
  ): Promise<Invitation> {
    const now = new Date();

    const expiresAt = new Date(
      now.getTime() +
        CreateInvitationService.EXPIRATION_HOURS *
          60 *
          60 *
          1000,
    );

    const timestamp = now.toISOString();

    const invitation: Invitation = {
      id: randomUUID(),
      organizationId:
        input.organizationId,
      userId: input.userId,
      membershipId: input.membershipId,
      email: input.email,
      role: input.role,
      tokenHash: input.tokenHash,
      status: InvitationStatus.PENDING,
      expiresAt: expiresAt.toISOString(),
      acceptedAt: null,
      revokedAt: null,
      createdByMembershipId:
        input.createdByMembershipId,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    return this.invitationsRepository.create(
      invitation,
    );
  }

  private normalizeEmail(
    email: string,
  ): string {
    return email.trim().toLowerCase();
  }
}