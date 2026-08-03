import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../common/database/prisma.service';
import { Session } from '../../domain/entities/session.entity';
import { SessionsRepository } from '../../domain/repositories/sessions.repository';

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
export class PrismaSessionsRepository
  implements SessionsRepository
{
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    session: Session,
  ): Promise<Session> {
    const createdSession =
      await this.prisma.session.create({
        data: {
          id: session.id,
          userId: session.userId,
          refreshTokenHash:
            session.refreshTokenHash,
          ipAddress: session.ipAddress,
          userAgent: session.userAgent,
          expiresAt: new Date(
            session.expiresAt,
          ),
          lastUsedAt: session.lastUsedAt
            ? new Date(session.lastUsedAt)
            : null,
          revokedAt: session.revokedAt
            ? new Date(session.revokedAt)
            : null,
          createdAt: new Date(
            session.createdAt,
          ),
          updatedAt: new Date(
            session.updatedAt,
          ),
        },
      });

    return this.toDomain(createdSession);
  }

  async findById(
    sessionId: string,
  ): Promise<Session | null> {
    const session =
      await this.prisma.session.findUnique({
        where: {
          id: sessionId,
        },
      });

    return session
      ? this.toDomain(session)
      : null;
  }

  async findByRefreshTokenHash(
    refreshTokenHash: string,
  ): Promise<Session | null> {
    const session =
      await this.prisma.session.findUnique({
        where: {
          refreshTokenHash,
        },
      });

    return session
      ? this.toDomain(session)
      : null;
  }

  async listActiveByUserId(
    userId: string,
    now: string,
  ): Promise<Session[]> {
    const sessions =
      await this.prisma.session.findMany({
        where: {
          userId,
          revokedAt: null,
          expiresAt: {
            gt: new Date(now),
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

    return sessions.map(
      (session) => this.toDomain(session),
    );
  }

  async update(
    session: Session,
  ): Promise<Session> {
    const updatedSession =
      await this.prisma.session.update({
        where: {
          id: session.id,
        },
        data: {
          refreshTokenHash:
            session.refreshTokenHash,
          ipAddress: session.ipAddress,
          userAgent: session.userAgent,
          expiresAt: new Date(
            session.expiresAt,
          ),
          lastUsedAt: session.lastUsedAt
            ? new Date(session.lastUsedAt)
            : null,
          revokedAt: session.revokedAt
            ? new Date(session.revokedAt)
            : null,
          updatedAt: new Date(
            session.updatedAt,
          ),
        },
      });

    return this.toDomain(updatedSession);
  }

  async revokeAllByUserId(
    userId: string,
    revokedAt: string,
  ): Promise<number> {
    const result =
      await this.prisma.session.updateMany({
        where: {
          userId,
          revokedAt: null,
        },
        data: {
          revokedAt: new Date(revokedAt),
          updatedAt: new Date(revokedAt),
        },
      });

    return result.count;
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