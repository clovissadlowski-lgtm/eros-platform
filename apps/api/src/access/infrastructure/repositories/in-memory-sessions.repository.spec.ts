import { randomUUID } from 'node:crypto';

import { Session } from '../../domain/entities/session.entity';
import { InMemorySessionsRepository } from './in-memory-sessions.repository';

describe('InMemorySessionsRepository', () => {
  let repository: InMemorySessionsRepository;

  beforeEach(() => {
    repository =
      new InMemorySessionsRepository();
  });

  it('creates a session', async () => {
    const session = createSession();

    const createdSession =
      await repository.create(session);

    expect(createdSession).toEqual(session);

    const storedSession =
      await repository.findById(
        session.id,
      );

    expect(storedSession).toEqual(session);
  });

  it('finds a session by id', async () => {
    const session = createSession();

    await repository.create(session);

    const foundSession =
      await repository.findById(
        session.id,
      );

    expect(foundSession).toEqual(session);
  });

  it('returns null when the session id does not exist', async () => {
    const foundSession =
      await repository.findById(
        randomUUID(),
      );

    expect(foundSession).toBeNull();
  });

  it('finds a session by refresh token hash', async () => {
    const session = createSession({
      refreshTokenHash:
        'hashed-refresh-token',
    });

    await repository.create(session);

    const foundSession =
      await repository.findByRefreshTokenHash(
        'hashed-refresh-token',
      );

    expect(foundSession).toEqual(session);
  });

  it('returns null when the refresh token hash does not exist', async () => {
    const foundSession =
      await repository.findByRefreshTokenHash(
        'unknown-refresh-token-hash',
      );

    expect(foundSession).toBeNull();
  });

  it('lists only active and non-expired sessions from the user', async () => {
    const userId = randomUUID();

    const activeSession = createSession({
      userId,
      expiresAt:
        '2026-08-10T12:00:00.000Z',
    });

    const revokedSession = createSession({
      userId,
      expiresAt:
        '2026-08-10T12:00:00.000Z',
      revokedAt:
        '2026-08-02T12:00:00.000Z',
    });

    const expiredSession = createSession({
      userId,
      expiresAt:
        '2026-08-01T12:00:00.000Z',
    });

    const anotherUserSession =
      createSession({
        userId: randomUUID(),
        expiresAt:
          '2026-08-10T12:00:00.000Z',
      });

    await repository.create(activeSession);
    await repository.create(revokedSession);
    await repository.create(expiredSession);

    await repository.create(
      anotherUserSession,
    );

    const sessions =
      await repository.listActiveByUserId(
        userId,
        '2026-08-03T12:00:00.000Z',
      );

    expect(sessions).toEqual([
      activeSession,
    ]);
  });

  it('updates a session', async () => {
    const session = createSession();

    await repository.create(session);

    const updatedSession: Session = {
      ...session,
      refreshTokenHash:
        'rotated-refresh-token-hash',
      lastUsedAt:
        '2026-08-02T12:00:00.000Z',
      updatedAt:
        '2026-08-02T12:00:00.000Z',
    };

    const result =
      await repository.update(
        updatedSession,
      );

    expect(result).toEqual(
      updatedSession,
    );

    const storedSession =
      await repository.findById(
        session.id,
      );

    expect(storedSession).toEqual(
      updatedSession,
    );
  });

  it('revokes all active sessions from a user', async () => {
    const userId = randomUUID();

    const firstSession = createSession({
      userId,
    });

    const secondSession = createSession({
      userId,
    });

    const alreadyRevokedSession =
      createSession({
        userId,
        revokedAt:
          '2026-08-01T10:00:00.000Z',
      });

    const anotherUserSession =
      createSession({
        userId: randomUUID(),
      });

    await repository.create(firstSession);
    await repository.create(secondSession);

    await repository.create(
      alreadyRevokedSession,
    );

    await repository.create(
      anotherUserSession,
    );

    const revokedAt =
      '2026-08-03T12:00:00.000Z';

    const revokedSessions =
      await repository.revokeAllByUserId(
        userId,
        revokedAt,
      );

    expect(revokedSessions).toBe(2);

    const storedFirstSession =
      await repository.findById(
        firstSession.id,
      );

    const storedSecondSession =
      await repository.findById(
        secondSession.id,
      );

    const storedAlreadyRevokedSession =
      await repository.findById(
        alreadyRevokedSession.id,
      );

    const storedAnotherUserSession =
      await repository.findById(
        anotherUserSession.id,
      );

    expect(
      storedFirstSession?.revokedAt,
    ).toBe(revokedAt);

    expect(
      storedSecondSession?.revokedAt,
    ).toBe(revokedAt);

    expect(
      storedAlreadyRevokedSession?.revokedAt,
    ).toBe(
      '2026-08-01T10:00:00.000Z',
    );

    expect(
      storedAnotherUserSession?.revokedAt,
    ).toBeNull();
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
        `refresh-token-hash-${randomUUID()}`,
      ipAddress: '127.0.0.1',
      userAgent:
        'Higeia Integration Client',
      expiresAt:
        '2026-08-08T12:00:00.000Z',
      lastUsedAt: null,
      revokedAt: null,
      createdAt: timestamp,
      updatedAt: timestamp,
      ...overrides,
    };
  }
});