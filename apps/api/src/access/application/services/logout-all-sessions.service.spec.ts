import { randomUUID } from 'node:crypto';

import { Session } from '../../domain/entities/session.entity';
import { InMemorySessionsRepository } from '../../infrastructure/repositories/in-memory-sessions.repository';
import { LogoutAllSessionsService } from './logout-all-sessions.service';

describe('LogoutAllSessionsService', () => {
  let sessionsRepository: InMemorySessionsRepository;
  let service: LogoutAllSessionsService;

  beforeEach(() => {
    sessionsRepository =
      new InMemorySessionsRepository();

    service = new LogoutAllSessionsService(
      sessionsRepository,
    );
  });

  it('revokes every active session from the user', async () => {
    const userId = randomUUID();

    const firstSession = createSession({
      userId,
    });

    const secondSession = createSession({
      userId,
    });

    await sessionsRepository.create(
      firstSession,
    );

    await sessionsRepository.create(
      secondSession,
    );

    const revokedCount =
      await service.execute({
        userId,
      });

    expect(revokedCount).toBe(2);

    const storedFirstSession =
      await sessionsRepository.findById(
        firstSession.id,
      );

    const storedSecondSession =
      await sessionsRepository.findById(
        secondSession.id,
      );

    expect(
      storedFirstSession?.revokedAt,
    ).not.toBeNull();

    expect(
      storedSecondSession?.revokedAt,
    ).not.toBeNull();
  });

  it('does not revoke sessions from another user', async () => {
    const targetUserId = randomUUID();
    const anotherUserId = randomUUID();

    const targetSession = createSession({
      userId: targetUserId,
    });

    const anotherUserSession =
      createSession({
        userId: anotherUserId,
      });

    await sessionsRepository.create(
      targetSession,
    );

    await sessionsRepository.create(
      anotherUserSession,
    );

    await service.execute({
      userId: targetUserId,
    });

    const storedAnotherSession =
      await sessionsRepository.findById(
        anotherUserSession.id,
      );

    expect(
      storedAnotherSession?.revokedAt,
    ).toBeNull();
  });

  it('does not change a session that was already revoked', async () => {
    const userId = randomUUID();

    const previousRevokedAt =
      '2026-08-01T10:00:00.000Z';

    const alreadyRevokedSession =
      createSession({
        userId,
        revokedAt: previousRevokedAt,
        updatedAt: previousRevokedAt,
      });

    await sessionsRepository.create(
      alreadyRevokedSession,
    );

    const revokedCount =
      await service.execute({
        userId,
      });

    expect(revokedCount).toBe(0);

    const storedSession =
      await sessionsRepository.findById(
        alreadyRevokedSession.id,
      );

    expect(
      storedSession?.revokedAt,
    ).toBe(previousRevokedAt);

    expect(
      storedSession?.updatedAt,
    ).toBe(previousRevokedAt);
  });

  it('returns zero when the user has no active sessions', async () => {
    const revokedCount =
      await service.execute({
        userId: randomUUID(),
      });

    expect(revokedCount).toBe(0);
  });

  it('returns zero for an empty user id', async () => {
    const revokedCount =
      await service.execute({
        userId: '   ',
      });

    expect(revokedCount).toBe(0);
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
        `hash-${randomUUID()}`,
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