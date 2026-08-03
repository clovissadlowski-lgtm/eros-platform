import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../common/database/prisma.service';
import {
  InvitationStatus as PrismaInvitationStatus,
  MembershipRole as PrismaMembershipRole,
  MembershipStatus as PrismaMembershipStatus,
  UserStatus as PrismaUserStatus,
} from '../../../generated/prisma/enums';
import {
  Invitation,
  InvitationStatus,
} from '../../domain/entities/invitation.entity';
import {
  AcceptInvitationTransactionInput,
  AcceptInvitationTransactionResult,
  InvitationAcceptanceTransaction,
} from '../../domain/transactions/invitation-acceptance.transaction';
import {
  Membership,
  MembershipRole,
  MembershipStatus,
} from '../../../users/domain/entities/membership.entity';
import {
  User,
  UserStatus,
} from '../../../users/domain/entities/user.entity';

@Injectable()
export class PrismaInvitationAcceptanceTransaction
  implements InvitationAcceptanceTransaction
{
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async execute(
    input: AcceptInvitationTransactionInput,
  ): Promise<AcceptInvitationTransactionResult> {
    const result = await this.prisma.$transaction(
      async (transaction) => {
        const updatedUser =
          await transaction.user.update({
            where: {
              id: input.user.id,
            },
            data: {
              name: input.user.name,
              email: input.user.email,
              passwordHash:
                input.user.passwordHash,
              status:
                input.user.status as PrismaUserStatus,
              lastLoginAt:
                input.user.lastLoginAt
                  ? new Date(
                      input.user.lastLoginAt,
                    )
                  : null,
              updatedAt: new Date(
                input.user.updatedAt,
              ),
            },
          });

        const updatedMembership =
          await transaction.membership.update({
            where: {
              id: input.membership.id,
            },
            data: {
              role: input.membership
                .role as PrismaMembershipRole,
              status:
                input.membership
                  .status as PrismaMembershipStatus,
              updatedAt: new Date(
                input.membership.updatedAt,
              ),
            },
          });

        const updatedInvitation =
          await transaction.invitation.update({
            where: {
              id: input.invitation.id,
            },
            data: {
              status:
                input.invitation
                  .status as PrismaInvitationStatus,
              acceptedAt:
                input.invitation.acceptedAt
                  ? new Date(
                      input.invitation.acceptedAt,
                    )
                  : null,
              revokedAt:
                input.invitation.revokedAt
                  ? new Date(
                      input.invitation.revokedAt,
                    )
                  : null,
              updatedAt: new Date(
                input.invitation.updatedAt,
              ),
            },
          });

        return {
          user: updatedUser,
          membership: updatedMembership,
          invitation: updatedInvitation,
        };
      },
    );

    return {
      user: this.toDomainUser(result.user),
      membership: this.toDomainMembership(
        result.membership,
      ),
      invitation: this.toDomainInvitation(
        result.invitation,
      ),
    };
  }

  private toDomainUser(user: {
    id: string;
    name: string;
    email: string;
    passwordHash: string | null;
    status: PrismaUserStatus;
    lastLoginAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      status: user.status as UserStatus,
      lastLoginAt:
        user.lastLoginAt?.toISOString() ??
        null,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  private toDomainMembership(membership: {
    id: string;
    userId: string;
    organizationId: string;
    role: PrismaMembershipRole;
    status: PrismaMembershipStatus;
    createdAt: Date;
    updatedAt: Date;
  }): Membership {
    return {
      id: membership.id,
      userId: membership.userId,
      organizationId:
        membership.organizationId,
      role:
        membership.role as MembershipRole,
      status:
        membership.status as MembershipStatus,
      createdAt:
        membership.createdAt.toISOString(),
      updatedAt:
        membership.updatedAt.toISOString(),
    };
  }

  private toDomainInvitation(invitation: {
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
  }): Invitation {
    return {
      id: invitation.id,
      organizationId:
        invitation.organizationId,
      userId: invitation.userId,
      membershipId:
        invitation.membershipId,
      email: invitation.email,
      role:
        invitation.role as MembershipRole,
      tokenHash: invitation.tokenHash,
      status:
        invitation.status as InvitationStatus,
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
}