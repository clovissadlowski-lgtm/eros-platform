import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../common/database/prisma.service';
import {
  InvitationStatus as PrismaInvitationStatus,
  MembershipRole as PrismaMembershipRole,
} from '../../../generated/prisma/enums';
import { MembershipRole } from '../../../users/domain/entities/membership.entity';
import {
  Invitation,
  InvitationStatus,
} from '../../domain/entities/invitation.entity';
import { InvitationsRepository } from '../../domain/repositories/invitations.repository';

interface PrismaInvitationRecord {
  id: string;
  organizationId: string;
  userId: string;
  membershipId: string;
  email: string;
  role: PrismaMembershipRole;
  tokenHash: string;
  status: PrismaInvitationStatus;
  expiresAt: Date;
  acceptedAt: Date | null;
  revokedAt: Date | null;
  createdByMembershipId: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class PrismaInvitationsRepository
  implements InvitationsRepository
{
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    invitation: Invitation,
  ): Promise<Invitation> {
    const createdInvitation =
      await this.prisma.invitation.create({
        data: {
          id: invitation.id,
          organizationId:
            invitation.organizationId,
          userId: invitation.userId,
          membershipId:
            invitation.membershipId,
          email: invitation.email,
          role: this.toPrismaRole(
            invitation.role,
          ),
          tokenHash: invitation.tokenHash,
          status: this.toPrismaStatus(
            invitation.status,
          ),
          expiresAt: new Date(
            invitation.expiresAt,
          ),
          acceptedAt: invitation.acceptedAt
            ? new Date(invitation.acceptedAt)
            : null,
          revokedAt: invitation.revokedAt
            ? new Date(invitation.revokedAt)
            : null,
          createdByMembershipId:
            invitation.createdByMembershipId,
          createdAt: new Date(
            invitation.createdAt,
          ),
          updatedAt: new Date(
            invitation.updatedAt,
          ),
        },
      });

    return this.toDomain(createdInvitation);
  }

  async findById(
    invitationId: string,
  ): Promise<Invitation | null> {
    const invitation =
      await this.prisma.invitation.findUnique({
        where: {
          id: invitationId,
        },
      });

    return invitation
      ? this.toDomain(invitation)
      : null;
  }

  async findByTokenHash(
    tokenHash: string,
  ): Promise<Invitation | null> {
    const invitation =
      await this.prisma.invitation.findUnique({
        where: {
          tokenHash,
        },
      });

    return invitation
      ? this.toDomain(invitation)
      : null;
  }

  async findPendingByEmailAndOrganization(
    email: string,
    organizationId: string,
  ): Promise<Invitation | null> {
    const normalizedEmail =
      email.trim().toLowerCase();

    const invitation =
      await this.prisma.invitation.findFirst({
        where: {
          organizationId,
          email: normalizedEmail,
          status:
            PrismaInvitationStatus.PENDING,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

    return invitation
      ? this.toDomain(invitation)
      : null;
  }

  async listByOrganization(
    organizationId: string,
  ): Promise<Invitation[]> {
    const invitations =
      await this.prisma.invitation.findMany({
        where: {
          organizationId,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

    return invitations.map(
      (invitation) =>
        this.toDomain(invitation),
    );
  }

  async update(
    invitation: Invitation,
  ): Promise<Invitation> {
    const updatedInvitation =
      await this.prisma.invitation.update({
        where: {
          id: invitation.id,
        },
        data: {
          email: invitation.email,
          role: this.toPrismaRole(
            invitation.role,
          ),
          tokenHash: invitation.tokenHash,
          status: this.toPrismaStatus(
            invitation.status,
          ),
          expiresAt: new Date(
            invitation.expiresAt,
          ),
          acceptedAt: invitation.acceptedAt
            ? new Date(invitation.acceptedAt)
            : null,
          revokedAt: invitation.revokedAt
            ? new Date(invitation.revokedAt)
            : null,
          updatedAt: new Date(
            invitation.updatedAt,
          ),
        },
      });

    return this.toDomain(
      updatedInvitation,
    );
  }

  private toDomain(
    invitation: PrismaInvitationRecord,
  ): Invitation {
    return {
      id: invitation.id,
      organizationId:
        invitation.organizationId,
      userId: invitation.userId,
      membershipId:
        invitation.membershipId,
      email: invitation.email,
      role: this.toDomainRole(
        invitation.role,
      ),
      tokenHash: invitation.tokenHash,
      status: this.toDomainStatus(
        invitation.status,
      ),
      expiresAt:
        invitation.expiresAt.toISOString(),
      acceptedAt:
        invitation.acceptedAt?.toISOString() ??
        null,
      revokedAt:
        invitation.revokedAt?.toISOString() ??
        null,
      createdByMembershipId:
        invitation.createdByMembershipId,
      createdAt:
        invitation.createdAt.toISOString(),
      updatedAt:
        invitation.updatedAt.toISOString(),
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
    status: InvitationStatus,
  ): PrismaInvitationStatus {
    return status as PrismaInvitationStatus;
  }

  private toDomainStatus(
    status: PrismaInvitationStatus,
  ): InvitationStatus {
    return status as InvitationStatus;
  }
}