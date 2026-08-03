import { randomUUID } from 'node:crypto';

import { Session } from '../../domain/entities/session.entity';
import { RefreshTokenHasher } from '../../domain/tokens/refresh-token-hasher';
import { InMemorySessionsRepository } from '../../infrastructure/repositories/in-memory-sessions.repository';
import { LogoutSessionService } from './logout-session.service';

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

describe('LogoutSessionService', () => {
  let sessionsRepository: InMemorySessionsRepository;
  let service: LogoutSessionService;

  beforeEach(() => {
    sessionsRepository =
      new InMemorySessionsRepository();

    service = new LogoutSessionService(
      sessionsRepository,
      new FakeRefreshTokenHasher(),
    );
  });

  it('revokes the session associated with the refresh token', async () => {
    const session = createSession();

    await sessionsRepository.create(
      session,
    );

    await service.execute({
      refreshToken:
        'current-refresh-token',
    });

    const storedSession =
      await sessionsRepository.findById(
        session.id,
      );

    expect(
      storedSession?.revokedAt,
    ).not.toBeNull();

    expect(
      storedSession?.updatedAt,
    ).toBe(storedSession?.revokedAt);
  });

  it('does not revoke another session', async () => {
    const targetSession =
      createSession();

    const anotherSession =
      createSession({
        refreshTokenHash:
          'hashed:another-refresh-token',
      });

    await sessionsRepository.create(
      targetSession,
    );

    await sessionsRepository.create(
      anotherSession,
    );

    await service.execute({
      refreshToken:
        'current-refresh-token',
    });

    const storedAnotherSession =
      await sessionsRepository.findById(
        anotherSession.id,
      );

    expect(
      storedAnotherSession?.revokedAt,
    ).toBeNull();
  });

  it('does not change an already revoked session', async () => {
    const previousRevokedAt =
      '2026-08-01T10:00:00.000Z';

    const session = createSession({
      revokedAt: previousRevokedAt,
      updatedAt: previousRevokedAt,
    });

    await sessionsRepository.create(
      session,
    );

    await service.execute({
      refreshToken:
        'current-refresh-token',
    });

    const storedSession =
      await sessionsRepository.findById(
        session.id,
      );

    expect(
      storedSession?.revokedAt,
    ).toBe(previousRevokedAt);

    expect(
      storedSession?.updatedAt,
    ).toBe(previousRevokedAt);
  });

  it('completes successfully for an unknown refresh token', async () => {
    await expect(
      service.execute({
        refreshToken:
          'unknown-refresh-token',
      }),
    ).resolves.toBeUndefined();
  });

  it('completes successfully for an empty token', async () => {
    await expect(
      service.execute({
        refreshToken: '   ',
      }),
    ).resolves.toBeUndefined();
  });

  function createSession(
    overrides: Partial<Session> = {},
  ): Session {
    const timestamp =
      '2026-08-01T12:00:00.000Z';

    return {
      id: randomUUID(),
      userId: randomUUID(),
      refreshTokenHash:
        'hashed:current-refresh-token',
      ipAddress: '127.0.0.1',
      userAgent:
        'Higeia Test Client',
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