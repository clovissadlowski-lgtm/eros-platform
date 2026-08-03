import { Session } from '../entities/session.entity';

export abstract class SessionsRepository {
  abstract create(
    session: Session,
  ): Promise<Session>;

  abstract findById(
    sessionId: string,
  ): Promise<Session | null>;

  abstract findByRefreshTokenHash(
    refreshTokenHash: string,
  ): Promise<Session | null>;

  abstract listActiveByUserId(
    userId: string,
    now: string,
  ): Promise<Session[]>;

  abstract update(
    session: Session,
  ): Promise<Session>;

  abstract revokeAllByUserId(
    userId: string,
    revokedAt: string,
  ): Promise<number>;
}