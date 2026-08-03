import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../common/database/prisma.service';
import { Session } from '../../domain/entities/session.entity';
import {
  RefreshSessionTransaction,
  RotateRefreshSessionInput,
} from '../../domain/transactions/refresh-session.transaction';

interface PrismaSessionRecord {
  id: string;
  userId: string;
  refreshTokenHash: string;
  ipAddress: string | null;
  userAgent: string | null;
  expiresAt: Date;
  lastUsedAt: Date | null;
  revokedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class PrismaRefreshSessionTransaction
  implements RefreshSessionTransaction
{
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async execute(
    input: RotateRefreshSessionInput,
  ): Promise<Session | null> {
    return this.prisma.$transaction(
      async (transaction) => {
        const updateResult =
          await transaction.session.updateMany({
            where: {
              id: input.session.id,
              refreshTokenHash:
                input.expectedRefreshTokenHash,
              revokedAt: null,
              expiresAt: {
                gt: new Date(input.now),
              },
            },
            data: {
              refreshTokenHash:
                input.session.refreshTokenHash,
              lastUsedAt:
                input.session.lastUsedAt
                  ? new Date(
                      input.session.lastUsedAt,
                    )
                  : null,
              updatedAt: new Date(
                input.session.updatedAt,
              ),
            },
          });

        if (updateResult.count !== 1) {
          return null;
        }

        const updatedSession =
          await transaction.session.findUnique({
            where: {
              id: input.session.id,
            },
          });

        return updatedSession
          ? this.toDomain(updatedSession)
          : null;
      },
    );
  }

  private toDomain(
    session: PrismaSessionRecord,
  ): Session {
    return {
      id: session.id,
      userId: session.userId,
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