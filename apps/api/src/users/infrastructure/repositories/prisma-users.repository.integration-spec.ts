import { randomUUID } from 'node:crypto';

import { PrismaService } from '../../../common/database/prisma.service';
import {
  User,
  UserStatus,
} from '../../domain/entities/user.entity';
import { PrismaUsersRepository } from './prisma-users.repository';

describe(
  'PrismaUsersRepository integration',
  () => {
    let prisma: PrismaService;
    let repository: PrismaUsersRepository;

    const createdUserIds: string[] = [];

    beforeAll(async () => {
      prisma = new PrismaService();

      repository =
        new PrismaUsersRepository(prisma);

      await prisma.$connect();
    });

    beforeEach(async () => {
      await clearUsers();
    });

    afterAll(async () => {
      await clearUsers();
      await prisma.$disconnect();
    });

    it('creates and returns a user', async () => {
      const user = createUser();

      const createdUser =
        await repository.create(user);

      expect(createdUser).toEqual(user);

      const storedUser =
        await prisma.user.findUnique({
          where: {
            id: user.id,
          },
        });

      expect(storedUser).not.toBeNull();
      expect(storedUser?.name).toBe(
        user.name,
      );
      expect(storedUser?.email).toBe(
        user.email,
      );
      expect(storedUser?.status).toBe(
        'INVITED',
      );
      expect(
        storedUser?.passwordHash,
      ).toBeNull();
    });

    it('finds a user by id', async () => {
      const user = createUser();

      await repository.create(user);

      const foundUser =
        await repository.findById(user.id);

      expect(foundUser).toEqual(user);
    });

    it('returns null when the user id does not exist', async () => {
      const foundUser =
        await repository.findById(
          randomUUID(),
        );

      expect(foundUser).toBeNull();
    });

    it('finds a user by normalized email', async () => {
      const user = createUser({
        email: createUniqueEmail(
          'normalized',
        ),
      });

      await repository.create(user);

      const foundUser =
        await repository.findByEmail(
          `  ${user.email.toUpperCase()}  `,
        );

      expect(foundUser).toEqual(user);
    });

    it('returns null when the email does not exist', async () => {
      const foundUser =
        await repository.findByEmail(
          createUniqueEmail('not-found'),
        );

      expect(foundUser).toBeNull();
    });

    it('lists stored users', async () => {
      const firstUser = createUser({
        name: 'First Integration User',
        email: createUniqueEmail('first'),
      });

      const secondUser = createUser({
        name: 'Second Integration User',
        email: createUniqueEmail('second'),
      });

      await repository.create(firstUser);
      await repository.create(secondUser);

      const users = await repository.list();

      expect(
        users.some(
          (user) =>
            user.id === firstUser.id,
        ),
      ).toBe(true);

      expect(
        users.some(
          (user) =>
            user.id === secondUser.id,
        ),
      ).toBe(true);
    });

    it('updates an existing user', async () => {
      const user = createUser();

      await repository.create(user);

      const updatedUser: User = {
        ...user,
        name: 'Updated Integration User',
        passwordHash:
          '$2b$12$integration-test-hash',
        status: UserStatus.ACTIVE,
        lastLoginAt:
          '2026-07-31T23:30:00.000Z',
        updatedAt:
          '2026-07-31T23:31:00.000Z',
      };

      const result =
        await repository.update(
          updatedUser,
        );

      expect(result).toEqual(updatedUser);

      const storedUser =
        await repository.findById(user.id);

      expect(storedUser).toEqual(
        updatedUser,
      );
    });

    function createUser(
      overrides: Partial<User> = {},
    ): User {
      const id = randomUUID();

      createdUserIds.push(id);

      const timestamp =
        '2026-07-31T22:00:00.000Z';

      return {
        id,
        name: 'Integration User',
        email: createUniqueEmail('user'),
        passwordHash: null,
        status: UserStatus.INVITED,
        lastLoginAt: null,
        createdAt: timestamp,
        updatedAt: timestamp,
        ...overrides,
      };
    }

    function createUniqueEmail(
      prefix: string,
    ): string {
      return `${prefix}-${randomUUID()}@higeia.test`;
    }

    async function clearUsers(): Promise<void> {
      if (createdUserIds.length === 0) {
        return;
      }

      await prisma.membership.deleteMany({
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

      createdUserIds.length = 0;
    }
  },
);