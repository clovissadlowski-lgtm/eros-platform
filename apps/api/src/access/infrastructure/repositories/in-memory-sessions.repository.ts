import { Injectable } from '@nestjs/common';

import { Session } from '../../domain/entities/session.entity';
import { SessionsRepository } from '../../domain/repositories/sessions.repository';

@Injectable()
export class InMemorySessionsRepository
  implements SessionsRepository
{
  private readonly sessions: Session[] = [];

  async create(
    session: Session,
  ): Promise<Session> {
    this.sessions.push(session);

    return session;
  }

  async findById(
    sessionId: string,
  ): Promise<Session | null> {
    return (
      this.sessions.find(
        (session) =>
          session.id === sessionId,
      ) ?? null
    );
  }

  async findByRefreshTokenHash(
    refreshTokenHash: string,
  ): Promise<Session | null> {
    return (
      this.sessions.find(
        (session) =>
          session.refreshTokenHash ===
          refreshTokenHash,
      ) ?? null
    );
  }

  async listActiveByUserId(
    userId: string,
    now: string,
  ): Promise<Session[]> {
    const nowTimestamp = new Date(
      now,
    ).getTime();

    return this.sessions.filter(
      (session) =>
        session.userId === userId &&
        session.revokedAt === null &&
        new Date(
          session.expiresAt,
        ).getTime() > nowTimestamp,
    );
  }

  async update(
    session: Session,
  ): Promise<Session> {
    const sessionIndex =
      this.sessions.findIndex(
        (storedSession) =>
          storedSession.id === session.id,
      );

    if (sessionIndex === -1) {
      this.sessions.push(session);

      return session;
    }

    this.sessions[sessionIndex] = session;

    return session;
  }

  async revokeAllByUserId(
    userId: string,
    revokedAt: string,
  ): Promise<number> {
    let revokedSessions = 0;

    for (
      let index = 0;
      index < this.sessions.length;
      index += 1
    ) {
      const session = this.sessions[index];

      if (
        session.userId !== userId ||
        session.revokedAt !== null
      ) {
        continue;
      }

      this.sessions[index] = {
        ...session,
        revokedAt,
        updatedAt: revokedAt,
      };

      revokedSessions += 1;
    }

    return revokedSessions;
  }
}