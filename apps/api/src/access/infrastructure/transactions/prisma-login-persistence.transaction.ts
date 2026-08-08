import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../common/database/prisma.service';
import { UserStatus as PrismaUserStatus } from '../../../generated/prisma/enums';
import {
  User,
  UserStatus,
} from '../../../users/domain/entities/user.entity';
import { Session } from '../../domain/entities/session.entity';
import {
  LoginPersistenceTransaction,
  PersistLoginInput,
  PersistLoginResult,
} from '../../domain/transactions/login-persistence.transaction';

@Injectable()
export class PrismaLoginPersistenceTransaction
  implements LoginPersistenceTransaction
{
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async execute(
    input: PersistLoginInput,
  ): Promise<PersistLoginResult> {
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
                input.user
                  .status as PrismaUserStatus,
              lastLoginAt: input.user.lastLoginAt
                ? new Date(
                    input.user.lastLoginAt,
                  )
                : null,
              updatedAt: new Date(
                input.user.updatedAt,
              ),
            },
          });

        const createdSession =
          await transaction.session.create({
            data: {
              id: input.session.id,
              userId: input.session.userId,
              selectedOrganizationId:
                input.session.selectedOrganizationId,
              refreshTokenHash:
                input.session
                  .refreshTokenHash,
              ipAddress:
                input.session.ipAddress,
              userAgent:
                input.session.userAgent,
              expiresAt: new Date(
                input.session.expiresAt,
              ),
              lastUsedAt:
                input.session.lastUsedAt
                  ? new Date(
                      input.session.lastUsedAt,
                    )
                  : null,
              revokedAt:
                input.session.revokedAt
                  ? new Date(
                      input.session.revokedAt,
                    )
                  : null,
              createdAt: new Date(
                input.session.createdAt,
              ),
              updatedAt: new Date(
                input.session.updatedAt,
              ),
            },
          });

        return {
          user: updatedUser,
          session: createdSession,
        };
      },
    );

    return {
      user: this.toDomainUser(result.user),
      session: this.toDomainSession(
        result.session,
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
      createdAt:
        user.createdAt.toISOString(),
      updatedAt:
        user.updatedAt.toISOString(),
    };
  }

  private toDomainSession(session: {
    id: string;
    userId: string;
    selectedOrganizationId: string | null;
    refreshTokenHash: string;
    ipAddress: string | null;
    userAgent: string | null;
    expiresAt: Date;
    lastUsedAt: Date | null;
    revokedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }): Session {
    return {
      id: session.id,
      userId: session.userId,
      selectedOrganizationId:
        session.selectedOrganizationId,
      refreshTokenHash:
        session.refreshTokenHash,
      ipAddress: session.ipAddress,
      userAgent: session.userAgent,
      expiresAt:
        session.expiresAt.toISOString(),
      lastUsedAt:
        session.lastUsedAt?.toISOString() ??
        null,
      revokedAt:
        session.revokedAt?.toISOString() ??
        null,
      createdAt:
        session.createdAt.toISOString(),
      updatedAt:
        session.updatedAt.toISOString(),
    };
  }
}