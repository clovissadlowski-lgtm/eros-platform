import { randomUUID } from 'node:crypto';

import { PrismaService } from '../../../common/database/prisma.service';
import { UserStatus } from '../../../users/domain/entities/user.entity';
import { Session } from '../../domain/entities/session.entity';
import { PrismaSessionsRepository } from './prisma-sessions.repository';

describe(
  'PrismaSessionsRepository integration',
  () => {
    let prisma: PrismaService;
    let repository: PrismaSessionsRepository;

    const createdSessionIds: string[] = [];
    const createdUserIds: string[] = [];

    beforeAll(async () => {
      prisma = new PrismaService();

      repository =
        new PrismaSessionsRepository(prisma);

      await prisma.$connect();
    });

    beforeEach(async () => {
      await clearTestData();
    });

    afterAll(async () => {
      await clearTestData();
      await prisma.$disconnect();
    });

    it('creates and returns a session', async () => {
      const userId = await createUser();

      const session = createSession({
        userId,
      });

      const createdSession =
        await repository.create(session);

      expect(createdSession).toEqual(
        session,
      );

      const storedSession =
        await prisma.session.findUnique({
          where: {
            id: session.id,
          },
        });

      expect(storedSession).not.toBeNull();

      expect(storedSession?.userId).toBe(
        userId,
      );

      expect(
        storedSession?.refreshTokenHash,
      ).toBe(session.refreshTokenHash);
    });

    it('finds a session by id', async () => {
      const userId = await createUser();

      const session = createSession({
        userId,
      });

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
      const userId = await createUser();

      const session = createSession({
        userId,
        refreshTokenHash:
          createTokenHash(),
      });

      await repository.create(session);

      const foundSession =
        await repository.findByRefreshTokenHash(
          session.refreshTokenHash,
        );

      expect(foundSession).toEqual(session);
    });

    it('returns null when the refresh token hash does not exist', async () => {
      const foundSession =
        await repository.findByRefreshTokenHash(
          createTokenHash(),
        );

      expect(foundSession).toBeNull();
    });

    it('lists only active and non-expired sessions from the requested user', async () => {
      const userId = await createUser();

      const anotherUserId =
        await createUser();

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
          userId: anotherUserId,
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

    it('updates an existing session', async () => {
      const userId = await createUser();

      const session = createSession({
        userId,
      });

      await repository.create(session);

      const updatedSession: Session = {
        ...session,
        refreshTokenHash:
          createTokenHash(),
        ipAddress: '192.168.0.10',
        userAgent:
          'Updated Higeia Client',
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
      const userId = await createUser();

      const anotherUserId =
        await createUser();

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
          updatedAt:
            '2026-08-01T10:00:00.000Z',
        });

      const anotherUserSession =
        createSession({
          userId: anotherUserId,
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

      const revokedCount =
        await repository.revokeAllByUserId(
          userId,
          revokedAt,
        );

      expect(revokedCount).toBe(2);

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
        storedFirstSession?.updatedAt,
      ).toBe(revokedAt);

      expect(
        storedSecondSession?.revokedAt,
      ).toBe(revokedAt);

      expect(
        storedSecondSession?.updatedAt,
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

    it('does not list sessions after all user sessions are revoked', async () => {
      const userId = await createUser();

      const firstSession = createSession({
        userId,
        expiresAt:
          '2026-08-10T12:00:00.000Z',
      });

      const secondSession = createSession({
        userId,
        expiresAt:
          '2026-08-10T12:00:00.000Z',
      });

      await repository.create(firstSession);
      await repository.create(secondSession);

      const revokedAt =
        '2026-08-03T12:00:00.000Z';

      await repository.revokeAllByUserId(
        userId,
        revokedAt,
      );

      const activeSessions =
        await repository.listActiveByUserId(
          userId,
          '2026-08-03T13:00:00.000Z',
        );

      expect(activeSessions).toEqual([]);
    });

    async function createUser(): Promise<string> {
      const userId = randomUUID();

      createdUserIds.push(userId);

      await prisma.user.create({
        data: {
          id: userId,
          name:
            'Session Integration User',
          email:
            `session-${randomUUID()}@higeia.test`,
          passwordHash:
            'integration-password-hash',
          status: UserStatus.ACTIVE,
          lastLoginAt: null,
          createdAt: new Date(
            '2026-08-01T12:00:00.000Z',
          ),
          updatedAt: new Date(
            '2026-08-01T12:00:00.000Z',
          ),
        },
      });

      return userId;
    }

    function createSession(
      overrides: Partial<Session> = {},
    ): Session {
      const id = randomUUID();

      createdSessionIds.push(id);

      return {
        id,
        userId: randomUUID(),
        refreshTokenHash:
          createTokenHash(),
        ipAddress: '127.0.0.1',
        userAgent:
          'Higeia Integration Client',
        expiresAt:
          '2026-08-08T12:00:00.000Z',
        lastUsedAt: null,
        revokedAt: null,
        createdAt:
          '2026-08-01T12:00:00.000Z',
        updatedAt:
          '2026-08-01T12:00:00.000Z',
        ...overrides,
      };
    }

    function createTokenHash(): string {
      return randomUUID()
        .replace(/-/g, '')
        .padEnd(64, '0')
        .slice(0, 64);
    }

    async function clearTestData(): Promise<void> {
      if (createdSessionIds.length > 0) {
        await prisma.session.deleteMany({
          where: {
            id: {
              in: createdSessionIds,
            },
          },
        });
      }

      if (createdUserIds.length > 0) {
        await prisma.session.deleteMany({
          where: {
            userId: {
              in: createdUserIds,
            },
          },
        });

        await prisma.user.deleteMany({
          where: {
            id: {
              in: createdUserIds,
            },
          },
        });
      }

      createdSessionIds.length = 0;
      createdUserIds.length = 0;
    }
  },
);