import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';

import { PasswordHasher } from '../../../auth/domain/services/password-hasher';
import {
  User,
  UserStatus,
} from '../../../users/domain/entities/user.entity';
import { InMemoryUsersRepository } from '../../../users/infrastructure/repositories/in-memory-users.repository';
import { Session } from '../../domain/entities/session.entity';
import { InvalidCredentialsError } from '../../domain/errors/invalid-credentials.error';
import {
  AccessTokenPayload,
  AccessTokenProvider,
} from '../../domain/tokens/access-token-provider';
import { RefreshTokenGenerator } from '../../domain/tokens/refresh-token-generator';
import { RefreshTokenHasher } from '../../domain/tokens/refresh-token-hasher';
import {
  LoginPersistenceTransaction,
  PersistLoginInput,
  PersistLoginResult,
} from '../../domain/transactions/login-persistence.transaction';
import { LoginService } from './login.service';

class FakePasswordHasher
  implements PasswordHasher
{
  async hash(
    plainPassword: string,
  ): Promise<string> {
    return `hashed:${plainPassword}`;
  }

  async compare(
    plainPassword: string,
    passwordHash: string,
  ): Promise<boolean> {
    return (
      passwordHash ===
      `hashed:${plainPassword}`
    );
  }
}

class FakeAccessTokenProvider
  implements AccessTokenProvider
{
  generatedPayload:
    | AccessTokenPayload
    | null = null;

  async generate(
    payload: AccessTokenPayload,
  ): Promise<string> {
    this.generatedPayload = payload;

    return 'generated-access-token';
  }

  async verify(
    _accessToken: string,
  ): Promise<AccessTokenPayload> {
    if (!this.generatedPayload) {
      throw new Error(
        'No access token was generated.',
      );
    }

    return this.generatedPayload;
  }
}

class FakeRefreshTokenGenerator
  implements RefreshTokenGenerator
{
  generate(): string {
    return 'generated-refresh-token';
  }
}

class FakeRefreshTokenHasher
  implements RefreshTokenHasher
{
  hash(refreshToken: string): string {
    return `hashed:${refreshToken}`;
  }

  compare(
    refreshToken: string,
    refreshTokenHash: string,
  ): boolean {
    return (
      refreshTokenHash ===
      `hashed:${refreshToken}`
    );
  }
}

class FakeLoginPersistenceTransaction
  implements LoginPersistenceTransaction
{
  persistedInput:
    | PersistLoginInput
    | null = null;

  async execute(
    input: PersistLoginInput,
  ): Promise<PersistLoginResult> {
    this.persistedInput = input;

    return input;
  }
}

describe('LoginService', () => {
  let usersRepository: InMemoryUsersRepository;
  let accessTokenProvider: FakeAccessTokenProvider;
  let loginPersistenceTransaction: FakeLoginPersistenceTransaction;
  let service: LoginService;

  beforeEach(() => {
    usersRepository =
      new InMemoryUsersRepository();

    accessTokenProvider =
      new FakeAccessTokenProvider();

    loginPersistenceTransaction =
      new FakeLoginPersistenceTransaction();

    const configService =
      new ConfigService({
        JWT_ACCESS_TTL_SECONDS: 900,
        REFRESH_TOKEN_TTL_DAYS: 30,
      });

    service = new LoginService(
      usersRepository,
      new FakePasswordHasher(),
      accessTokenProvider,
      new FakeRefreshTokenGenerator(),
      new FakeRefreshTokenHasher(),
      loginPersistenceTransaction,
      configService,
    );
  });

  it('authenticates an active user and returns tokens', async () => {
    const user = createUser();

    await usersRepository.create(user);

    const result = await service.execute({
      email: user.email,
      plainPassword:
        'StrongPassword#2026',
      ipAddress: '127.0.0.1',
      userAgent: 'Higeia Test Client',
    });

    expect(result.accessToken).toBe(
      'generated-access-token',
    );

    expect(result.refreshToken).toBe(
      'generated-refresh-token',
    );

    expect(result.tokenType).toBe(
      'Bearer',
    );

    expect(result.expiresIn).toBe(900);

    expect(result.user.id).toBe(user.id);

    expect(result.session.id).toBeDefined();
  });

  it('normalizes the email before authentication', async () => {
    const user = createUser({
      email: 'admin@higeia.test',
    });

    await usersRepository.create(user);

    const result = await service.execute({
      email:
        '  ADMIN@HIGEIA.TEST  ',
      plainPassword:
        'StrongPassword#2026',
    });

    expect(result.user.id).toBe(user.id);
  });

  it('creates a session with the refresh token hash', async () => {
    const user = createUser();

    await usersRepository.create(user);

    await service.execute({
      email: user.email,
      plainPassword:
        'StrongPassword#2026',
      ipAddress: ' 127.0.0.1 ',
      userAgent:
        ' Higeia Test Client ',
    });

    const persistedInput =
      loginPersistenceTransaction
        .persistedInput;

    expect(persistedInput).not.toBeNull();

    expect(
      persistedInput?.session.userId,
    ).toBe(user.id);

    expect(
      persistedInput?.session
        .refreshTokenHash,
    ).toBe(
      'hashed:generated-refresh-token',
    );

    expect(
      persistedInput?.session.ipAddress,
    ).toBe('127.0.0.1');

    expect(
      persistedInput?.session.userAgent,
    ).toBe('Higeia Test Client');

    expect(
      persistedInput?.session.revokedAt,
    ).toBeNull();
  });

  it('generates an access token linked to the session', async () => {
    const user = createUser();

    await usersRepository.create(user);

    const result = await service.execute({
      email: user.email,
      plainPassword:
        'StrongPassword#2026',
    });

    expect(
      accessTokenProvider.generatedPayload,
    ).toEqual({
      sub: user.id,
      sessionId: result.session.id,
      email: user.email,
    });
  });

  it('updates lastLoginAt when the login succeeds', async () => {
    const user = createUser();

    await usersRepository.create(user);

    const result = await service.execute({
      email: user.email,
      plainPassword:
        'StrongPassword#2026',
    });

    expect(
      result.user.lastLoginAt,
    ).not.toBeNull();

    expect(
      loginPersistenceTransaction
        .persistedInput?.user.lastLoginAt,
    ).not.toBeNull();
  });

  it('does not expose the password hash', async () => {
    const user = createUser();

    await usersRepository.create(user);

    const result = await service.execute({
      email: user.email,
      plainPassword:
        'StrongPassword#2026',
    });

    expect(result.user).not.toHaveProperty(
      'passwordHash',
    );
  });

  it('rejects an unknown email', async () => {
    await expect(
      service.execute({
        email: 'unknown@higeia.test',
        plainPassword:
          'StrongPassword#2026',
      }),
    ).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    );
  });

  it('rejects an incorrect password', async () => {
    const user = createUser();

    await usersRepository.create(user);

    await expect(
      service.execute({
        email: user.email,
        plainPassword:
          'WrongPassword#2026',
      }),
    ).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    );
  });

  it.each([
    UserStatus.INVITED,
    UserStatus.BLOCKED,
    UserStatus.INACTIVE,
  ])(
    'rejects a user with status %s',
    async (status) => {
      const user = createUser({
        status,
      });

      await usersRepository.create(user);

      await expect(
        service.execute({
          email: user.email,
          plainPassword:
            'StrongPassword#2026',
        }),
      ).rejects.toBeInstanceOf(
        InvalidCredentialsError,
      );
    },
  );

  it('rejects an active user without a password hash', async () => {
    const user = createUser({
      status: UserStatus.ACTIVE,
      passwordHash: null,
    });

    await usersRepository.create(user);

    await expect(
      service.execute({
        email: user.email,
        plainPassword:
          'StrongPassword#2026',
      }),
    ).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    );
  });

  function createUser(
    overrides: Partial<User> = {},
  ): User {
    const timestamp =
      '2026-08-01T12:00:00.000Z';

    return {
      id: randomUUID(),
      name: 'Higeia Administrator',
      email:
        `admin-${randomUUID()}@higeia.test`,
      passwordHash:
        'hashed:StrongPassword#2026',
      status: UserStatus.ACTIVE,
      lastLoginAt: null,
      createdAt: timestamp,
      updatedAt: timestamp,
      ...overrides,
    };
  }
});