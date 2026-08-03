import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../common/database/prisma.service';
import {
  MembershipRole as PrismaMembershipRole,
  MembershipStatus as PrismaMembershipStatus,
} from '../../../generated/prisma/enums';
import {
  Membership,
  MembershipRole,
  MembershipStatus,
} from '../../domain/entities/membership.entity';
import { MembershipsRepository } from '../../domain/repositories/memberships.repository';

interface PrismaMembershipRecord {
  id: string;
  userId: string;
  organizationId: string;
  role: PrismaMembershipRole;
  status: PrismaMembershipStatus;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class PrismaMembershipsRepository
  implements MembershipsRepository
{
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    membership: Membership,
  ): Promise<Membership> {
    const createdMembership =
      await this.prisma.membership.create({
        data: {
          id: membership.id,
          userId: membership.userId,
          organizationId:
            membership.organizationId,
          role: this.toPrismaRole(
            membership.role,
          ),
          status: this.toPrismaStatus(
            membership.status,
          ),
          createdAt: new Date(
            membership.createdAt,
          ),
          updatedAt: new Date(
            membership.updatedAt,
          ),
        },
      });

    return this.toDomain(
      createdMembership,
    );
  }

  async findById(
    membershipId: string,
  ): Promise<Membership | null> {
    const membership =
      await this.prisma.membership.findUnique({
        where: {
          id: membershipId,
        },
      });

    return membership
      ? this.toDomain(membership)
      : null;
  }

  async findByUserAndOrganization(
    userId: string,
    organizationId: string,
  ): Promise<Membership | null> {
    const membership =
      await this.prisma.membership.findUnique({
        where: {
          userId_organizationId: {
            userId,
            organizationId,
          },
        },
      });

    return membership
      ? this.toDomain(membership)
      : null;
  }

  async listByUser(
    userId: string,
  ): Promise<Membership[]> {
    const memberships =
      await this.prisma.membership.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

    return memberships.map(
      (membership) =>
        this.toDomain(membership),
    );
  }

  async listByOrganization(
    organizationId: string,
  ): Promise<Membership[]> {
    const memberships =
      await this.prisma.membership.findMany({
        where: {
          organizationId,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

    return memberships.map(
      (membership) =>
        this.toDomain(membership),
    );
  }

  async update(
    membership: Membership,
  ): Promise<Membership> {
    const updatedMembership =
      await this.prisma.membership.update({
        where: {
          id: membership.id,
        },
        data: {
          role: this.toPrismaRole(
            membership.role,
          ),
          status: this.toPrismaStatus(
            membership.status,
          ),
          updatedAt: new Date(
            membership.updatedAt,
          ),
        },
      });

    return this.toDomain(
      updatedMembership,
    );
  }

  private toDomain(
    membership: PrismaMembershipRecord,
  ): Membership {
    return {
      id: membership.id,
      userId: membership.userId,
      organizationId:
        membership.organizationId,
      role: this.toDomainRole(
        membership.role,
      ),
      status: this.toDomainStatus(
        membership.status,
      ),
      createdAt:
        membership.createdAt.toISOString(),
      updatedAt:
        membership.updatedAt.toISOString(),
    };
  }

  private toPrismaRole(
    role: MembershipRole,
  ): PrismaMembershipRole {
    return role as PrismaMembershipRole;
  }

  private toDomainRole(
    role: PrismaMembershipRole,
  ): MembershipRole {
    return role as MembershipRole;
  }

  private toPrismaStatus(
    status: MembershipStatus,
  ): PrismaMembershipStatus {
    return status as PrismaMembershipStatus;
  }

  private toDomainStatus(
    status: PrismaMembershipStatus,
  ): MembershipStatus {
    return status as MembershipStatus;
  }
}