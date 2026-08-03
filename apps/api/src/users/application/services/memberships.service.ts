import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import { OrganizationNotFoundError } from '../../../organizations/domain/errors/organization-not-found.error';
import { OrganizationsRepository } from '../../../organizations/domain/repositories/organizations.repository';
import {
  Membership,
  MembershipRole,
  MembershipStatus,
} from '../../domain/entities/membership.entity';
import { MembershipAlreadyExistsError } from '../../domain/errors/membership-already-exists.error';
import { MembershipNotFoundError } from '../../domain/errors/membership-not-found.error';
import { UserNotFoundError } from '../../domain/errors/user-not-found.error';
import { MembershipsRepository } from '../../domain/repositories/memberships.repository';
import { UsersRepository } from '../../domain/repositories/users.repository';

export interface CreateInvitedMembershipInput {
  userId: string;
  organizationId: string;
  role: MembershipRole;
}

@Injectable()
export class MembershipsService {
  constructor(
    private readonly membershipsRepository: MembershipsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly organizationsRepository: OrganizationsRepository,
  ) {}

  async createInvitedMembership(
    input: CreateInvitedMembershipInput,
  ): Promise<Membership> {
    const user =
      await this.usersRepository.findById(
        input.userId,
      );

    if (!user) {
      throw new UserNotFoundError();
    }

    const organization =
      await this.organizationsRepository.findById(
        input.organizationId,
      );

    if (!organization) {
      throw new OrganizationNotFoundError();
    }

    const existingMembership =
      await this.membershipsRepository.findByUserAndOrganization(
        input.userId,
        input.organizationId,
      );

    if (existingMembership) {
      throw new MembershipAlreadyExistsError(
        input.userId,
        input.organizationId,
      );
    }

    const timestamp = new Date().toISOString();

    const membership: Membership = {
      id: randomUUID(),
      userId: input.userId,
      organizationId:
        input.organizationId,
      role: input.role,
      status: MembershipStatus.INVITED,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    return this.membershipsRepository.create(
      membership,
    );
  }

  async getMembershipById(
    membershipId: string,
  ): Promise<Membership> {
    const membership =
      await this.membershipsRepository.findById(
        membershipId,
      );

    if (!membership) {
      throw new MembershipNotFoundError();
    }

    return membership;
  }

  async listMembershipsByUser(
    userId: string,
  ): Promise<Membership[]> {
    const user =
      await this.usersRepository.findById(
        userId,
      );

    if (!user) {
      throw new UserNotFoundError();
    }

    return this.membershipsRepository.listByUser(
      userId,
    );
  }

  async listMembershipsByOrganization(
    organizationId: string,
  ): Promise<Membership[]> {
    const organization =
      await this.organizationsRepository.findById(
        organizationId,
      );

    if (!organization) {
      throw new OrganizationNotFoundError();
    }

    return this.membershipsRepository.listByOrganization(
      organizationId,
    );
  }
}