import {
  Membership,
  MembershipRole,
  MembershipStatus,
} from '../../../users/domain/entities/membership.entity';
import { randomUUID } from 'node:crypto';
import { Request } from 'express';

import {
  User,
  UserStatus,
} from '../../../users/domain/entities/user.entity';
import { InMemoryMembershipsRepository } from '../../../users/infrastructure/repositories/in-memory-memberships.repository';
import { InMemoryUsersRepository } from '../../../users/infrastructure/repositories/in-memory-users.repository';
import { Session } from '../../domain/entities/session.entity';
import { InvalidAccessTokenError } from '../../domain/errors/invalid-access-token.error';
import {
  AccessTokenPayload,
  AccessTokenProvider,
} from '../../domain/tokens/access-token-provider';
import { InMemorySessionsRepository } from '../../infrastructure/repositories/in-memory-sessions.repository';
import { JwtAuthGuard } from './jwt-auth.guard';

class FakeAccessTokenProvider
  implements AccessTokenProvider
{
  payload: AccessTokenPayload | null = null;
  shouldFail = false;

  async generate(
    payload: AccessTokenPayload,
  ): Promise<string> {
    this.payload = payload;

    return 'access-token';
  }

  async verify(
    _accessToken: string,
  ): Promise<AccessTokenPayload> {
    if (this.shouldFail || !this.payload) {
      throw new Error('Invalid token.');
    }

    return this.payload;
  }
}

describe('JwtAuthGuard', () => {
  let sessionsRepository: InMemorySessionsRepository;
  let usersRepository: InMemoryUsersRepository;
  let membershipsRepository: InMemoryMembershipsRepository;
  let accessTokenProvider: FakeAccessTokenProvider;
  let guard: JwtAuthGuard;

  beforeEach(() => {
  sessionsRepository =
    new InMemorySessionsRepository();

  usersRepository =
    new InMemoryUsersRepository();

  membershipsRepository =
    new InMemoryMembershipsRepository();

  accessTokenProvider =
    new FakeAccessTokenProvider();

  guard = new JwtAuthGuard(
    accessTokenProvider,
    sessionsRepository,
    usersRepository,
    membershipsRepository,
  );
});

  it('authenticates a valid bearer token', async () => {
    const user = createUser();
    const session = createSession({
      userId: user.id,
    });

    await usersRepository.create(user);
    await sessionsRepository.create(session);

    accessTokenProvider.payload = {
      sub: user.id,
      sessionId: session.id,
      email: user.email,
    };

    const request = createRequest(
      'Bearer valid-access-token',
    );

    const result =
      await guard.canActivate(
        createExecutionContext(request),
      );

    expect(result).toBe(true);

    expect(request.auth).toEqual({
      userId: user.id,
      sessionId: session.id,
      email: user.email,
      organizationId: null,
      membershipId: null,
      role: null,
    });
  });

  it('rejects a request without authorization', async () => {
    const request = createRequest();

    await expect(
      guard.canActivate(
        createExecutionContext(request),
      ),
    ).rejects.toBeInstanceOf(
      InvalidAccessTokenError,
    );
  });

  it('rejects an invalid authorization scheme', async () => {
    const request = createRequest(
      'Basic invalid-token',
    );

    await expect(
      guard.canActivate(
        createExecutionContext(request),
      ),
    ).rejects.toBeInstanceOf(
      InvalidAccessTokenError,
    );
  });

  it('rejects an invalid JWT', async () => {
    accessTokenProvider.shouldFail = true;

    const request = createRequest(
      'Bearer invalid-access-token',
    );

    await expect(
      guard.canActivate(
        createExecutionContext(request),
      ),
    ).rejects.toBeInstanceOf(
      InvalidAccessTokenError,
    );
  });

  it('rejects a missing session', async () => {
    const user = createUser();

    await usersRepository.create(user);

    accessTokenProvider.payload = {
      sub: user.id,
      sessionId: randomUUID(),
      email: user.email,
    };

    const request = createRequest(
      'Bearer valid-access-token',
    );

    await expect(
      guard.canActivate(
        createExecutionContext(request),
      ),
    ).rejects.toBeInstanceOf(
      InvalidAccessTokenError,
    );
  });

  it('rejects a revoked session', async () => {
    const user = createUser();

    const session = createSession({
      userId: user.id,
      revokedAt:
        '2026-08-01T12:00:00.000Z',
    });

    await usersRepository.create(user);
    await sessionsRepository.create(session);

    accessTokenProvider.payload = {
      sub: user.id,
      sessionId: session.id,
      email: user.email,
    };

    const request = createRequest(
      'Bearer valid-access-token',
    );

    await expect(
      guard.canActivate(
        createExecutionContext(request),
      ),
    ).rejects.toBeInstanceOf(
      InvalidAccessTokenError,
    );
  });

  it('rejects an expired session', async () => {
    const user = createUser();

    const session = createSession({
      userId: user.id,
      expiresAt:
        '2020-01-01T00:00:00.000Z',
    });

    await usersRepository.create(user);
    await sessionsRepository.create(session);

    accessTokenProvider.payload = {
      sub: user.id,
      sessionId: session.id,
      email: user.email,
    };

    const request = createRequest(
      'Bearer valid-access-token',
    );

    await expect(
      guard.canActivate(
        createExecutionContext(request),
      ),
    ).rejects.toBeInstanceOf(
      InvalidAccessTokenError,
    );
  });

  it('rejects a session from another user', async () => {
    const user = createUser();

    const session = createSession({
      userId: randomUUID(),
    });

    await usersRepository.create(user);
    await sessionsRepository.create(session);

    accessTokenProvider.payload = {
      sub: user.id,
      sessionId: session.id,
      email: user.email,
    };

    const request = createRequest(
      'Bearer valid-access-token',
    );

    await expect(
      guard.canActivate(
        createExecutionContext(request),
      ),
    ).rejects.toBeInstanceOf(
      InvalidAccessTokenError,
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

      const session = createSession({
        userId: user.id,
      });

      await usersRepository.create(user);
      await sessionsRepository.create(session);

      accessTokenProvider.payload = {
        sub: user.id,
        sessionId: session.id,
        email: user.email,
      };

      const request = createRequest(
        'Bearer valid-access-token',
      );

      await expect(
        guard.canActivate(
          createExecutionContext(request),
        ),
      ).rejects.toBeInstanceOf(
        InvalidAccessTokenError,
      );
    },
  );

  function createRequest(
    authorization?: string,
  ): Request {
    return {
      headers: authorization
        ? {
            authorization,
          }
        : {},
    } as Request;
  }

  function createExecutionContext(
    request: Request,
  ): ExecutionContext {
    return {
      switchToHttp: () => ({
        getRequest: () => request,
        getResponse: () => undefined,
        getNext: () => undefined,
      }),
    } as ExecutionContext;
  }

  function createUser(
    overrides: Partial<User> = {},
  ): User {
    const timestamp =
      '2026-08-01T12:00:00.000Z';

    return {
      id: randomUUID(),
      name: 'Authenticated User',
      email:
        `auth-${randomUUID()}@higeia.test`,
      passwordHash: 'password-hash',
      status: UserStatus.ACTIVE,
      lastLoginAt: timestamp,
      createdAt: timestamp,
      updatedAt: timestamp,
      ...overrides,
    };
  }

  function createSession(
    overrides: Partial<Session> = {},
  ): Session {
    const timestamp =
      '2026-08-01T12:00:00.000Z';

    return {
      id: randomUUID(),
      userId: randomUUID(),
      refreshTokenHash:
        `hash-${randomUUID()}`,
      ipAddress: '127.0.0.1',
      userAgent: 'Higeia Test Client',
      expiresAt:
        '2099-08-31T12:00:00.000Z',
      lastUsedAt: null,
      revokedAt: null,
      createdAt: timestamp,
      updatedAt: timestamp,
      ...overrides,
    };
  }
});