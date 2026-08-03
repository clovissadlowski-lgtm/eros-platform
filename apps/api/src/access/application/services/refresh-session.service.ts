import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  User,
  UserStatus,
} from '../../../users/domain/entities/user.entity';
import { UsersRepository } from '../../../users/domain/repositories/users.repository';
import { Session } from '../../domain/entities/session.entity';
import { InvalidRefreshTokenError } from '../../domain/errors/invalid-refresh-token.error';
import { SessionsRepository } from '../../domain/repositories/sessions.repository';
import { AccessTokenProvider } from '../../domain/tokens/access-token-provider';
import { RefreshTokenGenerator } from '../../domain/tokens/refresh-token-generator';
import { RefreshTokenHasher } from '../../domain/tokens/refresh-token-hasher';
import { RefreshSessionTransaction } from '../../domain/transactions/refresh-session.transaction';

export interface RefreshSessionInput {
  refreshToken: string;
}

export interface RefreshSessionResult {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  session: {
    id: string;
    expiresAt: string;
  };
}

@Injectable()
export class RefreshSessionService {
  constructor(
    private readonly sessionsRepository: SessionsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly accessTokenProvider: AccessTokenProvider,
    private readonly refreshTokenGenerator: RefreshTokenGenerator,
    private readonly refreshTokenHasher: RefreshTokenHasher,
    private readonly refreshSessionTransaction: RefreshSessionTransaction,
    private readonly configService: ConfigService,
  ) {}

  async execute(
    input: RefreshSessionInput,
  ): Promise<RefreshSessionResult> {
    const providedRefreshToken =
      input.refreshToken.trim();

    if (!providedRefreshToken) {
      throw new InvalidRefreshTokenError();
    }

    const currentRefreshTokenHash =
      this.refreshTokenHasher.hash(
        providedRefreshToken,
      );

    const session =
      await this.sessionsRepository.findByRefreshTokenHash(
        currentRefreshTokenHash,
      );

    if (!session) {
      throw new InvalidRefreshTokenError();
    }

    const now = new Date();
    const timestamp = now.toISOString();

    this.ensureSessionCanBeRefreshed(
      session,
      now,
    );

    const user =
      await this.usersRepository.findById(
        session.userId,
      );

    this.ensureUserCanAuthenticate(user);

    const nextRefreshToken =
      this.refreshTokenGenerator.generate();

    const nextRefreshTokenHash =
      this.refreshTokenHasher.hash(
        nextRefreshToken,
      );

    const accessToken =
      await this.accessTokenProvider.generate({
        sub: user.id,
        sessionId: session.id,
        email: user.email,
      });

    const rotatedSession: Session = {
      ...session,
      refreshTokenHash:
        nextRefreshTokenHash,
      lastUsedAt: timestamp,
      updatedAt: timestamp,
    };

    const persistedSession =
      await this.refreshSessionTransaction.execute(
        {
          session: rotatedSession,
          expectedRefreshTokenHash:
            currentRefreshTokenHash,
          now: timestamp,
        },
      );

    if (!persistedSession) {
      throw new InvalidRefreshTokenError();
    }

    const accessTokenTtlSeconds =
      this.configService.getOrThrow<number>(
        'JWT_ACCESS_TTL_SECONDS',
      );

    return {
      accessToken,
      refreshToken: nextRefreshToken,
      tokenType: 'Bearer',
      expiresIn: accessTokenTtlSeconds,
      session: {
        id: persistedSession.id,
        expiresAt:
          persistedSession.expiresAt,
      },
    };
  }

  private ensureSessionCanBeRefreshed(
    session: Session,
    now: Date,
  ): void {
    const isRevoked =
      session.revokedAt !== null;

    const isExpired =
      new Date(
        session.expiresAt,
      ).getTime() <= now.getTime();

    if (isRevoked || isExpired) {
      throw new InvalidRefreshTokenError();
    }
  }

  private ensureUserCanAuthenticate(
    user: User | null,
  ): asserts user is User {
    if (
      !user ||
      user.status !== UserStatus.ACTIVE
    ) {
      throw new InvalidRefreshTokenError();
    }
  }
}