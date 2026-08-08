import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';

import { PasswordHasher } from '../../../auth/domain/services/password-hasher';
import {
  User,
  UserStatus,
} from '../../../users/domain/entities/user.entity';
import { UsersRepository } from '../../../users/domain/repositories/users.repository';
import { InvalidCredentialsError } from '../../domain/errors/invalid-credentials.error';
import { Session } from '../../domain/entities/session.entity';
import { AccessTokenProvider } from '../../domain/tokens/access-token-provider';
import { RefreshTokenGenerator } from '../../domain/tokens/refresh-token-generator';
import { RefreshTokenHasher } from '../../domain/tokens/refresh-token-hasher';
import { LoginPersistenceTransaction } from '../../domain/transactions/login-persistence.transaction';

export interface LoginInput {
  email: string;
  plainPassword: string;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  user: AuthenticatedUser;
  session: {
    id: string;
    expiresAt: string;
  };
}

@Injectable()
export class LoginService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly accessTokenProvider: AccessTokenProvider,
    private readonly refreshTokenGenerator: RefreshTokenGenerator,
    private readonly refreshTokenHasher: RefreshTokenHasher,
    private readonly loginPersistenceTransaction: LoginPersistenceTransaction,
    private readonly configService: ConfigService,
  ) {}

  async execute(
    input: LoginInput,
  ): Promise<LoginResult> {
    const email = this.normalizeEmail(
      input.email,
    );

    const user =
      await this.usersRepository.findByEmail(
        email,
      );

    this.ensureUserCanAuthenticate(user);

    const passwordMatches =
      await this.passwordHasher.compare(
        input.plainPassword,
        user.passwordHash,
      );

    if (!passwordMatches) {
      throw new InvalidCredentialsError();
    }

    const now = new Date();
    const timestamp = now.toISOString();

    const refreshToken =
      this.refreshTokenGenerator.generate();

    const refreshTokenHash =
      this.refreshTokenHasher.hash(
        refreshToken,
      );

    const refreshTokenTtlDays =
      this.configService.getOrThrow<number>(
        'REFRESH_TOKEN_TTL_DAYS',
      );

    const sessionExpiresAt = new Date(
      now.getTime() +
        refreshTokenTtlDays *
          24 *
          60 *
          60 *
          1000,
    );

    const session: Session = {
      id: randomUUID(),
      userId: user.id,
      selectedOrganizationId: null,
      refreshTokenHash,
      ipAddress:
        this.normalizeOptionalValue(
          input.ipAddress,
        ),
      userAgent:
        this.normalizeOptionalValue(
          input.userAgent,
        ),
      expiresAt:
        sessionExpiresAt.toISOString(),
      lastUsedAt: null,
      revokedAt: null,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const updatedUser: User = {
      ...user,
      lastLoginAt: timestamp,
      updatedAt: timestamp,
    };

    const accessToken =
      await this.accessTokenProvider.generate({
        sub: user.id,
        sessionId: session.id,
        email: user.email,
      });

    const persistedLogin =
      await this.loginPersistenceTransaction.execute(
        {
          user: updatedUser,
          session,
        },
      );

    const accessTokenTtlSeconds =
      this.configService.getOrThrow<number>(
        'JWT_ACCESS_TTL_SECONDS',
      );

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: accessTokenTtlSeconds,
      user: this.toAuthenticatedUser(
        persistedLogin.user,
      ),
      session: {
        id: persistedLogin.session.id,
        expiresAt:
          persistedLogin.session.expiresAt,
      },
    };
  }

  private ensureUserCanAuthenticate(
    user: User | null,
  ): asserts user is User & {
    passwordHash: string;
  } {
    const canAuthenticate =
      user !== null &&
      user.status === UserStatus.ACTIVE &&
      typeof user.passwordHash ===
        'string' &&
      user.passwordHash.length > 0;

    if (!canAuthenticate) {
      throw new InvalidCredentialsError();
    }
  }

  private toAuthenticatedUser(
    user: User,
  ): AuthenticatedUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      status: user.status,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private normalizeEmail(
    email: string,
  ): string {
    return email.trim().toLowerCase();
  }

  private normalizeOptionalValue(
    value: string | null | undefined,
  ): string | null {
    const normalizedValue = value?.trim();

    return normalizedValue
      ? normalizedValue
      : null;
  }
}