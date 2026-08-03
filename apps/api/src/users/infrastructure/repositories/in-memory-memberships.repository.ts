import { Injectable } from '@nestjs/common';

import { Membership } from '../../domain/entities/membership.entity';
import { MembershipsRepository } from '../../domain/repositories/memberships.repository';

@Injectable()
export class InMemoryMembershipsRepository
  implements MembershipsRepository
{
  private readonly memberships: Membership[] =
    [];

  async create(
    membership: Membership,
  ): Promise<Membership> {
    this.memberships.push(membership);

    return membership;
  }

  async findById(
    membershipId: string,
  ): Promise<Membership | null> {
    return (
      this.memberships.find(
        (membership) =>
          membership.id === membershipId,
      ) ?? null
    );
  }

  async findByUserAndOrganization(
    userId: string,
    organizationId: string,
  ): Promise<Membership | null> {
    return (
      this.memberships.find(
        (membership) =>
          membership.userId === userId &&
          membership.organizationId ===
            organizationId,
      ) ?? null
    );
  }

  async listByUser(
    userId: string,
  ): Promise<Membership[]> {
    return this.memberships.filter(
      (membership) =>
        membership.userId === userId,
    );
  }

  async listByOrganization(
    organizationId: string,
  ): Promise<Membership[]> {
    return this.memberships.filter(
      (membership) =>
        membership.organizationId ===
        organizationId,
    );
  }

  async update(
    membership: Membership,
  ): Promise<Membership> {
    const membershipIndex =
      this.memberships.findIndex(
        (storedMembership) =>
          storedMembership.id ===
          membership.id,
      );

    if (membershipIndex === -1) {
      this.memberships.push(membership);

      return membership;
    }

    this.memberships[membershipIndex] =
      membership;

    return membership;
  }
}